// app/verify-email/page.tsx
import { Suspense } from "react";
import VerifyEmailPage from "@/app/verify-email/VerifyEmailClient";

export default function VerifyEmailServer() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
