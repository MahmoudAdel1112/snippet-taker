"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ID, Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite"; // Assuming 'databases' is exported from here
import { useAuth } from "@/context/AuthContext";

const NewSnippetPage = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false); // New state for public toggle
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (authLoading || !user) {
      setError("You must be logged in to create a snippet.");
      setLoading(false);
      return;
    }

    // IMPORTANT: Replace with your actual Database ID and Collection ID
    const DATABASE_ID = "688545780018664df62a";
    const COLLECTION_ID = "6885459100315a77cdfd";

    const userId = user.$id;

    // Initialize permissions with update and delete for the owner
    const permissions = [
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ];

    // Add read permission based on the isPublic toggle
    if (isPublic) {
      permissions.push(Permission.read(Role.any())); // Publicly readable
    } else {
      permissions.push(Permission.read(Role.user(userId))); // Only owner can read
    }

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          snippet_name: title,
          snippet_description: description,
          snippet_language: language,
          snippet_code: code,
          user_id: userId,
          user_name: user.name, // Store user's name for display
          is_public: isPublic, // Store the public status in the document
        },
        permissions
      );
      router.push("/"); // Redirect to dashboard on success
    } catch (err: unknown) {
      // Changed from 'any' to 'unknown'
      console.error("Failed to create snippet:", err);
      setError(
        err instanceof Error
          ? err.message
          : String(err) || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-neutral-900">
        Add a New Snippet
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Snippet Title */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-neutral-700 mb-1"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-2 focus:ring-primary focus:border-primary transition"
              type="text"
              id="title"
              name="title"
              placeholder="e.g., React Fetch Hook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Language */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-neutral-700 mb-1"
              htmlFor="language"
            >
              Language
            </label>
            <input
              className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-2 focus:ring-primary focus:border-primary transition"
              type="text"
              id="language"
              name="language"
              placeholder="e.g., JavaScript"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-neutral-700 mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-2 focus:ring-primary focus:border-primary transition"
              id="description"
              name="description"
              rows={3}
              placeholder="A short description of what this snippet does."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Code */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-neutral-700 mb-1"
              htmlFor="code"
            >
              Code
            </label>
            <textarea
              className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-md text-neutral-100 font-mono focus:ring-2 focus:ring-primary focus:border-primary transition"
              id="code"
              name="code"
              rows={10}
              placeholder="// Your code snippet here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Public Toggle */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2 h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
            />
            <label
              className="text-sm font-medium text-neutral-700"
              htmlFor="isPublic"
            >
              Make Public (Anyone can view, only you can edit/delete)
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-error/20 text-error p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors duration-200"
              type="submit"
              disabled={loading || authLoading} // Disable button while loading or authenticating
            >
              {loading ? "Creating..." : "Create Snippet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSnippetPage;
