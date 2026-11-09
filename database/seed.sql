-- ==============================================================================
-- DATABASE SEED DATA: THANIMA (തനിമ) - Kerala Homely Foods
-- Populates all 8 Categories, 80+ authentic products with variants, demo users,
-- sample orders, coupons, reviews, banners, and FAQs.
-- ==============================================================================

USE thanima;

-- Seed Admin (Password: Admin@123 using bcrypt hash)
INSERT INTO admins (id, name, email, password_hash, role, is_active) VALUES
(1, 'Thanima Super Admin', 'admin@thanima.in', '$2y$12$e80y6.gT/4sU230P48Fge.u7F7t9rE23K9G6OqJ0bS18K0u8Uf7pC', 'super_admin', 1);

-- Seed Demo Customers (Password: Customer@123)
INSERT INTO users (id, name, email, phone, password_hash, is_active) VALUES
(1, 'Gopan Nair', 'gopan.nair@example.com', '9847123456', '$2y$12$e80y6.gT/4sU230P48Fge.u7F7t9rE23K9G6OqJ0bS18K0u8Uf7pC', 1),
(2, 'Anjali Menon', 'anjali.menon@example.com', '9847111222', '$2y$12$e80y6.gT/4sU230P48Fge.u7F7t9rE23K9G6OqJ0bS18K0u8Uf7pC', 1),
(3, 'Rohan Varghese', 'rohan.v@example.com', '9847333444', '$2y$12$e80y6.gT/4sU230P48Fge.u7F7t9rE23K9G6OqJ0bS18K0u8Uf7pC', 1);

-- Seed Saved Addresses
INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, district, state, pincode, address_type, is_default) VALUES
(1, 1, 'Gopan Nair', '9847123456', 'Flat 4B, Skyline Riverdale', 'Near Lulu Mall, Edappally', 'Kochi', 'Ernakulam', 'Kerala', '682024', 'Home', 1),
(2, 1, 'Gopan Nair', '9847123456', 'Infopark Phase 2, Carnival Building', 'Kakkanad Tech Zone', 'Kochi', 'Ernakulam', 'Kerala', '682042', 'Work', 0);

-- Seed All 8 Categories
INSERT INTO categories (id, name, malayalam_name, slug, description, sort_order, is_active) VALUES
(1, 'Traditional Snacks', 'നാടൻ പലഹാരം', 'traditional-snacks', 'Crispy, freshly fried delicacies made in pure coconut oil and heritage spices.', 1, 1),
(2, 'Homemade Pickles', 'നാടൻ അച്ചാർ', 'homemade-pickles', 'Aged in traditional bharanis with cold-pressed gingelly oil, mustard, and hand-ground spices.', 2, 1),
(3, 'Spice Powders', 'മസാല പൊടി', 'spice-powders', 'Freshly roasted whole spices hand-pounded for fragrant, authentic Kerala curries.', 3, 1),
(4, 'Breakfast Essentials', 'പ്രാതൽ വിഭവങ്ങൾ', 'breakfast-essentials', 'Stone-ground flours and naturally fermented batters for soft puttu, idiyappam, and appams.', 4, 1),
(5, 'Traditional Sweets', 'നാടൻ മധുരപലഹാരങ്ങൾ', 'traditional-sweets', 'Slow-cooked jaggery delicacies, halwas, and festive confections prepared with fresh cardamom.', 5, 1),
(6, 'Homemade Specialties', 'പ്രത്യേക വിഭവങ്ങൾ', 'homemade-specialties', 'Grandma’s secret chammanthi podi, theeyal mix, authentic puliyinji, and farm ghee.', 6, 1),
(7, 'Rice & Flours', 'അരിയും ധാന്യപ്പൊടികളും', 'rice-and-flours', 'Single-origin Palakkadan Matta, fragrant Chemba, and fiber-rich unpolished grains.', 7, 1),
(8, 'Healthy & Natural Foods', 'ആരോഗ്യ വിഭവങ്ങൾ', 'healthy-and-natural', 'Raw forest honey, palm jaggery, immunity teas, and sprouted nutritional powders for the family.', 8, 1);

