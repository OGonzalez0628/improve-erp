# InovaERP Cloud — Setup Guide

## Prerequisites
- Node.js 18+ installed (download from nodejs.org)
- A Supabase project with schema already deployed ✓

---

## Step 1 — Install dependencies

Open a terminal in this folder and run:

```bash
npm install
```

---

## Step 2 — Create your first user in Supabase

1. Go to your Supabase dashboard → **Authentication → Users**
2. Click **Invite user** → enter your email
3. Check your email and set a password
4. Copy your **User UUID** from the Users list

---

## Step 3 — Seed your tenant in Supabase

1. Go to **SQL Editor** in Supabase
2. Open `seed.sql` from this folder
3. Run the first INSERT to create your tenant — copy the returned UUID
4. Uncomment and run the second INSERT with your User UUID and Tenant UUID
5. Optionally run the master data inserts (clients, colors, sizes)

---

## Step 4 — Run locally

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to the login page.  
Log in with the email/password you set in Step 2.

---

## Step 5 — Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → **Add New Project** → import from GitHub
3. Add these environment variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lfkvjuzjwhlcprbdmhon.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Click **Deploy** — your app is live in ~2 minutes

---

## Adding a new customer tenant

For each new customer, run in Supabase SQL Editor:

```sql
-- 1. Create tenant
INSERT INTO tenants (nombre, email) VALUES ('Customer Name', 'admin@customer.com') RETURNING id;

-- 2. After inviting their admin user via Supabase Auth:
INSERT INTO usuarios (id, tenant_id, nombre, email, rol)
VALUES ('THEIR-USER-UUID', 'THEIR-TENANT-UUID', 'Their Name', 'admin@customer.com', 'admin');
```

They log in at your Vercel URL and only see their own data — RLS handles isolation automatically.

---

## What's built so far

- ✅ Login / logout with Supabase Auth
- ✅ Multi-tenant isolation (RLS)
- ✅ Dashboard with live counts from database
- ✅ Órdenes de Venta — list + create with line items
- 🔧 Producción, Inventario, Estilos — scaffolded, in development

## Next modules to build (next sessions)
1. Estilos + BOM (catalog foundation)
2. Production orders linked to sales orders
3. WIP capture per operation
4. Inventory movements
