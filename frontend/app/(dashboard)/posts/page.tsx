"use client";

import { apiClient } from "@/lib/api-client";
import { Calendar, FileText, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
    name: string | null;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<Post[]>("/posts");
        setPosts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Posts
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and view all your published and unpublished posts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-medium">Loading your posts...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-semibold">Error loading posts</p>
          </div>
          <p className="mt-2 text-red-700">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-white border border-gray-200 border-dashed p-10 text-center shadow-sm">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-6">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No posts created
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              You haven't created any posts yet. Start sharing your thoughts by
              creating your first post.
            </p>
            <Link
              href="/create-post"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
            >
              <Plus className="mr-2 h-5 w-5" />
              Get Started
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200 overflow-hidden"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4 gap-2">
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.published && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 whitespace-nowrap">
                      Published
                    </span>
                  )}
                  {!post.published && (
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 whitespace-nowrap">
                      Draft
                    </span>
                  )}
                </div>

                <p className="text-gray-600 line-clamp-3 leading-relaxed mb-6 flex-1">
                  {post.content}
                </p>

                <div className="flex items-center text-sm text-gray-400 mt-auto pt-4 border-t border-gray-100">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
