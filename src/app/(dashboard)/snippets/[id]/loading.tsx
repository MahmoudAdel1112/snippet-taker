'use client';

import { Skeleton } from "@/components/ui/skeleton";

const LoadingSnippetPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="text-2xl font-semibold leading-none tracking-tight">
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="text-sm text-muted-foreground pt-1">
            <Skeleton className="h-4 w-1/4 mt-1" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-1/4 mt-4" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSnippetPage;
