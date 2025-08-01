import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Snippet - SnippetLib",
  description: "Add a new code snippet to your personal library.",
};

export default function NewSnippetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
