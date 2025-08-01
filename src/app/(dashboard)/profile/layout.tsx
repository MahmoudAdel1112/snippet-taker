import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings - SnippetLib",
  description: "Manage your SnippetLib account settings, including name, email, and password.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
