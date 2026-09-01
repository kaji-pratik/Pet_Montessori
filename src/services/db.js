// Database Service for Pet Montessori using backend REST APIs
import { auth } from './auth';

const API_BASE = 'http://localhost:5000/api';

class PetMontessoriDB {
  // Pets
  async getPets() {
    try {
      const response = await fetch(`${API_BASE}/pets`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  }

  async savePet(pet) {
    try {
      const response = await fetch(`${API_BASE}/pets`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(pet)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving pet:', error);
      throw error;
    }
  }

  async deletePet(id) {
    try {
      const response = await fetch(`${API_BASE}/pets/${id}`, {
        method: 'DELETE',
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  }

  // Accessories / Shop
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async saveProduct(product) {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(product)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Testimonials
  async getTestimonials() {
    try {
      const response = await fetch(`${API_BASE}/testimonials`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  }

  async saveTestimonial(testimonial) {
    try {
      const response = await fetch(`${API_BASE}/testimonials`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(testimonial)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      throw error;
    }
  }

  async deleteTestimonial(id) {
    try {
      const response = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  }

  // FAQs
  async getFAQs() {
    try {
      const response = await fetch(`${API_BASE}/faqs`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  async saveFAQ(faq) {
    try {
      const response = await fetch(`${API_BASE}/faqs`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(faq)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      throw error;
    }
  }

  async deleteFAQ(id) {
    try {
      const response = await fetch(`${API_BASE}/faqs/${id}`, {
        method: 'DELETE',
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }

  // Bookings
  async getBookings() {
    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async saveBooking(booking) {
    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(booking)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  async deleteBooking(id) {
    try {
      const response = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'DELETE',
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Orders
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async saveOrder(order) {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      const response = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Adoption Requests
  async getAdoptionRequests() {
    try {
      const response = await fetch(`${API_BASE}/adoptions`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
      throw error;
    }
  }

  async saveAdoptionRequest(req) {
    try {
      const response = await fetch(`${API_BASE}/adoptions`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(req)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving adoption request:', error);
      throw error;
    }
  }

  // Notifications
  async getNotifications() {
    try {
      const response = await fetch(`${API_BASE}/notifications`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async createNotification(notif) {
    try {
      const response = await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(notif)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markNotificationsRead(userId) {
    try {
      const response = await fetch(`${API_BASE}/notifications/read`, {
        method: 'PUT',
        headers: auth.getHeaders(),
        body: JSON.stringify({ userId })
      });
      return await response.json();
    } catch (error) {
      console.error('Error marking notifications read:', error);
      throw error;
    }
  }

  // Analytics for Admin
  async getAnalytics() {
    try {
      const response = await fetch(`${API_BASE}/analytics`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // General Donations (Additional support)
  async saveDonation(donation) {
    try {
      const response = await fetch(`${API_BASE}/donations`, {
        method: 'POST',
        headers: auth.getHeaders(),
        body: JSON.stringify(donation)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving donation:', error);
      throw error;
    }
  }

  async getDonations() {
    try {
      const response = await fetch(`${API_BASE}/donations`, {
        headers: auth.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  }
}

export const db = new PetMontessoriDB();
export default db;
