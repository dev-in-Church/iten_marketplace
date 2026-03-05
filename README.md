# ItenGear - Multi-Vendor Sports Equipment Marketplace

A full-stack multi-vendor e-commerce platform for sports equipment, built with Next.js 16 (frontend) and Express.js (backend), using PostgreSQL via Supabase.

---

## Architecture Overview

```
itengear/
├── app/                    # Next.js Customer Storefront (main project)
│   ├── (store)/            # Customer pages (home, products, cart, checkout, auth, account)
│   ├── vendor/             # Vendor dashboard (extract to vendor-app/ for production)
│   └── admin/              # Admin dashboard (extract to admin-app/ for production)
├── backend/                # Express.js API server (shared by all frontends)
├── vendor-app/             # Standalone vendor project scaffold
├── admin-app/              # Standalone admin project scaffold
├── components/             # Shared React components
├── lib/                    # Shared utilities (api, auth-context, cart-context, mock-data)
└── public/images/          # Static assets including logo and product images
```

### Three Separate Frontend Projects (One Shared Backend)

| Project            | URL (Production)          | Port (Dev) | Description                      |
|--------------------|---------------------------|------------|----------------------------------|
| Customer Store     | `itengear.com`            | 3000       | Main marketplace for shoppers    |
| Vendor Dashboard   | `vendor.itengear.com`     | 3001       | Vendor store management          |
| Admin Dashboard    | `admin.itengear.com`      | 3002       | Platform administration          |
| Backend API        | `api.itengear.com`        | 5000       | Express.js API (shared)          |

During development, all three frontends are combined in the main Next.js app. For production, vendor and admin should be extracted into `vendor-app/` and `admin-app/` respectively. See their `SETUP.md` files for extraction instructions.

---

## Quick Start (Development)

### 1. Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `backend/schema.sql`
3. Copy your connection string from **Settings > Database**

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)
npm install
npm run dev
```

The API server starts at `http://localhost:5000`.

### 3. Frontend Setup

```bash
# From root directory
pnpm install
pnpm dev
```

The customer store starts at `http://localhost:3000`.
Vendor dashboard is at `http://localhost:3000/vendor`.
Admin dashboard is at `http://localhost:3000/admin`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
VENDOR_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000

# PostgreSQL (Supabase connection string)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# M-Pesa Daraja API (https://developer.safaricom.co.ke)
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_PASSKEY=your-passkey
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-api-domain.com/api/mpesa/callback
MPESA_ENV=sandbox

# Subscription Pricing (KES)
MONTHLY_SUBSCRIPTION_PRICE=2000
YEARLY_SUBSCRIPTION_PRICE=20000
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## Database Schema

Run `backend/schema.sql` on your Supabase SQL Editor. It creates:

| Table                  | Purpose                                        |
|------------------------|------------------------------------------------|
| `users`                | All users (customers, vendors, admins)         |
| `vendor_profiles`      | Vendor store details and verification status   |
| `vendor_subscriptions` | Monthly/yearly subscription records            |
| `categories`           | Product categories (8 seeded by default)       |
| `products`             | Product listings with multi-vendor support     |
| `product_reviews`      | Customer product reviews and ratings           |
| `cart_items`           | Server-side cart for logged-in users           |
| `addresses`            | Customer shipping addresses                    |
| `orders`               | Order records with status tracking             |
| `order_items`          | Individual items in orders (vendor-linked)      |
| `payments`             | M-Pesa payment transactions                    |
| `wishlists`            | Customer wishlists                             |
| `notifications`        | User notification system                       |
| `coupons`              | Discount coupons (vendor or platform-wide)     |

A default admin account is seeded:
- **Email:** `admin@itengear.com`
- **Password:** `Admin@123`

---

## Authentication

### Customer & Vendor Auth
- **Signup:** Email/password registration with full form (name, email, phone, password)
- **Login:** Email + password
- **Google OAuth:** One-click sign-in via Google Identity Services
- **JWT tokens** stored in HTTP-only cookies (not localStorage)
- **Cookie consent** banner is shown to all users

### Admin Auth
- **Login only** (no signup) -- uses the predefined admin account from the database seed
- Admin credentials are set in `schema.sql`

