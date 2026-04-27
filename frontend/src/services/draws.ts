import api from '@/lib/axios';
import { Draw } from '@/types';

export const drawService = {
  async getLatest() {
    const response = await api.get<Draw[]>('/draws');
    return response.data;
  },

  async runDraw() {
    const response = await api.post<Draw>('/draws/run');
    return response.data;
  }
};
