import db from '../models/index.js';

const checkoutController = {
  async processCheckout(req) {
    const { items, paymentMethod } = req.body;
    const { id: userId, role } = req.user; // Extract from JWT

    if (!items || items.length === 0) {
      throw new Error('Cart is empty');
    }

    const validPaymentMethods = ['Cash', 'Credit Card', 'Paypal'];
    const normalizedPaymentMethod = validPaymentMethods.includes(paymentMethod)
      ? paymentMethod
      : 'Cash';
    if (normalizedPaymentMethod !== paymentMethod) {
      console.warn(`Invalid payment method '${paymentMethod}' converted to 'Cash'`);
    }

    const result = await db.sequelize.transaction(async (t) => {
      const customer_id = role === 'user' ? userId : null; // Customer ID for users
      const employee_id = role === 'admin' ? userId : null; // Employee ID for admins

      const order = await db.Order.create(
        {
          customer_id, // Use authenticated user ID
          employee_id,
          total_amount: items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0),
        },
        { transaction: t }
      );

      const orderItems = await db.Order_Item.bulkCreate(
        items.map((item) => ({
          order_id: order.order_id,
          product_id: item.product.product_id,
          variant_id: item.variant.variant_id,
          quantity: item.quantity,
          unit_price: item.variant.price,
        })),
        { transaction: t }
      );

      for (const item of items) {
        const inventory = await db.Inventory.findOne({
          where: { product_id: item.product.product_id, variant_id: item.variant.variant_id },
        });
        if (inventory) {
          if (inventory.quantity < item.quantity) {
            throw new Error('Insufficient inventory for ' + item.product.product_name);
          }
          await inventory.update(
            { quantity: inventory.quantity - item.quantity },
            { transaction: t }
          );
        }
      }

      await db.Payment.create({
        order_id: order.order_id,
        amount: order.total_amount,
        payment_method: normalizedPaymentMethod,
        status: 'Pending',
      }, { transaction: t });

      return { orderId: order.order_id };
    });

    return result;
  }
};

export default checkoutController;