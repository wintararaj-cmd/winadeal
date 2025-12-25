import { Router } from 'express';
import { getOrders, getOrderById, updateOrderStatus, createOrder } from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.use(authenticate);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('VENDOR', 'ADMIN', 'DELIVERY'), updateOrderStatus);
router.post('/', authorize('CUSTOMER'), createOrder);

export default router;
