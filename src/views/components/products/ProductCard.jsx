// src/views/components/products/ProductCard.jsx
import { Heart, ShoppingBag, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-[#0e0e0e] border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col transition-all hover:border-neutral-700">
      {/* Insignia de Pulso Original */}
      {product.isPulsoOriginal && (
        <span className="absolute top-3 left-3 z-10 bg-[var(--color-pulso-lime)] text-black text-[10px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
          Pulso Original
        </span>
      )}

      {/* Botón Favorito */}
      <button 
        className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
        aria-label="Guardar en favoritos"
      >
        <Heart size={16} />
      </button>

      {/* Imagen */}
      <div className="relative w-full aspect-square bg-[#141414] overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Contenido / Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-neutral-400">
            {product.brand}
          </span>
          <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-2">
            <Star size={13} className="fill-[var(--color-pulso-lime)] text-[var(--color-pulso-lime)]" />
            <span className="text-xs font-bold text-white">{product.rating}</span>
            <span className="text-xs text-neutral-500">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-white">
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.originalPrice && (
              <span className="block text-xs line-through text-neutral-500">
                ${product.originalPrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>

          <button 
            className="bg-white hover:bg-[var(--color-pulso-lime)] text-black p-2.5 rounded-lg transition-colors"
            aria-label="Agregar al carrito"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};