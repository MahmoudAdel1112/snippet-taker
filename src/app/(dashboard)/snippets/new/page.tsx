"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ID, Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

// Zod schema for form validation
const snippetSchema = z.object({
  snippet_name: z.string().min(1, { message: "Title is required" }),
  snippet_language: z.string().min(1, { message: "Language is required" }),
  snippet_description: z.string().optional(),
  snippet_code: z.string().min(1, { message: "Code snippet cannot be empty" }),
  isPublic: z.boolean(),
});

type SnippetInputs = z.infer<typeof snippetSchema>;

const supportedLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "json", label: "JSON" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
];

const NewSnippetPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const form = useForm<SnippetInputs>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      snippet_name: "",
      snippet_language: "",
      snippet_description: "",
      snippet_code: "",
      isPublic: false,
    },
  });

  const onSubmit: SubmitHandler<SnippetInputs> = async (data) => {
    if (authLoading || !user) {
      toast.error("You must be logged in to create a snippet.");
      return;
    }

    const DATABASE_ID = "688545780018664df62a";
    const COLLECTION_ID = "6885459100315a77cdfd";
    const userId = user.$id;

    const permissions = [
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
      data.isPublic
        ? Permission.read(Role.any())
        : Permission.read(Role.user(userId)),
    ];

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          snippet_name: data.snippet_name,
          snippet_description: data.snippet_description,
          snippet_language: data.snippet_language,
          snippet_code: data.snippet_code,
          user_id: userId,
          user_name: user.name,
          is_public: data.isPublic,
        },

        permissions
      );

      // Invalidate cache and redirect
      sessionStorage.removeItem(`mySnippets_${userId}`);
      toast.success("Snippet created successfully!");
      router.push("/mysnippets");
    } catch (err: unknown) {
      console.error("Failed to create snippet:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to create snippet: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="p-8 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-6">
            Add a New Snippet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="snippet_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React Fetch Hook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="snippet_language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supportedLanguages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="snippet_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of what this snippet does."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="snippet_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="// Your code snippet here"
                        rows={10}
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Make Public (Anyone can view, only you can edit/delete)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || authLoading}
                >
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create Snippet"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewSnippetPage;
