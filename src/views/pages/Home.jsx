// src/views/pages/Home.jsx
import { TopBar } from '../components/layout/TopBar';
import { Navbar } from '../components/layout/Navbar';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { BrandBar } from '../components/home/BrandBar';
import { ProductCard } from '../components/products/ProductCard';
import { DualBanners, TripleBanners } from '../components/home/PromoBanners';
import { BenefitsBar } from '../components/layout/BenefitsBar';
import { Footer } from '../components/layout/Footer';
import { useProducts } from '../../controllers/useProducts';

export const Home = () => {
  const { products, loading, activeTab, setActiveTab } = useProducts();

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
      <TopBar />
      <Navbar />

      <main className="flex-1">
        <HeroSlider />
        <CategoryGrid />
        <BrandBar />

        {/* Catálogo Destacado Real de Supabase */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[var(--color-pulso-lime)] font-bold text-xs tracking-widest uppercase">
                Catálogo Oficial
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white mt-1">
                Productos Destacados
              </h2>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'pulso', label: 'Pulso Original' },
                { id: 'futbol', label: 'Fútbol' },
                { id: 'running', label: 'Running' },
                { id: 'fitness', label: 'Fitness' },
                { id: 'accesorios', label: 'Accesorios' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs uppercase font-extrabold px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[var(--color-pulso-lime)] text-black'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-neutral-500 text-xs">Cargando catálogo...</div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 text-xs">
              No hay productos destacados en esta categoría. Puedes marcarlos como destacados desde el panel de administración.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <DualBanners />
        <BenefitsBar />
        <TripleBanners />
      </main>

      <Footer />
    </div>
  );
};