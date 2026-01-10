const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'accounting.db');
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      vendor TEXT NOT NULL,
      amount INTEGER NOT NULL,
      code TEXT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized at:', dbPath);
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) {
    db.close();
  }
});

ipcMain.handle('db:getTransactions', async () => {
  try {
    const stmt = db.prepare('SELECT * FROM transactions ORDER BY date DESC, created_at DESC');
    return stmt.all();
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
});

ipcMain.handle('db:addTransaction', async (event, transaction) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO transactions (date, vendor, amount, code, type)
      VALUES (@date, @vendor, @amount, @code, @type)
    `);
    const result = stmt.run(transaction);
    return { id: result.lastInsertRowid, ...transaction };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
});

ipcMain.handle('db:updateTransaction', async (event, id, transaction) => {
  try {
    const stmt = db.prepare(`
      UPDATE transactions
      SET date = @date, vendor = @vendor, amount = @amount, code = @code, type = @type
      WHERE id = @id
    `);
    stmt.run({ id, ...transaction });
    return { id, ...transaction };
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
});

ipcMain.handle('db:deleteTransaction', async (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
});
