import { queryOptions } from '@tanstack/react-query';
import { getMyReservations, getReservations, getRooms } from 'pages/remotes';

export const roomKeys = {
  all: ['rooms'],
};

export const reservationKeys = {
  all: ['reservations'],
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (date: string) => [...reservationKeys.details(), date] as const,
};

export const myReservationKeys = {
  all: ['myReservations'],
};

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: roomKeys.all,
    queryFn: getRooms,
  });

export const reservationsQueryOptions = (date: string) =>
  queryOptions({
    queryKey: reservationKeys.detail(date),
    queryFn: () => getReservations(date),
    enabled: !!date,
  });

export const myReservationsQueryOptions = () =>
  queryOptions({
    queryKey: myReservationKeys.all,
    queryFn: getMyReservations,
  });
