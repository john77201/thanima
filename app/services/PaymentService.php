<?php
declare(strict_types=1);

namespace App\Services;

interface PaymentGatewayInterface
{
    public function createOrder(float $amount, string $currency, string $receiptId): array;
    public function verifyPayment(string $paymentId, string $orderId, string $signature): bool;
    public function refund(string $paymentId, float $amount): array;
}

/**
 * Simulated Razorpay Gateway Service
 * Simulates standard Razorpay behavior for dev, staging, and demo environments.
 * To switch to real Razorpay: set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env
 * and instantiate RazorpayGatewayImplementation implementing PaymentGatewayInterface.
 */
class PaymentService implements PaymentGatewayInterface
{
    private string $keyId;
    private string $keySecret;
    private bool $isSandbox;

    public function __construct(string $keyId = '', string $keySecret = '', bool $isSandbox = true)
    {
        $this->keyId = $keyId ?: (getenv('RAZORPAY_KEY_ID') ?: 'rzp_test_simulated');
        $this->keySecret = $keySecret ?: (getenv('RAZORPAY_KEY_SECRET') ?: 'simulated_secret');
        $this->isSandbox = $isSandbox;
    }

    public function createOrder(float $amount, string $currency = 'INR', string $receiptId = ''): array
    {
        $amountInPaise = (int)round($amount * 100);
        $simulatedOrderId = 'order_' . bin2hex(random_bytes(8));

        return [
            'id' => $simulatedOrderId,
            'amount' => $amountInPaise,
            'currency' => $currency,
            'receipt' => $receiptId,
            'status' => 'created',
            'created_at' => time(),
        ];
    }

    public function verifyPayment(string $paymentId, string $orderId, string $signature): bool
    {
        if ($this->isSandbox) {
            // In sandbox simulation, verify that payment ID starts with pay_
            return str_starts_with($paymentId, 'pay_');
        }

        // Production Razorpay HMAC-SHA256 signature verification
        $expectedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, $this->keySecret);
        return hash_equals($expectedSignature, $signature);
    }

    public function refund(string $paymentId, float $amount): array
    {
        return [
            'id' => 'rfnd_' . bin2hex(random_bytes(8)),
            'payment_id' => $paymentId,
            'amount' => (int)round($amount * 100),
            'status' => 'processed',
            'created_at' => time(),
        ];
    }
}
