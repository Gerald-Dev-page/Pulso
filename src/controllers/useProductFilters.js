// src/controllers/useProductFilters.js
import { useState, useMemo } from 'react';
import { FEATURED_PRODUCTS } from '../models/store.data';

export const useProductFilters = () => {
  const [activeTab, setActiveTab] = useState('todos');

  const filteredProducts = useMemo(() => {
    if (activeTab === 'todos') return FEATURED_PRODUCTS;
    if (activeTab === 'pulso') return FEATURED_PRODUCTS.filter((p) => p.isPulsoOriginal);
    return FEATURED_PRODUCTS.filter((p) => p.category === activeTab);
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    products: filteredProducts
  };
};