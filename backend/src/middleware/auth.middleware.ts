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

        // File Logging Helper
        const fs = require('fs');
        const path = require('path');
        const logFile = path.join(__dirname, '../../auth_debug.log');
        const log = (msg: string) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

        // Handle common frontend bugs
        if (!token || token === 'undefined' || token === 'null') {
            log('❌ No token provided or token is string literal "null"/"undefined"');
            return errorResponse(res, 'No token provided', 401);
        }

        // Verify token
        let decoded;
        try {
            decoded = verifyToken(token);
            log(`✅ Token decoded successfully. UserID: ${decoded.userId}`);
        } catch (e: any) {
            log(`❌ Token verification failed: ${e.message}. Token start: ${token.substring(0, 10)}...`);
            console.error('Token verification failed:', e.message);
            return errorResponse(res, 'Invalid token: ' + e.message, 401);
        }

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
            log(`❌ User NOT found in DB. ID: ${decoded.userId}`);
            return errorResponse(res, 'User not found', 404);
        }

        if (!user.isActive) {
            log(`❌ User is inactive. ID: ${decoded.userId}`);
            return errorResponse(res, 'Account is deactivated', 403);
        }

        log(`✅ Auth successful for User: ${user.id}`);

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
