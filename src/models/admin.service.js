// src/models/admin.service.js
import { supabase } from './supabaseClient';

export const adminService = {
  // 1. Dashboard: Métricas rápidas
  async getDashboardMetrics() {
    const [{ data: orders }, { count: totalProducts }, { count: totalCustomers }] = await Promise.all([
      supabase.from('orders').select('id, total, status, created_at'),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true })
    ]);

    const totalSales = (orders || [])
      .filter(o => o.status !== 'cancelado')
      .reduce((acc, curr) => acc + Number(curr.total || 0), 0);

    const totalOrdersCount = orders ? orders.length : 0;

    return {
      totalSales,
      totalOrdersCount,
      totalCustomers: totalCustomers || 0,
      totalProducts: totalProducts || 0
    };
  },

  // 2. Pedidos Recientes
  async getRecentOrders(limit = 6) {
    const { data, error } = await supabase
      .from('orders')
      .select('id, customer_name, total, status, created_at, payment_method, transfer_receipt_url')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // 3. Productos y Variantes completos
  async getProductsWithInventory() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        base_price,
        sale_price,
        is_active,
        categories (id, name, slug),
        brands (id, name, is_own_brand),
        product_images (id, image_url, is_cover, display_order),
        product_variants (id, size, color, stock, min_stock_alert, sku)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 4. Cambiar Estado de Pedido (Confirmar Pago, Despachar, etc.)
  async updateOrderStatus(orderId, newStatus, shippingData = {}) {
    const updates = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      ...shippingData
    };

    if (newStatus === 'pagado') {
      updates.payment_verified_at = new Date().toISOString();
    }
    if (newStatus === 'enviado') {
      updates.shipped_at = new Date().toISOString();
    }
    if (newStatus === 'entregado') {
      updates.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

// 5. Configuración de la tienda protegida contra error 406
  async getSettings() {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Advertencia al consultar store_settings:', error.message);
      return {
        bank_name: 'Banco Galicia',
        bank_account_holder: 'Pulso Deportes',
        bank_alias: 'PULSO.DEPORTES.OFICIAL',
        bank_cbu: '',
        bank_cuit: ''
      };
    }
    return data;
  },
};