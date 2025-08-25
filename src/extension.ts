import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Claude External Launcher is now active!');

    let disposable = vscode.commands.registerCommand('claude-external-launcher.launchClaude', () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const cwd = workspaceFolder ? workspaceFolder.uri.fsPath : process.cwd();
        
        // 設定を読み取る
        const config = vscode.workspace.getConfiguration('claude-external-launcher');
        const preferredTerminal = config.get<string>('preferredTerminal', 'auto');

        const launchInWindowsTerminal = () => {
            cp.exec(`wt -d "${cwd}" claude`, (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Failed to launch Claude in Windows Terminal: ${err.message}`);
                } else {
                    vscode.window.showInformationMessage('Claude launched in Windows Terminal');
                }
            });
        };

        const launchInCmd = () => {
            cp.exec(`start cmd /k "cd /d "${cwd}" && claude"`, (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Failed to launch Claude in Command Prompt: ${err.message}`);
                } else {
                    vscode.window.showInformationMessage('Claude launched in Command Prompt');
                }
            });
        };

        const launchInPowerShell = () => {
            cp.exec(`start powershell -NoExit -Command "cd '${cwd}'; claude"`, (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Failed to launch Claude in PowerShell: ${err.message}`);
                } else {
                    vscode.window.showInformationMessage('Claude launched in PowerShell');
                }
            });
        };

        // preferredTerminalの設定に基づいて起動
        switch (preferredTerminal) {
            case 'wt':
                launchInWindowsTerminal();
                break;
            case 'cmd':
                launchInCmd();
                break;
            case 'powershell':
                launchInPowerShell();
                break;
            case 'auto':
            default:
                // autoの場合、Windows Terminalがあれば使う、なければcmd
                cp.exec('where wt', (error) => {
                    if (!error) {
                        launchInWindowsTerminal();
                    } else {
                        launchInCmd();
                    }
                });
                break;
        }
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