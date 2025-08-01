"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code, Zap, Save } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Your Personal Code Snippet Library
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Never lose a useful piece of code again. Organize, search, and access your snippets from anywhere.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Explore Snippets</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="feature-card">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Save className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Organize</h3>
              <p className="text-muted-foreground">
                Easily save and categorize your code snippets with names, descriptions, and languages.
              </p>
            </div>
            <div className="feature-card">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Syntax Highlighting</h3>
              <p className="text-muted-foreground">
                Enjoy beautiful and readable code with automatic syntax highlighting.
              </p>
            </div>
            <div className="feature-card">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast Access</h3>
              <p className="text-muted-foreground">
                Quickly find the snippet you need with a powerful and fast search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-background border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SnippetLib. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;