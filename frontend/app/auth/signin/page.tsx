"use client";
import { Loader2, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!res) {
      setError("Terjadi kesalahan.");
      return;
    }

    if (res.error) {
      setError(res.error);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <div className="py-6 px-6 sm:px-8 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm opacity-90 mt-1">Sign in to your account</p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-3 py-2.5 rounded-lg border border-slate-200 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-3 py-2.5 rounded-lg border border-slate-200 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>

            <div className="text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <a
                href="/auth/signup"
                className="text-indigo-600 hover:underline"
              >
                Daftar
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
