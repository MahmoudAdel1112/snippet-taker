"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { databases } from "@/lib/appwrite";
import Link from "next/link";
import { Models, Query } from "appwrite";

const PUBLIC_DATABASE_ID = "688545780018664df62a";
const SNIPPET_COLLECTION_ID = "6885459100315a77cdfd";
const SNIPPETS_PER_PAGE = 9;

const DashboardPage = () => {
  const [snippets, setSnippets] = useState<Models.Document[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMoreSnippets = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setError(null);

    try {
      if (!PUBLIC_DATABASE_ID || !SNIPPET_COLLECTION_ID) {
        throw new Error("Appwrite database or collection IDs are not defined.");
      }
      const response = await databases.listDocuments(
        PUBLIC_DATABASE_ID,
        SNIPPET_COLLECTION_ID,
        [Query.equal("is_public", true), Query.limit(SNIPPETS_PER_PAGE), Query.offset(offset)]
      );
      console.log(response);
      const newSnippets = response.documents;
      if (newSnippets.length > 0) {
        setSnippets((prev) => [...prev, ...newSnippets]);
        console.log(snippets);
        setOffset((prev) => prev + newSnippets.length);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Failed to fetch public snippets", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [offset, hasMore, isLoading, snippets]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoading) {
          loadMoreSnippets();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreSnippets, hasMore, isLoading]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Public Snippets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((snippet) => (
          <div key={snippet.$id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {snippet.snippet_name}
            </h2>
            <p className="text-gray-600 mb-2 line-clamp-3">
              {snippet.snippet_description}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Created by: {snippet.user_name}
            </p>
            <Link
              href={`/snippets/${snippet.$id}`}
              className="text-blue-600 hover:underline"
            >
              View Snippet
            </Link>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 text-center">
        {isLoading && <p>Loading more snippets...</p>}
        {!hasMore && snippets.length > 0 && <p>You&apos;ve reached the end!</p>}
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">Error: {error}</div>
      )}

      {snippets.length === 0 && !isLoading && !error && (
        <p className="text-center">No public snippets available yet.</p>
      )}
    </div>
  );
};

export default DashboardPage;
