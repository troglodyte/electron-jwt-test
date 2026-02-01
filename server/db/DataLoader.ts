import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";

const dbPath = path.join(app.getPath("userData"), "app.db");
export const db = new Database(dbPath);

