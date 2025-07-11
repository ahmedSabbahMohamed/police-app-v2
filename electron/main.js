const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const NextServer = require('./server');
const DatabaseManager = require('./database');

let mainWindow;
let nextServer = null;
let dbManager = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // icon: path.join(__dirname, 'assets/icon.png'), // You can add an icon later
    titleBarStyle: 'default',
    show: false, // Don't show until ready
  });

  // Load the app
  const startUrl = 'http://localhost:3000';
  
    // Start the Next.js server and then load the app
  async function startApp() {
    try {
      // Initialize database first
      if (!isDev) {
        console.log('🔧 Initializing database...');
        dbManager = new DatabaseManager();
        await dbManager.initializeDatabase();
        
        // Set environment variable for database path globally
        const dbPath = dbManager.getDatabasePath();
        process.env.DATABASE_PATH = dbPath;
        
        // Also set it for any child processes
        if (process.platform === 'win32') {
          process.env.DATABASE_PATH = dbPath;
        } else {
          process.env.DATABASE_PATH = dbPath;
        }
        
        console.log('📁 Database path set:', dbPath);
      }
      
      if (!isDev) {
        // Start built-in Next.js server in production
        nextServer = new NextServer();
        await nextServer.start();
      }
      
      // Load the app
      mainWindow.loadURL(startUrl);
    } catch (error) {
      console.error('Failed to start app:', error);
      app.quit();
    }
  }
  
  startApp();

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();

  // Create menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Cleanup when app quits
app.on('before-quit', () => {
  if (nextServer) {
    nextServer.stop();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
}); 