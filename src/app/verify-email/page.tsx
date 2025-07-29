"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (userId && secret) {
      const verifyEmail = async () => {
        try {
          await account.updateVerification(userId, secret);
          setMessage("Email verified successfully! Redirecting to login...");
          setIsError(false);
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000); // Redirect after 3 seconds
        } catch (error) {
          console.error("Email verification failed:", error);
          setMessage(
            "Email verification failed. Please try again or contact support."
          );
          setIsError(true);
        }
      };
      verifyEmail();
    } else {
      setMessage("Invalid verification link.");
      setIsError(true);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-neutral-900 text-2xl font-bold mb-4">
          Email Verification
        </h2>
        <p className={isError ? "text-error" : "text-neutral-700"}>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
