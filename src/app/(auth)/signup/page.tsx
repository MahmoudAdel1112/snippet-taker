'use client';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { useAuth } from '@/context/AuthContext';
import { ID } from 'appwrite';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      await account.createVerification('http://localhost:3000/verify-email'); // Replace with your actual verification URL
      const userAccount = await account.get();
      if (userAccount) {
        login(userAccount);
        // Optionally, redirect to a page informing the user to check their email
        router.push('/dashboard?message=verify_email');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-neutral-900 text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="name">
              Name
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-error/20 text-error p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;