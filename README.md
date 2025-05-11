# Scalable AI Chatbot

A scalable AI chatbot built with Next.js 15 and OpenAI.

## Features

- Google Authentication with NextAuth.js
- Secure route protection
- Modern UI with Tailwind CSS v4
- (Future) AI chat functionality

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here # Generate with: openssl rand -base64 32

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. Set up Google OAuth:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Configure OAuth consent screen
   - Create OAuth credentials (Web application type)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-production-domain.com/api/auth/callback/google` (for production)
   - Copy the Client ID and Client Secret to your `.env.local` file

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `app/api/auth/[...nextauth]/` - NextAuth.js authentication API
- `app/login/` - Login page with Google authentication
- `app/dashboard/` - Protected dashboard page
- `components/` - Reusable React components
- `middleware.ts` - Route protection middleware

## Technologies Used

- Next.js 15
- NextAuth.js
- Tailwind CSS v4
- TypeScript

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


<TEXT TO COPY. DO NOT DELETE>
'''
Our context here is getting over, I willl move ontot a new chat, give me a short but detailed context in plain text that I can paste in the next chat session and continue or work from there. I will run the code now and check how it works and will continue debugging it if needed
'''
</TEXT TO COPY. DO NOT DELETE>