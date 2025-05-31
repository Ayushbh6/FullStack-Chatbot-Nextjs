# Scalable AI Chatbot

A production-ready, scalable AI chatbot built with Next.js 15, OpenAI GPT, and MongoDB. Features real-time streaming responses, persistent chat history, and a modern dark/light theme interface.

## ✨ Features

### 🔐 Authentication & Security
- **Google OAuth Integration** with NextAuth.js
- **MongoDB Adapter** for user session persistence
- **Route Protection Middleware** for secure access
- **User-specific Data Isolation** - each user only sees their own conversations

### 💬 Chat Functionality
- **Real-time Streaming Responses** from OpenAI GPT models
- **Persistent Chat History** stored in MongoDB
- **Multiple Conversations** - create, rename, and delete chat sessions
- **Message Threading** - maintain context across conversation turns
- **Auto-scroll** to latest messages

### 🎨 User Interface
- **Modern Responsive Design** with Tailwind CSS v4
- **Dark/Light Theme Toggle** with system preference detection
- **Sidebar Navigation** for conversation management
- **Real-time Message Streaming** with typing indicators
- **File Upload Support** (infrastructure ready)
- **Shadcn/ui Components** for consistent design system

### 🏗️ Architecture
- **Next.js 15 App Router** with TypeScript
- **MongoDB Atlas Integration** with optimized connection pooling
- **RESTful API Routes** for conversations and chat
- **Streaming API Responses** for real-time chat experience
- **Component-based Architecture** with reusable UI components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Google Cloud Console project
- OpenAI API account

### 1. Clone and Install
```bash
git clone <repository-url>
cd scalable-ai-chatbot
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here # Generate with: openssl rand -base64 32

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI API (Required)
OPENAI_API_KEY=your-openai-api-key

# MongoDB Atlas (Required)
MONGODB_ATLAS_CLUSTER_URI=mongodb+srv://username:password@cluster.mongodb.net/Chatbot_v2?retryWrites=true&w=majority
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (Web application)
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy Client ID and Secret to `.env.local`

### 4. MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Create a database named `Chatbot_v2`
3. Get your connection string and add to `.env.local`
4. Ensure your IP is whitelisted in Atlas

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
scalable-ai-chatbot/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth.js configuration
│   │   ├── chat/                 # Chat streaming endpoint
│   │   ├── conversations/        # Conversation CRUD operations
│   │   ├── toolcalls/           # Tool calling functionality
│   │   └── upload/              # File upload handling
│   ├── chat/                    # Main chat interface
│   ├── dashboard/               # User dashboard
│   ├── login/                   # Authentication page
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Landing page
├── components/                   # Reusable React components
│   ├── ui/                      # Shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── ChatLayout.tsx           # Main chat interface layout
│   ├── ChatInput.tsx            # Message input component
│   ├── Sidebar.tsx              # Conversation sidebar
│   ├── ThemeProvider.tsx        # Theme context provider
│   ├── ThemeInitializer.tsx     # Theme initialization
│   ├── SessionProvider.tsx      # NextAuth session provider
│   └── SignOutButton.tsx        # Authentication controls
├── lib/                         # Utility libraries
│   ├── mongodb.ts               # MongoDB connection client
│   ├── conversations.ts         # Conversation data operations
│   ├── openai.ts               # OpenAI client configuration
│   └── utils.ts                # Utility functions
├── middleware.ts                # Route protection middleware
├── tailwind.config.js          # Tailwind CSS configuration
├── components.json             # Shadcn/ui configuration
└── package.json               # Dependencies and scripts
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon library

### Backend & Database
- **NextAuth.js** - Authentication solution
- **MongoDB Atlas** - Cloud database with MongoDB adapter
- **OpenAI API** - GPT models for chat responses

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Fast development bundler
- **PostCSS** - CSS processing

## 🔧 Available Scripts

```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `GET/POST /api/auth/*` - NextAuth.js authentication routes

### Conversations
- `GET /api/conversations` - Fetch user's conversations
- `POST /api/conversations` - Create new conversation
- `PUT /api/conversations/[id]` - Update conversation (rename)
- `DELETE /api/conversations/[id]` - Delete conversation

### Chat
- `POST /api/chat` - Send message and get streaming AI response

### File Upload
- `POST /api/upload` - Handle file uploads (ready for implementation)

## 🎯 Key Features Explained

### Real-time Streaming
The chat interface uses Server-Sent Events (SSE) to stream responses from OpenAI in real-time, providing a smooth user experience similar to ChatGPT.

### Conversation Management
Users can create multiple conversations, rename them, and delete them. All conversations are persisted in MongoDB and associated with the authenticated user.

### Theme System
Comprehensive dark/light theme support with system preference detection and manual toggle. Theme state persists across sessions.

### Security
- Route-level protection with middleware
- User session management with NextAuth.js
- Data isolation - users only access their own conversations
- Secure API endpoints with authentication checks

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials
- `OPENAI_API_KEY` - OpenAI API key
- `MONGODB_ATLAS_CLUSTER_URI` - MongoDB connection string

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Ensure all environment variables are correctly set
3. Verify MongoDB Atlas connection and IP whitelist
4. Check Google OAuth configuration

## 🔮 Roadmap

- [ ] File upload and processing
- [ ] Vector embeddings for document search
- [ ] Multi-model support (Claude, Gemini)
- [ ] Conversation sharing
- [ ] Export chat history
- [ ] Advanced tool calling
- [ ] Custom system prompts
- [ ] Usage analytics dashboard


