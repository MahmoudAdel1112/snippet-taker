'use client';

import { Skeleton } from "@/components/ui/skeleton";

const MySnippetsSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-2xl font-bold mb-4">
        <Skeleton className="h-8 w-40" />
      </div>
      <ul>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="border p-4 my-2 rounded-lg">
            <div className="text-xl font-semibold">
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-32 w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MySnippetsSkeleton;