### Auth Flow
1. User submits credentials
2. Backend validates, creates JWT token
3. Token is set as HTTP-only cookie (`token`)
4. Frontend calls `/api/auth/me` to verify session on page load
5. Cookie is cleared on logout

---

## Hybrid Cart System

The cart works differently based on authentication state:

| State         | Storage      | Behavior                                          |
|---------------|-------------|---------------------------------------------------|
| Logged out    | localStorage | Cart persists in browser, no API calls             |
| Logged in     | PostgreSQL   | Cart synced to database via `/api/cart` endpoints  |
| On login      | Merge        | Local cart items are merged into the DB cart        |

---

## M-Pesa Integration

### Customer Payments (Orders)
1. Customer completes checkout form
2. M-Pesa STK Push is sent to customer's phone
3. Customer enters PIN on their phone
4. Callback from Safaricom confirms payment
5. Order status updates to `paid`

### Vendor Subscriptions
1. Vendor selects Monthly (KES 2,000) or Yearly (KES 20,000)
2. M-Pesa STK Push is sent to vendor's phone
3. On successful payment, vendor gets verified status
4. Subscription expires automatically (cron job checks hourly)
5. Admin can also manually verify vendors

### API Endpoints

| Method | Endpoint                           | Description                    |
|--------|-------------------------------------|-------------------------------|
| POST   | `/api/mpesa/stk-push`              | Initiate STK Push payment      |
| POST   | `/api/mpesa/callback`              | Safaricom callback (webhook)   |
| GET    | `/api/mpesa/status/:checkoutId`    | Check payment status           |
| POST   | `/api/mpesa/subscription`          | Vendor subscription payment    |
| POST   | `/api/mpesa/subscription/callback` | Subscription callback          |

### Setting Up M-Pesa

1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create a new app and get Consumer Key and Consumer Secret
3. Use the Lipa Na M-Pesa Online (STK Push) API
4. For testing, use sandbox credentials (shortcode: `174379`)
5. For production, apply for a Paybill/Till number

---

## API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint               | Auth  | Description              |
|--------|------------------------|-------|--------------------------|
| POST   | `/register/customer`   | No    | Register customer        |
| POST   | `/register/vendor`     | No    | Register vendor          |
| POST   | `/login/customer`      | No    | Login customer           |
| POST   | `/login/vendor`        | No    | Login vendor             |
| POST   | `/login/admin`         | No    | Login admin              |
| POST   | `/google`              | No    | Google OAuth login       |
| POST   | `/logout`              | No    | Clear auth cookie        |
| GET    | `/me`                  | Yes   | Get current user         |

### Product Routes (`/api/products`)

| Method | Endpoint      | Auth  | Description                            |
|--------|---------------|-------|----------------------------------------|
| GET    | `/`           | No    | List products (search, filter, paginate)|
| GET    | `/:slug`      | No    | Get single product by slug             |

### Cart Routes (`/api/cart`)

| Method | Endpoint      | Auth  | Description              |
|--------|---------------|-------|--------------------------|
| GET    | `/`           | Yes   | Get cart items           |
| POST   | `/`           | Yes   | Add item to cart         |
| PUT    | `/:itemId`    | Yes   | Update cart item qty     |
| DELETE | `/:itemId`    | Yes   | Remove cart item         |
| POST   | `/sync`       | Yes   | Sync local cart to DB    |

### Order Routes (`/api/orders`)

| Method | Endpoint       | Auth  | Description              |
|--------|----------------|-------|--------------------------|
| POST   | `/`            | Yes   | Create order             |
| GET    | `/`            | Yes   | Get user's orders        |
| GET    | `/:id`         | Yes   | Get order details        |

### Vendor Routes (`/api/vendor`)

| Method | Endpoint             | Auth    | Description                  |
|--------|----------------------|---------|------------------------------|
| GET    | `/dashboard`         | Vendor  | Dashboard stats              |
| GET    | `/products`          | Vendor  | Vendor's products            |
| POST   | `/products`          | Vendor  | Create product               |
| PUT    | `/products/:id`      | Vendor  | Update product               |
| DELETE | `/products/:id`      | Vendor  | Delete product               |
| GET    | `/orders`            | Vendor  | Vendor's order items         |
| PUT    | `/orders/:id/status` | Vendor  | Update order item status     |
| GET    | `/subscription`      | Vendor  | Current subscription         |
| PUT    | `/profile`           | Vendor  | Update vendor profile        |

