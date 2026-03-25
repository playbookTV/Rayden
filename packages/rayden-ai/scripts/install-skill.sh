#!/bin/sh
# Rayden UI Figma Skill Installer
# Downloads and installs the rayden-use skill for Claude Code or Cursor
#
# Usage:
#   curl -fsSL https://raydenui.com/install-skill | sh
#
# Or specify a version:
#   curl -fsSL https://raydenui.com/install-skill | sh -s -- v1.0.0

set -e

# Configuration
REPO="ovalay-studios/rayden-ui"
BRANCH="${1:-main}"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}/packages/rayden-ai"

# Determine skill directory
if [ -n "$CLAUDE_SKILLS_DIR" ]; then
  SKILL_DIR="$CLAUDE_SKILLS_DIR/rayden-use"
elif [ -d "$HOME/.claude" ]; then
  SKILL_DIR="$HOME/.claude/skills/rayden-use"
elif [ -d "$HOME/.cursor" ]; then
  SKILL_DIR="$HOME/.cursor/rules/rayden-use"
else
  SKILL_DIR="$HOME/.claude/skills/rayden-use"
fi

echo "Installing Rayden UI Figma skill..."
echo "Target directory: $SKILL_DIR"
echo ""

# Create directories
mkdir -p "$SKILL_DIR/references"
mkdir -p "$SKILL_DIR/anatomy/components"
mkdir -p "$SKILL_DIR/tokens"

# Download skill file
echo "Downloading SKILL.md..."
curl -fsSL "$BASE_URL/skills/rayden-use/SKILL.md" -o "$SKILL_DIR/SKILL.md"

# Download reference files
echo "Downloading reference files..."
curl -fsSL "$BASE_URL/references/naming-conventions.md" -o "$SKILL_DIR/references/naming-conventions.md"
curl -fsSL "$BASE_URL/references/token-usage.md" -o "$SKILL_DIR/references/token-usage.md"
curl -fsSL "$BASE_URL/references/layout-rules.md" -o "$SKILL_DIR/references/layout-rules.md"
curl -fsSL "$BASE_URL/references/component-properties.md" -o "$SKILL_DIR/references/component-properties.md"

# Download anatomy files
echo "Downloading component anatomy specs..."
curl -fsSL "$BASE_URL/src/anatomy/schema.json" -o "$SKILL_DIR/anatomy/schema.json"
curl -fsSL "$BASE_URL/src/anatomy/components.json" -o "$SKILL_DIR/anatomy/components.json"
curl -fsSL "$BASE_URL/src/anatomy/components/button.json" -o "$SKILL_DIR/anatomy/components/button.json" 2>/dev/null || true
curl -fsSL "$BASE_URL/src/anatomy/components/input.json" -o "$SKILL_DIR/anatomy/components/input.json" 2>/dev/null || true
curl -fsSL "$BASE_URL/src/anatomy/components/badge.json" -o "$SKILL_DIR/anatomy/components/badge.json" 2>/dev/null || true
curl -fsSL "$BASE_URL/src/anatomy/components/avatar.json" -o "$SKILL_DIR/anatomy/components/avatar.json" 2>/dev/null || true

# Download tokens (DTCG format)
echo "Downloading design tokens..."
curl -fsSL "$BASE_URL/dist/tokens/tokens.dtcg.json" -o "$SKILL_DIR/tokens/tokens.dtcg.json" 2>/dev/null || \
curl -fsSL "$BASE_URL/src/tokens/tokens.json" -o "$SKILL_DIR/tokens/tokens.json"

echo ""
echo "================================================"
echo " Rayden UI Figma skill installed successfully!"
echo "================================================"
echo ""
echo "Installed to: $SKILL_DIR"
echo ""
echo "Next steps:"
echo ""
echo "  1. Connect Figma MCP (if not already done):"
echo "     claude mcp add --transport http figma https://mcp.figma.com/mcp"
echo ""
echo "  2. Restart Claude Code or Cursor"
echo ""
echo "  3. Try it out:"
echo '     "Use the rayden-use skill to build a Button component"'
echo ""
echo "Documentation: https://raydenui.com/docs/figma-integration"
echo ""
