import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Snippet - SnippetLib",
  description: "Edit your existing code snippet.",
};

export default function EditSnippetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
