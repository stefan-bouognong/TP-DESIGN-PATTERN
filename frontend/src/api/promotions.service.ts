import api from './index.service';

export const promotionsService = {
  // Appliquer une promotion de clearance aux véhicules
  applyClearance: async (days: number, discount: number) => {
    const response = await api.post(`/promotions/clearance?days=${days}&discount=${discount}`);
    return response.data;
  },

  // Optionnel: Endpoint pour appliquer une promotion spécifique à un véhicule
  applyPromotionToVehicle: async (vehicleId: number, discount: number) => {
    const response = await api.put(`/vehicles/${vehicleId}/promotion`, { discount });
    return response.data;
  },

  // Optionnel: Retirer une promotion d'un véhicule
  removePromotionFromVehicle: async (vehicleId: number) => {
    const response = await api.delete(`/vehicles/${vehicleId}/promotion`);
    return response.data;
  }
};