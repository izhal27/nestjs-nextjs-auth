import { signOut } from "@/auth";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-md transition-all duration-300">
      <div className="text-xl font-bold tracking-tight text-gray-900">
        <span className="cursor-pointer hover:text-blue-600 transition-colors">
          My Blog
        </span>
      </div>
      <ul className="flex items-center gap-6 text-sm font-medium text-gray-600">
        <li>
          <Link href="/posts" className="hover:text-gray-900 transition-colors">
            Posts
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="hover:text-gray-900 transition-colors"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/create-post"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Create Post
          </Link>
        </li>
        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
