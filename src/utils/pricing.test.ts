import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  calculateCouponDiscount,
  calculateDeliveryFee,
  calculateOrderTotal,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_CHARGE,
  STANDARD_COD_FEE,
} from './pricing';
import { Coupon } from '../types';

test('formatINR formats numbers with Indian commas', () => {
  assert.equal(formatINR(500), '₹500');
  assert.equal(formatINR(1250), '₹1,250');
  assert.equal(formatINR(100000), '₹1,00,000');
  assert.equal(formatINR(49.5, true), '₹49.50');
});

test('calculateCouponDiscount with percentage coupon and max limit', () => {
  const percentageCoupon: Coupon = {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderValue: 299,
    maxDiscount: 100,
    description: '10% off',
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 0,
  };

  // Below minimum value
  assert.equal(calculateCouponDiscount(200, percentageCoupon), 0);
  // Valid, under max limit (10% of 500 = 50)
  assert.equal(calculateCouponDiscount(500, percentageCoupon), 50);
  // Valid, capped by max limit (10% of 1500 = 150 -> 100)
  assert.equal(calculateCouponDiscount(1500, percentageCoupon), 100);
});

test('calculateCouponDiscount with flat coupon', () => {
  const flatCoupon: Coupon = {
    code: 'KERALA50',
    type: 'flat',
    value: 50,
    minOrderValue: 499,
    description: '₹50 off',
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 0,
  };

  assert.equal(calculateCouponDiscount(400, flatCoupon), 0);
  assert.equal(calculateCouponDiscount(500, flatCoupon), 50);
});

test('calculateDeliveryFee respects free delivery threshold and free shipping coupon', () => {
  // Below threshold
  assert.equal(calculateDeliveryFee(300, null), STANDARD_DELIVERY_CHARGE);
  // At or above threshold (499)
  assert.equal(calculateDeliveryFee(FREE_DELIVERY_THRESHOLD, null), 0);
  assert.equal(calculateDeliveryFee(1000, null), 0);

  // Free shipping coupon overrides below threshold
  const freeShipCoupon: Coupon = {
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minOrderValue: 0,
    description: 'Free delivery',
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 0,
  };
  assert.equal(calculateDeliveryFee(200, freeShipCoupon), 0);
});

test('calculateOrderTotal adds delivery and COD fees accurately', () => {
  // Subtotal 600, discount 50, free delivery, online payment
  assert.equal(calculateOrderTotal(600, 50, 0, false), 550);
  // Subtotal 400, discount 0, delivery 49, COD fee 30
  assert.equal(calculateOrderTotal(400, 0, 49, true), 400 + 49 + STANDARD_COD_FEE);
});
