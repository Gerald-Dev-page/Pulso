// src/views/components/home/BrandBar.jsx
import { siNike, siAdidas, siPuma, siNewbalance, siUnderarmour } from 'simple-icons';

// Logos oficiales
const BRAND_LOGOS = [
  { name: 'Nike', svg: siNike.svg },
  { name: 'Adidas', svg: siAdidas.svg },
  { name: 'Puma', svg: siPuma.svg },
  { name: 'New Balance', svg: siNewbalance.svg },
  { name: 'Under Armour', svg: siUnderarmour.svg },
];

export const BrandBar = () => {
  // Duplicamos la lista para crear el bucle infinito sin saltos
  const loopList = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <section className="border-y border-neutral-900 bg-[#050505] py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
        <span className="text-[11px] uppercase font-black tracking-widest text-neutral-400">
          Grandes Marcas en Pulso
        </span>
        <span className="text-[10px] text-neutral-400 uppercase font-semibold">
          Selección Oficial
        </span>
      </div>

      <div className="relative w-full overflow-hidden mask-gradient">
        {/* Sombras laterales para difuminado suave */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10" />

        {/* Carrusel continuo */}
        <div className="animate-marquee flex items-center gap-12 md:gap-20 py-2">
          {loopList.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center h-8 md:h-10 w-24 md:w-32 opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300 text-white cursor-pointer"
              title={brand.name}
              dangerouslySetInnerHTML={{
                __html: brand.svg.replace('<svg ', '<svg fill="currentColor" class="h-6 md:h-8 w-auto max-w-full" ')
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};