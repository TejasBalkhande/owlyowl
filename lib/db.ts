// lib/db.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";

let database: any = null;
let rawClient: any = null;

export function getDb() {
  if (database && rawClient) return { db: database, client: rawClient };

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  }

  rawClient = createClient({ 
    url, 
    authToken,
    fetch: (info: RequestInfo | URL, init?: RequestInit) => {
      const safeHeaders = new Headers();
      
      // 1. THE FIX: Explicitly hardcode the token into the headers 
      // so Next.js cannot accidentally strip it away.
      safeHeaders.set("Authorization", `Bearer ${authToken}`);
      
      // 2. Safely copy any other required headers (like Content-Type)
      const originalHeaders = (init?.headers || {}) as Record<string, string>;
      for (const [key, value] of Object.entries(originalHeaders)) {
        if (key.toLowerCase() !== "authorization") {
          safeHeaders.set(key, value);
        }
      }
      
      // 3. Send the request
      return fetch(info, {
        ...init,
        headers: safeHeaders,
        cache: "no-store" 
      });
    }
  });
  
  database = drizzle(rawClient);
  
  return { db: database, client: rawClient };
}