export type CardBrand = 'Visa' | 'Mastercard' | 'RuPay' | 'Amex' | 'Unknown';

export function isValidLuhn(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (sanitized.length < 13 || sanitized.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function detectCardBrand(cardNumber: string): CardBrand {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (/^4/.test(sanitized)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(sanitized)) return 'Mastercard';
  if (/^(60|65|81|82|508)/.test(sanitized)) return 'RuPay';
  if (/^3[47]/.test(sanitized)) return 'Amex';
  return 'Unknown';
}

export function isValidUPI(upiId: string): boolean {
  const trimmed = upiId.trim();
  // Validates standard UPI pattern like name@oksbi, user@upi, 9876543210@paytm
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(trimmed);
}

export function isValidCardExpiry(expiry: string): boolean {
  const trimmed = expiry.trim();
  if (!/^\d{2}\/\d{2}$/.test(trimmed)) return false;
  const [monthStr, yearStr] = trimmed.split('/');
  const month = parseInt(monthStr, 10);
  const year = 2000 + parseInt(yearStr, 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (year > currentYear + 20) return false;

  return true;
}

export function isValidIndianPhone(phone: string): boolean {
  const sanitized = phone.replace(/[\s\-\+]/g, '');
  // Allows optional +91 or 91 prefix followed by 10 digits starting with 6, 7, 8, or 9
  const phoneRegex = /^(?:(?:\+|0{0,2})91)?[6-9]\d{9}$/;
  return phoneRegex.test(sanitized);
}

export function isValidPincode(pincode: string): boolean {
  const sanitized = pincode.replace(/\D/g, '');
  return /^[1-9][0-9]{5}$/.test(sanitized);
}

export function isKeralaPincode(pincode: string): boolean {
  const sanitized = pincode.replace(/\D/g, '');
  if (!isValidPincode(sanitized)) return false;
  // Kerala pincodes start with 67, 68, or 69
  const prefix = parseInt(sanitized.substring(0, 2), 10);
  return prefix >= 67 && prefix <= 69;
}
