import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/database';
import { asyncHandler, successResponse, errorResponse } from '../utils/helpers';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder', // User needs to set this
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// Create Razorpay Order
export const createPaymentOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const userId = req.user?.userId;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) {
        return errorResponse(res, 'Order not found', 404);
    }

    if (order.userId !== userId) {
        return errorResponse(res, 'Unauthorized', 403);
    }

    // Razorpay expects amount in paise
    const amountInPaise = Math.round(order.total * 100);

    const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_order_${order.orderNumber}`,
        notes: {
            orderId: order.id,
            userId: userId,
        },
    };

    try {
        const razorpayOrder = await razorpay.orders.create(options);

        // Store Razorpay Order ID temporarily or just return it. 
        // We can store it in paymentTransactionId for now, or add a specific field.
        // Let's use paymentTransactionId to store the RZPAY ORDER ID initially.
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentTransactionId: razorpayOrder.id }, // Corrected field name
        });

        successResponse(res, {
            ...razorpayOrder,
            orderId: order.id, // WinADeal Order ID
            key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
            amount: order.total,
            currency: 'INR',
            name: 'WinADeal',
            description: `Order #${order.orderNumber}`,
            prefill: {
                name: req.user?.name, // We might not have name in req.user token payload fully, but let's try
                email: req.user?.email || '',
                contact: req.user?.phone || ''
            }
        });
    } catch (error) {
        console.error('Razorpay Error:', error);
        return errorResponse(res, 'Failed to create payment order', 500);
    }
});

// Verify Payment
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId // WinADeal Order ID
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment Successful
        // Update Order Status
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'PLACED',
                paymentStatus: 'PAID',
                paymentTransactionId: razorpay_payment_id, // Store actual Payment ID on success
            },
        });

        // Create Wallet Transaction or similar record if needed? Not for direct payment.

        successResponse(res, {
            success: true,
            orderId: order.id,
            message: 'Payment verified and order placed successfully',
        });
    } else {
        return errorResponse(res, 'Invalid signature', 400);
    }
});
