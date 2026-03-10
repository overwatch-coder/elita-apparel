# Deployment Guide - Elita Apparel

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Supabase](https://supabase.com/) account
- [Vercel](https://vercel.com/) account (recommended for hosting)

---

## 1. Supabase Project Setup

### 1.1 Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New project** → choose organization → enter name, password, region (closest to Accra)

### 1.2 Run the database schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Paste and run the contents of `supabase/schema.sql`
3. Then run `supabase/admin-setup.sql`

### 1.3 Seed sample data

1. Go to **SQL Editor**
2. Paste and run the contents of `supabase/seed.sql`

### 1.4 Create a Storage bucket

1. Go to **Storage** in the dashboard
2. Click **New bucket**
3. Name: `product-images`
4. Set **Public** to `true`
5. Under **Policies**, add:
   - **SELECT** (public) — everyone can read
   - **INSERT/UPDATE/DELETE** (authenticated) — only logged-in users

### 1.5 Create an admin user

1. Go to **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter email + password (e.g. `admin@elitaapparel.com`)
4. Copy the user UUID
5. Run in SQL Editor:

```sql
INSERT INTO admin_users (user_id, role)
VALUES ('<UUID>', 'admin');
```

---

## 2. Environment Variables

Create `.env.local` at the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL (for sitemap, OG, etc.)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Get these from: Supabase Dashboard → **Settings → API**

---

## 3. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:3000`

---

## 4. Vercel Deployment

### 4.1 Connect repo

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Framework preset: **Next.js** (auto-detected)

### 4.2 Set environment variables

In Vercel project settings → **Environment Variables**, add:

| Variable                           | Value                              |
|------------------------------------|------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`         | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | `Your Supabase anon key`           |
| `NEXT_PUBLIC_SITE_URL`             | `https://your-domain.com`          |

### 4.3 Deploy

Click **Deploy** — Vercel will build and deploy automatically.

### 4.4 Custom domain (optional)

1. Go to project **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to match

---

## 5. Post-Deployment Checklist

- [ ] Verify `/sitemap.xml` loads correctly
- [ ] Verify `/robots.txt` loads correctly
- [ ] Test admin login at `/login`
- [ ] Upload a product image via admin dashboard
- [ ] Test full checkout flow
- [ ] Verify OG tags with [og-image debugger](https://www.opengraph.xyz/)
- [ ] Test on mobile (375px, 390px, 414px)
- [ ] Verify WhatsApp button works with correct number
- [ ] Update `BRAND.whatsappNumber` in `lib/constants.ts` with real number

---

## 6. Production Hardening

- [ ] Replace placeholder WhatsApp number in `lib/constants.ts`
- [ ] Replace placeholder Instagram handle
- [ ] Replace placeholder email
- [ ] Set up Supabase Auth email templates (branding)
- [ ] Enable Supabase Database Backups
- [ ] Review RLS policies for production security
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Configure rate limiting on Supabase
