import React, { useEffect, useState } from "react";
import "./apiTypes";

const pingFunc = async () => {
  const response = await window.versions.ping();
  console.log(response)
}
pingFunc()

export default function App() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.auth.getToken().then(setToken).catch(() => setToken(null));
  }, []);

  async function onLogin(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    try {
      const r = await window.auth.login(email, password);
      setToken(r.token);
      setMe(null);
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    }
  }

  async function onMe() {
    setError(null);
    try {
      const data = await window.auth.me();
      setMe(data);
    } catch (err: any) {
      setError(err?.message ?? "Request failed");
    }
  }

  async function onLogout() {
    await window.auth.logout();
    setToken(null);
    setMe(null);
  }

  return (
    <div style={{ background: "#dedede", fontFamily: "system-ui", padding: 16, maxWidth: 560 }}>
      <h2>Electron JWT Login</h2>

      {!token ? (
        <form onSubmit={onLogin} style={{ display: "grid", gap: 8 }}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              style={{ width: "100%" }}
            />
          </label>
          <button type="submit">Login</button>
        </form>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>Token:</b> <code>{token.slice(0, 24)}…</code>
          </div>
          <button onClick={onMe}>Call /me</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {me && (
        <pre style={{ background: "#111", color: "#eee", padding: 12, borderRadius: 8, overflow: "auto" }}>
          {JSON.stringify(me, null, 2)}
        </pre>
      )}
    </div>
  );
}
