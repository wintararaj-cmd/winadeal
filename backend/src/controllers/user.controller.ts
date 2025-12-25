import { Request, Response } from 'express';
import prisma from '../config/database';
import { asyncHandler, successResponse, errorResponse } from '../utils/helpers';

/**
 * Get all users with optional filtering
 * GET /api/v1/users
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { role, isVerified, isActive, search, page = 1, limit = 50 } = req.query;
    const userRole = req.user?.role;

    // Only Admin can fetch all users
    if (userRole !== 'ADMIN') {
        return errorResponse(res, 'Forbidden', 403);
    }

    const where: any = {};

    if (role) {
        where.role = role as string;
    }

    if (isVerified !== undefined) {
        where.isVerified = isVerified === 'true';
    }

    if (isActive !== undefined) {
        where.isActive = isActive === 'true';
    }

    if (search) {
        where.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { phone: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
        ];
    }

    const users = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            isVerified: true,
            isActive: true,
            createdAt: true,
            shop: {
                select: {
                    id: true,
                    name: true,
                    isVerified: true,
                }
            }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            createdAt: 'desc',
        },
    });

    const total = await prisma.user.count({ where });

    successResponse(res, {
        users,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    });
});

/**
 * Update user status (Active/Verified)
 * PATCH /api/v1/users/:id
 */
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isVerified, isActive } = req.body;
    const userRole = req.user?.role;

    if (userRole !== 'ADMIN') {
        return errorResponse(res, 'Forbidden', 403);
    }

    const user = await prisma.user.update({
        where: { id },
        data: {
            ...(isVerified !== undefined && { isVerified }),
            ...(isActive !== undefined && { isActive }),
        },
        select: {
            id: true,
            name: true,
            isVerified: true,
            isActive: true,
        }
    });

    successResponse(res, user, 'User status updated successfully');
});
