# Technical Notes - Claude External Launcher

## Git Bash / MinTTY 調査結果 (2025-08-30)

### MinTTYのコマンドラインオプション
```
Usage: mintty [OPTION]... [ PROGRAM [ARG]... | - ]

主要オプション:
  -e, --exec ...        残りの引数をコマンドとして実行
  -h, --hold            コマンド終了後もウィンドウを開いたまま
  -p, --position        ウィンドウ位置指定
  -s, --size           画面サイズ指定
  -t, --title          ウィンドウタイトル設定
  -w, --window         初期ウィンドウ状態
  -o, --option         設定オプション指定
  -D, --daemon         Windowsショートカットキーで新インスタンス起動
```

### Git Bashの構成
- `C:\Program Files\Git\git-bash.exe` - メイン実行ファイル
- `C:\Program Files\Git\git-cmd.exe` - コマンドプロンプト版
- `C:\Program Files\Git\usr\bin\mintty.exe` - 実際のターミナルエミュレータ
- `C:\Program Files\Git\bin\bash.exe` - Bashシェル本体
- `C:\Program Files\Git\usr\bin\bash.exe` - Bashシェル（別の場所）

### 判明した問題点と原因

1. **`--init-file`オプション**: 
   - Git Bashではサポートされていない
   - これはbashのオプションだが、git-bash.exeは直接渡さない

2. **`--dir`オプション**: 
   - MinTTYには存在しない
   - `--cd`はGit Bash独自の実装

3. **スクリプト経由の実行**: 
   - TTY環境が正しく設定されずclaudeの出力が表示されない
   - claudeはインタラクティブなTTYを期待している

4. **`exec`コマンド**: 
   - シェルプロセスを置き換えるが、MinTTY環境では期待通り動作しない
   - スクリプトファイル経由だとTTYの割り当てが異なる

5. **Windows Terminal (wt.exe)**:
   - 日本語表示に問題がある可能性
   - Git Bashとの統合が完全ではない

### claudeの場所
- `/c/nvm4w/nodejs/claude` - nvm for Windows経由でインストール
- PATHに含まれているが、スクリプト経由だと正しく起動しない

### 試したアプローチと結果

1. **直接実行** (`git-bash.exe -c "claude"`)
   - Git Bashは`-c`オプションを正しく処理しない

2. **スクリプトファイル経由**
   - claudeは起動するが出力が表示されない
   - TTY環境の問題

3. **exec使用**
   - プロセスは置き換わるが、出力が表示されない

4. **Windows Terminal使用**
   - 表示に問題がある

### 今後の可能な解決策

1. **MinTTY直接起動**
   ```bash
   mintty.exe -e /bin/bash -l -c "cd /c/path && claude"
   ```

2. **AutoHotkeyやPowerShellスクリプト**
   - キーストロークを送信してclaudeを自動入力

3. **bashrcの一時的な変更**
   - `.bashrc`に一時的にclaudeコマンドを追加

4. **名前付きパイプやソケット経由**
   - より複雑だが確実な方法

### 現在の状況（2025-08-30 23:01）
- **解決済み**: claudeをGit Bash内で自動実行成功！
  - winptyで直接claude.cmdを実行（Windows形式パス使用）
  - `winpty "C:/nvm4w/nodejs/claude.cmd"`が動作
  - フォールバックとして直接実行も用意
- **最終解決方法**: winpty + Windows形式パスでバッチファイル実行
- **根本原因**: claudeがNode.jsスクリプトで、Windows環境でのTTY処理が複雑

### 既知の問題と解決（2025-08-30 23:04）
- **問題**: 右クリックでペースト機能が動作しない
  - winpty使用時の制限の可能性
  - MinTTYのマウス設定が影響している可能性
- **試した解決方法（失敗）**:
  1. winptyに`--mouse`オプション追加 → **逆効果：行選択もできなくなった**
  2. .minttyrcに`RightClickAction=paste`設定追加 → **効果なし**
- **判明した事実**:
  - `--mouse`オプションはアプリケーションにマウスイベントを渡すため、通常のテキスト選択が無効化される
  - winpty経由ではMinTTYの右クリックメニューが制限される
- **現在の対処法**: 
  - Shift+Insertでペースト
  - Ctrl+Shift+Vでペースト（環境による）
  - `--mouse`オプションは削除して通常のテキスト選択を維持

## バージョン履歴と変更内容

