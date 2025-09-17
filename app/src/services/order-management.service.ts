export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export class OrderManagementService {
  private orders: Order[] = [];

  async createOrder(userId: string, items: OrderItem[]): Promise<Order> {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order: Order = {
      id: this.generateId(),
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.push(order);
    // TODO: Persist to database
    return order;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return this.orders.filter(order => order.userId === userId);
    }
    return this.orders;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orders.find(order => order.id === orderId) || null;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      // TODO: Persist to database
    }
    return order || null;
  }

  async cancelOrder(orderId: string): Promise<Order | null> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}