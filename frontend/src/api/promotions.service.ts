import api from './index.service';

export const promotionsService = {
  // Appliquer une promotion de clearance aux véhicules
  applyClearance: async (days: number, discount: number) => {
    const response = await api.post(`/promotions/clearance?days=${days}&discount=${discount}`);
    return response.data;
  },

};