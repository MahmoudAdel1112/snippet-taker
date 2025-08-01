"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({ reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <AlertTriangle className="w-24 h-24 mb-6 text-destructive" />
      <h2 className="text-3xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error. Please try again.
      </p>
      <Button onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}
