# Change Log

All notable changes to the "claude-external-launcher" extension will be documented in this file.

## [0.0.6] - 2025-08-25

### Changed

- Simplified to Git Bash only launcher
- Removed Windows Terminal, Command Prompt, and PowerShell options
- Removed preferredTerminal configuration option
- Always launches Claude in Git Bash with MinTTY settings

### Removed

- preferredTerminal configuration
- Support for Windows Terminal, Command Prompt, and PowerShell

## [0.0.5] - 2025-08-25

### Added

- Git Bash support with MinTTY for better Japanese input handling
- New terminal option: `gitbash` in preferences
- Automatic `.minttyrc` configuration when launching in Git Bash
- Configurable MinTTY settings:
  - `claude-external-launcher.mintty.locale` (default: ja_JP)
  - `claude-external-launcher.mintty.charset` (default: UTF-8)
  - `claude-external-launcher.mintty.font` (default: MS Gothic)
  - `claude-external-launcher.mintty.fontHeight` (default: 12)

### Changed

- Git Bash automatically updates `.minttyrc` with configured settings before launching Claude

## [0.0.4] - 2025-08-25

### Added

- ConPTY is now disabled for all terminal types:
  - Windows Terminal: Uses `--disable-conpty` flag
  - Command Prompt: Sets `CLAUDE_DISABLE_CONPTY=1` environment variable
  - PowerShell: Sets `$env:CLAUDE_DISABLE_CONPTY=1` environment variable

### Changed

- Updated extension description to clarify ConPTY disabling functionality

## [0.0.3] - 2025-08-25

### Fixed

- Fixed preferredTerminal configuration not being used
- Added support for PowerShell terminal option
- Improved terminal selection logic based on user preferences

## [0.0.2] - 2025-08-25

### Fixed

- Fixed command from `claude code` to `claude` (correct Claude CLI command)
- Improved error messages to include detailed error information
- Fixed command execution for both Windows Terminal and Command Prompt

## [0.0.1] - 2024-01-14

### Initial release

- Launch Claude Code in external terminal (Windows Terminal or Command Prompt)
- Keyboard shortcut: `Ctrl+Alt+C`
- Status bar button for quick access
- Configurable terminal preference (auto/wt/cmd/powershell)