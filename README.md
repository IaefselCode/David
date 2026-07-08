# Portfolio

A modern, full-featured personal portfolio website built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**, and **Prisma 7** with PostgreSQL.

Includes a public-facing portfolio page and a private admin dashboard for managing all content via a CMS-like interface.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui, Magic UI, Lucide Icons |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | JWT (jose) with httpOnly cookies |
| Password Hashing | bcryptjs |
| Animations | motion (Framer Motion) |

## Features

### Public Portfolio
- Hero section with animated blur-fade text
- About / summary section
- GitHub activity display
- Work experience timeline
- Education timeline
- Skills grid with icon picker
- Project showcase with links and demos
- Hackathon section with awards
- Contact section with social links
- Responsive design (mobile + desktop)
- Dark/light mode toggle
- Floating dock navigation

### Admin Dashboard (`/dashboard`)
- Overview page with content counts
- Profile editor (name, bio, avatar, CV upload)
- Skills CRUD with icon picker
- Work experience CRUD
- Education CRUD
- Projects CRUD (with technologies and links)
- Hackathons CRUD
- Contact / social links editor
- Account settings (change username/password)

### Authentication
- JWT-based authentication with httpOnly cookies
- Session expires after 7 days
- Middleware protects all `/dashboard/*` routes
- Login redirects authenticated users to dashboard

## Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** database server running
- **pnpm** (recommended), npm, or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd DavidModetus
```

### 2. Install dependencies

```bash
pnpm install
```

This will also run `prisma generate` via the `postinstall` script.

### 3. Set up environment variables

Copy or create a `.env` file in the project root:

```bash
# .env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/portifolio"
JWT_SECRET="your-secret-key-change-in-production"
```

- `DATABASE_URL`: Connection string to your PostgreSQL database.
- `JWT_SECRET` (optional): Used to sign JWT tokens. Falls back to `"portifolio-secret-key-change-in-production"` if not set. **Change this in production.**

### 4. Run database migrations

```bash
npx prisma migrate deploy
```

This applies all existing migrations and creates the required tables.

### 5. Seed the database

```bash
pnpm seed
```

This populates the database with sample data and creates the default admin account:

> **Username:** `admin`
> **Password:** `admin123`

The seeder is idempotent — it will skip if data already exists (checks for an existing Profile record).

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Login to the admin dashboard

Navigate to [http://localhost:3000/login](http://localhost:3000/login) and sign in with:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

Once logged in, you will be redirected to the dashboard at `/dashboard`.

## Project Structure

```
src/
├── app/
│   ├── (portfolio)/          # Public-facing pages (route group)
│   │   ├── layout.tsx        # Portfolio layout (background, navbar)
│   │   ├── page.tsx          # Main portfolio page (all sections)
│   │   └── login/
│   │       └── page.tsx      # Admin login page
│   ├── api/                  # API route handlers
│   │   ├── auth/             # Authentication endpoints
│   │   ├── contact/          # Social links CRUD
│   │   ├── data/             # Public data endpoint
│   │   ├── education/        # Education CRUD
│   │   ├── hackathons/       # Hackathons CRUD
│   │   ├── profile/          # Profile updates
│   │   ├── projects/         # Projects CRUD
│   │   ├── skills/           # Skills CRUD
│   │   ├── upload/           # File uploads
│   │   └── work/             # Work experience CRUD
│   ├── dashboard/            # Admin dashboard (protected)
│   │   ├── layout.tsx        # Dashboard layout (sidebar, auth check)
│   │   ├── page.tsx          # Overview
│   │   ├── account/          # Change username/password
│   │   ├── contact/          # Edit contact info
│   │   ├── education/        # Manage education
│   │   ├── hackathons/       # Manage hackathons
│   │   ├── profile/          # Edit profile
│   │   ├── projects/         # Manage projects
│   │   ├── skills/           # Manage skills
│   │   └── work/             # Manage work experience
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout (ThemeProvider, fonts)
│   └── not-found.tsx         # 404 page
├── components/               # Reusable React components
│   ├── ui/                   # shadcn/ui primitives
│   ├── magicui/              # Animated UI components
│   └── section/              # Portfolio section components
├── data/
│   └── resume.tsx            # Minimal config (name, initials, URL)
├── generated/prisma/         # Auto-generated Prisma client
├── lib/
│   ├── auth.ts               # JWT token creation / verification
│   ├── db.ts                 # Prisma client singleton
│   └── portfolio.ts          # Server-side data fetching
├── middleware.ts              # Auth middleware (protects /dashboard)
└── scripts/
    └── seed.ts               # Database seeder with default admin
