'use client';

import React, { useEffect } from 'react';
import { Models } from 'appwrite';
import CodeBlock from '@/components/CodeBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SnippetClientPageProps {
  initialSnippet: Models.Document;
}

const SnippetClientPage: React.FC<SnippetClientPageProps> = ({ initialSnippet }) => {
  useEffect(() => {
    const CACHE_KEY = `snippet_${initialSnippet.$id}`;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(initialSnippet));
  }, [initialSnippet]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{initialSnippet.snippet_name}</CardTitle>
          <CardDescription>
            Created by: {initialSnippet.user_name || 'Unknown'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{initialSnippet.snippet_description}</p>
          <CodeBlock code={initialSnippet.snippet_code} language={initialSnippet.snippet_language} />
          <p className="text-sm text-muted-foreground mt-4">
            Language: {initialSnippet.snippet_language}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnippetClientPage;
