"use client";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-neutral-900 mb-4">
          Welcome to Your Personal Snippet Library
        </h1>
        <p className="text-lg text-neutral-700 mb-8">
          Organize, store, and access your code snippets from anywhere. Your
          personal digital library for efficient and streamlined development.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