```

## Database Schema

The database contains the following models:

| Model | Description |
|-------|-------------|
| `Profile` | Portfolio owner info (name, bio, avatar, etc.) |
| `Skill` | Skills with icon references |
| `Work` | Work experience entries |
| `Education` | Education entries |
| `Project` | Project entries with technologies and links |
| `Hackathon` | Hackathon entries with optional awards |
| `SocialLink` | Social media / contact links |
| `NavbarItem` | Navigation bar items |
| `AdminUser` | Admin credentials (username + bcrypt password hash) |

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/data` | No | Returns all portfolio data |
| `POST` | `/api/auth/login` | No | Login with username/password |
| `POST` | `/api/auth/logout` | Yes | Clear auth cookie |
| `GET` | `/api/auth/me` | Yes | Check authentication status |
| `GET` | `/api/auth/account` | Yes | Get current username |
| `PUT` | `/api/auth/account` | Yes | Update username/password |
| `GET` | `/api/contact` | No | Get social links |
| `PUT` | `/api/contact` | Yes | Update social links |
| `GET/POST` | `/api/skills` | No/Yes | List / create skills |
| `PUT/DELETE` | `/api/skills/[id]` | Yes | Update / delete skill |
| `GET/POST` | `/api/work` | No/Yes | List / create work entries |
| `PUT/DELETE` | `/api/work/[id]` | Yes | Update / delete work |
| `GET/POST` | `/api/education` | No/Yes | List / create education |
| `PUT/DELETE` | `/api/education/[id]` | Yes | Update / delete education |
| `GET/POST` | `/api/projects` | No/Yes | List / create projects |
| `PUT/DELETE` | `/api/projects/[id]` | Yes | Update / delete project |
| `GET/POST` | `/api/hackathons` | No/Yes | List / create hackathons |
| `PUT/DELETE` | `/api/hackathons/[id]` | Yes | Update / delete hackathon |
| `PUT` | `/api/profile` | Yes | Update profile |
| `POST` | `/api/upload` | Yes | Upload file (image/PDF) |

## How It Works

### Authentication Flow

1. User visits `/login` and submits the username/password form.
2. The server verifies credentials via `bcrypt.compare()` against the stored hash in the `AdminUser` table.
3. On success, a JWT token (signed with `jose` using HS256) is created and stored in an httpOnly cookie named `auth_token` with a 7-day expiry.
4. The middleware (`src/middleware.ts`) checks for this cookie on all `/dashboard/*` requests. If missing, it redirects to `/login`.
5. For API routes, if the token is missing or invalid, a 401 response is returned.
6. Logout clears the cookie by setting `maxAge: 0`.

### Data Flow

- The public portfolio page (`/`) is a server component that fetches all data via `getPortfolioData()` from `src/lib/portfolio.ts`.
- The admin dashboard uses client components that call API routes (e.g., `/api/skills`, `/api/work`) to perform CRUD operations.
- File uploads are stored in `public/uploads/` and served statically.

### Customization

- Edit `src/data/resume.tsx` to change the owner's name, initials, and URL.
- All other content (profile, skills, work, education, projects, hackathons, social links) is managed through the admin dashboard or directly seeded via the seed script.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm seed` | Seed database with sample data + admin user |
| `pnpm postinstall` | Generate Prisma client (auto-runs on install) |

## License

Licensed under the [MIT license](LICENSE).
# David