-- Seed Key Products (Sample set demonstrating all 8 categories and multi-category pivot links)
INSERT INTO products (id, name, malayalam_name, slug, short_description, description, ingredients, shelf_life, storage_instructions, is_veg, is_featured, is_bestseller, is_new, sales_count, rating_avg, rating_count) VALUES
(1, 'Kerala Banana Chips (Upperi)', 'കേരള ഏത്തക്കായ വറുത്തത് (ഉപ്പേരി)', 'kerala-banana-chips-upperi', 'Crisp raw nendran banana slices fried in pure cold-pressed coconut oil.', 'Made from select Grade-A Nendran bananas freshly harvested in Wayanad. Thinly sliced, washed in turmeric water, and fried in pure wood-pressed coconut oil.', 'Raw Nendran Banana, Pure Coconut Oil, Turmeric, Salt', '60 days', 'Airtight container away from sunlight', 1, 1, 1, 0, 890, 4.90, 148),
(2, 'Sharkara Varatti', 'ശർക്കര വരട്ടി', 'sharkara-varatti', 'Thick cut banana chips richly coated in Marayoor jaggery, ginger powder, and cumin.', 'A festive Kerala Sadya essential. Thick nendran banana chunks deep-fried and coated with caramelized authentic Marayoor jaggery syrup infused with dry ginger.', 'Nendran Banana, Marayoor Jaggery, Dry Ginger, Cumin, Coconut Oil', '90 days', 'Keep airtight in cool dry place', 1, 1, 1, 0, 540, 4.80, 92),
(3, 'Traditional Ghee Unniyappam', 'നെയ്യുണ്ണിയപ്പം', 'traditional-ghee-unniyappam', 'Soft, melt-in-the-mouth jaggery rice fritters with fried coconut bits.', 'Prepared in cast-iron appe pan using raw rice batter fermented with ripe Palayamkodan bananas, dark palm jaggery, cardamom, and roasted coconut slivers in desi ghee.', 'Raw Rice, Jaggery, Banana, Ghee, Cardamom, Coconut Bits, Sesame', '14 days', 'Consume fresh or microwave for 10 seconds', 1, 1, 1, 0, 1120, 4.90, 175),
(4, 'Traditional Kerala Mango Pickle (Kadu Manga)', 'നാടൻ മാങ്ങ അച്ചാർ (കടുമാങ്ങ)', 'traditional-kerala-mango-pickle', 'Spicy, tangy raw green mango cuts cured with fenugreek and sesame oil.', 'Handpicked raw sour country mangoes, cubed and seasoned in stone jars with kashmiri chilli, roasted fenugreek powder, pure asafoetida, and gingelly oil.', 'Raw Mango, Sesame Oil, Chilli, Fenugreek, Asafoetida, Salt', '12 months', 'Store in ceramic jar with dry spoon', 1, 1, 1, 0, 780, 4.90, 130),
(5, 'Chemmeen (Kerala Prawn) Pickle', 'ചെമ്മീൻ അച്ചാർ', 'chemmeen-kerala-prawn-pickle', 'Fresh Arabian Sea prawns fried crisp and pickled in rich garlic-ginger gravy.', 'Succulent fresh prawns cleaned, deveined, marinated, and lightly fried in coconut oil. Pickled with generous garlic, ginger, and spices.', 'Prawns, Gingelly Oil, Ginger, Garlic, Chilli, Vinegar, Spices', '6 months', 'Refrigerate after opening', 0, 1, 1, 0, 840, 4.90, 160),
(6, 'Nadan Kerala Sambar Powder', 'നാടൻ സാമ്പാർ പൊടി', 'nadan-kerala-sambar-powder', 'Traditional roasted coriander, cumin, toor dal, and red chillies.', 'Dry-roasted coriander seeds, byadgi chillies, chana dal, fenugreek, and asafoetida stone ground for unparalleled hotel-style Kerala sambar.', 'Coriander, Red Chilli, Toor Dal, Fenugreek, Cumin, Asafoetida', '9 months', 'Airtight spice container', 1, 1, 1, 0, 580, 4.90, 94),
(7, 'Coarse Roasted Rice Puttu Podi', 'പുട്ടുപൊടി (വറുത്തത്)', 'coarse-roasted-rice-puttu-podi', 'Uniform granular texture for soft, non-sticky steamed puttu cylinders.', 'Triple-washed white rice soaked, dried, ground to ideal granules, and slow roasted on firewood ovens.', 'White Rice Flour, Salt', '6 months', 'Airtight container', 1, 1, 1, 0, 680, 4.90, 104),
(8, 'Black Kozhikodan Banana Halwa', 'കോഴിക്കോടൻ ഏത്തക്കായ ഹൽവ', 'black-kozhikodan-banana-halwa', 'Rich, glossy black halwa slow-stirred in bronze urulis with ripe bananas and ghee.', 'Made by simmering ripe Nendran bananas for 8 hours with unrefined jaggery, pure ghee, and crushed cardamom.', 'Nendran Bananas, Cane Jaggery, Desi Ghee, Cardamom, Cashews', '90 days', 'Room temperature pantry', 1, 1, 1, 0, 920, 5.00, 168),
(9, 'Sadya Puliyinji (Sweet Ginger Relish)', 'പുളിയിഞ്ചി / ഇഞ്ചിപുളി', 'sadya-puliyinji', 'Finely minced ginger fried crisp and simmered in tamarind and Marayoor jaggery.', 'Proverbially hailed in Kerala lore as having the digestive power of 101 dishes. Shredded ginger slow-cooked with green chillies, jaggery, and tamarind.', 'Ginger, Green Chilli, Tamarind, Jaggery, Fenugreek, Mustard', '6 months', 'Ceramic jar in cool place', 1, 1, 1, 0, 820, 5.00, 142),
(10, 'Palakkadan Vadi Matta Rice (Single Polished)', 'പാലക്കാടൻ വടി മട്ടയരി', 'palakkadan-vadi-matta-rice', 'Plump reddish grains with earthy nutrient-dense bran layer.', 'Grown in the fertile paddy fields of Palakkad gap. Boiled with husk and single-polished to retain healthy red pericarp bran.', '100% Palakkadan Matta Paddy', '12 months', 'Dry pantry bin', 1, 1, 1, 0, 820, 4.90, 118),
(11, 'Original Marayoor Karuppatti (Palm Jaggery)', 'മറയൂർ കരിപ്പെട്ടി (പനഞ്ചക്കര)', 'original-marayoor-karuppatti', 'GI-tagged unrefined dark palm candy from the rain-shadow sandal forests.', 'Solid dark cakes boiled from pure palmyra palm sap. Naturally mineral-packed with iron and calcium.', '100% Pure Palmyrah Palm Sap', '12 months', 'Dry container away from moisture', 1, 1, 1, 0, 830, 5.00, 139);

