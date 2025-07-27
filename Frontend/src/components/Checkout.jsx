import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [error, setError] = useState('');
  const total = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      setError('Your cart is empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, paymentMethod }),
      });

      if (!response.ok) throw new Error('Checkout failed');

      const result = await response.json();
      clearCart();
      navigate(`/order-confirmation/${result.orderId}`); // User confirmation route
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {cartItems.length > 0 ? (
          <>
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border rounded p-4 shadow">
                  <img
                    src={item.product.image_url || '/placeholder.jpg'}
                    alt={item.product.product_name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{item.product.product_name}</h4>
                    <p className="text-gray-600 text-sm">
                      Size: {item.variant.size} | Color: {item.variant.color}
                    </p>
                    <p className="text-black font-semibold">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
              </select>
            </div>

            <div className="mt-8 text-right">
              <p className="text-xl font-semibold mb-4">Total: ${total.toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Place Order
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">Your cart is empty. <button onClick={() => navigate('/Cart')} className="text-blue-600 underline">Go to Cart</button></p>
        )}
      </div>
    </div>
  );
}