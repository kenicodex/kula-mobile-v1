import api from './api';

export type MenuItemAvailability = 'available' | 'unavailable' | 'archived';

export interface MenuItem {
  id: string;
  creatorId: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  imageUrl?: string | null;
  category?: string | null;
  availability: MenuItemAvailability;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertMenuItemPayload {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  category?: string;
  availability?: MenuItemAvailability;
  sortOrder?: number;
}

export const menuService = {
  listByCreator(creatorId: string, includeUnavailable = false) {
    return api
      .get<MenuItem[]>(`/menu/creators/${creatorId}/items`, {
        params: includeUnavailable ? { includeUnavailable: 'true' } : undefined,
      })
      .then((r) => r.data);
  },

  listMine() {
    return api.get<MenuItem[]>('/menu/items').then((r) => r.data);
  },

  create(payload: UpsertMenuItemPayload) {
    return api.post<MenuItem>('/menu/items', payload).then((r) => r.data);
  },

  update(id: string, payload: Partial<UpsertMenuItemPayload>) {
    return api.patch<MenuItem>(`/menu/items/${id}`, payload).then((r) => r.data);
  },

  setAvailability(id: string, availability: MenuItemAvailability) {
    return api
      .patch<MenuItem>(`/menu/items/${id}/availability`, { availability })
      .then((r) => r.data);
  },

  delete(id: string) {
    return api.delete(`/menu/items/${id}`).then((r) => r.data);
  },
};
