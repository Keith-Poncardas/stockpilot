# StockPilot

**StockPilot** is a modern, enterprise-ready **Point of Sale (POS) & Inventory Management System** built for retail, warehouse, and commerce workflows. It provides real-time stock tracking, audit trails for stock movements, secure POS transaction processing, employee role-based access control (RBAC), and customer management.

---

## System Overview & Key Capabilities

StockPilot is structured as a full-stack monorepo-style project separated into two independent applications: a **React + Vite Frontend** (`/client`) and a **Node.js + GraphQL Backend** (`/server`).

```mermaid
graph TD
    Client["React 19 + TypeScript + Tailwind v4 Client"] -->|GraphQL Queries / Mutations| Server["Node.js + Express 4 + Apollo Server v5"]
    Client -->|Zustand Global Store| State["Client State Management"]
    Server -->|Prisma ORM| DB[("PostgreSQL Database")]
    Server -->|Argon2 & JWT| Auth["Security & Auth Service"]
    Server -->|Resend / Nodemailer| Email["OTP & Email Notifications"]
```

### Core Domain Modules
1. **Inventory & Stock Management**:
   - Real-time stock counts (`quantityOnHand`), reorder levels, and maximum stock limits.
   - Comprehensive **Stock Movement Log** tracking `IN`, `OUT`, and `ADJUSTMENT` operations with specific reasons (`SALE`, `PURCHASE`, `RETURN`, `DAMAGE`, `EXPIRED`, `TRANSFER`, `INITIAL_STOCK`).
   - Database-level integrity constraints preventing negative stock levels.
2. **Product Catalog**:
   - Product SKU management, pricing (`unitPrice` and `costPrice`), descriptions, and lifecycle states (`DRAFT`, `ACTIVE`, `INACTIVE`, `DISCONTINUED`, `ARCHIVED`).
3. **Sales & POS Processing**:
   - End-to-end transaction processing with customer association, payment method tracking, and itemized receipts.
   - Support for multiple order statuses (`PENDING`, `COMPLETED`, `REFUNDED`, `VOIDED`).
4. **Customer Database**:
   - Customer profile management including addresses, contact information, and order history tracking.
5. **Role-Based Access Control (RBAC) & Employee Onboarding**:
   - Granular roles: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, and `CASHIER`.
   - Employee onboarding workflow with email verification, OTP codes, and administrator approval statuses (`PENDING`, `APPROVED`, `REJECTED`).

---

## StockPilot Future Core Features (Highlights)

StockPilot is actively evolving to support omnichannel retail, automated operations, and AI-driven insights. Below are the highlighted upcoming features and enhancements on the product roadmap:

### Core Roadmap Highlights
- **Multi-Channel Sales**: Seamless sales and inventory synchronization across major e-commerce platforms (**TikTok Shop**, **Lazada**, **Shopee**, etc.).
- **Natural Language AI Assistant**: Conversational AI assistant for querying sales metrics, inventory insights, and executing quick operational commands.
- **Payroll**: Integrated employee payroll calculation, attendance tracking, and commission management.
- **Sales Heatmap *(Hot Feature)***: Visual analytics heatmap showing peak sales hours, high-performing regions, and high-velocity product categories.
- **Product Expiration Tracker / Alert *(CRON JOB)***: Scheduled automated background tasks to monitor batch expiration dates and notify managers before stock spoils.
- **Realtime *(Websocketing)***: Bidirectional real-time stock updates, live POS notifications, and instant order state broadcasting.
- **Audit Trail**: End-to-end comprehensive activity logging and compliance tracking for system mutations, user actions, and security events.

### Optional Enhancements
- **Dark Mode *(Optional Feature)***: Full sleek dark theme switching for low-light environments and enhanced visual comfort.
- **Customer Loyalty Points *(Optional Feature)***: Rewards and loyalty program tracking customer purchases, membership tiers, and point redemptions at checkout.

---

## Tech Stack

