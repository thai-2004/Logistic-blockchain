// frontend/src/hooks/useShipments.js
import { useState, useEffect } from 'react';
import { shipmentAPI } from '../services/api';

export const useShipments = (params = {}) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchShipments = async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Filter out empty status parameter
      const filteredParams = { ...params, ...newParams };
      if (filteredParams.status === '') {
        delete filteredParams.status;
      }
      
      const response = await shipmentAPI.getAllShipments(filteredParams);
      setShipments(response.data.shipments);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return {
    shipments,
    loading,
    error,
    pagination,
    refetch: fetchShipments
  };
};

export const useShipment = (id) => {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShipment = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await shipmentAPI.getShipment(id);
      setShipment(response.data.shipment);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch shipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  return { shipment, loading, error, refetch: fetchShipment };
};

export const useShipmentStats = (period = 'all') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await shipmentAPI.getStats(period);
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return { stats, loading, error, refetch: fetchStats };
};