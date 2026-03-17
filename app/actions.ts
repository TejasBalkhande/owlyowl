"use server";

import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt_123");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Extract the raw Turso client
  const { client } = getDb();

  try {
    const hashedPassword = await hashPassword(password);
    
    // NATIVE TURSO SQL: 100% Immune to Drizzle/Webpack bugs
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      )
    `);

    await client.execute({
      sql: `INSERT INTO users (email, password) VALUES (?, ?)`,
      args: [email, hashedPassword]
    });
    
    return { success: "Account created!", error: null };
  } catch (e: any) {
    // THIS PRINTS THE EXACT TURSO ERROR TO YOUR BROWSER SCREEN!
    return { error: `Turso Error: ${e.message || "Unknown error"}`, success: null };
  }
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { client } = getDb(); 
  let success = false;

  try {
    const hashedPassword = await hashPassword(password);
    
    const result = await client.execute({
      sql: `SELECT email FROM users WHERE email = ? AND password = ? LIMIT 1`,
      args: [email, hashedPassword]
    });

    if (result.rows.length > 0) {
      const cookieStore = await cookies();
      cookieStore.set("session", email, { httpOnly: true, secure: true, path: "/" });
      success = true;
    } else {
      return { error: "Invalid credentials.", success: null };
    }
  } catch (e: any) {
    return { error: `Turso Error: ${e.message || "Unknown error"}`, success: null };
  }

  if (success) redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}