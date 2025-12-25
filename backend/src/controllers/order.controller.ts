import { Request, Response } from 'express';
import prisma from '../config/database';
import { asyncHandler, successResponse, errorResponse } from '../utils/helpers';
import { OrderStatus } from '@prisma/client';
import { socketService } from '../services/socket.service';

// Get orders
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const { status, page = 1, limit = 20 } = req.query;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const where: any = {};

    // Filter based on role
    if (userRole === 'VENDOR') {
        const shop = await prisma.shop.findUnique({
            where: { userId },
        });

        if (!shop) {
            return errorResponse(res, 'Shop not found for this vendor', 404);
        }
        where.shopId = shop.id;
    } else if (userRole === 'CUSTOMER') {
        where.customerId = userId;
    }
    // Admin sees all

    // Filter by status
    if (status && status !== 'all') {
        where.status = status as OrderStatus;
    }

    const orders = await prisma.order.findMany({
        where,
        include: {
            customer: {
                select: {
                    name: true,
                    phone: true,
                },
            },
            shop: {
                select: {
                    name: true,
                    address: true,
                }
            },
            orderItems: {
                include: {
                    product: true,
                },
            },
            deliveryAddress: true,
            delivery: {
                include: {
                    deliveryPartner: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    phone: true,
                                }
                            }
                        }
                    }
                }
            },
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            createdAt: 'desc',
        },
    });

    const total = await prisma.order.count({ where });

    successResponse(res, {
        orders,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    });
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: {
                select: {
                    name: true,
                    phone: true,
                },
            },
            shop: {
                select: {
                    name: true,
                    address: true,
                    userId: true, // Needed for permission check
                }
            },
            orderItems: {
                include: {
                    product: true,
                },
            },
            deliveryAddress: true,
            delivery: {
                include: {
                    deliveryPartner: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    phone: true,
                                }
                            }
                        }
                    }
                }
            },
        },
    });

    if (!order) {
        return errorResponse(res, 'Order not found', 404);
    }

    // Permission check
    if (userRole === 'VENDOR') {
        if (order.shop.userId !== userId) {
            return errorResponse(res, 'Unauthorized', 403);
        }
    } else if (userRole === 'CUSTOMER') {
        if (order.customerId !== userId) {
            return errorResponse(res, 'Unauthorized', 403);
        }
    }

    successResponse(res, order);
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            shop: true,
        },
    });

    if (!order) {
        return errorResponse(res, 'Order not found', 404);
    }

    // Permission check
    if (userRole === 'VENDOR') {
        if (order.shop.userId !== userId) {
            return errorResponse(res, 'Unauthorized', 403);
        }
    }

    // Validate status transition (simplified)
    // TODO: Add stricter state machine logic if needed

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
            status: status as OrderStatus,
        },
    });

    // Notify Customer
    socketService.emitToUser(updatedOrder.customerId, 'order_update', {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        message: `Order status updated to ${updatedOrder.status}`
    });

    // Notify Vendor (User ID of the shop owner)
    if (order.shop?.userId) {
        socketService.emitToUser(order.shop.userId, 'order_update', {
            orderId: updatedOrder.id,
            status: updatedOrder.status,
            message: `Order #${updatedOrder.orderNumber} updated to ${updatedOrder.status}`
        });
    }

    successResponse(res, updatedOrder, 'Order status updated successfully');
});

// Create order (Basic implementation for testing)
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { shopId, items, deliveryAddressId, paymentMethod } = req.body;

    // Calculate totals based on items (simplified, assumes frontend passes valid data or we re-fetch)
    // In a real app, always fetch prices from DB to prevent tampering.

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;
        const price = product.discountedPrice || product.price;
        subtotal += price * item.quantity;
        orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: price,
        });
    }

    const deliveryFee = 50; // Flat fee for demo
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryFee + tax;

    const order = await prisma.order.create({
        data: {
            orderNumber: `ORD-${Date.now()}`,
            customerId: userId!,
            shopId,
            status: 'PLACED',
            deliveryAddressId,
            subtotal,
            deliveryFee,
            tax,
            total,
            paymentMethod,
            orderItems: {
                create: orderItemsData
            }
        }
    });

    // Notify Shop Owner (Vendor)
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (shop?.userId) {
        socketService.emitToUser(shop.userId, 'new_order', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            message: `New Order #${order.orderNumber} Received!`,
            order: order
        });
    }

    successResponse(res, order, 'Order created successfully', 201);
});
