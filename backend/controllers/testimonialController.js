import pool from '../config/db.js';

export const getTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    
    const testimonials = rows.map(t => ({
      ...t,
      rating: parseInt(t.rating)
    }));

    return res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ message: 'Server error fetching testimonials.', error: error.message });
  }
};

export const saveTestimonial = async (req, res) => {
  const testimonial = req.body;
  const { id, name, role, content, rating, avatar } = testimonial;

  if (!name || !role || !content) {
    return res.status(400).json({ message: 'Name, role, and content are required.' });
  }

  try {
    if (id) {
      // Update
      const [result] = await pool.query(
        `UPDATE testimonials SET name=?, role=?, content=?, rating=?, avatar=? WHERE id=?`,
        [name, role, content, rating || 5, avatar || '', id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Testimonial not found.' });
      }
      return res.json({ message: 'Testimonial updated.', testimonial });
    } else {
      // Insert
      const newId = 'test-' + Date.now();
      const defaultAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';
      await pool.query(
        `INSERT INTO testimonials (id, name, role, content, rating, avatar) VALUES (?, ?, ?, ?, ?, ?)`,
        [newId, name, role, content, rating || 5, defaultAvatar]
      );
      const createdTestimonial = { ...testimonial, id: newId, avatar: defaultAvatar };
      return res.status(201).json(createdTestimonial);
    }
  } catch (error) {
    console.error('Error saving testimonial:', error);
    return res.status(500).json({ message: 'Server error saving testimonial.', error: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    return res.json({ message: 'Testimonial deleted successfully.' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ message: 'Server error deleting testimonial.', error: error.message });
  }
};
