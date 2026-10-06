// src/views/components/layout/BenefitsBar.jsx
import { Truck, CreditCard, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { TOP_BENEFITS } from '../../../models/store.data';

const icons = {
  truck: Truck,
  'credit-card': CreditCard,
  'rotate-ccw': RotateCcw,
  'shield-check': ShieldCheck,
  headphones: Headphones,
};

export const BenefitsBar = () => {
  return (
    <section className="border-y border-neutral-800 bg-[#060606] py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-6">
        {TOP_BENEFITS.map((item) => {
          const Icon = icons[item.icon];
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-900 text-[var(--color-pulso-lime)]">
                {Icon && <Icon size={22} />}
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white tracking-wide">{item.text}</p>
                <p className="text-[11px] text-neutral-400">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};