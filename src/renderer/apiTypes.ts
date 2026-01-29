export {};

declare global {
  interface Window {
    auth: {
      getToken(): Promise<string | null>;
      login(email: string, password: string): Promise<{ token: string }>;
      me(): Promise<any>;
      logout(): Promise<boolean>;
    },
    versions: {
      ping(): Promise<string>;
    }
  }
}
