import { OrderStatus } from '../types';

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export function generateOrderNumber(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `THN-${yyyy}${mm}${dd}-${random}`;
}

export function canCancelOrder(status: OrderStatus): boolean {
  return status === 'Pending' || status === 'Confirmed';
}

export function getStatusStepIndex(status: OrderStatus): number {
  if (status === 'Cancelled' || status === 'Returned') return -1;
  return ORDER_STATUS_SEQUENCE.indexOf(status);
}

export function getEstimatedDeliveryDate(fromDays = 3, toDays = 5): string {
  const date = new Date();
  date.setDate(date.getDate() + toDays);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
