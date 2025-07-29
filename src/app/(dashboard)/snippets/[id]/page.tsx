"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases } from "@/lib/appwrite";
import { Models } from "appwrite";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const PUBLIC_DATABASE_ID = "688545780018664df62a";
const SNIPPET_COLLECTION_ID = "6885459100315a77cdfd";

const SnippetPage = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Snippet ID is missing.");
      return;
    }

    const fetchSnippet = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedSnippet = await databases.getDocument(
          PUBLIC_DATABASE_ID,
          SNIPPET_COLLECTION_ID,
          id as string
        );
        setSnippet(fetchedSnippet);
      } catch (err: any) {
        console.error("Failed to fetch snippet:", err);
        setError(err.message || "Failed to load snippet.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading snippet...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="container mx-auto p-4 text-center">
        Snippet not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{snippet.snippet_name}</h1>
      <p className="text-gray-600 mb-2">
        Created by: {snippet.user_name || "Unknown"}
      </p>
      <p className="text-gray-700 mb-4">{snippet.snippet_description}</p>

      <div className="bg-neutral-800 rounded-lg p-4 mb-4">
        <SyntaxHighlighter language={snippet.snippet_language} style={dracula}>
          {snippet.snippet_code}
        </SyntaxHighlighter>
      </div>

      <p className="text-sm text-gray-500">
        Language: {snippet.snippet_language}
      </p>
    </div>
  );
};

export default SnippetPage;
