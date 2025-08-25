import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

function updateMinttyrc(): void {
    const config = vscode.workspace.getConfiguration('claude-external-launcher');
    const locale = config.get<string>('mintty.locale', 'ja_JP');
    const charset = config.get<string>('mintty.charset', 'UTF-8');
    const font = config.get<string>('mintty.font', 'MS Gothic');
    const fontHeight = config.get<number>('mintty.fontHeight', 12);
    
    const homeDir = os.homedir();
    const minttyrcPath = path.join(homeDir, '.minttyrc');
    
    const minttySettings = [
        `Locale=${locale}`,
        `Charset=${charset}`,
        `Font=${font}`,
        `FontHeight=${fontHeight}`,
        'Columns=120',
        'Rows=40'
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
        
        // Update with new settings
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
        
        const gitBashPath = '"C:\\Program Files\\Git\\git-bash.exe"';
        cp.exec(`${gitBashPath} --cd="${cwd}" -c "claude"`, (err) => {
            if (err) {
                vscode.window.showErrorMessage(`Failed to launch Claude in Git Bash: ${err.message}`);
            } else {
                vscode.window.showInformationMessage('Claude launched in Git Bash with updated MinTTY settings');
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