// src/controllers/useAdminDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../models/admin.service';
import { supabase } from '../models/supabaseClient';

export const useAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ totalSales: 0, totalOrdersCount: 0, totalCustomers: 0, totalProducts: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [settings, setSettings] = useState(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [m, o, p, c, b, s] = await Promise.all([
        adminService.getDashboardMetrics(),
        adminService.getRecentOrders(50),
        adminService.getProductsWithInventory(),
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('brands').select('*').order('name'),
        adminService.getSettings()
      ]);

      setMetrics(m);
      setOrders(o || []);
      setProducts(p || []);
      setCategories(c.data || []);
      setBrands(b.data || []);
      setSettings(s);
    } catch (err) {
      console.error('Error al sincronizar datos del panel:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateOrderStatus = async (orderId, newStatus, extraData = {}) => {
    await adminService.updateOrderStatus(orderId, newStatus, extraData);
    await refreshData();
  };

  return {
    activeSection,
    setActiveSection,
    loading,
    metrics,
    orders,
    products,
    categories,
    brands,
    settings,
    refreshData,
    updateOrderStatus
  };
};