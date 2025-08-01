"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { databases } from "@/lib/appwrite";
import { Query, Models } from "appwrite";
import CodeBlock from "@/components/CodeBlock";
import MySnippetsSkeleton from "./MySnippetsSkeleton";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

// Define the structure of a snippet document
interface Snippet extends Models.Document {
  snippet_name: string;
  snippet_code: string;
  user_id: string;
  snippet_language: string;
}

const MySnippetsPage = () => {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  useEffect(() => {
    const fetchSnippets = async () => {
      if (!user) {
        setIsLoading(false);
        setInitialFetchComplete(true);
        return;
      }

      const CACHE_KEY = `mySnippets_${user.$id}`;
      setIsLoading(true);

      try {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          setSnippets(JSON.parse(cachedData));
        } else {
          const response = await databases.listDocuments<Snippet>(
            "688545780018664df62a", // Your DATABASE_ID
            "6885459100315a77cdfd", // Your COLLECTION_ID
            [Query.equal("user_id", user.$id)]
          );
          const fetchedSnippets = response.documents;
          setSnippets(fetchedSnippets);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(fetchedSnippets));
        }
      } catch (error) {
        console.error("Failed to fetch snippets:", error);
        // Optionally, handle the error state in the UI
      } finally {
        setIsLoading(false);
        setInitialFetchComplete(true);
      }
    };

    fetchSnippets();
  }, [user]);

  const handleDelete = async (snippetId: string) => {
    if (!user) return;

    if (window.confirm("Are you sure you want to delete this snippet?")) {
      try {
        await databases.deleteDocument(
          "688545780018664df62a", // Your DATABASE_ID
          "6885459100315a77cdfd", // Your COLLECTION_ID
          snippetId
        );

        const updatedSnippets = snippets.filter((s) => s.$id !== snippetId);
        setSnippets(updatedSnippets);
        sessionStorage.setItem(`mySnippets_${user.$id}`, JSON.stringify(updatedSnippets));
        toast.success("Snippet deleted successfully!");

      } catch (error) {
        console.error("Failed to delete snippet:", error);
        toast.error("Failed to delete snippet.");
      }
    }
  };

  if (isLoading) {
    return <MySnippetsSkeleton />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Snippets</h1>

      {snippets.length > 0 ? (
        <ul>
          {snippets.map((snippet) => (
            <li key={snippet.$id} className="border p-4 my-2 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{snippet.snippet_name}</h2>
                <div className="flex space-x-2">
                  <Link href={`/snippets/${snippet.$id}/edit`} passHref>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(snippet.$id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <CodeBlock code={snippet.snippet_code} language={snippet.snippet_language} />
            </li>
          ))}
        </ul>
      ) : initialFetchComplete ? (
        <p>You have no snippets yet.</p>
      ) : null}
    </div>
  );
};

export default MySnippetsPage;
