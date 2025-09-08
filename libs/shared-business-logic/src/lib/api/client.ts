import type { ApiResponse, ApiError } from '@ece-platform/shared-types';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 3;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Get auth token if available
      const token = this.getAuthToken();
      const headers = {
        ...this.defaultHeaders,
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refreshToken') 
      : null;
    
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(updates: Record<string, unknown>) {
    return this.request('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Portfolio endpoints
  async getPortfolios() {
    return this.request('/portfolios');
  }

  async createPortfolio(data: { name: string; description?: string }) {
    return this.request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolio(id: string, updates: Record<string, unknown>) {
    return this.request(`/portfolios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deletePortfolio(id: string) {
    return this.request(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  // Cards endpoints
  async getCards(params?: Record<string, string>) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/cards${query}`);
  }

  async getCard(id: string) {
    return this.request(`/cards/${id}`);
  }

  async searchCards(query: string, filters?: Record<string, unknown>) {
    return this.request('/cards/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  async getTrendingCards() {
    return this.request('/cards/trending');
  }

  // Market endpoints
  async getMarketData() {
    return this.request('/market/data');
  }

  async getCardMarketData(cardId: string) {
    return this.request(`/market/cards/${cardId}`);
  }

  // Trading endpoints
  async getActiveTrades() {
    return this.request('/trades/active');
  }

  async getTradeHistory() {
    return this.request('/trades/history');
  }

  async createTrade(tradeData: Record<string, unknown>) {
    return this.request('/trades', {
      method: 'POST',
      body: JSON.stringify(tradeData),
    });
  }

  async cancelTrade(tradeId: string) {
    return this.request(`/trades/${tradeId}/cancel`, {
      method: 'POST',
    });
  }

  // Trade offers endpoints
  async getPendingOffers() {
    return this.request('/trade-offers/pending');
  }

  async createTradeOffer(offerData: Record<string, unknown>) {
    return this.request('/trade-offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  async acceptTradeOffer(offerId: string) {
    return this.request(`/trade-offers/${offerId}/accept`, {
      method: 'POST',
    });
  }

  async rejectTradeOffer(offerId: string) {
    return this.request(`/trade-offers/${offerId}/reject`, {
      method: 'POST',
    });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'POST',
    });
  }

  // Analytics endpoints
  async getUserAnalytics() {
    return this.request('/analytics/user');
  }

  async getPortfolioAnalytics(portfolioId: string) {
    return this.request(`/analytics/portfolio/${portfolioId}`);
  }
}

// Create default client instance
export const apiClient = new ApiClient({
  baseUrl: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001/api',
});

// WebSocket client for real-time updates
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  constructor(private url: string) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        
        // Send auth token if available
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('accessToken') 
          : null;
        
        if (token) {
          this.send('auth', { token });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleMessage(message: { type: string; data: unknown }) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(listener => listener(message.data));
    }
  }

  send(type: string, data: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  subscribe(type: string, listener: (data: unknown) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create default WebSocket client
export const wsClient = new WebSocketClient(
  process.env['NEXT_PUBLIC_WS_URL'] || 'ws://localhost:3001'
);
