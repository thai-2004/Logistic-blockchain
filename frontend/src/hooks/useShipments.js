// frontend/src/hooks/useShipments.js
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { shipmentAPI } from '@services/api';

export const useShipments = (params = {}) => {
  const normalizedParams = useMemo(() => {
    const cleaned = { ...params };
    if (cleaned.status === '') {
      delete cleaned.status;
    }
    if (cleaned.customer) {
      cleaned.customer =
        typeof cleaned.customer === 'string'
          ? cleaned.customer.toLowerCase()
          : cleaned.customer;
    }
    return cleaned;
  }, [params]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['shipments', normalizedParams],
    queryFn: async () => {
      const filteredParams = normalizedParams;
      let response;
      if (filteredParams.customer) {
        const { customer, ...rest } = filteredParams;
        response = await shipmentAPI.getShipmentsByCustomer(customer, rest);
      } else {
        response = await shipmentAPI.getAllShipments(filteredParams);
      }
      return {
        shipments: response.data.shipments || [],
        pagination: response.data.pagination || {},
      };
    },
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });

  return {
    shipments: data?.shipments || [],
    pagination: data?.pagination || {},
    loading: isLoading || isFetching,
    error: error ? (error.response?.data?.error || error.message) : null,
    refetch,
  };
};

export const useShipment = (id) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    enabled: !!id,
    queryKey: ['shipment', id],
    queryFn: async () => {
      const response = await shipmentAPI.getShipment(id);
      return response.data.shipment;
    },
    staleTime: 60 * 1000,
  });

  return {
    shipment: data || null,
    loading: isLoading || isFetching,
    error: error ? (error.response?.data?.error || error.message) : null,
    refetch,
  };
};

export const useShipmentStats = (period = 'all') => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['shipment-stats', period],
    queryFn: async () => {
      const response = await shipmentAPI.getStats(period);
      return response.data.stats;
    },
    staleTime: 60 * 1000,
  });

  return {
    stats: data || null,
    loading: isLoading || isFetching,
    error: error ? (error.response?.data?.error || error.message) : null,
    refetch,
  };
};