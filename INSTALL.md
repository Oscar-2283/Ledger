# 安裝指南

## ✅ 已完成的測試

我已經測試並確認：
- ✅ 所有依賴已正確安裝（Tailwind CSS、lucide-react 等）
- ✅ Vite 開發伺服器可以正常啟動
- ✅ 前端代碼沒有錯誤
- ✅ CSS 編譯正常

## ⚠️ 唯一需要修復的問題

Electron 緩存目錄權限問題。該目錄目前屬於 root 用戶：

```
drwxr-xr-x  3 root  staff  /Users/oscarwang/Library/Caches/electron
```

## 🔧 完整安裝步驟

### 方案一：修復權限（推薦）

在終端執行以下命令：

```bash
# 1. 修復 Electron 緩存目錄權限
sudo chown -R $USER ~/Library/Caches/electron

# 2. 手動安裝 Electron 二進制文件
cd /Users/oscarwang/project/new/node_modules/electron
node install.js
cd ../..

# 3. 啟動應用程式
npm start
```

### 方案二：刪除並重建緩存目錄

如果方案一不行，可以嘗試：

```bash
# 1. 刪除 root 所有的緩存目錄
sudo rm -rf ~/Library/Caches/electron

# 2. 創建新的緩存目錄（屬於當前用戶）
mkdir -p ~/Library/Caches/electron

# 3. 手動安裝 Electron
cd /Users/oscarwang/project/new/node_modules/electron
node install.js
cd ../..

# 4. 啟動應用程式
npm start
```

### 方案三：使用 --ignore-scripts 並手動安裝

```bash
# 1. 確保當前在專案目錄
cd /Users/oscarwang/project/new

# 2. 嘗試使用自定義緩存路徑
export ELECTRON_CACHE="$(pwd)/.electron-cache"
cd node_modules/electron
node install.js
cd ../..

# 3. 啟動
npm start
```

## 🎉 啟動成功後

執行 `npm start` 後，你應該會看到：

1. **Vite 開發伺服器**啟動在 `http://localhost:5173`
2. **Electron 視窗**自動打開，顯示漂亮的 Linear/Modern 風格界面

### 預期畫面特效：

- 🌌 深色背景，帶有 4 層動畫光暈（藍紫色漸變）
- 💎 玻璃形態卡片（半透明，柔和陰影）
- 🔦 滑鼠移動時，交易記錄卡片會顯示追蹤聚光燈效果
- ✨ 所有 hover 效果都有精準的微動畫（上浮 -4px）
- 🎨 統計卡片顯示收入（綠色）、支出（紅色）、餘額

## 📁 專案結構

```
project/
├── src/
│   ├── main/              # Electron 主程序
│   │   ├── main.js        # 主程序入口
│   │   └── preload.js     # 預載腳本
│   └── renderer/          # React 前端
│       ├── components/    # 組件
│       │   ├── AnimatedBackground.jsx
│       │   ├── StatsCard.jsx
│       │   ├── TransactionForm.jsx
│       │   └── TransactionList.jsx
│       ├── App.jsx        # 主應用
│       ├── main.jsx       # React 入口
│       └── index.css      # 全局樣式
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
├── tailwind.config.js     # Tailwind 配置
├── postcss.config.js      # PostCSS 配置
└── package.json           # 依賴配置
```

## 🐛 疑難排解

### Vite 啟動但 Electron 沒有打開

檢查 Electron 是否已安裝：

```bash
ls -la node_modules/electron/dist/
```

如果沒有 `Electron.app`，需要重新安裝。

### 樣式沒有生效

確保：
1. Tailwind CSS 已安裝：`npm list tailwindcss`
2. PostCSS 配置正確：檢查 `postcss.config.js`

### 資料庫錯誤

資料庫會自動創建在：
- macOS: `~/Library/Application Support/accounting-app/accounting.db`

如果有問題，可以手動刪除並重新啟動。

## 📦 打包應用程式（未來）

當你想要打包成獨立應用程式：

```bash
npm run build
npm run electron:build
```

這會生成可安裝的 `.app` 檔案（Mac）或 `.exe`（Windows）。

## 🎨 設計系統特色

- **色彩**: 深色主題 (#050506 背景, #5E6AD2 主色)
- **動畫**: 所有互動都是 200-300ms expo-out 緩動
- **陰影**: 多層陰影系統（邊框高光 + 柔和擴散 + 環境陰影）
- **玻璃效果**: backdrop-blur + 半透明漸變背景
- **滑鼠追蹤**: 300px 徑向漸變跟隨游標位置
