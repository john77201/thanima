# MASTER PROMPT: THANIMA (തനിമ), Kerala Homely Foods E-Commerce Website

## 0. ROLE & GOAL
You are a senior full-stack engineer and UI designer. Build a **complete, production-ready, fully working e-commerce website** named **"Thanima" (തനിമ)** that sells authentic Kerala homemade foods. Deliver the frontend, backend, database (schema + seed data), admin panel, Docker/OpenShift deployment files and documentation. **Do not leave placeholders, TODOs or "coming soon" pages. Every page and button listed below must work end to end.**

Work in this order: (1) plan and show the folder structure, (2) database, (3) backend core, (4) frontend pages, (5) admin panel, (6) payment simulation, (7) OpenShift deployment, (8) README, (9) self-test against the acceptance checklist in Section 14.

---

## 1. TECH STACK (STRICT)
- **Backend:** PHP 8.2+ (plain PHP with a simple MVC-style structure, **no heavy framework**), PDO with prepared statements only
- **Database:** MySQL 8 / MariaDB 10.6+ (utf8mb4, so Malayalam text works)
- **Frontend:** HTML5, CSS3 (custom CSS with CSS variables, mobile-first, responsive), vanilla JavaScript (ES6+, fetch/AJAX). Bootstrap 5 or Tailwind via CDN is allowed, but the design must still look custom and premium
- **Icons:** Font Awesome or Bootstrap Icons. **Fonts:** Google Fonts: *Noto Serif Malayalam* (logo and headings), *Poppins* or *Inter* (body)
- **Web server:** Apache (PHP official image) with `mod_rewrite` and clean URLs
- **Deployment:** Docker + Red Hat OpenShift (see Section 11)

---

## 2. BRAND & DESIGN SYSTEM
**Brand:** Thanima = "authenticity / originality". Tagline: *"Pure. Homemade. Kerala."* (also provide a Malayalam tagline: *"തനി നാടൻ രുചി"*).

**Logo:**
- Create a beautiful **SVG logo** with the Malayalam wordmark **"തനിമ"** (Noto Serif Malayalam, bold) with the English "THANIMA" in small spaced capitals below it
- Add a small emblem: coconut palm leaf, or a nilavilakku (traditional lamp), or a banana leaf motif, in gold/green
- Provide variants: full-colour (header), white (footer on dark background), icon-only (favicon, 32x32 and 180x180)
- Save under `/public/assets/img/logo/`

**Colour palette (CSS variables):**
- `--green-deep: #1F4D2B` (primary, banana-leaf green)
- `--turmeric: #F2A900` (accent/CTA)
- `--cream: #FFF8E7` (background)
- `--terracotta: #B5502C` (highlights, sale badges)
- `--coconut-brown: #4A2C17` (text/headings)
- `--white`, `--light-gray` for cards and borders

**Style:** warm, traditional yet modern. Rounded cards, soft shadows, subtle Kerala motifs (kasavu-style gold border lines as section dividers), smooth hover animations, skeleton loaders, toast notifications, sticky header, back-to-top button, lazy-loaded images, accessible contrast and focus states. Fully responsive (mobile, tablet, desktop). Mobile gets a bottom navigation bar (Home, Shop, Cart, Account).

**Images:** Do not depend on hotlinked photos. Generate attractive local product placeholders (SVG or gradient cards with the product name and an emoji or icon) in `/public/assets/img/products/`, and build the admin image-upload so real photos can replace them later.

---

## 3. COMMON LAYOUT (reused on every page via PHP includes)
**Header (`includes/header.php`):**
- Top announcement bar (e.g., "Free delivery above ₹499 | COD available")
- Thanima logo (links to home), search bar with live suggestions (AJAX autocomplete), category mega-menu (all 8 categories), Wishlist icon with count, Cart icon with live count badge, Login/Register or "Hi, {name}" dropdown (My Account, My Orders, Wishlist, Logout)
- Sticky on scroll, hamburger menu on mobile

**Footer (`includes/footer.php`):**
- Logo and short brand story, quick links (Shop, About, Contact, FAQ, Track Order), category links, contact details (phone, email, WhatsApp link, address placeholder), social icons, newsletter signup (saves to DB), accepted payment icons (UPI, GPay, PhonePe, Visa, Mastercard, COD), policy links (Privacy, Terms, Refund, Shipping), copyright "© Thanima. Made with ❤ in Kerala"
- Floating **WhatsApp chat button** on all pages

---

