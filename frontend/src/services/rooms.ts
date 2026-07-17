import { fetchApi } from '../lib/api';

export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  district: string;
  amenities: string[];
  nearbyUniversities: string[];
  images: string[];
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  createdAt: string;
  isFavorite?: boolean;
  landlord?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

export const getRooms = async (params?: any) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/rooms?${query}`);
};

export const getRoom = async (id: string) => {
  return fetchApi(`/rooms/${id}`);
};

export const createRoom = async (formData: FormData) => {
  return fetchApi('/rooms', {
    method: 'POST',
    body: formData,
  });
};

export const updateRoom = async (id: string, formData: FormData) => {
  return fetchApi(`/rooms/${id}`, {
    method: 'PATCH',
    body: formData,
  });
};

export const deleteRoom = async (id: string) => {
  return fetchApi(`/rooms/${id}`, {
    method: 'DELETE',
  });
};

export const toggleFavorite = async (id: string) => {
  return fetchApi(`/rooms/${id}/favorite`, {
    method: 'POST',
  });
};

export const getFavorites = async () => {
  return fetchApi('/rooms/favorites');
};

export const getStatistics = async () => {
  return fetchApi('/rooms/statistics');
};
