# EurekaPad

EurekaPad is a specialized note-taking application designed to provide a superior experience for STEM students. It offers a comprehensive set of features tailored to technical note-taking, with a focus on essential tools such as interactive math equations, dynamic graphs, and runnable code blocks.

## Table of Contents

1. [Setup](#setup)
2. [Core Features](#core-features)
3. [Project Structure](#project-structure)
4. [Key Implementations](#key-implementations)
5. [Development Guidelines](#development-guidelines)

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/zeyu2001/eurekapad
   cd eurekapad
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Refer to the Notion engineering onboarding page for instructions on setting up environment variables
   - Fill in the required values for:
     - Clerk (authentication)
     - Convex (backend)
     - Azure Blob Storage (file uploads)
     - Microsoft Cognitive Services (speech recognition)

4. Start the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Core Features

- Rich text editing with custom blocks
- Math equation support
- Interactive graphs powered by Desmos
- Runnable code blocks with syntax highlighting
- Real-time collaboration (powered by Convex)
- Document organization with nested structure
- Dark mode support
- Speech-to-text transcription

## Project Structure

- `app/`: Next.js app router and page components
- `components/`: Reusable React components
- `convex/`: Convex backend functions and schema
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and helpers
- `public/`: Static assets
- `styles/`: Global styles and Tailwind CSS configuration

## Key Implementations

- Editor: `components/editor/index.tsx`
- Custom Blocks:
  - Code: `components/editor/code/`
  - Math: `components/editor/math/`
  - Graph: `components/editor/graph/`
  - Transcription: `components/editor/transcription/`
- Document Management: `convex/documents.ts`
- Navigation: `app/(main)/_components/navigation.tsx`
- Authentication: Implemented using Clerk (see `app/layout.tsx`)
- File Uploads: `convex/uploads.ts` and `lib/client-uploads.ts`
- Speech Recognition: `components/editor/transcription/transcription-block.tsx`

## Development Guidelines

1. Follow the existing code style and use ESLint and Prettier for consistency.
2. Write unit tests for new features using the preferred testing framework.
3. Use the custom UI components from `components/ui/` when possible.
4. When adding new environment variables, update both `.env.example` and the setup instructions in this README.
5. Keep the `convex/schema.ts` file updated when modifying the database structure.
6. Use the `useOptimisticDocumentUpdate` hook for a better user experience when updating documents.

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production application
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier to format code
- `npm run prepare`: Install Husky for pre-commit hooks