- **v0.1.0**: 初期リリース、基本的な起動機能
- **v0.1.1**: コマンド実行方法の改善
- **v0.1.2**: MinTTY設定の簡略化
- **v0.1.3**: Windows Terminal対応試行
- **v0.1.4**: execコマンドでの実行試行、コンパイル時刻表示追加
- **v0.1.5**: 複数のアプローチを試行（2025-08-30）
  - スクリプトファイル経由の実行（TTY問題で失敗）
  - `script`コマンド使用（Git Bashに含まれず）
  - `winpty`使用（パス問題）
  - `winpty cmd.exe`経由（構文エラー）
  - `winpty -- cmd.exe /c`（構文エラー）
  - コンパイル時刻自動更新スクリプト作成
  - **最終的に成功**: `winpty "C:/nvm4w/nodejs/claude.cmd"`で自動起動実現！
- **v0.1.6**: 自動起動成功版のリリース（2025-08-30）
  - winpty + Windows形式パスで安定動作
  - フォールバック機構付き
  - 日本語入力サポート継続
- **v0.1.7**: 右クリックペースト修正試行（2025-08-30）
  - winptyに`--mouse`オプション追加 → 失敗（テキスト選択不可になる）
  - .minttyrcに`RightClickAction=paste`設定追加
  - マウス操作のサポート改善試行
- **v0.1.8**: `--mouse`オプション削除（2025-08-30）
  - `--mouse`オプションを削除してテキスト選択機能を復元
  - RightClickActionは維持（将来の互換性のため）
  - Shift+Insertでのペーストを推奨

## 追加の判明事項（2025-08-30）

### winptyについて
- Git Bashに含まれている
- TTYエミュレーションを提供
- 実行可能ファイルのフルパスが必要
- `/c/nvm4w/nodejs/claude`は実行可能ファイルではない（シンボリックリンクまたはスクリプト）

#### winptyの使用方法
```
Usage: winpty [options] [--] program [args]

Options:
  -h, --help  Show this help message
  --mouse     Enable terminal mouse input
  --showkey   Dump STDIN escape sequences
  --version   Show the winpty version number
```

#### 試した組み合わせと結果
- `winpty claude` - PATHで見つからない
- `winpty /c/nvm4w/nodejs/claude` - Win32アプリケーションではないエラー
- `winpty cmd.exe /c "claude"` - 構文エラー（Git Bash内で）

### claudeの実際の場所と形式
- `/c/nvm4w/nodejs/claude` - 実行不可（Win32アプリケーションではない）
- `/c/nvm4w/nodejs/claude.cmd` - Windowsバッチファイル（存在確認済み）
- nvmでインストールされたNode.jsのグローバルパッケージ

### cmd.exe経由の実行
- `winpty cmd.exe /c "claude"` - スラッシュ1つが正しいが、Git Bash内では構文エラー
- `winpty cmd.exe //c "claude"` - ダブルスラッシュは構文エラー
- Git Bash内からcmd.exeを呼び出す必要がある
- 問題: winptyとcmd.exeの引数の解釈が競合している可能性

### 試した解決策と結果（2025-08-30 22:50）
1. `winpty -- cmd.exe /c claude` - `--`で引数を分離 → **構文エラー**
2. 直接node.exeを実行: 未検証
3. バッチファイルを直接実行: 未検証

### コンパイル時刻の記録
- 問題: TypeScriptではコンパイル時の定数置換ができない
- 解決: `compile.js`スクリプトを作成
  - コンパイル前にソースコードの時刻を自動更新
  - `node compile.js`で実行
  - `const compiledAt = '2025/8/30 22:57:56';`のように埋め込まれる

### 最終的な動作する実装（2025-08-30 22:58）
```bash
# winptyでWindows形式のパスを使用してclause.cmdを実行
if [ -f "/c/nvm4w/nodejs/claude.cmd" ]; then
    echo "Found claude.cmd at: /c/nvm4w/nodejs/claude.cmd"
    echo "Starting Claude Code..."
    winpty "C:/nvm4w/nodejs/claude.cmd" 2>&1 || {
        echo "winpty failed, trying direct execution..."
        /c/nvm4w/nodejs/claude.cmd
    }
fi
```

**成功の鍵**:
1. winptyを使用（TTY環境を提供）
2. Windows形式のパス（`C:/nvm4w/nodejs/claude.cmd`）を使用
3. .cmdファイルを直接指定（.exeではない）
4. フォールバック機構を用意

## 参考リンク
- [MinTTY Documentation](https://mintty.github.io/)
- [Git for Windows](https://gitforwindows.org/)
- [Claude CLI Documentation](https://claude.ai/docs)