const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // โหลด React
  win.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
}

app.whenReady().then(() => {
  //Start Express backend (index.js อยู่ใน backend/)
  backendProcess = exec('node backend/index.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error starting backend: ${err}`);
    } else {
      console.log(`Backend started`);
    }
  });

  createWindow();
});

//ปิด backend เมื่อ Electron ปิด
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) backendProcess.kill();
});
