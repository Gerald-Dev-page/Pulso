// src/models/store.data.js

export const TOP_BENEFITS = [
  { id: 1, text: "ENVÍOS A TODO EL PAÍS", detail: "Rápido y seguro", icon: "truck" },
  { id: 2, text: "HASTA 3 CUOTAS SIN INTERÉS", detail: "Con todas las tarjetas", icon: "credit-card" },
  { id: 3, text: "CAMBIOS FÁCILES", detail: "Sin complicaciones", icon: "rotate-ccw" },
  { id: 4, text: "COMPRA SEGURA", detail: "Tus datos protegidos", icon: "shield-check" },
  { id: 5, text: "ATENCIÓN PERSONALIZADA", detail: "Estamos para ayudarte", icon: "headphones" }
];

export const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'hombre', label: 'Hombre', href: '#hombre' },
  { id: 'mujer', label: 'Mujer', href: '#mujer' },
  { id: 'futbol', label: 'Fútbol', href: '#futbol' },
  { id: 'running', label: 'Running', href: '#running' },
  { id: 'training', label: 'Training', href: '#training' },
  { id: 'outdoor', label: 'Outdoor', href: '#outdoor' },
  { id: 'accesorios', label: 'Accesorios', href: '#accesorios' },
  { id: 'marcas', label: 'Marcas', href: '#marcas' },
  { id: 'ofertas', label: 'Ofertas', href: '#ofertas', isHighlight: true }
];

export const HERO_SLIDES = [
  {
    id: 1,
    tag: "COLECCIÓN PULSO",
    title: "MOVIMIENTO QUE TE LLEVA MÁS LEJOS",
    subtitle: "Indumentaria técnica y equipamiento diseñado para acompañar cada uno de tus desafíos.",
    ctaText: "DESCUBRÍ PULSO",
    ctaLink: "#pulso",
    imageDesktop: "/images/banners/banner1.webp",
    imageMobile: "/images/banners/bannerm1.webp",
  },
  {
    id: 2,
    tag: "ACCESORIOS",
    title: "PEQUEÑOS DETALLES, GRANDES RESULTADOS",
    subtitle: "Equipamiento, bolsos y complementos clave para optimizar tu rendimiento diario.",
    ctaText: "VER ACCESORIOS",
    ctaLink: "#accesorios",
    imageDesktop: "/images/banners/banner2.webp",
    imageMobile: "/images/banners/bannerm2.webp",
  },
  {
    id: 3,
    tag: "RUNNING",
    title: "SUPERA TUS LÍMITES",
    subtitle: "Calzado técnico y prendas ligeras pensadas para que nada frene tu ritmo.",
    ctaText: "VER RUNNING",
    ctaLink: "#running",
    imageDesktop: "/images/banners/banner3.webp",
    imageMobile: "/images/banners/bannerm3.webp",
  }
];

export const CATEGORIES = [
  { id: 'futbol', label: 'FÚTBOL', image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=600&auto=format&fit=crop' },
  { id: 'running', label: 'RUNNING', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=600&auto=format&fit=crop' },
  { id: 'training', label: 'FITNESS / TRAINING', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
  { id: 'padel', label: 'PÁDEL', image: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?q=80&w=600&auto=format&fit=crop' },
  { id: 'outdoor', label: 'OUTDOOR', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=600&auto=format&fit=crop' },
  { id: 'accesorios', label: 'ACCESORIOS', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop' }
];

export const FEATURED_PRODUCTS = [
  {
    id: 'p-01',
    brand: 'Pulso',
    name: 'Remera Técnica Pro Training',
    category: 'training',
    price: 45999,
    originalPrice: 52999,
    rating: 5.0,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop',
    isPulsoOriginal: true
  },
  {
    id: 'p-02',
    brand: 'Pulso',
    name: 'Short Running Aeroflex con Calza',
    category: 'running',
    price: 54999,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 28,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
    isPulsoOriginal: true
  },
  {
    id: 'p-03',
    brand: 'Nike',
    name: 'Nike Mercurial Superfly 10 Elite FG',
    category: 'futbol',
    price: 329999,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    isPulsoOriginal: false
  },
  {
    id: 'p-04',
    brand: 'Adidas',
    name: 'Adidas F50 Elite FG',
    category: 'futbol',
    price: 299999,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 16,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format&fit=crop',
    isPulsoOriginal: false
  },
  {
    id: 'p-05',
    brand: 'Puma',
    name: 'Puma Future 7 Ultimate FG',
    category: 'futbol',
    price: 289999,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 12,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
    isPulsoOriginal: false
  },
  {
    id: 'p-06',
    brand: 'Pulso',
    name: 'Bolso Deportivo Duffle Impermeable',
    category: 'accesorios',
    price: 79999,
    originalPrice: 89999,
    rating: 5.0,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    isPulsoOriginal: true
  }
];

export const BRANDS = [
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_complete_logo.svg' },
  { name: 'Asics', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg' },
  { name: 'Wilson', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Wilson-logo.svg' }
];