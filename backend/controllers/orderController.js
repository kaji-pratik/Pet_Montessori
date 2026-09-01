import pool from '../config/db.js';

export const getOrders = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    
    const orders = rows.map(o => ({
      ...o,
      items: JSON.parse(o.items || '[]'),
      totalAmount: parseFloat(o.totalAmount)
    }));

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Server error fetching orders.', error: error.message });
  }
};

export const saveOrder = async (req, res) => {
  const order = req.body;
  const { id, items, totalAmount, paymentGateway, paymentStatus, status, buyerName, buyerEmail, buyerPhone, address, txnId, type } = order;

  if (!items || !totalAmount || !paymentGateway || !buyerName || !buyerEmail || !buyerPhone || !address || !txnId) {
    return res.status(400).json({ message: 'Required order details are missing.' });
  }

  try {
    const userId = req.user ? req.user.id : null;
    const itemsStr = JSON.stringify(items);

    // Check if order exists by ID or txnId
    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ? OR txnId = ?', [id || '', txnId || '']);

    if (existing.length > 0) {
      // Update
      const record = existing[0];
      await pool.query(
        `UPDATE orders SET items=?, totalAmount=?, paymentGateway=?, paymentStatus=?, status=?, buyerName=?, buyerEmail=?, buyerPhone=?, address=?, type=? WHERE id=?`,
        [itemsStr, totalAmount, paymentGateway, paymentStatus || record.paymentStatus, status || record.status, buyerName, buyerEmail, buyerPhone, address, type || 'accessory', record.id]
      );
      return res.json({ message: 'Order updated successfully.', order });
    } else {
      // Insert
      const newId = id || 'ord-' + Date.now();
      const finalStatus = status || 'Pending';
      const finalPaymentStatus = paymentStatus || 'Pending';

      await pool.query(
        `INSERT INTO orders (id, userId, items, totalAmount, paymentGateway, paymentStatus, status, buyerName, buyerEmail, buyerPhone, address, txnId, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newId, userId, itemsStr, totalAmount, paymentGateway, finalPaymentStatus, finalStatus, buyerName, buyerEmail, buyerPhone, address, txnId, type || 'accessory']
      );

      const createdOrder = { ...order, id: newId, userId, status: finalStatus, paymentStatus: finalPaymentStatus };
      return res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Error saving order:', error);
    return res.status(500).json({ message: 'Server error saving order.', error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ message: 'Server error deleting order.', error: error.message });
  }
};
