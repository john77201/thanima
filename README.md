# Thanima (തനിമ) - Authentic Kerala Homely Foods

> **"നന്മ നിറഞ്ഞ നാടൻ രുചികൾ" (Goodness of Pure Traditional Flavors)**  
> Thanima is an enterprise-grade e-commerce platform dedicated to bringing 100% authentic, preservative-free, handmade Kerala delicacies—sourced directly from local home cooks and Kudumbashree women collectives—straight to households across India and the global Malayali diaspora.

---

## 🌴 Key Features

### 🛒 Customer Storefront
- **8 Signature Categories & 80+ Authentic Products**:
  - **Banana Chips & Snacks (ഉപ്പേരി & പലഹാരങ്ങൾ)**: Pure cold-pressed coconut oil Sharkara Varatti, Nendran Upperi, Kappa chips, Jackfruit chips, Ribbon Pakkavada, Murukku, etc.
  - **Traditional Pickles (നാടൻ അച്ചാറുകൾ)**: Avakkai, Kadumanga, Kannimanga, Naranga, Veluthulli, Pavakka, Meen (Fish), Chemmeen (Prawns), Beef Achar.
  - **Authentic Sweets (മധുരപലഹാരങ്ങൾ)**: Kozhikodan Black Halwa, Neyyappam, Unniyappam, Aval Vilayichathu, Madhuraseva, Diamond cuts.
  - **Homemade Podis & Masalas (പൊടികളും മസാലകളും)**: Chammanthi Podi (roasted coconut), Idli Podi, Sambar Powder, Fish Curry Masala, Garam Masala.
  - **Ready-to-Cook & Batters (പാകം ചെയ്യാൻ തയ്യാറായവ)**: Stone-ground Idli/Dosa batter, Idiyappam Podi, Palappam mix, Pathiri Podi, Chemba Puttu Podi.
  - **Payasam & Pradhaman Mixes (പായസം മിക്സ്)**: Palada Pradhaman, Ada Pradhaman, Parippu Payasam, Wheat Payasam, Boli.
  - **Authentic Rice & Grains (നാടൻ അരി & ധാന്യങ്ങൾ)**: Palakkadan Matta (Double Dhooth), Wayanadan Gandhakasala, Navara medicinal rice.
  - **Pure Extracts & Honey (ശുദ്ധമായ വെളിച്ചെണ്ണ & തേൻ)**: Wood-pressed coconut oil, Marayoor Jaggery, Forest Honey, Homemade Ghee.
- **Bilingual Malayalam & English Typography**: High-contrast, authentic Malayalam script (`Noto Serif Malayalam`) paired with modern sans-serif.
- **Search with Live Autocomplete**: Real-time matching across English product names, Malayalam script, categories, and tags with keyboard navigation.
- **Dynamic Variant Picker**: Instant pricing & inventory updates across weight packs (100g, 250g, 500g, 1kg, 2kg, 5kg).
- **Cart & Tiered Shipping Engine**:
  - Free delivery threshold calculator (`₹499+` gets Free Delivery; standard `₹49`).
  - Cash on Delivery flat surcharge (`₹30`).
  - Active coupon codes: `WELCOME10` (10% off up to ₹100 on ₹299+), `KERALA50` (Flat ₹50 off on ₹499+), `FREESHIP` (Free shipping on ₹349+).
- **4-Step Frictionless Checkout**:
  1. Address Selection / New Address Form with Kerala pincode autofill (`682001`, `695001`, etc.).
  2. Delivery Slot & Express Courier Selection.
  3. Payment Options (Simulated Razorpay, UPI QR, Cards, NetBanking, COD).
  4. Final Order Summary with price breakdown and GST breakdown.
- **Simulated Razorpay Gateway Modal**:
  - Brand-compliant Thanima checkout overlay.
  - Interactive tabs for UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking, and Wallets.
  - Card validation (Luhn algorithm, brand auto-detection for Visa, Mastercard, RuPay, Amex).
  - Simulated 2-Factor OTP verification (`123456`) and "Simulate Failure" button for testing retry flows.
