# Code Examples - Starter Templates

**Version:** 1.0  
**Last Updated:** November 3, 2025

This document provides ready-to-use code examples for key components in the Thoughtweaver architecture.

---

## Table of Contents

1. [Backend Examples](#backend-examples)
2. [Frontend Examples](#frontend-examples)
3. [Shared Package Examples](#shared-package-examples)
4. [Database Examples](#database-examples)

---

## Backend Examples

### 1. Supabase Service

```typescript
// apps/api/src/database/supabase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // Helper methods
  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async createConversation(userId: string, conversationData: any) {
    const { data, error } = await this.client
      .from('conversations')
      .insert({ ...conversationData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
```

### 2. Auth Guard

```typescript
// apps/api/src/common/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    try {
      const { data: { user }, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user to request
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
```

### 3. User Decorator

```typescript
// apps/api/src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### 4. Conversations Controller

```typescript
// apps/api/src/modules/conversations/conversations.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.create(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.conversationsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.conversationsService.findOne(id, user.id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: SendMessageDto,
  ) {
    return this.conversationsService.sendMessage(id, user.id, dto);
  }
}
```

### 5. AI Service with Adapter Pattern

```typescript
// apps/api/src/modules/ai/adapters/base.adapter.ts
export interface LLMAdapter {
  generate(prompt: string, options: LLMOptions): Promise<LLMResponse>;
  stream(prompt: string, options: LLMOptions): AsyncGenerator<string>;
}

export interface LLMOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface LLMResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

// apps/api/src/modules/ai/adapters/openai.adapter.ts
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { LLMAdapter, LLMOptions, LLMResponse } from './base.adapter';

@Injectable()
export class OpenAIAdapter implements LLMAdapter {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generate(prompt: string, options: LLMOptions): Promise<LLMResponse> {
    const messages = [
      ...(options.systemPrompt
        ? [{ role: 'system' as const, content: options.systemPrompt }]
        : []),
      { role: 'user' as const, content: prompt },
    ];

    const response = await this.client.chat.completions.create({
      model: options.model,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
    });

    return {
      content: response.choices[0].message.content || '',
      tokensUsed: response.usage?.total_tokens || 0,
      model: options.model,
    };
  }

  async *stream(prompt: string, options: LLMOptions): AsyncGenerator<string> {
    const messages = [
      ...(options.systemPrompt
        ? [{ role: 'system' as const, content: options.systemPrompt }]
        : []),
      { role: 'user' as const, content: prompt },
    ];

    const stream = await this.client.chat.completions.create({
      model: options.model,
      messages,
      temperature: options.temperature || 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  }
}

// apps/api/src/modules/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { LLMAdapter, LLMOptions, LLMResponse } from './adapters/base.adapter';
import { OpenAIAdapter } from './adapters/openai.adapter';
import { AnthropicAdapter } from './adapters/anthropic.adapter';

@Injectable()
export class AIService {
  private adapters: Map<string, LLMAdapter> = new Map();

  constructor(
    private openaiAdapter: OpenAIAdapter,
    private anthropicAdapter: AnthropicAdapter,
  ) {
    // Register adapters
    this.adapters.set('gpt-5', this.openaiAdapter);
    this.adapters.set('gpt-5-mini', this.openaiAdapter);
    this.adapters.set('claude-sonnet-4.5', this.anthropicAdapter);
    this.adapters.set('claude-haiku-4.5', this.anthropicAdapter);
  }

  async generate(
    model: string,
    prompt: string,
    systemPrompt?: string,
    options?: Partial<LLMOptions>,
  ): Promise<LLMResponse> {
    const adapter = this.adapters.get(model);
    if (!adapter) {
      throw new Error(`Unknown model: ${model}`);
    }

    return adapter.generate(prompt, {
      model,
      systemPrompt,
      ...options,
    });
  }

  async *stream(
    model: string,
    prompt: string,
    systemPrompt?: string,
  ): AsyncGenerator<string> {
    const adapter = this.adapters.get(model);
    if (!adapter) {
      throw new Error(`Unknown model: ${model}`);
    }

    yield* adapter.stream(prompt, {
      model,
      systemPrompt,
    });
  }
}
```

---

## Frontend Examples

### 1. Supabase Client

```typescript
// apps/web/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. Auth Hook

```typescript
// apps/web/lib/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      // On first login, sync profile with backend
      if (event === 'SIGNED_IN' && session) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
          });
        } catch (error) {
          console.error('Failed to sync profile:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
}
```

### 3. API Client Wrapper

```typescript
// apps/web/lib/api/client.ts
import { ThoughtweaverClient } from '@thoughtweaver/sdk';
import { supabase } from '../supabase/client';

let clientInstance: ThoughtweaverClient | null = null;

export async function getApiClient(): Promise<ThoughtweaverClient> {
  if (clientInstance) {
    return clientInstance;
  }

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  clientInstance = new ThoughtweaverClient(
    process.env.NEXT_PUBLIC_API_URL!,
    session.access_token,
  );

  return clientInstance;
}

// Auto-refresh client when token changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') {
    clientInstance = null;
  } else if (event === 'TOKEN_REFRESHED' && session) {
    clientInstance = new ThoughtweaverClient(
      process.env.NEXT_PUBLIC_API_URL!,
      session.access_token,
    );
  }
});
```

### 4. Conversation Page

```typescript
// apps/web/app/(dashboard)/conversations/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getApiClient } from '@/lib/api/client';
import { Conversation, Message } from '@thoughtweaver/types';
import { ConversationView } from '@thoughtweaver/ui';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversation() {
      try {
        const client = await getApiClient();
        const conv = await client.getConversation(conversationId);
        const msgs = await client.getMessages(conversationId);
        
        setConversation(conv);
        setMessages(msgs);
      } catch (error) {
        console.error('Failed to load conversation:', error);
      } finally {
        setLoading(false);
      }
    }

    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {
    try {
      const client = await getApiClient();
      const newMessages = await client.sendMessage(conversationId, content, []);
      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!conversation) {
    return <div>Conversation not found</div>;
  }

  return (
    <ConversationView
      conversation={conversation}
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  );
}
```

---

## Shared Package Examples

### 1. Types Package

```typescript
// packages/types/src/conversation.ts
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  workflowId?: string;
  contextId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistantId?: string;
  modelUsed?: string;
  tokensUsed?: number;
  createdAt: Date;
}

export interface CreateConversationDto {
  title: string;
  prompt: string;
  workflowId?: string;
  assistantIds: string[];
  modelId: string;
}

export interface SendMessageDto {
  content: string;
  assistantIds?: string[];
}

// packages/types/src/index.ts
export * from './conversation';
export * from './user';
export * from './assistant';
export * from './workflow';
```

### 2. SDK Package

```typescript
// packages/sdk/src/client.ts
import {
  Conversation,
  Message,
  CreateConversationDto,
  SendMessageDto,
} from '@thoughtweaver/types';

export class ThoughtweaverClient {
  constructor(
    private baseUrl: string,
    private token: string,
  ) {}

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${id}`);
  }

  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/conversations');
  }

  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.request<Message[]>(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(
    conversationId: string,
    content: string,
    assistantIds: string[],
  ): Promise<Message[]> {
    return this.request<Message[]>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        assistantIds,
      } as SendMessageDto),
    });
  }
}
```

---

## Database Examples

### 1. Migration Template

```sql
-- infra/supabase/migrations/001_create_profiles.sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
```

### 2. Seed Data Template

```sql
-- infra/supabase/seeds/default_assistants.sql
-- Insert default assistants
INSERT INTO assistants (id, name, description, system_prompt, personality, is_default, is_custom)
VALUES
  (
    gen_random_uuid(),
    'All Rounder',
    'Balanced perspective across all domains',
    'You are a helpful assistant with balanced perspectives...',
    '{"openness": 60, "conscientiousness": 60, "extraversion": 50, "agreeableness": 60, "emotionalStability": 40}'::jsonb,
    true,
    false
  ),
  -- Add more default assistants...
ON CONFLICT DO NOTHING;
```

---

## Environment Variables Template

### Backend (.env)

```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx  # NEVER expose!

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=xxx

# Stripe
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# LLM APIs
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-xxx
GOOGLE_API_KEY=xxx

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```bash
# Supabase (anon key only!)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

**Examples Maintained By**: Engineering Team  
**Update Frequency**: As architecture evolves
