import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

function updateMinttyrc(): void {
    // Minimal settings for Japanese support only
    // Don't change font or display settings that might affect claude
    const config = vscode.workspace.getConfiguration('claude-external-launcher');
    const enableJapaneseSupport = config.get<boolean>('enableJapaneseSupport', true);
    
    if (!enableJapaneseSupport) {
        return; // Skip if Japanese support is disabled
    }
    
    const homeDir = os.homedir();
    const minttyrcPath = path.join(homeDir, '.minttyrc');
    
    // Only set locale and charset for Japanese input
    // Add RightClickAction for paste support
    const minttySettings = [
        'Locale=ja_JP',
        'Charset=UTF-8',
        'RightClickAction=paste'
    ];
    
    try {
        let existingContent = '';
        if (fs.existsSync(minttyrcPath)) {
            existingContent = fs.readFileSync(minttyrcPath, 'utf8');
        }
        
        // Parse existing settings
        const existingSettings = new Map<string, string>();
        existingContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                existingSettings.set(match[1].trim(), match[2].trim());
            }
        });
        
        // Only update locale and charset, preserve other settings
        minttySettings.forEach(setting => {
            const [key, value] = setting.split('=');
            existingSettings.set(key, value);
        });
        
        // Write back
        const newContent = Array.from(existingSettings.entries())
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        fs.writeFileSync(minttyrcPath, newContent);
    } catch (err) {
        console.error('Failed to update .minttyrc:', err);
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Claude External Launcher is now active!');

    let disposable = vscode.commands.registerCommand('claude-external-launcher.launchClaude', () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const cwd = workspaceFolder ? workspaceFolder.uri.fsPath : process.cwd();
        
        // Update .minttyrc before launching
        updateMinttyrc();
        
        // Use Git Bash with a direct command approach
        const gitBashPath = 'C:\\Program Files\\Git\\git-bash.exe';
        const minttyPath = 'C:\\Program Files\\Git\\usr\\bin\\mintty.exe';
        const bashPath = 'C:\\Program Files\\Git\\bin\\bash.exe';
        // Hardcoded compile time - update this before compiling
        const compiledAt = '2025/8/30 23:07:02';
        
        // Create a wrapper script that will run claude in an interactive shell
        const wrapperScript = path.join(os.tmpdir(), `claude_wrapper_${Date.now()}.sh`);
        const wrapperContent = `#!/bin/bash
echo "========================================="
echo "Claude External Launcher v0.1.8"
echo "Compiled at: ${compiledAt}"
echo "========================================="
echo ""
cd "${cwd.replace(/\\/g, '/')}"

# Source bashrc for PATH
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi

# Try different approaches based on what's available
echo "Checking for claude installation..."

# Method 1: Try winpty with the full Windows path to claude.cmd
if [ -f "/c/nvm4w/nodejs/claude.cmd" ]; then
    echo "Found claude.cmd at: /c/nvm4w/nodejs/claude.cmd"
    echo "Starting Claude Code..."
    # Try winpty with Windows path (no --mouse to keep text selection)
    winpty "C:/nvm4w/nodejs/claude.cmd" 2>&1 || {
        echo "winpty failed, trying direct execution..."
        # Fallback: Execute directly
        /c/nvm4w/nodejs/claude.cmd
    }
elif [ -f "$HOME/AppData/Roaming/npm/claude.cmd" ]; then
    echo "Found claude.cmd at: ~/AppData/Roaming/npm/claude.cmd"
    echo "Starting Claude Code..."
    WINPATH=$(cygpath -w "$HOME/AppData/Roaming/npm/claude.cmd")
    winpty "$WINPATH" 2>&1 || {
        echo "winpty failed, trying direct execution..."
        "$HOME/AppData/Roaming/npm/claude.cmd"
    }
else
    # Method 2: Try using node directly
    NODE_PATH=$(which node 2>/dev/null)
    if [ -n "$NODE_PATH" ] && [ -f "/c/nvm4w/nodejs/node_modules/@anthropic/claude/bin/claude" ]; then
        echo "Found claude module, running with node..."
        echo "Starting Claude Code..."
        node /c/nvm4w/nodejs/node_modules/@anthropic/claude/bin/claude
    else
        # Method 3: Last resort - try PATH
        echo "Attempting to run claude from PATH..."
        echo "Starting Claude Code..."
        claude 2>&1 || echo "Error: claude not found. Please ensure it's installed."
    fi
fi

# Keep terminal open
echo ""
echo "Claude session ended. Press Enter to exit or run 'claude' again."
read
`;
        
        fs.writeFileSync(wrapperScript, wrapperContent.replace(/\r\n/g, '\n'));
        
        // Use Git Bash to run the wrapper script
        const command = `start "" "${gitBashPath}" --cd="${cwd}" "${wrapperScript.replace(/\\/g, '/')}"`;
        
        cp.exec(command, (err) => {
            // Clean up after a delay
            setTimeout(() => {
                try {
                    fs.unlinkSync(wrapperScript);
                } catch (e) {
                    // Ignore
                }
            }, 5000);
            
            if (err) {
                console.error('Launch error:', err);
                // Simple fallback
                const fallbackCommand = `start "" "${gitBashPath}" --cd="${cwd}"`;
                cp.exec(fallbackCommand, (fallbackErr) => {
                    if (fallbackErr) {
                        vscode.window.showErrorMessage(`Failed to launch Git Bash: ${fallbackErr.message}`);
                    } else {
                        vscode.env.clipboard.writeText('claude').then(() => {
                            vscode.window.showInformationMessage('Git Bash launched. "claude" copied to clipboard - paste and run.');
                        }, () => {
                            vscode.window.showInformationMessage('Git Bash launched. Run "claude" to start Claude Code.');
                        });
                    }
                });
            } else {
                vscode.window.showInformationMessage('Claude launching in Git Bash...');
            }
        })
    });

    // ステータスバーアイテムの追加
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    statusBarItem.text = "$(terminal) Claude";
    statusBarItem.command = 'claude-external-launcher.launchClaude';
    statusBarItem.tooltip = 'Launch Claude Code in External Terminal';
    statusBarItem.show();

    context.subscriptions.push(disposable);
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {}