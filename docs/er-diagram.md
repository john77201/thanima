# Thanima (തനിമ) - Database Entity Relationship Diagram

\`\`\`mermaid
erDiagram
    USERS ||--o{ ADDRESSES : "has many"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ CART : "owns"
    USERS ||--o{ WISHLIST : "saves"
    USERS ||--o{ REVIEWS : "writes"

    CATEGORIES ||--o{ SUBCATEGORIES : "contains"
    CATEGORIES ||--o{ PRODUCT_CATEGORIES : "pivots"
    PRODUCTS ||--o{ PRODUCT_CATEGORIES : "belongs to"
    PRODUCTS ||--o{ PRODUCT_VARIANTS : "has variants"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "has images"
    PRODUCTS ||--o{ ORDER_ITEMS : "included in"
    PRODUCTS ||--o{ CART_ITEMS : "added to"
    PRODUCTS ||--o{ WISHLIST : "saved in"
    PRODUCTS ||--o{ REVIEWS : "reviewed by"

    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--o{ ORDER_STATUS_HISTORY : "tracks"
    ORDERS ||--o| PAYMENTS : "records"
    COUPONS ||--o{ COUPON_USAGE : "redeemed in"

    USERS {
        int id PK
        string name
        string email UK
        string phone
        string password_hash
        boolean is_active
        timestamp created_at
    }

    ADDRESSES {
        int id PK
        int user_id FK
        string full_name
        string phone
        string address_line1
        string city
        string district
        string state
        string pincode
        boolean is_default
    }

    CATEGORIES {
        int id PK
        string name
        string malayalam_name
        string slug UK
        string description
        int sort_order
    }

    PRODUCTS {
        int id PK
        string name
        string malayalam_name
        string slug UK
        text short_description
        text ingredients
        string shelf_life
        boolean is_veg
        boolean is_featured
        boolean is_bestseller
        decimal rating_avg
        int sales_count
    }

    PRODUCT_VARIANTS {
        int id PK
        int product_id FK
        string weight
        decimal price
        decimal mrp
        int stock
        string sku UK
    }

    ORDERS {
        int id PK
        string order_number UK
        int user_id FK
        string customer_name
        string customer_email
        string customer_phone
        json shipping_address_json
        decimal subtotal
        decimal discount
        decimal delivery_charge
        decimal cod_fee
        decimal total
        string payment_method
        string payment_status
        string order_status
        string courier_name
        string tracking_id
        timestamp created_at
    }

    ORDER_STATUS_HISTORY {
        int id PK
        int order_id FK
        string status
        string note
        timestamp created_at
    }

    PAYMENTS {
        int id PK
        int order_id FK
        string gateway_payment_id
        string method
        decimal amount
        string status
        string card_last4
        string upi_id
    }
\`\`\`
