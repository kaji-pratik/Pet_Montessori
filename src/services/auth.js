// Authentication Service for Pet Montessori using backend REST APIs
const API_URL = 'http://localhost:5000/api/auth';

const STORAGE_KEYS = {
  CURRENT_USER: 'pet_montessori_current_user',
  TOKEN: 'pet_montessori_token'
};

class AuthService {
  getHeaders() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password. Please try again.');
      }

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      return data.user;
    } catch (err) {
      console.error('Login service error:', err);
      throw err;
    }
  }

  async signup(name, email, password, extra = {}) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: extra.phone || '',
          address: extra.address || ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during registration.');
      }

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      return data.user;
    } catch (err) {
      console.error('Signup service error:', err);
      throw err;
    }
  }

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    return true;
  }

  async updateProfile(updatedData) {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      console.error('Update profile service error:', err);
      throw err;
    }
  }
}

export const auth = new AuthService();
export default auth;
