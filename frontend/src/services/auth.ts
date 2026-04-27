import api from '@/lib/axios';
import { AuthResponse } from '@/types';

export const authService = {
  async login(formData: FormData) {
    const response = await api.post<AuthResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  async signup(data: any) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }
};
