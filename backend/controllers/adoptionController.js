import pool from '../config/db.js';

export const getAdoptionRequests = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM adoption_requests ORDER BY date DESC');
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching adoptions:', error);
    return res.status(500).json({ message: 'Server error fetching adoptions.', error: error.message });
  }
};

export const saveAdoptionRequest = async (req, res) => {
  const reqData = req.body;
  const { id, petId, petName, applicantName, applicantEmail, applicantPhone, applicantAddress, experience, homeType, status } = reqData;

  if (!petId || !petName || !applicantName || !applicantEmail || !applicantPhone || !applicantAddress) {
    return res.status(400).json({ message: 'Required applicant fields are missing.' });
  }

  try {
    const userId = req.user ? req.user.id : null;

    // Check if exists
    const [existing] = await pool.query('SELECT * FROM adoption_requests WHERE id = ?', [id || '']);

    if (existing.length > 0) {
      // Update
      await pool.query(
        `UPDATE adoption_requests SET status=? WHERE id=?`,
        [status || 'Pending', id]
      );
      return res.json({ message: 'Adoption request updated.', request: { ...existing[0], status } });
    } else {
      // Insert
      const newId = 'adr-' + Date.now();
      await pool.query(
        `INSERT INTO adoption_requests (id, petId, petName, applicantName, applicantEmail, applicantPhone, applicantAddress, experience, homeType, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newId, petId, petName, applicantName, applicantEmail, applicantPhone, applicantAddress, experience || '', homeType || '', status || 'Pending', userId]
      );

      const createdReq = { ...reqData, id: newId, userId, status: status || 'Pending' };
      return res.status(201).json(createdReq);
    }
  } catch (error) {
    console.error('Error saving adoption request:', error);
    return res.status(500).json({ message: 'Server error saving adoption request.', error: error.message });
  }
};
