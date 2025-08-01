"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <FileQuestion className="w-24 h-24 mb-6 text-primary" />
      <h2 className="text-4xl font-bold mb-2">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <Button asChild>
        <Link href="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
}
