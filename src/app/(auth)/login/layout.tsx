import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SnippetLib",
  description: "Log in to your SnippetLib account to access your personal code snippet library.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
