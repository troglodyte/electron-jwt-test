import { contextBridge, ipcRenderer } from "electron";
import * as electron from "electron";

contextBridge.exposeInMainWorld("auth", {
  getToken: () => ipcRenderer.invoke("auth:getToken") as Promise<string | null>,
  login: (email: string, password: string) =>
    ipcRenderer.invoke("auth:login", { email, password }) as Promise<{ token: string }>,
  me: () => ipcRenderer.invoke("auth:me") as Promise<any>,
  logout: () => ipcRenderer.invoke("auth:logout") as Promise<boolean>,
});

contextBridge.exposeInMainWorld('versions', {
    node: ():string => process.versions.node,
    chrome: ():string => process.versions.chrome,
    electron: (): string => process.versions.electron,
    ping: (): Promise<string> => ipcRenderer.invoke('ping')
})

