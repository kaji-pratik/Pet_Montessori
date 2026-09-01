import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import productRoutes from './routes/productRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adoptionRoutes from './routes/adoptionRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Set payload limits high to support base64 photo uploads from the frontend
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test DB Connection and Initialize Schema automatically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    // Test connection
    const connection = await pool.getConnection();
    console.log('MySQL Database connected successfully! 🐾');
    
    // Check if tables exist by searching for the 'users' table
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('Database tables not found. Initializing schema and seed data...');
      
      const schemaPath = path.join(__dirname, 'db_schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Execute the multi-statement SQL script
      await connection.query(schemaSql);
      console.log('Database tables initialized and seeded successfully! 🎉');
    } else {
      console.log('Database tables already exist. Skipping initialization.');
    }
    
    connection.release();
  } catch (error) {
    console.error('CRITICAL: Database initialization failed! Please check MySQL connection details.');
    console.error('Error Details:', error.message);
    console.error('Server is still running, but database endpoints will return 500 errors.');
  }
}

// Routes registration
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/donations', donationRoutes);

// Base route
app.use('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pet Montessori backend is healthy!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await initializeDatabase();
});
