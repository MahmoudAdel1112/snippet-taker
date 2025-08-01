'use client';
import { SnippetProvider } from '@/context/SnippetContext';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  return <SnippetProvider>{children}</SnippetProvider>;
}
