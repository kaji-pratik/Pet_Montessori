import pool from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    
    const products = rows.map(prod => ({
      ...prod,
      price: parseFloat(prod.price),
      rating: parseFloat(prod.rating),
      stock: parseInt(prod.stock)
    }));

    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error fetching products.', error: error.message });
  }
};

export const saveProduct = async (req, res) => {
  const product = req.body;
  const { id, name, type, category, price, rating, stock, image, description } = product;

  if (!name || !type || !category || !price || stock === undefined) {
    return res.status(400).json({ message: 'Name, type, category, price, and stock are required.' });
  }

  try {
    if (id) {
      // Update
      const [result] = await pool.query(
        `UPDATE products SET name=?, type=?, category=?, price=?, rating=?, stock=?, image=?, description=? WHERE id=?`,
        [name, type, category, price, rating || 5.0, stock, image, description || '', id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      return res.json({ message: 'Product updated successfully.', product });
    } else {
      // Create
      const newId = 'prod-' + Date.now();
      await pool.query(
        `INSERT INTO products (id, name, type, category, price, rating, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newId, name, type, category, price, rating || 5.0, stock, image, description || '']
      );

      const createdProduct = { ...product, id: newId, rating: rating || 5.0 };
      return res.status(201).json(createdProduct);
    }
  } catch (error) {
    console.error('Error saving product:', error);
    return res.status(500).json({ message: 'Server error saving product.', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Server error deleting product.', error: error.message });
  }
};
