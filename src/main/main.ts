import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { getToken, setToken } from "./authStore";

const API_BASE = "http://localhost:3000"; // your backend

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.webContents.openDevTools({ mode: "detach" });

  // In dev you can load Vite dev server. In prod load built files.
  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) win.loadURL(devUrl);
  else win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  registerIpc();
  /** testing */
  ipcMain.handle('ping', () => 'pong');
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function registerIpc() {
  ipcMain.handle("auth:getToken", () => getToken());

  ipcMain.handle("auth:logout", () => {
    setToken(null);
    return true;
  });

  ipcMain.handle("auth:login", async (_evt, payload: { email: string; password: string }) => {
    // Example expects backend returns { token: "..." }
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Login failed (${res.status}). ${text}`);
    }

    const data = (await res.json()) as { token: string };
    if (!data?.token) throw new Error("No token returned from server");
    setToken(data.token);
    return { token: data.token };
  });

  ipcMain.handle("auth:me", async () => {
    const token = getToken();
    if (!token) throw new Error("Not logged in");

    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401) setToken(null);
      throw new Error(`Me failed (${res.status})`);
    }

    return res.json();
  });
}
