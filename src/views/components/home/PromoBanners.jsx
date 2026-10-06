import { ArrowRight } from 'lucide-react';
import { DUAL_BANNERS, TRIPLE_BANNERS } from '../../../models/promotions.data';

export const DualBanners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DUAL_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="group relative h-72 md:h-80 rounded-xl overflow-hidden flex flex-col justify-end p-6 md:p-8 border border-neutral-800"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            
            <div className="relative z-10">
              <span className="text-[var(--color-pulso-lime)] font-black text-xs tracking-widest uppercase">
                {banner.tag}
              </span>
              <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white mt-1 mb-4 leading-none">
                {banner.title}
              </h3>
              <a
                href={banner.href}
                className="inline-flex items-center gap-2 bg-white hover:bg-[var(--color-pulso-lime)] text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-all"
              >
                <span>{banner.ctaText}</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const TripleBanners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRIPLE_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="group relative h-64 md:h-72 rounded-xl overflow-hidden flex flex-col justify-end p-6 border border-neutral-800"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            <div className="relative z-10">
              <span className="text-[var(--color-pulso-lime)] font-black text-xs tracking-widest uppercase">
                {banner.tag}
              </span>
              <h3 className="text-xl font-black italic tracking-tight uppercase text-white mt-1 mb-4 leading-tight">
                {banner.title}
              </h3>
              <a
                href={banner.href}
                className="inline-flex items-center gap-2 bg-white hover:bg-[var(--color-pulso-lime)] text-black font-extrabold text-xs px-4 py-2 rounded-full transition-all"
              >
                <span>{banner.ctaText}</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};