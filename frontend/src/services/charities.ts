import api from '@/lib/axios';
import { Charity } from '@/types';

export const charityService = {
  async getAll() {
    const response = await api.get<Charity[]>('/charities');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<Charity>(`/charities/${id}`);
    return response.data;
  },

  async selectCharity(charityId: string, percentage: number) {
    const response = await api.post('/users/select-charity', { 
      charity_id: charityId, 
      contribution_percentage: percentage 
    });
    return response.data;
  }
};
