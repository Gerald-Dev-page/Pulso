import { Truck, CreditCard, RotateCcw, Headphones, Phone } from 'lucide-react';
import { TOP_BAR_ITEMS } from '../../../models/navigation.data';

const iconMap = {
  truck: Truck,
  'credit-card': CreditCard,
  'rotate-ccw': RotateCcw,
  headphones: Headphones,
  phone: Phone,
};

export const TopBar = () => {
  return (
    <div className="bg-[#050505] text-[#999999] border-b border-neutral-900 text-[11px] py-1.5 px-4 tracking-wider">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
        {TOP_BAR_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.id} className="flex items-center gap-1.5 shrink-0">
              {Icon && <Icon size={13} className="text-white" />}
              <span className="font-medium">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};