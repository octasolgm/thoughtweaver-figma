#!/bin/bash
# Migration Helper Script
# This script helps automate the migration process

set -e

echo "🚀 Thoughtweaver Migration Helper"
echo "=================================="

# Configuration
CURRENT_CODE_PATH="${1:-C:/Users/Hp/Downloads/Thoughtweaver (Master) 1/src}"
MONOREPO_ROOT="$(pwd)"

if [ ! -d "$MONOREPO_ROOT" ]; then
  echo "❌ Error: Please run this script from the monorepo root directory"
  exit 1
fi

echo "📁 Current code path: $CURRENT_CODE_PATH"
echo "📁 Monorepo root: $MONOREPO_ROOT"
echo ""

# Function to copy components
copy_components() {
  echo "📦 Copying components..."
  
  local components=(
    "home"
    "conversation"
    "assistant"
    "workflow"
    "projects"
    "preferences"
    "account"
    "billing"
    "team"
    "llms"
    "auth"
    "layout"
    "context"
    "figma"
  )
  
  for component in "${components[@]}"; do
    if [ -d "$CURRENT_CODE_PATH/components/$component" ]; then
      echo "  ✓ Copying $component..."
      cp -r "$CURRENT_CODE_PATH/components/$component" apps/web/components/ || true
    else
      echo "  ⚠ Component $component not found, skipping..."
    fi
  done
  
  echo "✅ Components copied"
}

# Function to copy UI components
copy_ui_components() {
  echo "🎨 Copying UI components..."
  
  if [ -d "$CURRENT_CODE_PATH/components/ui" ]; then
    mkdir -p packages/ui/src/components/ui
    cp -r "$CURRENT_CODE_PATH/components/ui"/* packages/ui/src/components/ui/
    echo "✅ UI components copied"
  else
    echo "⚠ UI components directory not found"
  fi
}

# Function to copy other files
copy_other_files() {
  echo "📄 Copying other files..."
  
  # Copy hooks
  if [ -d "$CURRENT_CODE_PATH/hooks" ]; then
    cp -r "$CURRENT_CODE_PATH/hooks" apps/web/lib/
    echo "  ✓ Hooks copied"
  fi
  
  # Copy contexts
  if [ -d "$CURRENT_CODE_PATH/contexts" ]; then
    cp -r "$CURRENT_CODE_PATH/contexts" apps/web/lib/
    echo "  ✓ Contexts copied"
  fi
  
  # Copy styles
  if [ -d "$CURRENT_CODE_PATH/styles" ]; then
    cp -r "$CURRENT_CODE_PATH/styles" apps/web/
    echo "  ✓ Styles copied"
  fi
  
  # Copy types
  if [ -d "$CURRENT_CODE_PATH/types" ]; then
    mkdir -p packages/types/src
    cp -r "$CURRENT_CODE_PATH/types"/* packages/types/src/ 2>/dev/null || true
    echo "  ✓ Types copied"
  fi
  
  # Copy constants
  if [ -d "$CURRENT_CODE_PATH/constants" ]; then
    mkdir -p packages/config/src
    cp "$CURRENT_CODE_PATH/constants"/* packages/config/src/ 2>/dev/null || true
    echo "  ✓ Constants copied"
  fi
  
  # Copy assets
  if [ -d "$CURRENT_CODE_PATH/assets" ]; then
    cp -r "$CURRENT_CODE_PATH/assets" apps/web/public/ 2>/dev/null || true
    echo "  ✓ Assets copied"
  fi
  
  echo "✅ Other files copied"
}

# Function to create directory structure
create_structure() {
  echo "📁 Creating directory structure..."
  
  mkdir -p apps/{web,api}
  mkdir -p apps/web/{components,lib,styles,app,public}
  mkdir -p apps/web/app/\(auth\)/{login,signup}
  mkdir -p apps/web/app/\(dashboard\)/{conversations,workflows,assistants,settings,projects}
  mkdir -p apps/web/lib/{supabase,api,hooks,contexts}
  mkdir -p packages/{ui,sdk,types,ai,config,utils}
  mkdir -p packages/ui/src/components/ui
  mkdir -p infra/{supabase/{migrations,seeds,policies},docker,stripe,scripts}
  
  echo "✅ Directory structure created"
}

# Main menu
show_menu() {
  echo ""
  echo "What would you like to do?"
  echo "1. Create directory structure"
  echo "2. Copy all components"
  echo "3. Copy UI components only"
  echo "4. Copy other files (hooks, contexts, styles, etc.)"
  echo "5. Do everything (full migration)"
  echo "6. Exit"
  echo ""
  read -p "Enter choice [1-6]: " choice
  
  case $choice in
    1)
      create_structure
      ;;
    2)
      copy_components
      ;;
    3)
      copy_ui_components
      ;;
    4)
      copy_other_files
      ;;
    5)
      create_structure
      copy_components
      copy_ui_components
      copy_other_files
      echo ""
      echo "✅ Full migration complete!"
      echo ""
      echo "Next steps:"
      echo "1. Review the copied files"
      echo "2. Fix import paths (run: scripts/fix-imports.sh)"
      echo "3. Install dependencies (run: pnpm install)"
      echo "4. Continue with Phase 2-12 from COMPLETE_SETUP_GUIDE.md"
      ;;
    6)
      echo "👋 Goodbye!"
      exit 0
      ;;
    *)
      echo "❌ Invalid choice"
      show_menu
      ;;
  esac
  
  show_menu
}

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  echo "⚠ Windows detected"
  echo "⚠ Some commands may need to be run in Git Bash or WSL"
  echo ""
fi

# Run menu
show_menu

