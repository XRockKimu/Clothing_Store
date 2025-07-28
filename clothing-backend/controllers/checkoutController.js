const processCheckout = async (req, res) => {
  const { items, paymentMethod } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Example logic (replace with Sequelize)
    const orderId = Math.floor(Math.random() * 100000); // mock orderId

    console.log(`User ${userId} placed order with`, { items, paymentMethod });

    return res.status(200).json({ success: true, orderId });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error.name === 'SequelizeDatabaseError' && error.parent?.code === 'WARN_DATA_TRUNCATED') {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    return res.status(500).json({ error: error.message || 'Failed to process order' });
  }
};

export default { processCheckout };
