# Change Log

All notable changes to the "claude-external-launcher" extension will be documented in this file.

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