## 4. CUSTOMER-FACING PAGES (ALL REQUIRED)
| # | Page | Required content & behaviour |
|---|------|------------------------------|
| 1 | **Home** | Hero banner slider (admin-managed banners), category tiles (all 8 with icons), Featured Products, Best Sellers, New Arrivals, Offers/Deals strip with coupon highlight, "Why Thanima" (100% homemade, no preservatives, fresh, Kerala-wide delivery), testimonials carousel, Instagram-style gallery, newsletter signup |
| 2 | **Shop / All Products** | Product grid with pagination (or infinite scroll), sidebar filters: category, subcategory, price range slider, rating, availability (in stock), veg/non-veg; sorting: Popularity, Price low→high, Price high→low, Newest, Rating; search results here; "Showing X of Y"; grid/list toggle |
| 3 | **Category Page** | Category banner and description, subcategory chips, same filters and sorting, breadcrumb |
| 4 | **Product Details** | Image gallery with zoom and thumbnails, name (English + Malayalam), price, MRP and discount %, weight/size variants (e.g., 250g / 500g / 1kg) with variant-based price, stock status, quantity selector, **Add to Cart**, **Buy Now**, Wishlist heart, short and full description, **ingredients**, shelf life, storage instructions, veg/non-veg badge, delivery pincode check, share buttons, **ratings and reviews** (verified-purchase badge, submit form for logged-in users, rating breakdown bars), related products, **recently viewed products** |
| 5 | **Cart** | List of items with image, variant, qty +/- (AJAX update), remove, **coupon code apply/remove**, subtotal, discount, delivery charge, total, free-delivery progress bar, continue shopping, proceed to checkout. Works for guests (session) and merges into the user cart on login |
| 6 | **Checkout** | Steps: Address → Delivery → Payment → Review. Customer details form, choose saved address or add new, delivery charge calculated from pincode/state, order notes, order summary sidebar, payment method selection (Section 7), place order. Guest checkout allowed |
| 7 | **Login / Register** | Register (name, email, phone, password with strength meter), login, **forgot password** (generate secure token, store hash and expiry, show a reset link on screen in dev mode and send via PHP mail/SMTP config when configured), reset password page, remember me |
| 8 | **My Account** | Profile edit, change password, **saved addresses CRUD** (with default address), account settings (notification preferences), delete account request |
| 9 | **My Orders** | Order history list with status badges and payment status; order detail page with items, address, invoice (printable HTML invoice with "Download PDF" via print), **visual delivery tracking timeline**, cancel order (only while Pending/Confirmed), reorder button |
| 10 | **Wishlist** | Saved products grid, move to cart, remove; heart toggle works from every product card via AJAX; guests are prompted to log in |
| 11 | **About Us** | Brand story, homemade-food concept, mission and values, "meet the makers" section, process timeline (Sourcing → Preparing → Packing → Delivering), counters (customers, products, districts delivered) |
| 12 | **Contact Us** | Phone, email, WhatsApp click-to-chat, address and embedded map placeholder, contact form (validated, saved to DB, visible in admin, with CSRF and honeypot spam protection) |
| 13 | **FAQ** | Accordion grouped by Products, Orders, Payment, Delivery, Returns (content managed in DB, editable in admin) |
| 14 | **Extras** | Order Success page, Track Order page (order number and phone, for guests too), Privacy / Terms / Shipping / Refund pages, custom 404 and 500 pages |

---

## 5. CORE E-COMMERCE FEATURES
- **Search:** by name (English and Malayalam), with AJAX autocomplete suggestions
- **Filter and sort:** category, price, rating, stock; sort by popularity (based on units sold), price, newest
- **Cart:** add, update quantity, remove, stock validation, persists in DB for logged-in users
- **Buy Now:** skips the cart and goes directly to checkout with that item
- **Coupons:** admin-created; types: percentage / flat; min order value; max discount; usage limit; per-user limit; expiry date; active flag. Seed: `WELCOME10` (10% off, min ₹299), `KERALA50` (₹50 off above ₹499), `FREESHIP` (free delivery)
- **Delivery charges:** configurable rules in admin: flat charge, free above threshold, optional per-state/pincode override. Default: ₹49, free above ₹499
- **Ratings and reviews:** 1–5 stars, text, optional photo; admin moderation (approve/reject); average rating auto-updates
- **Recently viewed:** stored in a cookie/session and shown on home, product and cart pages
- **Offers and discounts:** product-level sale price, "% OFF" badges, deal-of-the-day section, homepage offers banner
- **Stock management:** decrement on order, restore on cancellation, "Out of stock" and "Only few left" badges, low-stock alert in admin
- **Notifications:** an in-site notification bell for the customer on every order status change (stored in the `notifications` table) plus an email using PHP `mail()` or SMTP (configurable via env vars; log to file if SMTP is not configured)

