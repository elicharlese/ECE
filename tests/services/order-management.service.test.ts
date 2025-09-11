import { OrderManagementService, Order } from '../../src/services/order-management.service';

describe('OrderManagementService', () => {
  let service: OrderManagementService;

  beforeEach(() => {
    service = new OrderManagementService();
  });

  describe('createOrder', () => {
    it('creates a new order with correct structure', async () => {
      const userId = 'user123';
      const items = [
        { id: 'item1', productId: 'prod1', quantity: 2, price: 10.00 },
        { id: 'item2', productId: 'prod2', quantity: 1, price: 15.00 }
      ];

      const order = await service.createOrder(userId, items);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.userId).toBe(userId);
      expect(order.items).toEqual(items);
      expect(order.total).toBe(35.00); // 2*10 + 1*15
      expect(order.status).toBe('pending');
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it('generates unique order IDs', async () => {
      const userId = 'user123';
      const items = [{ id: 'item1', productId: 'prod1', quantity: 1, price: 10.00 }];

      const order1 = await service.createOrder(userId, items);
      const order2 = await service.createOrder(userId, items);

      expect(order1.id).not.toBe(order2.id);
    });
  });

  describe('getOrders', () => {
    beforeEach(async () => {
      await service.createOrder('user1', [{ id: 'item1', productId: 'prod1', quantity: 1, price: 10.00 }]);
      await service.createOrder('user2', [{ id: 'item2', productId: 'prod2', quantity: 1, price: 20.00 }]);
      await service.createOrder('user1', [{ id: 'item3', productId: 'prod3', quantity: 1, price: 30.00 }]);
    });

    it('returns all orders when no userId specified', async () => {
      const orders = await service.getOrders();
      expect(orders).toHaveLength(3);
    });

    it('returns only orders for specific user', async () => {
      const orders = await service.getOrders('user1');
      expect(orders).toHaveLength(2);
      orders.forEach(order => expect(order.userId).toBe('user1'));
    });

    it('returns empty array for user with no orders', async () => {
      const orders = await service.getOrders('nonexistent');
      expect(orders).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    let order: Order;

    beforeEach(async () => {
      order = await service.createOrder('user123', [{ id: 'item1', productId: 'prod1', quantity: 1, price: 10.00 }]);
    });

    it('returns the correct order by ID', async () => {
      const foundOrder = await service.getOrderById(order.id);
      expect(foundOrder).toEqual(order);
    });

    it('returns null for non-existent order ID', async () => {
      const foundOrder = await service.getOrderById('nonexistent');
      expect(foundOrder).toBeNull();
    });
  });

  describe('updateOrderStatus', () => {
    let order: Order;

    beforeEach(async () => {
      order = await service.createOrder('user123', [{ id: 'item1', productId: 'prod1', quantity: 1, price: 10.00 }]);
    });

    it('updates order status successfully', async () => {
      const updatedOrder = await service.updateOrderStatus(order.id, 'processing');
      expect(updatedOrder?.status).toBe('processing');
      expect(updatedOrder?.updatedAt.getTime()).toBeGreaterThan(order.updatedAt.getTime());
    });

    it('returns null for non-existent order ID', async () => {
      const updatedOrder = await service.updateOrderStatus('nonexistent', 'completed');
      expect(updatedOrder).toBeNull();
    });
  });

  describe('cancelOrder', () => {
    let order: Order;

    beforeEach(async () => {
      order = await service.createOrder('user123', [{ id: 'item1', productId: 'prod1', quantity: 1, price: 10.00 }]);
    });

    it('cancels order by setting status to cancelled', async () => {
      const cancelledOrder = await service.cancelOrder(order.id);
      expect(cancelledOrder?.status).toBe('cancelled');
    });

    it('returns null for non-existent order ID', async () => {
      const cancelledOrder = await service.cancelOrder('nonexistent');
      expect(cancelledOrder).toBeNull();
    });
  });
});
