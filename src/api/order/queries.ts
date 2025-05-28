import { createMutation, createQuery } from 'react-query-kit';
import { getOrderById, getOrders, updateOrderStatus, updatePaymentStatus, updateShippingStatus } from './requests';
import type { IOrder, IOrderQuery, IOrderResponse } from './types';

export const useOrdersQuery = createQuery<IOrderResponse, Partial<IOrderQuery>>({
  queryKey: ['admin/orders'],
  fetcher: (params) => getOrders(params),
});

export const useOrderByIdQuery = createQuery<IOrder, string>({
  queryKey: ['order'],
  fetcher: (id) => getOrderById(id),
});

export const useUpdateOrderStatusMutation = createMutation<IOrder, { id: string; status: string; note: string }>({
  mutationFn: ({ id, note }) => updateOrderStatus({ id,  note }),
});

// Add new mutations for shipping and payment status
export const useUpdateShippingStatusMutation = createMutation<
  IOrder,
  { id: string; status: string; userNote: string; shipperOfProof: string[] }
>({
  mutationFn: ({ id, status, shipperOfProof, userNote }) => updateShippingStatus({ id, status, userNote, shipperOfProof }),
});

export const useUpdatePaymentStatusMutation = createMutation<IOrder, { id: string; status: string }>({
  mutationFn: ({ id, status }) => updatePaymentStatus({ id, status }),
});