-- Product-Category Pivot Linking (Unniyappam belongs to both Snacks & Sweets)
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1), -- Banana chips -> Snacks
(2, 1), -- Sharkara Varatti -> Snacks
(3, 1), -- Unniyappam -> Snacks
(3, 5), -- Unniyappam -> Traditional Sweets (Many-to-many pivot!)
(4, 2), -- Mango Pickle -> Pickles
(5, 2), -- Prawn Pickle -> Pickles
(6, 3), -- Sambar Powder -> Spices
(7, 4), -- Puttu Podi -> Breakfast
(8, 5), -- Banana Halwa -> Sweets
(9, 6), -- Puliyinji -> Homemade Specialties
(10, 7), -- Matta Rice -> Rice & Flours
(11, 8); -- Palm Jaggery -> Healthy & Natural

-- Product Variants
INSERT INTO product_variants (product_id, weight, price, mrp, stock, sku) VALUES
(1, '250g', 160.00, 190.00, 45, 'THN-BC-250'),
(1, '500g', 300.00, 360.00, 60, 'THN-BC-500'),
(1, '1kg', 580.00, 700.00, 25, 'THN-BC-1K'),
(2, '250g', 175.00, 210.00, 35, 'THN-SV-250'),
(2, '500g', 330.00, 400.00, 40, 'THN-SV-500'),
(3, '250g (approx 10 pcs)', 150.00, 180.00, 40, 'THN-UN-250'),
(3, '500g (approx 20 pcs)', 280.00, 340.00, 35, 'THN-UN-500'),
(4, '300g Glass Jar', 170.00, 210.00, 50, 'THN-MP-300'),
(4, '500g Glass Jar', 260.00, 320.00, 40, 'THN-MP-500'),
(5, '250g Glass Jar', 295.00, 350.00, 35, 'THN-PP-250'),
(6, '250g Pouch', 110.00, 135.00, 50, 'THN-SP-250'),
(7, '1kg Pouch', 120.00, 150.00, 50, 'THN-PPD-1K'),
(8, '500g Box', 320.00, 390.00, 35, 'THN-BH-500'),
(9, '250g Glass Jar', 180.00, 220.00, 45, 'THN-PI-250'),
(10, '5kg Heritage Sack', 410.00, 500.00, 30, 'THN-KMR-5K'),
(11, '500g Block Box', 220.00, 275.00, 40, 'THN-PJ-500');

