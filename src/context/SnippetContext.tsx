'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { client, databases } from '@/lib/appwrite';
import { Models, Query } from 'appwrite';

const PUBLIC_DATABASE_ID = "688545780018664df62a";
const SNIPPET_COLLECTION_ID = "6885459100315a77cdfd";
const SNIPPETS_PER_PAGE = 9;
const CACHE_KEY = 'snippetCache';

interface Snippet extends Models.Document {
  snippet_name: string;
  snippet_description: string;
  user_name: string;
  is_public: boolean;
}

interface SnippetCache {
  snippets: Snippet[];
  offset: number;
  hasMore: boolean;
  timestamp: number;
}

interface SnippetContextType {
  snippets: Snippet[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  loadMoreSnippets: () => void;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateCache = (data: Partial<SnippetCache>) => {
    const currentCache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
    const newCache = { ...currentCache, ...data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
  };

  const loadMoreSnippets = useCallback(async () => {
    if (isLoading || !hasMore || isInitialLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await databases.listDocuments<Snippet>(
        PUBLIC_DATABASE_ID,
        SNIPPET_COLLECTION_ID,
        [Query.equal("is_public", true), Query.orderDesc("$createdAt"), Query.limit(SNIPPETS_PER_PAGE), Query.offset(offset)]
      );
      const newSnippets = response.documents;
      if (newSnippets.length > 0) {
        setSnippets((prev) => {
          const uniqueNewSnippets = newSnippets.filter(ns => !prev.some(ps => ps.$id === ns.$id));
          const updatedSnippets = [...prev, ...uniqueNewSnippets];
          updateCache({ snippets: updatedSnippets, offset: offset + newSnippets.length, hasMore: newSnippets.length === SNIPPETS_PER_PAGE });
          return updatedSnippets;
        });
        setOffset((prev) => prev + newSnippets.length);
        setHasMore(newSnippets.length === SNIPPETS_PER_PAGE);
      } else {
        setHasMore(false);
        updateCache({ hasMore: false });
      }
    } catch (err: unknown) {
      console.error("Failed to fetch more snippets", err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [offset, hasMore, isLoading, isInitialLoading]);

  useEffect(() => {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { snippets: cachedSnippets, offset: cachedOffset, hasMore: cachedHasMore } = JSON.parse(cachedData);
      setSnippets(cachedSnippets);
      setOffset(cachedOffset);
      setHasMore(cachedHasMore);
      setIsInitialLoading(false);
    } else {
      const fetchInitialSnippets = async () => {
        setIsInitialLoading(true);
        setError(null);
        try {
          const response = await databases.listDocuments<Snippet>(
            PUBLIC_DATABASE_ID, SNIPPET_COLLECTION_ID,
            [Query.equal("is_public", true), Query.orderDesc("$createdAt"), Query.limit(SNIPPETS_PER_PAGE), Query.offset(0)]
          );
          const initialSnippets = response.documents;
          setSnippets(initialSnippets);
          setOffset(initialSnippets.length);
          setHasMore(initialSnippets.length === SNIPPETS_PER_PAGE);
          updateCache({ snippets: initialSnippets, offset: initialSnippets.length, hasMore: initialSnippets.length === SNIPPETS_PER_PAGE });
        } catch (err: unknown) {
          console.error("Failed to fetch initial snippets", err);
          setError((err as Error).message);
        } finally {
          setIsInitialLoading(false);
        }
      };
      fetchInitialSnippets();
    }

    const unsubscribe = client.subscribe(`databases.${PUBLIC_DATABASE_ID}.collections.${SNIPPET_COLLECTION_ID}.documents`, (response) => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        const newSnippet = response.payload as Snippet;
        if (newSnippet.is_public) {
          setSnippets((prev) => {
            const isDuplicate = prev.some((snippet) => snippet.$id === newSnippet.$id);
            if (isDuplicate) return prev;
            const updatedSnippets = [newSnippet, ...prev];
            updateCache({ snippets: updatedSnippets, offset: updatedSnippets.length });
            return updatedSnippets;
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SnippetContext.Provider value={{ snippets, hasMore, isLoading: isLoading || isInitialLoading, error, loadMoreSnippets }}>
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (context === undefined) {
    throw new Error('useSnippets must be used within a SnippetProvider');
  }
  return context;
};