- **Live Order Tracking & Milestones**:
  - Timeline progression: `Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`.
  - Detailed status history log with timestamps and carrier tracking IDs.
  - One-click PDF/print-ready Tax Invoice with FSSAI license numbers (`11322007000452`), GST breakdown, and Kudumbashree acknowledgment.
  - Self-service order cancellation before shipping.
- **Customer Account & Wishlist**:
  - Saved delivery addresses management (Home, Work, Other).
  - Order history with reorder capabilities.
  - Wishlist toggle on all product cards.

---

### 🛡️ Admin Management Portal (`/admin`)
- **Super Admin & Operations Login**:
  - Super Admin: `admin@thanima.in` / `Admin@123`
  - Operations Manager: `manager@thanima.in` / `Manager@123`
- **Dashboard KPIs**: Real-time GMV revenue, active orders, customer count, low-stock alerts, and average order value.
- **Sales & Category Analytics**: Visual trend charts and category revenue share breakdowns.
- **Order Fulfillment Workflow**:
  - Status transition state machine (`Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
  - Tracking ID assignment (India Post Speed Post, DTDC, Kerala Express) with automatic customer notification triggers.
- **Product Inventory CRUD**:
  - Add/Edit products with multi-category linking, weight variants, wholesale costs, sale prices, stock counts, FSSAI shelf life, and ingredients.
- **Review Moderation**: Approve or hide customer reviews.
- **Hero Promotional Banners**: Manage active homepage carousel promotions.
- **Data Export**: One-click CSV export of orders and customers for accounting.
- **In-App Deployment & Architecture Inspector**: Live viewer for `Dockerfile`, `docker-compose.yml`, `openshift/*.yaml`, `database/*.sql`, and Payment Service source code.

---

## 🏗️ Architecture & Tech Stack

```
Thanima Platform
├── Web Client / Admin (React 19 + TypeScript + Tailwind CSS v4 + Motion)
├── Backend API & Service Layer (PHP 8.2 MVC Architecture / PSR-4)
├── Database (MySQL 8.0 with InnoDB, Foreign Keys & Composite Indexes)
├── Containerization (Non-root Docker container on port 8080)
└── Enterprise Orchestration (Red Hat OpenShift 4.12+ / Kubernetes)
```

| Component | Technology | Version / Notes |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | SPA on Vite 8 |
| **Styling & Design** | Tailwind CSS v4 | Authentic Kerala color palette (`#1F4D2B`, `#F2A900`, `#FFF8E7`, `#B5502C`) |
| **Backend Service** | PHP 8.2 | MVC PSR-4 pattern, PDO Prepared Statements, strict types |
| **Payment Gateway** | Razorpay Standard SDK | Dual mode: Production API + Zero-dependency fallback simulator |
| **Relational Database** | MySQL 8.0 | Strict UTF8MB4, transactional integrity, soft deletes |
| **Container Engine** | Docker / Podman | Hardened non-root (`USER 1001`), OCI compliant |
| **Cluster Platform** | Red Hat OpenShift | Multi-replica Deployment, Edge TLS Route, Persistent Volumes |

---

## 🚀 Quick Start & Local Setup

### Option 1: Run the Interactive Web Application (Vite / React SPA)
```bash
# 1. Install dependencies
npm install

# 2. Run deterministic unit test suite
npx tsx --test src/utils/pricing.test.ts src/utils/validation.test.ts

# 3. Start development server
npm run dev
# The app opens at http://localhost:3000
```

### Option 2: Run Full-Stack with Docker Compose (PHP + Apache + MySQL 8)
```bash
# 1. Clone repository and start containers
docker-compose up -d --build

# 2. Verify containers are healthy
docker-compose ps

# 3. Access web application
# Customer & Admin App: http://localhost:8080
# MySQL Database: localhost:3306 (user: thanima_user, pass: ThanimaSecure#2025)
```

---

## 🔑 Default Credentials

| Portal / Role | Email / Username | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@thanima.in` | `Admin@123` | Full system access, users, settings, products, orders |
| **Operations Manager** | `manager@thanima.in` | `Manager@123` | Order fulfillment, inventory management, review moderation |
| **Demo Customer** | `lekshmi@kerala.com` | `Lekshmi@123` | Saved addresses, order tracking, cart & wishlist |

---

## 💳 Integrating Live Razorpay Payment Gateway

Thanima includes a production-ready `app/services/PaymentService.php` that implements the official Razorpay Orders and Webhook signature verification flow.

To switch from the simulated gateway to your live/test Razorpay account:

1. Obtain your `Key ID` and `Key Secret` from the [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys).
2. Set the environment variables in your `.env` or OpenShift Secret (`openshift/secret.yaml`):
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_secret_here
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
   ```
3. Set your webhook endpoint in Razorpay Dashboard to:
   `https://thanima.yourdomain.com/api/payment/webhook` with the following subscribed events:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`

---

## 📁 Repository Structure

```
.
├── Dockerfile                         # Non-root PHP 8.2 Apache container (port 8080)
├── docker-compose.yml                 # Local full-stack setup with MySQL 8.0
├── docker/
│   ├── apache.conf                    # Hardened virtual host with mod_rewrite
│   ├── php.ini                        # Production PHP 8.2 runtime configuration
│   └── entrypoint.sh                  # Database wait & startup orchestration
├── database/
│   ├── schema.sql                     # Complete 12-table relational DDL schema
│   ├── seed.sql                       # 8 categories, 80+ products, admins, coupons, FAQs
│   └── README.md                      # Database documentation & ER notes
├── openshift/                         # Production Kubernetes / OpenShift manifests
│   ├── secret.yaml                    # Base64 encrypted DB and Razorpay credentials
│   ├── configmap.yaml                 # Environment configuration
│   ├── mysql-pvc.yaml                 # 10Gi RWO volume for MySQL data
│   ├── mysql-deployment.yaml          # MySQL 8.0 deployment with health probes
│   ├── mysql-service.yaml             # ClusterIP service on port 3306
│   ├── uploads-pvc.yaml               # Shared RWX volume for product uploads
│   ├── app-deployment.yaml            # Scalable PHP app deployment (port 8080)
│   ├── app-service.yaml               # ClusterIP service on port 8080
│   ├── route.yaml                     # Edge TLS Route with automatic SSL redirect
│   ├── imagestream.yaml               # OpenShift ImageStream definition
│   ├── buildconfig.yaml               # S2I Docker build configuration
│   └── job-db-init.yaml               # Automated schema & seed migration Job
├── docs/
│   ├── er-diagram.md                  # Comprehensive ASCII & Mermaid ER diagram
│   └── flow.md                        # User and admin state machine flows
├── app/services/
│   └── PaymentService.php             # Production Razorpay HMAC-SHA256 handler
├── src/                               # React 19 Frontend application
│   ├── components/                    # Modular UI components (shop, cart, checkout, admin)
│   ├── context/                       # StoreContext state management with localStorage
│   ├── data/seedData.ts               # Complete product catalog & initial records
│   ├── utils/                         # Pricing, validation, order state helpers & tests
│   └── types.ts                       # Strongly-typed TypeScript interfaces
├── DEPLOYMENT.md                      # Comprehensive OpenShift deployment manual
└── README.md                          # Platform documentation
```

---

## 📜 FSSAI & Quality Assurance
- **FSSAI Central License**: `11322007000452`
- **Women Empowerment**: Made in association with 350+ certified Kudumbashree micro-enterprises across 14 districts of Kerala.
- **Guarantee**: 100% cold-pressed oils, no synthetic coloring, zero artificial preservatives.
