import pool from '../config/db.js';

export const getDonations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM donations ORDER BY date DESC');
    const donations = rows.map(d => ({
      ...d,
      amount: parseFloat(d.amount)
    }));
    return res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({ message: 'Server error fetching donations.', error: error.message });
  }
};

export const saveDonation = async (req, res) => {
  const donation = req.body;
  const { id, amount, paymentGateway, paymentStatus, donorName, donorEmail, message } = donation;

  if (!amount || !paymentGateway || !donorName || !donorEmail) {
    return res.status(400).json({ message: 'Amount, payment gateway, and donor contact details are required.' });
  }

  try {
    const userId = req.user ? req.user.id : null;
    const newId = id || 'don-' + Date.now();
    const finalPaymentStatus = paymentStatus || 'Pending';

    await pool.query(
      `INSERT INTO donations (id, userId, amount, paymentGateway, paymentStatus, donorName, donorEmail, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, userId, amount, paymentGateway, finalPaymentStatus, donorName, donorEmail, message || '']
    );

    const createdDonation = { ...donation, id: newId, userId, paymentStatus: finalPaymentStatus };
    return res.status(201).json(createdDonation);
  } catch (error) {
    console.error('Error saving donation:', error);
    return res.status(500).json({ message: 'Server error saving donation.', error: error.message });
  }
};
