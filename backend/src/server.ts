import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // In development, allow all localhost origins
        if (process.env.NODE_ENV === 'development') {
            if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                return callback(null, true);
            }
        }

        // In production, only allow specific origins
        const allowedOrigins = [
            process.env.ADMIN_PANEL_URL || 'http://localhost:3000',
            process.env.CUSTOMER_WEB_URL || 'http://localhost:3001',
            process.env.VENDOR_PANEL_URL || 'http://localhost:5174', // Vendor Panel
            'http://localhost:5173', // Delivery App or Local Fallback
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES
// ============================================

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: '🛒 Welcome to WinADeal API',
        version: '1.0.0',
        description: 'Multi-Vendor Delivery Platform API',
        endpoints: {
            health: '/health',
            api: '/api/v1',
            auth: '/api/v1/auth',
            documentation: 'Coming soon',
        },
        timestamp: new Date().toISOString(),
    });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        message: 'WinADeal API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API v1 routes
app.get('/api/v1', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'WinADeal API v1',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            shops: '/api/v1/shops',
            products: '/api/v1/products',
            orders: '/api/v1/orders',
            deliveries: '/api/v1/deliveries',
            admin: '/api/v1/admin',
        },
    });
});

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import shopRoutes from './routes/shop.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import deliveryRoutes from './routes/delivery.routes';
import addressRoutes from './routes/address.routes';
import paymentRoutes from './routes/payment.routes';
// import adminRoutes from './routes/admin.routes';

// Use routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/shops', shopRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/delivery', deliveryRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// ============================================
// START SERVER
// ============================================

import http from 'http';
import { socketService } from './services/socket.service';

// ... (existing code)

// Create HTTP server (needed for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io
socketService.init(server);

// ============================================
// START SERVER
// ============================================

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║        🛒 WinADeal API Server             ║
║                                           ║
║  Status: ✅ Running                       ║
║  Port: ${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  URL: http://localhost:${PORT}            ║
║  Socket.io: ✅ Active                     ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

export default app;

