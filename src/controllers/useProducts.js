// src/controllers/useProducts.js
import { useState, useEffect } from 'react';
import { supabase } from '../models/supabaseClient';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            base_price,
            sale_price,
            is_featured,
            is_active,
            brands (name, is_own_brand),
            categories (name, slug),
            product_images (image_url, is_cover),
            product_variants (id, size, color, stock)
          `)
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Normalizar estructura
        const formatted = (data || []).map((p) => {
          const cover = p.product_images?.find((img) => img.is_cover)?.image_url 
            || p.product_images?.[0]?.image_url 
            || '';
          return {
            id: p.id,
            name: p.name,
            brand: p.brands?.name || 'Pulso',
            category: p.categories?.slug || '',
            price: Number(p.base_price),
            originalPrice: p.sale_price ? Number(p.sale_price) : null,
            image: cover,
            isPulsoOriginal: p.brands?.is_own_brand || false,
            variants: p.product_variants || []
          };
        });

        setProducts(formatted);
      } catch (err) {
        console.error('Error cargando catálogo en Home:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'pulso') return p.isPulsoOriginal;
    return p.category === activeTab;
  });

  return { products: filteredProducts, loading, activeTab, setActiveTab };
};