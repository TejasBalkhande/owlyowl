"use client";

import { useActionState } from "react";
import { login, signUp } from "./actions";

export default function AuthForm() {
  // useActionState handles the return values from your server actions
  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signUpState, signUpAction, isSignUpPending] = useActionState(signUp, null);

  return (
    <div className="grid gap-8">
      {/* Login Form */}
      <form action={loginAction} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-black" />
        <input name="password" type="password" placeholder="Password" required className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-black" />
        
        {loginState?.error && <p className="text-red-500 text-xs">{loginState.error}</p>}
        
        <button disabled={isLoginPending} className="w-full h-11 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 disabled:opacity-50">
          {isLoginPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-200 dark:border-zinc-800"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">Or New User?</span></div>
      </div>

      {/* Signup Form */}
      <form action={signUpAction} className="space-y-4">
        <input name="email" type="email" placeholder="New Email" required className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
        <input name="password" type="password" placeholder="New Password" required className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
        
        {signUpState?.error && <p className="text-red-500 text-xs">{signUpState.error}</p>}
        {signUpState?.success && <p className="text-green-500 text-xs">{signUpState.success}</p>}

        <button disabled={isSignUpPending} className="w-full h-11 rounded-lg border border-zinc-800 text-black dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50">
          {isSignUpPending ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}