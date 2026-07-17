import { fetchApi } from '../lib/api';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';
  createdAt: string;
  room?: any;
  user?: any;
}

export const createBooking = async (data: { roomId: string; startDate: string; endDate: string; totalPrice: number }) => {
  return fetchApi('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getBookings = async () => {
  return fetchApi('/bookings');
};

export const getBooking = async (id: string) => {
  return fetchApi(`/bookings/${id}`);
};

export const approveBooking = async (id: string) => {
  return fetchApi(`/bookings/${id}/approve`, { method: 'PATCH' });
};

export const rejectBooking = async (id: string) => {
  return fetchApi(`/bookings/${id}/reject`, { method: 'PATCH' });
};

export const cancelBooking = async (id: string) => {
  return fetchApi(`/bookings/${id}/cancel`, { method: 'PATCH' });
};
