# Project Plan: Personal Snippet Library

This document outlines the plan for creating a personal code snippet library.

## Routes

- `/`: Main dashboard, listing all snippets for the logged-in user.
- `/snippets/new`: Page with a form to create a new snippet.
- `/snippets/[id]`: Page to view a single snippet.
- `/snippets/[id]/edit`: Page to edit an existing snippet.
- `/login`: User login page.
- `/signup`: User registration page.
- `/profile`: User profile page to manage account details.

## File Structure

```
.
├── .next/
├── .vscode/
├── node_modules/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── snippets/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── ...
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   └── components/
│       ├── Navbar.tsx
│       └── ...
├── .gitignore
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Next Steps

1.  **Setup Appwrite:**
    - Create a new project in Appwrite.
    - Create a collection for snippets with the following attributes:
        - `title` (string)
        - `description` (string)
        - `language` (string)
        - `code` (string)
        - `userId` (string)
    - Enable user authentication.

2.  **Implement Authentication:**
    - Create the login and signup pages.
    - Implement logic to handle user registration and login using Appwrite.
    - Create a session management system.

3.  **Implement Snippet Management:**
    - Create the pages for listing, creating, viewing, and editing snippets.
    - Implement the logic to interact with the Appwrite API for CRUD operations on snippets.

4.  **Add Features:**
    - Implement search functionality.
    - Add syntax highlighting for code snippets.
    - Implement user profile management.
