"use client";
import React, { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite"; // Import the centralized Appwrite account instance
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  const router = useRouter();
  const { user, loading, login } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state on new submission

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await account.createEmailPasswordSession(email, password);
      const userAccount = await account.get();
      if (userAccount) {
        login(userAccount);
        router.prefetch("/dashboard");
        router.push("/dashboard");
      }
    } catch (err) {
      // On failure, display a user-friendly error message
      setError("Invalid email or password. Please try again.");
      console.error(err); // Log the actual error for debugging
    }
  };

  if (loading || user) {
    return <div className="min-h-screen bg-neutral-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-neutral-900 text-2xl font-bold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-neutral-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-neutral-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Display error message if it exists */}
          {error && (
            <div className="bg-error/20 text-error p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
