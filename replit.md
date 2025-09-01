# Overview

FinTrek is a gamified financial literacy learning platform that teaches users investing, trading, and money management through interactive lessons, quizzes, and community features. The application combines educational content with game-like elements including points, badges, streaks, and leaderboards to encourage continuous learning and engagement.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using **React 18 with TypeScript** and follows a modern component-based architecture:

- **UI Framework**: Utilizes shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: TailwindCSS with a custom design system featuring financial-themed colors and gradients
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: React Router for client-side navigation with protected routes
- **Theme System**: next-themes for dark/light mode support with system preference detection

The application structure includes:
- **Pages**: Dashboard, Learning modules, Lessons, Quizzes, Leaderboard, Community, and Profile
- **Gamification Components**: Points display, progress bars, badges, and achievement tracking
- **Layout System**: Consistent navigation with responsive design and mobile optimization

## Backend Architecture

The backend uses **Express.js with TypeScript** in a minimalist setup:

- **Server Framework**: Express.js with middleware for JSON parsing, logging, and error handling
- **Development Setup**: Vite integration for hot module replacement in development
- **Storage Layer**: Abstracted storage interface with in-memory implementation (MemStorage class)
- **Type Safety**: Shared TypeScript schemas between frontend and backend

Key architectural decisions:
- **Monorepo Structure**: Client, server, and shared code in unified structure
- **Development-First Approach**: Optimized for rapid development with hot reloading
- **Extensible Storage**: Interface-based storage allows easy swapping of persistence layers

## Data Storage Solutions

The application uses a **dual-database approach**:

- **Primary Database**: PostgreSQL with Drizzle ORM for structured data
- **Session Storage**: PostgreSQL with connect-pg-simple for session management
- **Development Storage**: In-memory storage class for rapid prototyping
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL

Database design features:
- **Schema-First Approach**: Drizzle schemas with Zod validation
- **Type Generation**: Automatic TypeScript types from database schema
- **Migration System**: Drizzle-kit for schema migrations and database versioning

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe SQL ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form** with **@hookform/resolvers**: Form management and validation

### UI and Styling Dependencies
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **next-themes**: Theme management system

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Backend bundling and optimization
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx** and **tailwind-merge**: Conditional CSS class management
- **nanoid**: Unique ID generation
- **zod**: Runtime type validation and schema definition

The architecture prioritizes developer experience, type safety, and rapid iteration while maintaining scalability through modular design patterns and clear separation of concerns.