import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

const filePath = () => path.join(app.getPath("userData"), "auth.json");

type AuthFile = { token?: string };

export function getToken(): string | null {
  try {
    const raw = fs.readFileSync(filePath(), "utf-8");
    const data = JSON.parse(raw) as AuthFile;
    return data.token ?? null;
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  const data: AuthFile = token ? { token } : {};
  fs.writeFileSync(filePath(), JSON.stringify(data), "utf-8");
}
