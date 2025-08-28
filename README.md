# FLIX: Next-Gen Video Social Media Platform

FLIX is a cutting-edge video sharing and discovery platform designed to offer a unique experience with its signature **LENS** personalized feed, powered by AI-driven recommendations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Database Setup (Supabase)](#database-setup-supabase)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

### 1. Authentication & Profiles
- Email, phone, and magic-link authentication via Supabase.
- Customizable user profiles with username, avatar, bio, location, and handle.
- Follow/unfollow, block, and report functionalities.

### 2. Video Engine
- Seamless video upload, transcoding, and HLS streaming.
- Automatic thumbnail generation, duration detection, and caption generation.
- Comprehensive metadata management: title, description, hashtags, categories.
- Support for public, unlisted, and private video modes.

### 3. Discovery & LENS Feed
- **LENS**: A highly personalized, AI-powered video feed curated based on user activity and preferences.
- Explore section for trending videos, new releases, category-based browsing, and geo-filtered content.
- Infinite scrolling UI for a smooth content discovery experience.

### 4. Engagement
- Like, comment, and share functionalities for videos.
- Watch history tracking.
- Ability to save videos to personal collections.

### 5. Monetization (MVP Hooks)
- **Creator Tips**: Integrated Stripe Connect for direct tipping to creators (FLIX retains a small commission).
- **Affiliate Links**: Creators can attach affiliate URLs to their videos.
- **Sponsored Slots (Scaffolding)**: Reserved spaces within the LENS feed for future native advertising integrations.

### 6. Creator Dashboard v0
- Overview of tips earned, total views, likes, and watch time.

### 7. Trust & Safety
- Basic moderation dashboard for content oversight.
- AI-powered NSFW flagging (optional integration).
- User reporting and blocklist management.

## Tech Stack

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API routes + Supabase Edge Functions
- **Database:** PostgreSQL (Supabase) with Row-Level Security (RLS)
- **Video Storage & Delivery:** Cloudflare R2 + Cloudflare Stream (or Mux for managed transcoding)
- **Realtime:** Supabase Realtime (for likes, comments, notifications)
- **AI Layer:** OpenAI embeddings (for personalization and recommendations)
- **Payments:** Stripe Connect (for tips and payouts)
- **Deployment:** Vercel (frontend + API) + Supabase (database + auth)

## Getting Started

Follow these instructions to set up and run FLIX locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or Yarn
- Git
- A Supabase project (free tier is sufficient for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/flix.git
   cd flix
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```

### Environment Variables

Create a `.env.local` file in the root of the project based on `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional: Cloudflare Stream/Mux API keys for video
CLOUDFLARE_STREAM_API_KEY=
MUX_ACCESS_TOKEN_ID=
MUX_SECRET_KEY=

# Optional: OpenAI API key for AI features
OPENAI_API_KEY=

# Optional: Stripe Secret Key for payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public `anon` key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` key (use with caution, keep secure).

You can find these keys in your Supabase project settings under `API`.

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   # or yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Database Setup (Supabase)

1. **Create a new Supabase project** if you haven't already.
2. **Run Migrations:** You can apply the schema and policies using the Supabase CLI or by pasting the SQL into the SQL Editor in your Supabase dashboard.
   ```bash
   # Ensure Supabase CLI is installed: npm install -g supabase-cli
   # Login to Supabase CLI: supabase login
   # Link your project: supabase link --project-ref your-project-ref
   # Apply schema:
   supabase db push --file supabase/schema.sql
   # Apply policies:
   supabase sql --file supabase/policies.sql
   ```
   Alternatively, copy the contents of `supabase/schema.sql` and `supabase/policies.sql` into the SQL Editor in your Supabase dashboard and run them.

3. **Seed Data (Optional):** To populate your database with sample data, run:
   ```bash
   npm run seed
   # or yarn seed
   ```
   *Note: Ensure `ts-node` is installed (`npm install -g ts-node` or `yarn add global ts-node`).*

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com/).

1. **Connect your Git repository** (GitHub, GitLab, Bitbucket) to Vercel.
2. **Configure Environment Variables** on Vercel (matching your `.env.local` file).
3. Vercel will automatically detect the Next.js project and deploy it.

Supabase handles its own deployment for the database and Edge Functions.

## Project Structure

```
flix/
├─ .env.example
├─ .gitignore
├─ README.md
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ postcss.config.js
├─ tailwind.config.js
├─ public/
│  ├─ icons/
│  ├─ images/
│  ├─ favicons/
│  ├─ manifest.json
│  └─ robots.txt
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ explore/
│  │  │  └─ page.tsx
│  │  ├─ lens/
│  │  │  └─ page.tsx
│  │  ├─ upload/
│  │  │  └─ page.tsx
│  │  ├─ watch/
│  │  │  └─ [videoId]/page.tsx
│  │  ├─ profile/
│  │  │  └─ [username]/page.tsx
│  │  ├─ auth/
│  │  │  ├─ sign-in/page.tsx
│  │  │  ├─ sign-up/page.tsx
│  │  │  └─ callback/page.tsx
│  │  ├─ settings/
│  │  │  ├─ page.tsx
│  │  │  ├─ notifications.tsx
│  │  │  └─ preferences.tsx
│  │  └─ api/
│  │     ├─ videos/route.ts
│  │     ├─ lens/route.ts
│  │     ├─ explore/route.ts
│  │     ├─ comments/route.ts
│  │     ├─ likes/route.ts
│  │     ├─ search/route.ts
│  │     ├─ notifications/route.ts
│  │     ├─ reports/route.ts
│  │     └─ stripe/
│  │        ├─ checkout/route.ts
│  │        └─ webhook/route.ts
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Navbar.tsx
│  │  │  └─ Footer.tsx
│  │  ├─ ui/                # shadcn components generated here
│  │  ├─ video/
│  │  │  ├─ VideoPlayer.tsx
│  │  │  ├─ VideoCard.tsx
│  │  │  └─ VideoUploader.tsx
│  │  ├─ lens/
│  │  │  ├─ LensFeed.tsx
│  │  │  └─ LensFilters.tsx
│  │  ├─ comments/
│  │  │  ├─ CommentForm.tsx
│  │  │  └─ CommentList.tsx
│  │  ├─ tips/TipDialog.tsx
│  │  └─ loaders/Skeleton.tsx
│  ├─ lib/
│  │  ├─ supabaseClient.ts
│  │  ├─ auth.ts
│  │  ├─ api.ts
│  │  ├─ lens.ts
│  │  ├─ video.ts
│  │  ├─ stripe.ts
│  │  ├─ i18n.ts
│  │  └─ analytics.ts
│  ├─ hooks/
│  │  ├─ useLensFeed.ts
│  │  ├─ useAuth.ts
│  │  ├─ useUpload.ts
│  │  ├─ useRealtime.ts
│  │  └─ useNotifications.ts
│  ├─ styles/
│  │  └─ globals.css
│  └─ types/
│     ├─ video.ts
│     ├─ lens.ts
│     ├─ auth.ts
│     └─ user.ts
├─ scripts/
│  ├─ seed.ts
│  ├─ migrate.ts
│  ├─ deploy.sh
│  └─ lint-fix.sh
└─ supabase/
   ├─ schema.sql
   ├─ policies.sql
   └─ functions/
      ├─ lens-ranker.ts
      ├─ moderation-check.ts
      └─ tips-payout.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
