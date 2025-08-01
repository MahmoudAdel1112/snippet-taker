import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - SnippetLib",
  description: "Verify your email address for your SnippetLib account.",
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
