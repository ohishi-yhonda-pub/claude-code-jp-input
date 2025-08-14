# Claude External Launcher

VS Code拡張機能：Claude Codeを外部ターミナルで起動し、ConPTYに関連する日本語入力の問題を解決します。

## 機能

- Claude Codeを外部ターミナル（Windows TerminalまたはCommand Prompt）で起動
- キーボードショートカット：`Ctrl+Alt+C`
- ステータスバーにクイックアクセスボタン
- 優先ターミナルの設定が可能

## インストール

### VSIXファイルから（推奨）

1. 最新の`.vsix`ファイルをダウンロード
2. VS Codeで`Ctrl+Shift+P`を押す
3. "Extensions: Install from VSIX..."を実行
4. ダウンロードした`.vsix`ファイルを選択

### ソースコードから

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/claude-external-launcher.git
cd claude-external-launcher

# 依存関係をインストール
npm install

# 拡張機能をビルド
npm run compile

# 拡張機能をパッケージ化
vsce package
```

## 使い方

### Claude Codeの起動

3つの方法で起動できます：

1. **キーボードショートカット**：`Ctrl+Alt+C`を押す
2. **コマンドパレット**：`Ctrl+Shift+P`を押して"Launch Claude Code in External Terminal"を実行
3. **ステータスバー**：右下の"Claude"ボタンをクリック

### 設定

VS Codeの設定で優先ターミナルを設定できます：

```json
{
  "claude-external-launcher.preferredTerminal": "auto"
}
```

利用可能なオプション：
- `"auto"` - 自動検出（Windows Terminalが利用可能な場合はそれを、なければCommand Prompt）
- `"wt"` - Windows Terminal
- `"cmd"` - コマンドプロンプト
- `"powershell"` - PowerShell

## なぜこの拡張機能が必要か？

VS Codeの統合ターミナルでConPTYを無効にして（日本語入力サポートのため）Claude Codeを使用すると、色表示や`/resume`コマンドなどの特定の機能が正しく動作しません。この拡張機能は、これらの機能が正常に動作する外部ターミナルでClaude Codeを起動することで、この問題を解決します。

## 開発

### 前提条件

- Node.js（v16以上）
- VS Code
- TypeScript

### デバッグ

1. VS Codeでプロジェクトを開く
2. `F5`を押して拡張機能が読み込まれた新しいVS Codeウィンドウを起動
3. 新しいウィンドウで拡張機能をテスト

### ビルド

```bash
# TypeScriptをコンパイル
npm run compile

# 変更を監視
npm run watch

# VSIXパッケージを作成
vsce package
```

## ライセンス

MIT

## 貢献

IssueやPull Requestは歓迎します！