---

## 6. ORDER FLOW (END TO END)
`Home → Shop/Categories → Product Details → Add to Cart → Checkout → Place Order → Payment → Order Confirmation → Order Tracking → Delivery`

**Order statuses:** `Pending → Confirmed → Packed → Shipped → Out for Delivery → Delivered` (plus `Cancelled`, `Returned`)
**Payment statuses:** `Pending, Paid, Failed, Refunded, COD-Pending`

- Order number format: `THN-YYYYMMDD-XXXX`
- Every status change is logged in `order_status_history` with timestamp and note, and drives the customer tracking timeline
- Shipping details: courier name, tracking ID and expected delivery date, editable by admin
- Order confirmation page and email with a summary

---

## 7. PAYMENTS (RAZORPAY-STYLE DUMMY GATEWAY, NO REAL MONEY)
Build a **simulated Razorpay-like checkout** (a modal or page that looks like Razorpay Standard Checkout: Thanima branding, amount, order ID) with **no real API keys and no real transactions**.

Payment options at checkout:
1. **UPI** (enter UPI ID, e.g., name@upi, with format validation)
2. **Google Pay** (shows a UPI-intent style simulated screen)
3. **PhonePe** (simulated screen)
4. **Debit / Credit Card** (card number with Luhn validation, expiry, CVV, name; auto-detect Visa/Mastercard/RuPay; **never store the full card number or CVV**, store only the last 4 digits and brand)
5. **Cash on Delivery** (COD, optional ₹ COD fee configurable in admin)

Simulation rules:
- A fake OTP/confirm step (any 6-digit OTP, or "123456", succeeds)
- Add a "Simulate failure" test button in the dummy gateway to test the failed-payment flow, with retry
- On success: create a `payments` record with a fake `razorpay_payment_id` (`pay_` + random), mark the order Paid and clear the cart; on COD: order Confirmed with payment status COD-Pending
- Isolate gateway logic in `app/services/PaymentService.php` behind an interface so a real Razorpay integration can replace it later by changing only env vars and one class. Document the steps in the README

---

## 8. ADMIN DASHBOARD (`/admin`, separate login, role-based)
Roles: `super_admin`, `manager`. Admin has its own clean, responsive layout (sidebar and top bar) in the Thanima theme.

| Module | Functions |
|---|---|
| **Dashboard** | Cards: total sales, revenue (today/week/month), total orders, pending orders, total customers, low-stock count; charts (Chart.js): sales last 30 days, orders by status, sales by category, top 5 products; recent orders table |
| **Products** | CRUD, multi-image upload, variants (weight/price/stock/SKU), sale price, featured/best-seller/new flags, veg/non-veg, ingredients, shelf life, Malayalam name, SEO slug, bulk activate/deactivate, CSV import/export, search and filters |
| **Categories & Subcategories** | CRUD, image, description, sort order, active toggle |
| **Orders** | List with filters (status, date, payment), view detail, update status (writes to history and notifies the customer), set courier/tracking ID, print invoice and packing slip, cancel/refund, export CSV |
| **Customers** | List, view profile and order history, block/unblock |
| **Coupons** | CRUD with all rules from Section 5 |
| **Reviews** | Approve, reject, delete |
| **Banners & Offers** | Homepage banner CRUD (image, title, link, order, active dates) |
| **Delivery & Shipping** | Delivery charge rules, free-shipping threshold, serviceable pincodes |
| **Payments** | Transactions list with status, refund marking |
| **Messages** | Contact form messages (read/unread, reply via mail, delete), newsletter subscribers export |
| **Content** | Edit FAQ, About text, policy pages |
| **Reports** | Sales report by date range, product-wise and category-wise, customer report, export CSV/printable |
| **Settings** | Store name, logo upload, contact info, tax/GST %, currency symbol, COD enable/fee, SMTP settings, admin user management, change password |

Seed admin: `admin@thanima.in` / `Admin@123` (force the password change prompt on first login and mention it in the README).

---

## 9. DATABASE (MySQL): DESIGN & DELIVERABLES
Deliver `database/schema.sql` (tables, foreign keys, indexes) and `database/seed.sql` (sample data), plus `database/README` import instructions.

**Tables (minimum):** `users, admins, addresses, categories, subcategories, products, product_images, product_variants, cart, cart_items, wishlist, orders, order_items, order_status_history, payments, coupons, coupon_usage, reviews, banners, delivery_rules, serviceable_pincodes, notifications, contact_messages, newsletter_subscribers, faqs, pages, settings, password_resets, recently_viewed (optional)`

