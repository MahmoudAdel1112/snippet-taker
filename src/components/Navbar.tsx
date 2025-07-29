"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Snippet Library
        </Link>
        <div className="flex items-center">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : user ? (
            <>
              <Link href="/mysnippets" className="mr-4 hover:text-gray-300">
                My Snippets
              </Link>
              <span className="mr-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4 hover:text-gray-300">
                Login
              </Link>
              <Link href="/signup" className="hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
