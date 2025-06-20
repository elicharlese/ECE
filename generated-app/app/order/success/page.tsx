'use client';

import { useState, useEffect } from 'react';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOrder = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const orderId = urlParams.get('order_id');

      if (!sessionId && !orderId) {
        window.location.href = '/order';
        return;
      }

      try {
        const response = await fetch(`/api/orders/create?${sessionId ? `sessionId=${sessionId}` : `orderId=${orderId}`}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Order fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Successful!
          </h1>
          <p className="text-xl text-gray-300">
            Your app development order has been placed successfully.
            {order?.status === 'completed' && ' Your trading card will be generated soon!'}
          </p>
        </div>

        {order && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-white font-mono">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">App Name:</span>
                <span className="text-white">{order.appName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Framework:</span>
                <span className="text-white">{order.framework}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount:</span>
                <span className="text-teal-400 text-xl font-bold">${order.totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-gray-700 rounded-xl text-white hover:bg-gray-600 transition-all"
          >
            View Dashboard
          </button>
          <button
            onClick={() => window.location.href = '/marketplace'}
            className="px-8 py-3 bg-teal-500 rounded-xl text-white hover:bg-teal-600 transition-all"
          >
            Explore Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}
