"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
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

import { toast } from "sonner";

// Schema for updating name
const nameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
type NameInputs = z.infer<typeof nameSchema>;

// Schema for updating email
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
});
type EmailInputs = z.infer<typeof emailSchema>;

// Schema for updating password
const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });
type PasswordInputs = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
  const { user, loading, checkUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<boolean>();

  const nameForm = useForm<NameInputs>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const emailForm = useForm<EmailInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || "",
      currentPassword: "",
    },
  });

  const passwordForm = useForm<PasswordInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      setError(true);
    }
    if (user) {
      nameForm.reset({ name: user.name || "" });
      emailForm.reset({ email: user.email || "", currentPassword: "" });
    }
  }, [user, loading, router, nameForm, emailForm]);

  const handleUpdateName: SubmitHandler<NameInputs> = async (data) => {
    try {
      await account.updateName(data.name);
      await checkUser(); // Refresh user data in context
      toast.success("Name updated successfully!");
    } catch (err: unknown) {
      console.error("Failed to update name:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Error updating name: ${errorMessage}`);
    }
  };

  const handleUpdateEmail: SubmitHandler<EmailInputs> = async (data) => {
    try {
      await account.updateEmail(data.email, data.currentPassword);
      await account.createVerification("http://localhost:3000/verify-email");
      toast.success(
        "Email updated. Please check your new email for a verification link."
      );
      await checkUser();
      emailForm.reset({ ...data, currentPassword: "" });
    } catch (err: unknown) {
      console.error("Failed to update email:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Error updating email: ${errorMessage}`);
    }
  };

  const handleUpdatePassword: SubmitHandler<PasswordInputs> = async (data) => {
    try {
      await account.updatePassword(data.newPassword, data.currentPassword);
      toast.success("Password updated successfully!");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: unknown) {
      console.error("Failed to update password:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Error updating password: ${errorMessage}`);
    }
  };

  if (loading || !user) {
    return <div className="container mx-auto p-4">Loading profile...</div>;
  }
  if (error) {
    return <p>you&apos;re not logged in, log in first</p>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      {/* Update Name Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Update Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...nameForm}>
            <form
              onSubmit={nameForm.handleSubmit(handleUpdateName)}
              className="space-y-4"
            >
              <FormField
                control={nameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input id="profileName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={nameForm.formState.isSubmitting}>
                Update Name
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Update Email Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Update Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleUpdateEmail)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="profileEmail" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password (for email change)</FormLabel>
                    <FormControl>
                      <Input
                        id="currentPasswordEmail"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={emailForm.formState.isSubmitting}>
                Update Email
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Update Password Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleUpdatePassword)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        id="currentPasswordPassword"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input id="newPassword" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
              >
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
