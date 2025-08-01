// app/verify-email/VerifyEmailClient.tsx
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

    if (!userId || !secret) {
      setMessage("Invalid verification link. Missing userId or secret.");
      setIsError(true);
      return;
    }

    const verifyEmail = async () => {
      try {
        await account.updateVerification(userId, secret);
        setMessage("Email verified successfully! Redirecting to dashboard...");
        setIsError(false);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (error: unknown) {
        console.error("Email verification failed:", error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        setMessage(
          `Email verification failed: ${errorMessage}. Please try again or contact support.`
        );
        setIsError(true);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-neutral-900 text-2xl font-bold mb-4">
          Email Verification
        </h2>
        <p className={isError ? "text-red-600" : "text-neutral-700"}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
