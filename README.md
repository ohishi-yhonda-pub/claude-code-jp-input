# Claude External Launcher

VS Code拡張機能：Claude CodeをGit Bash（MinTTY）で起動し、日本語入力を完全にサポートします。

## 機能

- Claude CodeをGit Bashで起動（MinTTY使用）
- 日本語入力の完全サポート
- `.minttyrc`を自動的に設定
- キーボードショートカット：`Ctrl+Alt+C`
- ステータスバーにクイックアクセスボタン

## インストール

### VS Code Marketplaceから（推奨）

1. VS Codeの拡張機能タブを開く
2. "Claude External Launcher"を検索
3. インストールボタンをクリック

**Marketplace URL**: https://marketplace.visualstudio.com/items?itemName=yhonda-mtama.claude-external-launcher

### VSIXファイルから

1. 最新の`.vsix`ファイルをダウンロード
2. VS Codeで`Ctrl+Shift+P`を押す
3. "Extensions: Install from VSIX..."を実行
4. ダウンロードした`.vsix`ファイルを選択

## 使い方

### Claude Codeの起動

3つの方法で起動できます：

1. **キーボードショートカット**：`Ctrl+Alt+C`を押す
2. **コマンドパレット**：`Ctrl+Shift+P`を押して"Launch Claude Code in External Terminal"を実行
3. **ステータスバー**：右下の"Claude"ボタンをクリック

### MinTTY設定

拡張機能はGit Bash起動時に自動的に`.minttyrc`を更新します。以下の設定をカスタマイズできます：

```json
{
  "claude-external-launcher.mintty.locale": "ja_JP",
  "claude-external-launcher.mintty.charset": "UTF-8",
  "claude-external-launcher.mintty.font": "MS Gothic",
  "claude-external-launcher.mintty.fontHeight": 12
}
```

## なぜこの拡張機能が必要か？

Claude Codeで日本語を入力する際、標準のターミナルでは文字化けや入力の問題が発生することがあります。この拡張機能は、MinTTYの設定を最適化したGit BashでClaude Codeを起動することで、日本語入力を含むすべての機能を正常に動作させます。

## 前提条件

- Git for Windows（Git Bashが含まれている必要があります）
- Claude CLI (`claude`コマンドがインストールされていること)

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
npx vsce package
```

### 発行手順

```bash
# 1. バージョンを更新（package.json）
# 2. ビルドとパッケージング
npm run compile
npx vsce package

# 3. Marketplaceに発行（PATが必要）
npx vsce publish -p <your-personal-access-token>

# または、Marketplace管理ページから直接アップロード
# https://marketplace.visualstudio.com/manage/publishers/yhonda-mtama
```

#### Personal Access Token (PAT) の取得

1. [Azure DevOps](https://dev.azure.com/)にアクセス
2. User Settings → Personal Access Tokens
3. New Tokenを作成（Marketplace: Manageスコープを選択）
4. トークンを安全に保存

## ライセンス

ISC

## 貢献

IssueやPull Requestは歓迎します！GitHubリポジトリ：https://github.com/ohishi-yhonda-pub/claude-external-launcher