### Admin Routes (`/api/admin`)

| Method | Endpoint                       | Auth   | Description                 |
|--------|--------------------------------|--------|-----------------------------|
| GET    | `/dashboard`                   | Admin  | Platform stats              |
| GET    | `/users`                       | Admin  | List all users              |
| PUT    | `/users/:id/status`            | Admin  | Activate/deactivate user    |
| GET    | `/vendors`                     | Admin  | List all vendors            |
| PUT    | `/vendors/:id/verify`          | Admin  | Verify/unverify vendor      |
| PUT    | `/vendors/:id/commission`      | Admin  | Update commission rate      |
| GET    | `/products`                    | Admin  | List all products           |
| PUT    | `/products/:id/status`         | Admin  | Toggle product active       |
| PUT    | `/products/:id/featured`       | Admin  | Toggle product featured     |
| DELETE | `/products/:id`                | Admin  | Delete product              |
| GET    | `/orders`                      | Admin  | List all orders             |
| PUT    | `/orders/:id/status`           | Admin  | Update order status         |
| GET    | `/payments`                    | Admin  | List all payments           |
| GET    | `/analytics`                   | Admin  | Platform analytics          |
| GET    | `/pending-verifications`       | Admin  | Vendors awaiting approval   |

---

## Deploying to Production

### Backend (Express.js)

Deploy to any Node.js host (Render, Railway, DigitalOcean, AWS, etc):

```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

Set all environment variables on your host platform.

### Customer Storefront (Next.js)

Deploy the root project to Vercel:
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Connect your domain: `itengear.com`

### Vendor Dashboard (Next.js)

1. Follow extraction steps in `vendor-app/SETUP.md`
2. Deploy as separate Vercel project
3. Set same env vars pointing to shared backend
4. Connect subdomain: `vendor.itengear.com`

### Admin Dashboard (Next.js)

1. Follow extraction steps in `admin-app/SETUP.md`
2. Deploy as separate Vercel project
3. Set `NEXT_PUBLIC_API_URL` pointing to shared backend
4. Connect subdomain: `admin.itengear.com`

### CORS Configuration

Update `backend/.env` with production URLs:

```env
FRONTEND_URL=https://itengear.com
VENDOR_URL=https://vendor.itengear.com
ADMIN_URL=https://admin.itengear.com
```

---

## Project Features Summary

### Customer Storefront
- Home page with hero carousel, featured products, category browsing
- Product listing with search, category filter, sorting, and pagination
- Product detail page with image gallery, reviews, add to cart
- Hybrid cart (localStorage when logged out, database when logged in)
- Checkout with M-Pesa STK Push payment
- Customer account with order history
- Google OAuth and email/password signup and login
- Cookie consent banner

### Vendor Dashboard
- Vendor registration (email/password + Google OAuth)
- Dashboard overview with stats (sales, orders, products, revenue)
- Product management (CRUD with image upload)
- Order management (view and update status)
- Subscription management (monthly/yearly via M-Pesa)
- Verification status and payment
- Store settings and profile management

### Admin Dashboard
- Admin login only (no signup, predefined account)
- Platform overview dashboard with KPIs
- User management (view, activate/deactivate)
- Vendor management (verify, set commission rates)
- Product management (approve, feature, remove)
- Order management (view all, update status)
- Payment monitoring (all M-Pesa transactions)
- Vendor verification queue
- Analytics with charts (revenue, orders, users)
- Platform settings

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 16, React 19, Tailwind CSS 4   |
| UI        | shadcn/ui, Lucide Icons, Recharts       |
| Backend   | Express.js 5, Node.js                   |
| Database  | PostgreSQL (Supabase)                   |
| Auth      | JWT (HTTP-only cookies), Google OAuth   |
| Payments  | M-Pesa (Safaricom Daraja API)           |
| Charts    | Recharts                                |
# iten_ecommerce_marketplace
