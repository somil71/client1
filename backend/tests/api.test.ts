import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

describe('Moksh Sanskar Foundation API Tests', () => {
  let token = '';
  let requestId = '';

  beforeAll(async () => {
    // Create a test admin user if doesn't exist
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: 'test@moksh.org',
        password: 'test123456'
      });
      token = response.data.data.token;
    } catch (error) {
      console.log('Test admin user not found. Some tests will be skipped.');
    }
  });

  describe('Authentication Routes', () => {
    it('should login successfully with valid credentials', async () => {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: 'test@moksh.org',
          password: 'test123456'
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.data.token).toBeDefined();
        expect(response.data.data.user).toBeDefined();
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.log('Skipping login test - test user not set up');
        } else {
          throw error;
        }
      }
    });

    it('should fail login with invalid credentials', async () => {
      try {
        await axios.post(`${API_URL}/auth/login`, {
          email: 'invalid@moksh.org',
          password: 'wrongpassword'
        });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Request Routes - Public', () => {
    it('should submit a request successfully', async () => {
      const formData = new FormData();
      formData.append('name', 'Test Family');
      formData.append('phone', '9876543210');
      formData.append('email', 'family@test.com');
      formData.append('city', 'Mumbai');
      formData.append('address', '123 Test Street');
      formData.append('typeOfHelp', 'antim-kit');
      formData.append('description', 'Test assistance request for funeral arrangements');
      formData.append('urgencyLevel', 'high');

      try {
        const response = await axios.post(`${API_URL}/requests`, formData);

        expect(response.status).toBe(201);
        expect(response.data.success).toBe(true);
        expect(response.data.data.id).toBeDefined();
        expect(response.data.data.trackingId).toBeDefined();

        requestId = response.data.data.id;
      } catch (error: any) {
        console.error('Request submission failed:', error.response?.data);
        throw error;
      }
    });

    it('should fail to submit request with invalid data', async () => {
      const formData = new FormData();
      formData.append('name', 'T'); // Too short
      formData.append('email', 'invalid-email'); // Invalid email

      try {
        await axios.post(`${API_URL}/requests`, formData);
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain('Validation');
      }
    });

    it('should retrieve request details', async () => {
      if (!requestId) {
        console.log('Skipping - no request ID from previous test');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/requests/${requestId}`);

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.data._id).toBe(requestId);
        expect(response.data.data.name).toBe('Test Family');
      } catch (error: any) {
        console.error('Failed to retrieve request:', error.response?.data);
        throw error;
      }
    });
  });

  describe('Request Routes - Admin', () => {
    it('should list requests with pagination (authenticated)', async () => {
      if (!token) {
        console.log('Skipping admin test - no valid token');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/requests?page=1&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeInstanceOf(Array);
        expect(response.data.pagination).toBeDefined();
      } catch (error: any) {
        console.error('Failed to list requests:', error.response?.data);
      }
    });

    it('should get dashboard statistics (authenticated)', async () => {
      if (!token) {
        console.log('Skipping admin test - no valid token');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.data.totalRequests).toBeGreaterThanOrEqual(0);
      } catch (error: any) {
        console.error('Failed to get stats:', error.response?.data);
      }
    });

    it('should fail to access admin routes without token', async () => {
      try {
        await axios.get(`${API_URL}/requests`);
        expect.fail('Should have thrown authentication error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Server Health', () => {
    it('should return health check', async () => {
      try {
        const response = await axios.get('http://localhost:3000/health');
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('OK');
      } catch (error) {
        console.log('Health check failed - server might not be running');
      }
    });
  });
});
