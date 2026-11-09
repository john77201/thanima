import { CartItem, Coupon, Product } from '../types';

export const FREE_DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_CHARGE = 49;
export const STANDARD_COD_FEE = 30;

export function formatINR(amount: number, includeDecimals = false): string {
  if (isNaN(amount)) return '₹0';
  const rounded = Math.round(amount * 100) / 100;
  const parts = rounded.toFixed(includeDecimals ? 2 : 0).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian number grouping: 3 digits from right, then groups of 2
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return includeDecimals ? `₹${formattedInteger}.${decimalPart}` : `₹${formattedInteger}`;
}

export function calculateCartSubtotal(
  items: CartItem[],
  products: Product[]
): number {
  return items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    const variant = product.variants.find((v) => v.id === item.variantId) || product.variants[0];
    if (!variant) return sum;
    return sum + variant.price * item.quantity;
  }, 0);
}

export function calculateCouponDiscount(
  subtotal: number,
  coupon: Coupon | null | undefined
): number {
  if (!coupon || !coupon.isActive) return 0;
  if (subtotal < coupon.minOrderValue) return 0;

  if (coupon.type === 'free_shipping') {
    return 0; // handled in delivery calculation
  }

  if (coupon.type === 'flat') {
    return Math.min(coupon.value, subtotal);
  }

  if (coupon.type === 'percentage') {
    const rawDiscount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      return Math.min(rawDiscount, coupon.maxDiscount);
    }
    return rawDiscount;
  }

  return 0;
}

export function calculateDeliveryFee(
  subtotal: number,
  coupon: Coupon | null | undefined
): number {
  if (coupon && coupon.isActive && coupon.type === 'free_shipping' && subtotal >= coupon.minOrderValue) {
    return 0;
  }
  if (subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0) {
    return 0;
  }
  return STANDARD_DELIVERY_CHARGE;
}

export function calculateOrderTotal(
  subtotal: number,
  discount: number,
  deliveryFee: number,
  isCod = false
): number {
  const codFee = isCod ? STANDARD_COD_FEE : 0;
  const total = Math.max(0, subtotal - discount) + deliveryFee + codFee;
  return Math.round(total * 100) / 100;
}
