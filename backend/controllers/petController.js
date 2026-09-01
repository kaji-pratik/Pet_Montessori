import pool from '../config/db.js';

export const getPets = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pets ORDER BY created_at DESC');
    
    // Parse the JSON array string in images
    const pets = rows.map(pet => ({
      ...pet,
      price: parseFloat(pet.price),
      fee: parseFloat(pet.fee),
      images: JSON.parse(pet.images || '[]')
    }));

    return res.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return res.status(500).json({ message: 'Server error fetching pets.', error: error.message });
  }
};

export const savePet = async (req, res) => {
  const pet = req.body;
  const { id, name, type, breed, age, gender, price, fee, vaccination, description, images, status, purpose, ownerName, ownerEmail, ownerPhone } = pet;

  if (!name || !type || !breed || !age || !gender || !vaccination) {
    return res.status(400).json({ message: 'Name, type, breed, age, gender, and vaccination status are required.' });
  }

  try {
    const imagesStr = JSON.stringify(images || []);
    const user_id = req.user ? req.user.id : null;

    if (id) {
      // Update existing pet
      const [result] = await pool.query(
        `UPDATE pets SET name=?, type=?, breed=?, age=?, gender=?, price=?, fee=?, vaccination=?, description=?, images=?, status=?, purpose=?, ownerName=?, ownerEmail=?, ownerPhone=? WHERE id=?`,
        [name, type, breed, age, gender, price || 0, fee || 0, vaccination, description || '', imagesStr, status || 'Pending', purpose || 'adoption', ownerName, ownerEmail, ownerPhone, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Pet not found.' });
      }

      return res.json({ message: 'Pet updated successfully.', pet });
    } else {
      // Create new pet
      const newId = 'pet-' + Date.now();
      const finalStatus = status || 'Pending'; // Admin requests can set status directly

      await pool.query(
        `INSERT INTO pets (id, name, type, breed, age, gender, price, fee, vaccination, description, images, status, purpose, ownerName, ownerEmail, ownerPhone, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newId, name, type, breed, age, gender, price || 0, fee || 0, vaccination, description || '', imagesStr, finalStatus, purpose || 'adoption', ownerName, ownerEmail, ownerPhone, user_id]
      );

      const createdPet = { ...pet, id: newId, status: finalStatus, user_id };
      return res.status(201).json(createdPet);
    }
  } catch (error) {
    console.error('Error saving pet:', error);
    return res.status(500).json({ message: 'Server error saving pet.', error: error.message });
  }
};

export const deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM pets WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pet not found.' });
    }

    return res.json({ message: 'Pet deleted successfully.' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return res.status(500).json({ message: 'Server error deleting pet.', error: error.message });
  }
};
