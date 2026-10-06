// src/views/components/home/CategoryGrid.jsx
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../../../models/store.data';

export const CategoryGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="group relative h-48 md:h-64 rounded-lg overflow-hidden flex flex-col justify-end p-4 border border-neutral-800"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-white font-extrabold text-sm md:text-base tracking-wide uppercase">
                {cat.label}
              </span>
              <ArrowUpRight size={16} className="text-[var(--color-pulso-lime)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};