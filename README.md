# 記帳工具 - Linear/Modern 風格

使用 Electron + React + Tailwind CSS + SQLite 打造的桌面記帳應用程式，採用 Linear/Modern 設計風格。

## 特色功能

- ✅ **核心功能**：新增、編輯、刪除記帳記錄，自動計算收支餘額。
- ✅ **資料安全**：資料完全儲存於本地 (SQLite)，隱私無虞。
- 🎨 **視覺體驗**：深色主題、流暢動畫與玻璃擬態設計。

## 下載與執行

本程式為免安裝版本，下載後即可直接使用。

1. 前往本專案的 **Releases 頁面** 下載最新版本。
2. 在 **Assets** 區域找到並下載 `.exe` 檔案（例如 `Ledger_Portable_1.0.0.exe`）。
3. 下載完成後，雙擊檔案即可直接啟動，無需安裝。

## 功能說明

- **新增記帳**：輸入日期、廠商名稱、金額與代碼即可新增。
- **編輯/刪除**：點擊列表中的項目即可進行編輯或刪除。
- **自動計算**：系統會自動統計總收入、總支出與當前餘額。

## 資料存放位置

資料庫文件存放在：

- **macOS**: `~/Library/Application Support/accounting-app/accounting.db`
- **Windows**: `%APPDATA%/accounting-app/accounting.db`
- **Linux**: `~/.config/accounting-app/accounting.db`
