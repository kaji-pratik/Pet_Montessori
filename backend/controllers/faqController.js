import pool from '../config/db.js';

export const getFAQs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faqs ORDER BY created_at ASC');
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return res.status(500).json({ message: 'Server error fetching FAQs.', error: error.message });
  }
};

export const saveFAQ = async (req, res) => {
  const faq = req.body;
  const { id, question, answer } = faq;

  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and answer are required.' });
  }

  try {
    if (id) {
      // Update
      const [result] = await pool.query(
        `UPDATE faqs SET question=?, answer=? WHERE id=?`,
        [question, answer, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'FAQ not found.' });
      }
      return res.json({ message: 'FAQ updated.', faq });
    } else {
      // Insert
      const newId = 'faq-' + Date.now();
      await pool.query(
        `INSERT INTO faqs (id, question, answer) VALUES (?, ?, ?)`,
        [newId, question, answer]
      );
      const createdFaq = { ...faq, id: newId };
      return res.status(201).json(createdFaq);
    }
  } catch (error) {
    console.error('Error saving FAQ:', error);
    return res.status(500).json({ message: 'Server error saving FAQ.', error: error.message });
  }
};

export const deleteFAQ = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM faqs WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    return res.json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return res.status(500).json({ message: 'Server error deleting FAQ.', error: error.message });
  }
};
