// src/views/pages/Admin.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingCart,
  CreditCard,
  Truck,
  BarChart3,
  Users,
  Settings,
  ArrowLeft,
  UploadCloud,
  Trash2,
  Plus,
  Star,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../controllers/AuthContext';
import { Login } from './Login';
import { useAdminDashboard } from '../../controllers/useAdminDashboard';
import { storageService } from '../../models/storage.service';
import { supabase } from '../../models/supabaseClient';
import { Toast } from '../components/ui/Toast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import logoPulso from '../../assets/Logo.png';

export const Admin = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    activeSection,
    setActiveSection,
    metrics,
    orders,
    products,
    categories,
    brands,
    settings,
    refreshData,
    updateOrderStatus
  } = useAdminDashboard();

  const [toast, setToast] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, productId: null });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    brandId: '',
    gender: 'unisex',
    basePrice: '',
    salePrice: '',
    isFeatured: true,
    description: ''
  });
  const [productImages, setProductImages] = useState([]);
  const [variants, setVariants] = useState([
    { size: 'M', color: 'Negro', stock: 10, minStock: 3 }
  ]);
  const [uploading, setUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !productForm.categoryId) {
      setProductForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, productForm.categoryId]);

  useEffect(() => {
    if (brands.length > 0 && !productForm.brandId) {
      setProductForm((prev) => ({ ...prev, brandId: brands[0].id }));
    }
  }, [brands, productForm.brandId]);

  if (authLoading) {
    return <div className="min-h-screen bg-[#070707] flex items-center justify-center text-white text-xs">Cargando...</div>;
  }
  if (!user) {
    return <Login />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'new_product', label: 'Nuevo Producto', icon: PlusCircle },
    { id: 'categories', label: 'Categorías', icon: FolderTree },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'pending_payments', label: 'Pagos Pendientes', icon: CreditCard },
    { id: 'stock', label: 'Stock & Inventario', icon: BarChart3 },
    { id: 'shipping', label: 'Envíos & Logística', icon: Truck },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  // Alternar Destacado con feedback visual
  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      const nextStatus = !currentStatus;
      const { error } = await supabase
        .from('products')
        .update({ is_featured: nextStatus })
        .eq('id', productId);
      if (error) throw error;
      await refreshData();
      showToast(nextStatus ? '¡Producto destacado en la Home!' : 'Producto retirado de destacados.');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productImages.length > 4) {
      showToast('Máximo 4 imágenes por producto.', 'error');
      return;
    }
    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setProductImages([...productImages, ...newItems]);
  };

  const removeImage = (idx) => {
    setProductImages(productImages.filter((_, i) => i !== idx));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const slug = newCategoryName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const maxOrder = categories.reduce((max, c) => Math.max(max, c.display_order || 0), 0);
      const { error } = await supabase.from('categories').insert({
        name: newCategoryName.trim(),
        slug,
        is_active: true,
        display_order: maxOrder + 1
      });

      if (error) throw error;
      setNewCategoryName('');
      await refreshData();
      showToast('Categoría creada exitosamente.');
    } catch (err) {
      showToast('Error creando categoría: ' + err.message, 'error');
    } finally {
      setCreatingCategory(false);
    }
  };

  const confirmDeleteProduct = async () => {
    const id = modalState.productId;
    setModalState({ isOpen: false, productId: null });
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await refreshData();
      showToast('Producto eliminado del catálogo.');
    } catch (err) {
      showToast('Error al eliminar: ' + err.message, 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const selectedCatId = productForm.categoryId || categories[0]?.id;
      const selectedBrId = productForm.brandId || brands[0]?.id;

      if (!selectedCatId || !selectedBrId) throw new Error('Selecciona categoría y marca.');

      const slug = productForm.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

      const { data: prod, error: pErr } = await supabase
        .from('products')
        .insert({
          name: productForm.name,
          slug,
          category_id: selectedCatId,
          brand_id: selectedBrId,
          base_price: parseFloat(productForm.basePrice),
          sale_price: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
          gender: productForm.gender,
          is_featured: productForm.isFeatured,
          description: productForm.description
        })
        .select()
        .single();

      if (pErr) throw pErr;

      for (let i = 0; i < productImages.length; i++) {
        const publicUrl = await storageService.uploadProductImage(
          productImages[i].file,
          `${slug}-img-${i + 1}`
        );
        await supabase.from('product_images').insert({
          product_id: prod.id,
          image_url: publicUrl,
          display_order: i + 1,
          is_cover: i === 0
        });
      }

      const varPayload = variants.map((v) => ({
        product_id: prod.id,
        size: v.size.trim(),
        color: v.color.trim() || 'Único',
        stock: parseInt(v.stock, 10) || 0,
        min_stock_alert: parseInt(v.minStock, 10) || 5,
        sku: `${slug}-${v.size}-${v.color}`.toUpperCase().replace(/\s+/g, '')
      }));

      await supabase.from('product_variants').insert(varPayload);

      showToast('¡Producto publicado con éxito!');
      setProductForm({
        name: '',
        categoryId: categories[0]?.id || '',
        brandId: brands[0]?.id || '',
        gender: 'unisex',
        basePrice: '',
        salePrice: '',
        isFeatured: true,
        description: ''
      });
      setProductImages([]);
      setVariants([{ size: 'M', color: 'Negro', stock: 10, minStock: 3 }]);
      await refreshData();
      setActiveSection('products');
    } catch (err) {
      showToast('Error al publicar: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col md:flex-row font-sans">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmModal
        isOpen={modalState.isOpen}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Se borrarán también sus variantes e imágenes asociadas."
        confirmText="Eliminar"
        danger={true}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setModalState({ isOpen: false, productId: null })}
      />

      {/* HEADER SUPERIOR PARA MÓVIL (Hamburguesa) */}
      <div className="md:hidden bg-[#0a0a0a] border-b border-neutral-900 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-neutral-900 text-white"
            aria-label="Abrir navegación de administración"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <img src={logoPulso} alt="Pulso" className="h-6 w-auto object-contain" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--color-pulso-lime)] text-black px-2 py-0.5 rounded">
          Admin
        </span>
      </div>

      {/* SIDEBAR (Desktop fijo / Móvil retráctil) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-neutral-900 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="p-5 border-b border-neutral-900 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoPulso} alt="Pulso Deportes" className="h-7 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[var(--color-pulso-navy)] text-[var(--color-pulso-lime)] border-l-4 border-[var(--color-pulso-lime)]'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-900 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver a la tienda</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 py-1 transition-colors"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY PARA CERRAR EL MENÚ EN MÓVIL AL TOCAR AFUERA */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-xs"
        />
      )}

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden overflow-y-auto">
        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6 md:space-y-8">
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tight">Dashboard General</h1>
              <p className="text-xs text-neutral-400">Estado operativo y comercial en tiempo real.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-[#0f0f0f] border border-neutral-800/80 p-4 md:p-5 rounded-xl">
                <span className="text-[10px] md:text-xs font-bold uppercase text-neutral-400">Ventas</span>
                <p className="text-xl md:text-2xl font-black text-white mt-1 truncate">
                  ${metrics.totalSales.toLocaleString('es-AR')}
                </p>
              </div>
              <div className="bg-[#0f0f0f] border border-neutral-800/80 p-4 md:p-5 rounded-xl">
                <span className="text-[10px] md:text-xs font-bold uppercase text-neutral-400">Pedidos</span>
                <p className="text-xl md:text-2xl font-black text-white mt-1">{metrics.totalOrdersCount}</p>
              </div>
              <div className="bg-[#0f0f0f] border border-neutral-800/80 p-4 md:p-5 rounded-xl">
                <span className="text-[10px] md:text-xs font-bold uppercase text-neutral-400">Clientes</span>
                <p className="text-xl md:text-2xl font-black text-white mt-1">{metrics.totalCustomers}</p>
              </div>
              <div className="bg-[#0f0f0f] border border-neutral-800/80 p-4 md:p-5 rounded-xl">
                <span className="text-[10px] md:text-xs font-bold uppercase text-neutral-400">Productos</span>
                <p className="text-xl md:text-2xl font-black text-[var(--color-pulso-lime)] mt-1">{metrics.totalProducts}</p>
              </div>
            </div>

            {/* Pedidos recientes */}
            <div className="bg-[#0f0f0f] border border-neutral-800/80 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-wider text-neutral-300">
                  Últimos Pedidos
                </h2>
                <button
                  onClick={() => setActiveSection('orders')}
                  className="text-xs text-[var(--color-pulso-lime)] font-bold hover:underline"
                >
                  Ver todos
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-[#141414] text-neutral-400 uppercase font-black">
                    <tr>
                      <th className="py-3 px-4">Pedido</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-4 font-bold text-white">#{o.id}</td>
                        <td className="py-3 px-4 text-neutral-300">{o.customer_name}</td>
                        <td className="py-3 px-4 font-black">${Number(o.total).toLocaleString('es-AR')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            o.status === 'pendiente_pago' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            o.status === 'pagado' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            'bg-neutral-900 text-neutral-300'
                          }`}>
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-neutral-500">
                          Aún no hay pedidos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTOS CON DESTACADO CLARO */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tight">Catálogo de Productos</h1>
                <p className="text-xs text-neutral-400">Toca el botón de la estrella para activar o quitar de la portada.</p>
              </div>
              <button
                onClick={() => setActiveSection('new_product')}
                className="bg-[var(--color-pulso-lime)] text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start"
              >
                <PlusCircle size={15} />
                <span>Nuevo Producto</span>
              </button>
            </div>

            <div className="bg-[#0f0f0f] border border-neutral-800/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#141414] text-neutral-400 uppercase font-black">
                    <tr>
                      <th className="py-3 px-4">Destacado en Home</th>
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Precio</th>
                      <th className="py-3 px-4">Variantes & Stock</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {products.map((p) => {
                      const cover = p.product_images?.find((img) => img.is_cover)?.image_url;
                      return (
                        <tr key={p.id} className="hover:bg-neutral-900/40">
                          {/* Botón de Destacado con indicación clara */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleFeatured(p.id, p.is_featured)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border ${
                                p.is_featured
                                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                              }`}
                            >
                              <Star
                                size={14}
                                className={p.is_featured ? 'fill-amber-400 text-amber-400' : 'text-neutral-500'}
                              />
                              <span>{p.is_featured ? 'Destacado' : 'Normal'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 flex items-center gap-3">
                            {cover ? (
                              <img src={cover} alt={p.name} className="w-10 h-10 object-cover rounded bg-black" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-neutral-900 border border-neutral-800" />
                            )}
                            <div>
                              <span className="font-bold text-white block">{p.name}</span>
                              {p.brands?.is_own_brand && (
                                <span className="text-[10px] text-[var(--color-pulso-lime)] font-bold">
                                  Pulso Original
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-neutral-400">{p.categories?.name}</td>
                          <td className="py-3 px-4 font-black">${Number(p.base_price).toLocaleString('es-AR')}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {p.product_variants?.map((v) => (
                                <span key={v.id} className="bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-[10px]">
                                  {v.size} ({v.color}): <strong>{v.stock}u</strong>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setModalState({ isOpen: true, productId: p.id })}
                              className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                              title="Eliminar producto"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-500">
                          No hay productos en el catálogo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NUEVO PRODUCTO */}
        {activeSection === 'new_product' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tight">Crear Nuevo Producto</h1>
              <p className="text-xs text-neutral-400">
                Las imágenes seleccionadas se convierten a .webp automáticamente.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="bg-[#0f0f0f] border border-neutral-800/80 p-5 sm:p-6 rounded-2xl space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-2">
                  Imágenes del Producto (Máximo 4)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {productImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg border border-neutral-800 overflow-hidden bg-black">
                      <img src={img.preview} alt="Upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/80 p-1 rounded-full text-rose-400 hover:text-white"
                      >
                        <Trash2 size={13} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[var(--color-pulso-lime)] text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                          Portada
                        </span>
                      )}
                    </div>
                  ))}
                  {productImages.length < 4 && (
                    <label className="aspect-square border-2 border-dashed border-neutral-800 hover:border-[var(--color-pulso-lime)] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors text-neutral-400 hover:text-white">
                      <UploadCloud size={24} />
                      <span className="text-[10px] uppercase font-bold mt-1">Agregar Foto</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageAdd} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Categoría *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Precio Base ($) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Precio Promocional ($)</label>
                  <input
                    type="number"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Marca *</label>
                  <select
                    value={productForm.brandId}
                    onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.is_own_brand ? '(Marca Propia Pulso)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Variantes */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase text-neutral-300">
                    Variantes de Stock (Talle / Color)
                  </span>
                  <button
                    type="button"
                    onClick={() => setVariants([...variants, { size: '', color: 'Negro', stock: 5, minStock: 2 }])}
                    className="text-xs text-[var(--color-pulso-lime)] font-bold uppercase"
                  >
                    + Agregar Variante
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2">
                      <input
                        type="text"
                        placeholder="Talle"
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].size = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-24 sm:w-28 bg-neutral-900 border border-neutral-800 p-2 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Color"
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].color = e.target.value;
                          setVariants(updated);
                        }}
                        className="flex-1 sm:w-32 bg-neutral-900 border border-neutral-800 p-2 rounded text-xs text-white"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].stock = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-20 sm:w-24 bg-neutral-900 border border-neutral-800 p-2 rounded text-xs text-white"
                      />
                      <input
                        type="number"
                        placeholder="Mínimo"
                        value={v.minStock}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].minStock = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-20 sm:w-24 bg-neutral-900 border border-neutral-800 p-2 rounded text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 bg-[var(--color-pulso-lime)] text-black font-black uppercase text-xs rounded-xl tracking-wider disabled:opacity-50"
              >
                {uploading ? 'Optimizando y Guardando...' : 'Publicar Producto'}
              </button>
            </form>
          </div>
        )}

        {/* CATEGORÍAS */}
        {activeSection === 'categories' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tight">Gestión de Categorías</h1>
              <p className="text-xs text-neutral-400">Administra las disciplinas y secciones de la tienda.</p>
            </div>

            <form onSubmit={handleCreateCategory} className="bg-[#0f0f0f] border border-neutral-800/80 p-4 rounded-xl flex gap-3">
              <input
                type="text"
                required
                placeholder="Nombre (ej: Ciclismo)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
              />
              <button
                type="submit"
                disabled={creatingCategory}
                className="bg-[var(--color-pulso-lime)] text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus size={15} />
                <span>{creatingCategory ? 'Guardando...' : 'Crear'}</span>
              </button>
            </form>

            <div className="bg-[#0f0f0f] border border-neutral-800/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-[#141414] text-neutral-400 uppercase font-black">
                    <tr>
                      <th className="py-3 px-4">Orden</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Slug</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {categories.map((cat, idx) => (
                      <tr key={cat.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-4 font-mono text-neutral-500">#{cat.display_order || idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-white text-sm">{cat.name}</td>
                        <td className="py-3 px-4 text-neutral-400 font-mono">{cat.slug}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            cat.is_active ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {cat.is_active ? 'Activa' : 'Pausada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PAGOS PENDIENTES */}
        {activeSection === 'pending_payments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tight">Validación de Transferencias</h1>
              <p className="text-xs text-neutral-400">Verifica comprobantes bancarios y confirma el paso a preparación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.filter((o) => o.status === 'pendiente_pago').map((o) => (
                <div key={o.id} className="bg-[#0f0f0f] border border-neutral-800 p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black uppercase text-amber-400">Pedido #{o.id}</span>
                      <h3 className="text-sm font-bold text-white mt-1">{o.customer_name}</h3>
                      <p className="text-xs text-neutral-400">{o.customer_phone}</p>
                    </div>
                    <span className="text-lg font-black text-white">
                      ${Number(o.total).toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await updateOrderStatus(o.id, 'pagado');
                        showToast(`Pedido #${o.id} confirmado.`);
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg uppercase"
                    >
                      Confirmar Pago
                    </button>
                    <button
                      onClick={async () => {
                        await updateOrderStatus(o.id, 'cancelado');
                        showToast(`Pedido #${o.id} cancelado.`, 'error');
                      }}
                      className="px-3 py-2 bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 rounded-lg text-xs"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
              {orders.filter((o) => o.status === 'pendiente_pago').length === 0 && (
                <div className="col-span-full py-12 text-center text-neutral-500 text-xs">
                  No hay transferencias pendientes de validación.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STOCK */}
        {activeSection === 'stock' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tight">Control de Reposición</h1>
              <p className="text-xs text-neutral-400">Variantes con inventario por debajo del mínimo.</p>
            </div>

            <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-[#141414] text-neutral-400 uppercase font-black">
                    <tr>
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4">Variante</th>
                      <th className="py-3 px-4">Stock Actual</th>
                      <th className="py-3 px-4">Stock Mínimo</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {products.flatMap((p) =>
                      (p.product_variants || []).map((v) => {
                        const isLow = v.stock <= v.min_stock_alert;
                        return (
                          <tr key={v.id} className="hover:bg-neutral-900/40">
                            <td className="py-3 px-4 font-bold text-white">{p.name}</td>
                            <td className="py-3 px-4 text-neutral-300">{v.size} - {v.color}</td>
                            <td className="py-3 px-4 font-black">{v.stock} u.</td>
                            <td className="py-3 px-4 text-neutral-400">{v.min_stock_alert} u.</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                v.stock === 0 ? 'bg-rose-950 text-rose-400' :
                                isLow ? 'bg-amber-950 text-amber-400' :
                                'bg-emerald-950 text-emerald-400'
                              }`}>
                                {v.stock === 0 ? 'Sin Stock' : isLow ? 'Reponer' : 'Disponible'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN */}
        {activeSection === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tight">Datos Bancarios</h1>
              <p className="text-xs text-neutral-400">Información para abonos por transferencia.</p>
            </div>

            <div className="bg-[#0f0f0f] border border-neutral-800 p-6 rounded-xl space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Banco</label>
                <input
                  type="text"
                  defaultValue={settings?.bank_name}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Titular</label>
                <input
                  type="text"
                  defaultValue={settings?.bank_account_holder}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Alias</label>
                  <input
                    type="text"
                    defaultValue={settings?.bank_alias}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">CBU</label>
                  <input
                    type="text"
                    defaultValue={settings?.bank_cbu}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};