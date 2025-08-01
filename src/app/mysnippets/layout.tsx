import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Snippets - SnippetLib",
  description: "View and manage your personal code snippets.",
};

export default function MySnippetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}