'use client';
import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user, loading, login, checkUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, loading, router]);

  const handleUpdateName = async (e: FormEvent) => {
    e.preventDefault();
    setNameMessage(null);
    if (!user) return;

    try {
      await account.updateName(name);
      await checkUser(); // Refresh user data in context
      setNameMessage('Name updated successfully!');
    } catch (err: any) {
      console.error('Failed to update name:', err);
      setNameMessage(`Error updating name: ${err.message}`);
    }
  };

  const handleUpdateEmail = async (e: FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);
    if (!user) return;

    try {
      // Appwrite updateEmail requires current password for security
      // For simplicity here, we're assuming the user is logged in and session is active.
      // In a real app, you might re-authenticate or prompt for current password.
      await account.updateEmail(email, currentPassword);
      await account.createVerification('/verify-email'); // Send verification to new email
      setEmailMessage('Email updated. Please check your new email for a verification link.');
      await checkUser(); // Refresh user data in context
    } catch (err: any) {
      console.error('Failed to update email:', err);
      setEmailMessage(`Error updating email: ${err.message}`);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (!user) return;

    if (newPassword.length < 8) {
      setPasswordMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    try {
      await account.updatePassword(newPassword, currentPassword);
      setPasswordMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error('Failed to update password:', err);
      setPasswordMessage(`Error updating password: ${err.message}`);
    }
  };

  if (loading || !user) {
    return <div className="container mx-auto p-4">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      {/* Update Name Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Update Name</h2>
        <form onSubmit={handleUpdateName}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="profileName">
              Name
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="text"
              id="profileName"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          {nameMessage && (
            <div className={`p-3 rounded-md mb-4 text-sm ${nameMessage.startsWith('Error') ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
              {nameMessage}
            </div>
          )}
          <button
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            type="submit"
          >
            Update Name
          </button>
        </form>
      </div>

      {/* Update Email Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Update Email</h2>
        <form onSubmit={handleUpdateEmail}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="profileEmail">
              Email
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="email"
              id="profileEmail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="currentPasswordEmail">
              Current Password (for email change)
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="password"
              id="currentPasswordEmail"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          {emailMessage && (
            <div className={`p-3 rounded-md mb-4 text-sm ${emailMessage.startsWith('Error') ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
              {emailMessage}
            </div>
          )}
          <button
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            type="submit"
          >
            Update Email
          </button>
        </form>
      </div>

      {/* Update Password Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="currentPasswordPassword">
              Current Password
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="password"
              id="currentPasswordPassword"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              className="w-full p-2 mt-1 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-900 focus:ring-primary focus:border-primary"
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {passwordMessage && (
            <div className={`p-3 rounded-md mb-4 text-sm ${passwordMessage.startsWith('Error') ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
              {passwordMessage}
            </div>
          )}
          <button
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            type="submit"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;