Requirements: InnoDB, utf8mb4_unicode_ci, proper FK with ON DELETE rules, indexes on slug/category/price/status, `created_at/updated_at` timestamps, unique constraints (email, slug, order_number, coupon code), prices as `DECIMAL(10,2)`.

### Seed data: use ALL of these 8 categories and subcategories
Treat each subcategory as an actual **product** (with at least 2 weight variants, realistic INR prices, a description, ingredients, a Malayalam name where known, and at least 3 sample reviews on the top products). Products that appear in two categories (Unniyappam, Neyyappam, Aval Vilayichathu) must be **one product linked to both categories** (use a `product_categories` pivot table).

1. **Traditional Snacks (നാടൻ പലഹാരം):** Banana Chips (Upperi), Sharkara Varatti, Achappam, Kuzhalappam, Unniyappam, Neyyappam, Chakka Upperi, Tapioca Chips, Murukku, Ribbon Pakoda, Aval Vilayichathu, Kozhukatta
2. **Homemade Pickles (അച്ചാർ):** Mango Pickle, Lemon Pickle, Dates Pickle, Garlic Pickle, Gooseberry Pickle, Tender Mango Pickle, Prawn Pickle, Fish Pickle, Beef Pickle, Chilli Pickle
3. **Spice Powders (മസാല പൊടി):** Sambar Powder, Rasam Powder, Fish Curry Masala, Chicken Masala, Meat Masala, Garam Masala, Biriyani Masala, Turmeric Powder, Chilli Powder, Coriander Powder, Pepper Powder, Roasted Coconut Powder
4. **Breakfast Essentials:** Puttu Podi, Chemba Puttu Podi, Ragi Puttu Podi, Appam Podi, Idiyappam Podi, Pathiri Podi, Idli Podi, Dosa Batter, Appam Batter, Idli Batter
5. **Traditional Sweets:** Banana Halwa, Kozhikode Halwa, Unniyappam, Neyyappam, Coconut Burfi, Elayappam, Ari Unda, Aval Vilayichathu, Jackfruit Halwa, Coconut Ladoo
6. **Homemade Specialties:** Chammanthi Podi, Coconut Chutney Powder, Idli Chutney Powder, Theeyal Mix, Puliyinji, Homemade Ghee, Homemade Coconut Oil, Jackfruit Jam, Banana Jam, Homemade Squash
7. **Rice & Flours:** Kerala Matta Rice, Palakkadan Matta Rice, Chemba Rice, Roasted Rice Flour, Raw Rice Flour, Appam Rice Flour, Ragi Flour, Wheat Flour, Tapioca Flour
8. **Healthy & Natural Foods:** Ragi Powder, Banana Powder, Jackfruit Powder, Dates Powder, Sprouted Ragi Powder, Palm Jaggery, Pure Honey, Dry Fruits Mix, Herbal Drink Mix

Note: the category list above is the **subcategory/product list**. Model it as: `categories` (8 rows) → `products` (each product belongs to one or more categories). Where useful, add optional `subcategories` (e.g., Pickles → Veg / Non-Veg; Snacks → Fried / Steamed / Sweet) for filtering.

Also seed: 1 admin, 3 demo customers with addresses, 5 sample orders in different statuses, 3 coupons, 4 banners, 12 FAQs, delivery rules, settings.

---

## 10. BACKEND ARCHITECTURE & SECURITY
**Folder structure (create exactly, extend if needed):**
```
thanima/
├── public/                # web root (index.php front controller, .htaccess, assets/)
│   ├── assets/{css,js,img,uploads}
│   └── index.php
├── app/
│   ├── controllers/  models/  services/  middleware/  helpers/
│   └── views/ (layouts, partials, pages, admin)
├── admin/ (or routed under /admin)
├── config/ (config.php reading env vars, routes.php)
├── database/ (schema.sql, seed.sql)
├── docker/ (apache.conf, php.ini, entrypoint.sh)
├── openshift/ (YAML manifests)
├── Dockerfile
├── docker-compose.yml     # local dev: php-apache + mysql + phpmyadmin
├── .env.example
└── README.md
```
**Security (mandatory):** PDO prepared statements everywhere; `password_hash()/password_verify()` (bcrypt/argon2); CSRF tokens on all POST forms and AJAX; output escaping (XSS); session hardening (httponly, samesite, regenerate id on login); server-side validation on every input; secure file upload (type/size/MIME check, random filenames, uploads dir with no PHP execution); rate-limit login attempts; role checks on every admin route; security headers; never commit secrets; all config from environment variables.
**Other:** clean URLs (`/shop`, `/category/{slug}`, `/product/{slug}`), SEO (meta tags, Open Graph, sitemap.xml, structured data for products), JSON API endpoints for AJAX (cart, wishlist, search), error logging to stderr (OpenShift-friendly), pagination helper, flash messages.