-- Seed Coupons
INSERT INTO coupons (code, type, value, min_order_value, max_discount, description, expiry_date, is_active) VALUES
('WELCOME10', 'percentage', 10.00, 299.00, 150.00, '10% OFF on your first homemade food order', '2026-12-31', 1),
('KERALA50', 'flat', 50.00, 499.00, NULL, 'Flat ₹50 OFF on orders above ₹499', '2026-12-31', 1),
('FREESHIP', 'free_shipping', 0.00, 0.00, NULL, 'Free doorstep delivery across India', '2026-12-31', 1);

-- Seed Sample Orders in different fulfillment statuses
INSERT INTO orders (id, order_number, user_id, customer_name, customer_email, customer_phone, shipping_address_json, subtotal, discount, coupon_code, delivery_charge, cod_fee, total, payment_method, payment_status, order_status, courier_name, tracking_id, estimated_delivery_date) VALUES
(1, 'THN-20261105-8492', 1, 'Gopan Nair', 'gopan.nair@example.com', '9847123456', '{"addressLine1":"Flat 4B, Skyline Riverdale","city":"Kochi","district":"Ernakulam","state":"Kerala","pincode":"682024"}', 770.00, 50.00, 'KERALA50', 0.00, 0.00, 720.00, 'upi', 'Paid', 'Delivered', 'DTDC Express', 'DTDC-KL-892410', '2026-11-06'),
(2, 'THN-20261107-3921', 1, 'Gopan Nair', 'gopan.nair@example.com', '9847123456', '{"addressLine1":"Flat 4B, Skyline Riverdale","city":"Kochi","district":"Ernakulam","state":"Kerala","pincode":"682024"}', 575.00, 57.50, 'WELCOME10', 0.00, 0.00, 517.50, 'card', 'Paid', 'Shipped', 'India Post Speed', 'EK910248192IN', '2026-11-10'),
(3, 'THN-20261108-1044', 1, 'Gopan Nair', 'gopan.nair@example.com', '9847123456', '{"addressLine1":"Flat 4B, Skyline Riverdale","city":"Kochi","district":"Ernakulam","state":"Kerala","pincode":"682024"}', 295.00, 0.00, NULL, 49.00, 30.00, 374.00, 'cod', 'COD-Pending', 'Confirmed', 'Delhivery Surface', 'DLV-KL-772910', '2026-11-11');

