# Thanima (തനിമ) - User Navigation & Order Flow

## 1. Customer User Journey
\`\`\`mermaid
graph TD
    A[Homepage] --> B[Shop / Category Grid]
    A --> C[Search Bar / Autocomplete]
    A --> D[Festival Deals & Coupons]
    
    B --> E[Product Details]
    C --> E
    D --> E
    
    E -->|Add to Cart| F[Slide-Over Bag / Cart]
    E -->|Buy Now| G[Checkout Modal]
    
    F -->|Apply Coupon| F
    F -->|Proceed| G
    
    G -->|Step 1: Address| G1[Shipping & Contact Details]
    G1 -->|Step 2: Delivery| G2[Kerala Express / Courier]
    G2 -->|Step 3: Payment| G3[UPI / GPay / PhonePe / Card / COD]
    G3 -->|Step 4: Review| G4[Final Amount & Notes]
    
    G4 -->|Online Gateways| H[Simulated Razorpay Modal]
    H -->|OTP Step: 123456| I[Payment Authorized]
    H -->|Simulate Failure| H1[Failure Retry Screen]
    
    G4 -->|Cash on Delivery| I[Order Confirmed]
    
    I --> J[Order Confirmation & Live Timeline]
    J --> K[Printable Tax Invoice]
    J --> L[Order History / My Orders]
    
    L -->|Pending/Confirmed| M[Cancel Order]
    L -->|Any Time| N[Reorder to Cart]
\`\`\`

## 2. Admin Operational Flow
\`\`\`mermaid
graph TD
    A[Admin Login: admin@thanima.in] --> B[Overview Dashboard]
    B --> C[Orders Fulfillment]
    C -->|Update Status| D[Pending -> Confirmed -> Packed -> Shipped -> Delivered]
    D -->|Realtime Trigger| E[In-App Notification Sent to Customer]
    
    B --> F[Product Inventory CRUD]
    F -->|Variants / Pricing / Stock| G[Live Store Updates]
    
    B --> H[Customer Review Moderation]
    H -->|Approve / Reject| I[Storefront Review Feed]
    
    B --> J[Hero Banners & Coupons]
    B --> K[Export Orders CSV]
\`\`\`
