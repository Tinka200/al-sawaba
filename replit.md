# Medical Clinic Management System

## Overview

This is a full-stack medical clinic management system built for "Al-sawab Clinic & Maternity". The application provides comprehensive functionality for managing patients, doctors, drugs, appointments, and admissions in a healthcare setting.

## User Preferences

Preferred communication style: Simple, everyday language.
Contact information: Phone +234 813 012 0622 with WhatsApp integration.
Login requirement: Users must authenticate to access patient management features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with Express routes
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

### Database Design
- **Primary Database**: PostgreSQL (using Neon serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Connection pooling with @neondatabase/serverless
- **Tables**: Users, patients, doctors, drugs, appointments, admissions, sessions

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Authorization**: Role-based access control (patient, doctor, admin)
- **User Management**: Automatic user creation/update on login

### Core Entities
1. **Patients**: Personal information, medical history, emergency contacts
2. **Doctors**: Professional details, specializations, availability
3. **Drugs**: Inventory management with stock tracking and expiry dates
4. **Appointments**: Scheduling system with status tracking
5. **Admissions**: Patient admission records with duration tracking

### UI Components
- **Design System**: shadcn/ui components with Radix UI primitives
- **Theme**: Medical-focused color scheme with custom CSS variables
- **Responsive**: Mobile-first design with breakpoint utilities
- **Forms**: Comprehensive form validation with error handling

## Data Flow

### Frontend to Backend
1. Client makes API requests using fetch with credentials
2. TanStack Query handles caching, loading states, and error handling
3. Form submissions use React Hook Form with Zod validation
4. Authentication state managed through React Query

### Backend Processing
1. Express middleware handles CORS, JSON parsing, and logging
2. Replit Auth middleware validates sessions and user identity
3. Route handlers process requests and interact with database
4. Drizzle ORM handles database queries with type safety

### Database Operations
1. Connection pooling manages PostgreSQL connections
2. Drizzle schema provides type-safe database operations
3. Relations between entities handled through foreign keys
4. Search functionality implemented with SQL LIKE queries

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **express**: Web framework for API routes
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation library

### UI Dependencies
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight routing

### Authentication
- **openid-client**: OIDC authentication client
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server for frontend with HMR
- **API Server**: Express server with tsx for TypeScript execution
- **Database**: Neon PostgreSQL with development connection string
- **Hot Reload**: Automatic restart on file changes

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js
- **Database**: Production PostgreSQL with connection pooling
- **Environment**: Production-ready with proper error handling

### Configuration Management
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID
- **TypeScript**: Strict type checking with shared types
- **Path Mapping**: Absolute imports with @ and @shared aliases
- **Build Scripts**: Separate dev, build, and production commands

The system is designed to be deployed on Replit with automatic provisioning of PostgreSQL database and authentication services. The architecture supports both development and production environments with appropriate configurations for each.