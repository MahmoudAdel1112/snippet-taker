import { databases } from "@/lib/appwrite";
import { notFound } from "next/navigation";
import SnippetClientPage from "./SnippetClientPage";
import { Metadata } from "next";

// Define the expected shape of params
interface PageProps {
  params: Promise<{ id: string }>;
}

const PUBLIC_DATABASE_ID = "688545780018664df62a";
const SNIPPET_COLLECTION_ID = "6885459100315a77cdfd";

async function getSnippet(id: string) {
  try {
    return await databases.getDocument(
      PUBLIC_DATABASE_ID, // Ensure environment variables are defined
      SNIPPET_COLLECTION_ID, // Ensure environment variables are defined
      id
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params; // Await the params Promise to get the id
  const snippet = await getSnippet(id);

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    };
  }

  return {
    title: `${snippet.snippet_name} - SnippetLib`,
    description:
      snippet.snippet_description ||
      `A code snippet for ${snippet.snippet_language}`,
  };
}

const SnippetPage = async ({ params }: PageProps) => {
  const { id } = await params; // Await the params Promise to get the id
  const snippet = await getSnippet(id);

  if (!snippet) {
    notFound();
  }

  return <SnippetClientPage initialSnippet={snippet} />;
};

export default SnippetPage;
