import pool from '../config/db.js';

export const getNotifications = async (req, res) => {
  const userId = req.user ? req.user.id : 'all';

  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE userId = ? OR userId = "all" ORDER BY date DESC',
      [userId]
    );
    
    // Map database is_read to camelCase read to match frontend JS
    const notifications = rows.map(n => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.message,
      date: n.date,
      read: !!n.is_read // Convert 1/0 to true/false
    }));

    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Server error fetching notifications.', error: error.message });
  }
};

export const createNotification = async (req, res) => {
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ message: 'UserId, title, and message are required.' });
  }

  try {
    const id = 'not-' + Date.now();
    await pool.query(
      'INSERT INTO notifications (id, userId, title, message, is_read) VALUES (?, ?, ?, ?, FALSE)',
      [id, userId, title, message]
    );

    return res.status(201).json({ id, userId, title, message, read: false, date: new Date().toISOString() });
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ message: 'Server error creating notification.', error: error.message });
  }
};

export const markNotificationsRead = async (req, res) => {
  const userId = req.user ? req.user.id : req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required.' });
  }

  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE userId = ? OR userId = "all"',
      [userId]
    );
    return res.json({ message: 'Notifications marked as read.' });
  } catch (error) {
    console.error('Error marking notifications read:', error);
    return res.status(500).json({ message: 'Server error marking notifications read.', error: error.message });
  }
};
