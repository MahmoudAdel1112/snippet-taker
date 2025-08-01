"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSnippets } from "@/context/SnippetContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import DashboardSkeleton from "./DashboardSkeleton";

const DashboardPage = () => {
  const { snippets, hasMore, isLoading, error, loadMoreSnippets } =
    useSnippets();
  const loaderRef = useRef<HTMLDivElement | null>(null);

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

  if (isLoading && snippets.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Public Snippets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((snippet) => (
          <Card key={snippet.$id}>
            <CardHeader>
              <CardTitle>{snippet.snippet_name}</CardTitle>
              <CardDescription className="line-clamp-3">
                {snippet.snippet_description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Created by: {snippet.user_name}
              </p>
              <Link href={`/snippets/${snippet.$id}`} passHref>
                <Button variant="outline">View Snippet</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 text-center mt-6">
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
