import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidLuhn,
  detectCardBrand,
  isValidUPI,
  isValidCardExpiry,
  isValidIndianPhone,
  isKeralaPincode,
} from './validation';

test('isValidLuhn tests standard test card numbers', () => {
  // Standard valid test card numbers (Luhn compliant)
  assert.equal(isValidLuhn('4532015112830366'), true);
  assert.equal(isValidLuhn('4532 0151 1283 0366'), true);
  // Invalid Luhn
  assert.equal(isValidLuhn('4532015112830367'), false);
  assert.equal(isValidLuhn('123'), false);
});

test('detectCardBrand detects Visa, Mastercard and RuPay', () => {
  assert.equal(detectCardBrand('4111111111111111'), 'Visa');
  assert.equal(detectCardBrand('5500000000000004'), 'Mastercard');
  assert.equal(detectCardBrand('6080000000000001'), 'RuPay');
  assert.equal(detectCardBrand('6521000000000000'), 'RuPay');
  assert.equal(detectCardBrand('378282246310005'), 'Amex');
});

test('isValidUPI validates valid UPI format', () => {
  assert.equal(isValidUPI('thanima@oksbi'), true);
  assert.equal(isValidUPI('user.name@upi'), true);
  assert.equal(isValidUPI('9876543210@paytm'), true);
  assert.equal(isValidUPI('invalid-upi'), false);
  assert.equal(isValidUPI('user@'), false);
});

test('isValidCardExpiry validates MM/YY format and future dates', () => {
  assert.equal(isValidCardExpiry('12/28'), true);
  assert.equal(isValidCardExpiry('01/30'), true);
  assert.equal(isValidCardExpiry('13/28'), false); // invalid month
  assert.equal(isValidCardExpiry('00/28'), false); // invalid month
  assert.equal(isValidCardExpiry('05/20'), false); // past year
});

test('isValidIndianPhone validates 10-digit Indian numbers', () => {
  assert.equal(isValidIndianPhone('9876543210'), true);
  assert.equal(isValidIndianPhone('+919876543210'), true);
  assert.equal(isValidIndianPhone('919876543210'), true);
  assert.equal(isValidIndianPhone('1234567890'), false); // starts with 1
  assert.equal(isValidIndianPhone('98765'), false); // too short
});

test('isKeralaPincode identifies Kerala postal codes (67xxxx - 69xxxx)', () => {
  assert.equal(isKeralaPincode('682001'), true); // Kochi
  assert.equal(isKeralaPincode('695001'), true); // Thiruvananthapuram
  assert.equal(isKeralaPincode('673001'), true); // Kozhikode
  assert.equal(isKeralaPincode('560001'), false); // Bengaluru
  assert.equal(isKeralaPincode('110001'), false); // Delhi
});
