import pool from '../config/db.js';

export const getBookings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY date DESC');
    
    const bookings = rows.map(b => ({
      ...b,
      daysCount: parseInt(b.daysCount),
      totalCost: parseFloat(b.totalCost)
    }));

    return res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Server error fetching bookings.', error: error.message });
  }
};

export const saveBooking = async (req, res) => {
  const booking = req.body;
  const { id, petName, petType, breed, age, checkIn, checkOut, daysCount, totalCost, ownerName, ownerPhone, ownerEmail, specialInstructions, paymentGateway, paymentStatus, status } = booking;

  if (!petName || !petType || !breed || !age || !checkIn || !checkOut || !ownerName || !ownerPhone || !ownerEmail || !paymentGateway) {
    return res.status(400).json({ message: 'Required fields are missing.' });
  }

  try {
    const userId = req.user ? req.user.id : null;

    // Check if ID exists -> Update
    const [existing] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    if (existing.length > 0) {
      // Update
      await pool.query(
        `UPDATE bookings SET petName=?, petType=?, breed=?, age=?, checkIn=?, checkOut=?, daysCount=?, totalCost=?, ownerName=?, ownerPhone=?, ownerEmail=?, specialInstructions=?, paymentGateway=?, paymentStatus=?, status=? WHERE id=?`,
        [petName, petType, breed, age, checkIn, checkOut, daysCount, totalCost, ownerName, ownerPhone, ownerEmail, specialInstructions || '', paymentGateway, paymentStatus || 'Pending', status || 'Pending', id]
      );
      return res.json({ message: 'Booking updated successfully.', booking });
    } else {
      // Insert
      const newId = id || 'bk-' + Date.now();
      const finalStatus = status || 'Pending';
      const finalPaymentStatus = paymentStatus || 'Pending';

      await pool.query(
        `INSERT INTO bookings (id, userId, petName, petType, breed, age, checkIn, checkOut, daysCount, totalCost, ownerName, ownerPhone, ownerEmail, specialInstructions, paymentGateway, paymentStatus, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newId, userId, petName, petType, breed, age, checkIn, checkOut, daysCount, totalCost, ownerName, ownerPhone, ownerEmail, specialInstructions || '', paymentGateway, finalPaymentStatus, finalStatus]
      );

      const createdBooking = { ...booking, id: newId, userId, status: finalStatus, paymentStatus: finalPaymentStatus };
      return res.status(201).json(createdBooking);
    }
  } catch (error) {
    console.error('Error saving booking:', error);
    return res.status(500).json({ message: 'Server error saving booking.', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    return res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ message: 'Server error deleting booking.', error: error.message });
  }
};