### Frontend (`/client`)
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework & Build** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 8](https://vitejs.dev/) | High-performance SPA with modern React compiler primitives & HMR. |
| **UI & Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Utility-first styling with accessible Radix UI primitives. |
| **Data Fetching & API** | [Apollo Client v3](https://www.apollographql.com/docs/react/) | Caching GraphQL client for queries, mutations, and pagination. |
| **State Management** | [Zustand v5](https://github.com/pmndrs/zustand) | Lightweight global client state management. |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod v4](https://zod.dev/) | Type-safe form controllers and schema validation. |
| **Tables & Charts** | [TanStack Table v8](https://tanstack.com/table) + [Recharts](https://recharts.org/) | Virtualized, sortable tables and analytics dashboards. |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Declarative client routing with protected/public guard layouts. |

### Backend (`/server`)
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Server** | [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) | Robust HTTP application layer and middleware engine. |
| **API Layer** | [Apollo Server v5](https://www.apollographql.com/) + GraphQL | Schema-first GraphQL API with modular resolvers and type definitions. |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM v5](https://www.prisma.io/) | Relational data persistence with type-safe database access and migrations. |
| **Authentication & Security** | [Argon2](https://github.com/ranisalt/node-argon2) + JWT (`jsonwebtoken`) | Secure password hashing, token generation, and role verification. |
| **Email & Verification** | [Resend](https://resend.com/) + Nodemailer | Transactional email delivery and OTP verification workflows. |

---

## Folder Structure

The project uses a **feature-driven architecture** across both client and server to keep domain logic decoupled and maintainable.

```text
d:\Documents\GitHub\stockpilot\
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets
│   └── src/
│       ├── components/         # Reusable shadcn/ui and shared UI components
│       ├── features/           # Feature-driven modules (Auth, Users, Products, Inventory, StockMovement)
│       ├── graphql/            # Frontend GraphQL queries, mutations, and generated types
│       ├── hooks/              # Custom React hooks (auth, theme, utilities)
│       ├── layout/             # Application layouts (MainLayout, AuthLayout, UserLayout)
│       ├── lib/                # Apollo client setup, Tailwind utility helpers (cn)
│       ├── routes/             # ProtectedRoute and PublicRoute wrappers
│       ├── store/              # Zustand global state stores
│       ├── types/              # Frontend TypeScript interfaces
│       ├── App.tsx             # Root route definitions & layout mapping
│       └── main.tsx            # Application entry point
│
└── server/                     # Backend Application (Node.js + Express + Apollo)
    ├── prisma/
    │   └── schema.prisma       # Database schema, enums, models, and relations
    └── src/
        ├── context/            # Apollo GraphQL request context (JWT verification, user session)
        ├── enums/              # TypeScript enums synced with Prisma
        ├── features/           # Feature modules with domain resolvers & business logic
        ├── graphql/            # TypeDefs assembly and root GraphQL schema
        ├── lib/                # Singleton services (Prisma Client, Email clients)
        ├── schemas/            # Zod validation schemas for input sanitization
        ├── types/              # Server TypeScript definitions
        ├── utils/              # Helper utilities (token signing, OTP generation)
        ├── seed.ts             # Database seeder (creates dummy users, products, inventory)
        └── server.ts           # Server bootstrap (Express + Apollo middleware + Health check)
```

---

## Installation & Local Setup

### Prerequisites
- **Node.js**: `v20.x` or higher recommended
- **NPM**: `v10.x` or higher
- **PostgreSQL**: A local PostgreSQL instance or a hosted database (e.g., [Neon DB](https://neon.tech/))

---

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd stockpilot
```

---

### Step 2: Backend Setup (`/server`)

1. **Navigate to the server directory and install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `server/.env` and configure your database connection string and secrets:
   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/stockpilot_dev"
   SMTP_EMAIL="your-email@email.com"
   SMTP_PASSWORD="your-app-password"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   CORS_ORIGIN="http://localhost:5173"
   ```

3. **Generate Prisma Client and Run Database Migrations:**
   ```bash
   # Generate type-safe Prisma client
   npm run prisma:generate

   # Apply schema migrations to your local PostgreSQL database
   npm run prisma:migrate
   ```

4. **Seed the Database with Sample Data (Optional but Recommended):**
   ```bash
   npm run seed
   ```
   > [!TIP]
   > The seeder populates your database with dummy users, products, and inventory items from `dummy-users.json` and `dummy-products.json` so you can start testing immediately.

5. **Start the Backend Development Server:**
   ```bash
   npm run dev
   ```
   The backend server will start at `http://localhost:4000`. You can access:
   - **GraphQL Endpoint**: `http://localhost:4000/graphql`
   - **Health Check**: `http://localhost:4000/health`

---

### Step 3: Frontend Setup (`/client`)

1. **Open a new terminal, navigate to the client directory, and install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Configure environment variables (optional):**
   By default, Vite looks for `VITE_GRAPHQL_URI`. If you need to override the default endpoint, copy `.env.example` to `.env`:
   ```env
   VITE_GRAPHQL_URI="http://localhost:4000/graphql"
   ```

3. **Start the Vite Development Server:**
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`.

---

## Available NPM Scripts

### Frontend (`/client`)
| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts the Vite development server with HMR. |
| `npm run build` | `tsc -b && vite build` | Runs TypeScript type checking and bundles for production. |
| `npm run lint` | `eslint .` | Runs ESLint across all source files. |
| `npm run preview` | `vite preview` | Previews the local production build. |

### Backend (`/server`)
| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `nodemon --exec tsx src/server.ts` | Starts the backend dev server with hot reload via Nodemon and TSX. |
| `npm run build` | `tsc` | Compiles TypeScript source files into `/dist`. |
| `npm run start` | `node dist/server.js` | Runs the compiled production server. |
| `npm run seed` | `tsx src/seed.ts` | Seeds the database with test users, products, and initial stock. |
| `npm run prisma:generate` | `prisma generate` | Generates the `@prisma/client` types based on `schema.prisma`. |
| `npm run prisma:migrate` | `prisma migrate dev` | Creates and applies SQL migrations to the database. |
| `npm run prisma:studio` | `prisma studio` | Opens a web UI to inspect and manage database records. |
| `npm run prisma:reset` | `prisma migrate reset` | Drops all tables, re-applies migrations, and triggers seeder. |

---

## Database Models & Key Relationships

The application schema is defined in [server/prisma/schema.prisma](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma):

```mermaid
erDiagram
    User ||--o{ Sale : processes
    User ||--o{ StockMovement : records
    User ||--o{ Inventory : manages
    Product ||--o| Inventory : has
    Product ||--o{ SaleItem : included_in
    Product ||--o{ StockMovement : audited_by
    Sale ||--o{ SaleItem : contains
    Customer ||--o{ Sale : makes
```

- **[User](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L63-L82)**: Manages authentication, RBAC permissions, and relationships to sales and stock movements.
- **[Product](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L113-L129)**: Represents a catalog item identified by a unique SKU.
- **[Inventory](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L131-L148)**: Tracks `quantityOnHand`, `reorderLevel`, and `maxStock` for a single product.
  > [!IMPORTANT]
  > The database includes a constraint check (`chk_qty_non_negative`) to ensure `quantity_on_hand >= 0` at the database level.
- **[StockMovement](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L209-L228)**: Immutable log entries capturing quantity changes (`IN`, `OUT`, `ADJUSTMENT`) along with references and timestamps.
- **[Sale](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L170-L189)** & **[SaleItem](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L191-L207)**: Capture POS checkout records, line items, customer details, and payment methods.
- **[Customer](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L150-L168)**: Stores client contact and shipping information.

---

## Guide for Future Developers

### 1. Feature-Driven Development
When adding a new domain feature (e.g., *Suppliers* or *Purchase Orders*):
- **Backend (`/server`)**:
  1. Define the model in [server/prisma/schema.prisma](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma) and run `npm run prisma:migrate`.
  2. Create a new directory in `server/src/features/<feature-name>/` containing your GraphQL schema, resolvers, and business logic.
  3. Merge the feature resolvers and typeDefs in [server/src/graphql/index.ts](file:///d:/Documents/GitHub/stockpilot/server/src/graphql).
- **Frontend (`/client`)**:
  1. Create a corresponding directory in `client/src/features/<feature-name>/`.
  2. Define GraphQL documents (`queries.ts`, `mutations.ts`) inside `client/src/graphql/`.
  3. Register new routes in [client/src/App.tsx](file:///d:/Documents/GitHub/stockpilot/client/src/App.tsx) inside either `ProtectedRoute` or `PublicRoute`.

### 2. Authentication & Authorization Workflow
- Authentication is managed via JWT tokens signed with `JWT_SECRET`.
- In GraphQL resolvers, inspect `context.user` (created in [server/src/context/index.ts](file:///d:/Documents/GitHub/stockpilot/server/src/context)) to enforce role-based permissions (`UserRole.SUPER_ADMIN`, `UserRole.ADMIN`, etc.) or check account activation (`UserStatus.ACTIVE`).
- Frontend routes are protected using `<ProtectedRoute />` located in [client/src/routes](file:///d:/Documents/GitHub/stockpilot/client/src/routes), which validates user authentication and approval status before rendering pages.

### 3. Maintaining Data Integrity
- Do not store computed subtotals in `SaleItem`. As noted in the schema, subtotals should be calculated dynamically as `quantity * unitPrice` to avoid state synchronization bugs.
- Always record a `StockMovement` entry whenever modifying `Inventory.quantityOnHand` so audit trails remain complete.
