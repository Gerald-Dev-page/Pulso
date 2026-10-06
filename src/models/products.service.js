import { supabase } from './supabaseClient';

export const productsService = {
  // Obtener productos destacados con su marca, categoría y fotos
  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        base_price,
        sale_price,
        is_featured,
        brands (
          name,
          slug,
          is_own_brand
        ),
        categories (
          name,
          slug
        ),
        product_images (
          image_url,
          alt_text,
          is_cover
        ),
        product_variants (
          id,
          sku,
          size,
          color,
          stock
        )
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al consultar productos destacados:', error);
      throw error;
    }

    return data;
  },

  // Obtener todos los productos filtrados por slug de categoría
  async getProductsByCategory(categorySlug) {
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        base_price,
        sale_price,
        brands (name, is_own_brand),
        categories!inner (name, slug),
        product_images (image_url, is_cover)
      `)
      .eq('is_active', true);

    if (categorySlug && categorySlug !== 'todos') {
      query = query.eq('categories.slug', categorySlug);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
};