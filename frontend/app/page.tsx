import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans">
      <main className="text-center px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
            My App
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Welcome to your application
          </p>
        </div>

        <div className="flex gap-6 justify-center flex-wrap">
          <Link
            href="/auth/signin"
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <LogIn size={20} />
            <span className="font-semibold">Sign In</span>
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <UserPlus size={20} />
            <span className="font-semibold">Sign Up</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
