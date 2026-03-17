import { cookies } from "next/headers";
import Image from "next/image";
import { logout } from "./actions";
import AuthForm from "./auth-form";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-6">
      <main className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <Image className="dark:invert mb-8" src="/next.svg" alt="Next.js logo" width={80} height={16} priority />

        {session ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Welcome back!</h1>
            <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Logged in as:</p>
              <p className="font-mono text-lg text-black dark:text-white break-all">{session}</p>
            </div>
            <form action={logout}>
              <button className="w-full h-12 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Authentication</h1>
              <p className="text-zinc-500 text-sm">Sign in to your Turso-powered account.</p>
            </div>
            <AuthForm />
          </div>
        )}
      </main>
    </div>
  );
}