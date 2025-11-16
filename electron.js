const { app, BrowserWindow } = require('electron');
const path = require('path');

// 개발 모드 확인
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1650,
    height: 1000,
    title : '교육원 관리 시스템',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Vite는 기본 포트가 5173
  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }


  // 새로고침 단축키 추가
  win.webContents.on('before-input-event', (event, input) => {
    if ((input.control && input.key.toLowerCase() === 'r') || input.key === 'F5') {
      win.webContents.reload();
      event.preventDefault();
    }
    if (input.control && input.shift && input.key.toLowerCase() === 'r') {
      win.webContents.reloadIgnoringCache();
      event.preventDefault();
    }
  });
}




app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});