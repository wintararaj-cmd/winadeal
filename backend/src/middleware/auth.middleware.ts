import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { errorResponse } from '../utils/helpers';
import prisma from '../config/database';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}

/**
 * Authenticate user with JWT token
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'No token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Handle common frontend bugs where token might be a string "undefined" or "null"
        if (!token || token === 'undefined' || token === 'null') {
            return errorResponse(res, 'No token provided', 401);
        }

        // Verify token
        const decoded = verifyToken(token);

        // Check if user exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                role: true,
                isActive: true,
            },
        });

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        if (!user.isActive) {
            return errorResponse(res, 'Account is deactivated', 403);
        }

        // Attach user to request
        req.user = {
            userId: user.id,
            role: user.role,
        };

        next();
    } catch (error: any) {
        console.error('Authentication error:', error);
        return errorResponse(res, 'Invalid or expired token', 401);
    }
};

/**
 * Authorize user based on roles
 */
export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            return errorResponse(
                res,
                'You do not have permission to access this resource',
                403
            );
        }

        next();
    };
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyToken(token);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    role: true,
                    isActive: true,
                },
            });

            if (user && user.isActive) {
                req.user = {
                    userId: user.id,
                    role: user.role,
                };
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