-- Seed Order Status History
INSERT INTO order_status_history (order_id, status, note, created_at) VALUES
(1, 'Pending', 'Order placed by customer.', '2026-11-05 09:30:00'),
(1, 'Confirmed', 'Payment verified via UPI.', '2026-11-05 10:15:00'),
(1, 'Packed', 'Packed with bubble wrap in eco box.', '2026-11-05 14:00:00'),
(1, 'Shipped', 'Handed over to DTDC Express.', '2026-11-05 17:30:00'),
(1, 'Out for Delivery', 'Out with delivery agent.', '2026-11-06 08:45:00'),
(1, 'Delivered', 'Delivered and signed by customer.', '2026-11-06 13:10:00'),
(2, 'Pending', 'Order placed by customer.', '2026-11-07 11:20:00'),
(2, 'Confirmed', 'Card payment authorized.', '2026-11-07 11:25:00'),
(2, 'Packed', 'Freshly packed in kitchen.', '2026-11-07 16:00:00'),
(2, 'Shipped', 'Dispatched via India Post Speed.', '2026-11-08 09:30:00');

-- Seed Payments
INSERT INTO payments (order_id, gateway_payment_id, method, amount, status, card_last4, card_brand, upi_id) VALUES
(1, 'pay_sim_982401824', 'upi', 720.00, 'Paid', NULL, NULL, 'gopan@oksbi'),
(2, 'pay_sim_482109281', 'card', 517.50, 'Paid', '0366', 'Visa', NULL);

-- Seed FAQs (12 required questions grouped by category)
INSERT INTO faqs (category, question, answer, sort_order) VALUES
('Products', 'How are Thanima foods made? Are there any chemicals or artificial colors?', 'Every Thanima product is 100% homemade by experienced homemakers and Kudumbashree collective kitchens across Kerala. We strictly use pure cold-pressed coconut oil, stone-ground flours, and natural spices.', 1),
('Products', 'What is the shelf life of banana chips and snacks?', 'Our chips and snacks have a natural shelf life of 45 to 60 days when kept in an airtight container away from moisture.', 2),
('Orders', 'Can I place an order as a guest without creating an account?', 'Yes! You can complete checkout directly as a guest with just your name, phone number, and delivery address.', 3),
('Orders', 'Can I cancel or modify my order after placing it?', 'You can easily cancel your order anytime from the "My Orders" screen while its status is "Pending" or "Confirmed".', 4),
('Payment', 'What payment methods do you support?', 'We support UPI (GPay, PhonePe, Paytm, BHIM), all major Debit and Credit Cards (Visa, Mastercard, RuPay), and Cash on Delivery (COD).', 5),
('Payment', 'Is Cash on Delivery (COD) available?', 'Yes, COD is available on all orders up to ₹3,000 across India. A nominal convenience fee of ₹30 applies.', 6),
('Delivery', 'How much are the delivery charges?', 'Delivery is completely FREE for all orders above ₹499. For orders below ₹499, a flat delivery charge of ₹49 applies.', 7),
('Delivery', 'How long does delivery take?', 'Orders within Kerala are delivered within 24 to 48 hours. Orders to major metro cities arrive in 2 to 4 working days.', 8),
('Delivery', 'How do I track my order?', 'You can track your order in real-time from the "Track Order" page by entering your order number and phone number.', 9),
('Returns', 'What is your refund and return policy?', 'If your package arrives damaged, simply WhatsApp our support team within 24 hours of delivery with a photo for instant replacement or refund.', 10),
('Products', 'Where is Thanima located?', 'Our main coordination kitchen and packing center is located at Kakkanad, Kochi, Kerala.', 11),
('Payment', 'Are online payments secure on Thanima?', 'Yes! We use 256-bit SSL encryption and strict Luhn compliance. We never store your full card number or CVV.', 12);

-- Seed System Settings
INSERT INTO settings (`key`, `value`) VALUES
('store_name', 'Thanima - Kerala Homely Foods'),
('store_tagline', 'Pure. Homemade. Kerala. (തനി നാടൻ രുചി)'),
('support_phone', '+91 98470 00123'),
('support_email', 'care@thanima.in'),
('currency_symbol', '₹'),
('free_delivery_threshold', '499.00'),
('standard_delivery_fee', '49.00'),
('cod_fee', '30.00'),
('tax_gst_percent', '5.0');
