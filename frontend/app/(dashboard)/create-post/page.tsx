"use client";

import { apiClient } from "@/lib/api-client";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiClient.post("/posts", {
        title,
        content,
        published,
      });
      router.push("/posts");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
      <div className="mb-8">
        <Link
          href="/posts"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Create New Post
        </h1>
        <p className="text-gray-500 mt-2">
          Write down your thoughts and share them with the world.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Validation Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-900"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Give your post a catchy title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-shadow"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-gray-900"
              >
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                placeholder="Write your post content here..."
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-shadow resize-y"
                disabled={loading}
              />
            </div>

            <div className="flex items-center pl-1">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                disabled={loading}
              />
              <label
                htmlFor="published"
                className="ml-3 block text-sm leading-6 text-gray-900 cursor-pointer user-select-none"
              >
                <span className="font-medium">Publish immediately</span>
                <span className="block text-gray-500 text-xs mt-0.5">
                  If unchecked, this will be saved as a draft.
                </span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-8 flex justify-end gap-4">
            <Link
              href="/posts"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Save Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
