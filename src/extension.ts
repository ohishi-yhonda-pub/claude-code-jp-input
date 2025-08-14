import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Claude External Launcher is now active!');

    let disposable = vscode.commands.registerCommand('claude-external-launcher.launchClaude', () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const cwd = workspaceFolder ? workspaceFolder.uri.fsPath : process.cwd();

        // Windows Terminalがインストールされているか確認
        cp.exec('where wt', (error) => {
            if (!error) {
                // Windows Terminalで起動
                cp.exec(`wt -d "${cwd}" claude code`, (err) => {
                    if (err) {
                        vscode.window.showErrorMessage('Failed to launch Claude Code in Windows Terminal');
                    } else {
                        vscode.window.showInformationMessage('Claude Code launched in Windows Terminal');
                    }
                });
            } else {
                // 通常のコマンドプロンプトで起動
                cp.exec(`start cmd /k "cd /d "${cwd}" && claude code"`, (err) => {
                    if (err) {
                        vscode.window.showErrorMessage('Failed to launch Claude Code');
                    } else {
                        vscode.window.showInformationMessage('Claude Code launched in Command Prompt');
                    }
                });
            }
        });
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