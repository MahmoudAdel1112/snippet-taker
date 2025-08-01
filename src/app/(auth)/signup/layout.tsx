import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - SnippetLib",
  description: "Create an account to start building your personal code snippet library.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
