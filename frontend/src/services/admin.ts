import api from '@/lib/axios';
import { User, Charity } from '@/types';

export const adminService = {
  async getUsers() {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async addCharity(data: Partial<Charity>) {
    const response = await api.post('/charities', data);
    return response.data;
  },

  async toggleUserStatus(userId: number) {
    const response = await api.post(`/users/${userId}/toggle-status`);
    return response.data;
  }
};