---

## 11. OPENSHIFT DEPLOYMENT (MANDATORY DELIVERABLES)
Provide a working containerised setup and OpenShift manifests:
- **Dockerfile:** based on `php:8.2-apache`, installs `pdo_mysql`, `gd`, `mbstring`, `intl`, enables `mod_rewrite`; **runs as non-root and listens on port 8080** (OpenShift restricted SCC / arbitrary UID: set directory permissions with `chgrp -R 0` and `chmod -R g=u` on writable paths); document root = `/public`; healthcheck endpoint `/healthz`
- **docker-compose.yml** for local dev (web, mysql with volume, phpMyAdmin) and the DB auto-initialises from `database/schema.sql` + `seed.sql`
- **/openshift manifests:**
  - `secret.yaml` (DB credentials, app key, SMTP; example values only)
  - `configmap.yaml` (non-secret env vars: APP_URL, APP_ENV, etc.)
  - `mysql-pvc.yaml`, `mysql-deployment.yaml`, `mysql-service.yaml` (MySQL with PersistentVolumeClaim, readiness/liveness probes, init job or script to load schema and seed)
  - `uploads-pvc.yaml` (persistent storage for product images)
  - `app-deployment.yaml` (replicas: 2, resource requests/limits, probes, env from Secret/ConfigMap, uploads volume mount)
  - `app-service.yaml`, `route.yaml` (TLS edge termination with redirect to HTTPS)
  - `buildconfig.yaml` + `imagestream.yaml` (Binary or Git source build, Docker strategy) **and** an alternative `oc new-app` command
  - `job-db-init.yaml`
- **DEPLOYMENT.md** with exact `oc` commands: login, create project, apply secrets and configs, deploy MySQL, init DB, build and push image, deploy app, expose route, verify, view logs, scale, and update/rollback

---

## 12. UX, PERFORMANCE & QUALITY
- Fast: gzip, cache headers for static assets, minified CSS/JS for production, lazy-load images, DB indexes
- Accessibility: semantic HTML, alt text, ARIA labels, keyboard navigation
- Form UX: inline validation, loading states on buttons, toast messages, confirmation dialogs for destructive actions
- Empty states (empty cart/wishlist/orders) with friendly illustrations and CTAs
- Currency formatting in INR (₹) with Indian digit grouping
- All text must support Malayalam rendering (UTF-8 everywhere)

---

## 13. DOCUMENTATION DELIVERABLES
1. `README.md`: overview, features, tech stack, local setup (Docker and XAMPP/manual), environment variables, default credentials, database import, folder structure, how to replace the dummy payment with real Razorpay, troubleshooting
2. `DEPLOYMENT.md`: OpenShift steps (Section 11)
3. ER diagram (Mermaid) of the database in `docs/er-diagram.md`
4. Sitemap and navigation flow diagram in `docs/flow.md`

---

## 14. ACCEPTANCE CHECKLIST (SELF-TEST BEFORE FINISHING)
Run through and fix anything failing, then report results:
- [ ] Site loads with common header and footer on every page, Thanima Malayalam logo visible and crisp
- [ ] All 13+ pages work and are responsive on mobile
- [ ] All 8 categories and every listed product exist in the DB and show in the shop
- [ ] Search, filters, sorting and pagination work together
- [ ] Add to cart, Buy Now, quantity update, remove, coupon apply all work (guest and logged-in)
- [ ] Register, login, forgot/reset password, logout work
- [ ] Checkout works with all 5 payment options (success and failure paths), and the order appears in My Orders with tracking timeline
- [ ] Wishlist, reviews, recently viewed work
- [ ] Admin can log in, add or edit products, change order status (customer sees update and notification), manage coupons and banners, and view dashboard charts
- [ ] No SQL injection, XSS or CSRF holes in the main flows; passwords are hashed
- [ ] `docker-compose up` brings up a working site with seeded data
- [ ] OpenShift manifests deploy successfully (non-root, port 8080, route with TLS, PVCs bound)
- [ ] README and DEPLOYMENT docs are complete and accurate

**Final output:** the full source code in the folder structure above, ready to run, plus a short summary of how to start it locally and how to deploy to OpenShift. If anything must be assumed, state the assumption briefly and keep going rather than stopping to ask.
