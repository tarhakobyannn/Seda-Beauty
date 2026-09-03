import { Service, Booking, GalleryItem, StudioInfo } from '../types';

export const STUDIO_INFO: StudioInfo = {
  name: 'Seda Beauty Studio',
  tagline: 'Elegance, Artistry & Care in Ararat Province · Vedi & Artashat',
  instagramHandle: 'seda__beauty',
  instagramUrl: 'https://www.instagram.com/seda__beauty/',
  phone: '093 33 24 14',
  phoneRaw: '+37493332414',
  whatsappUrl: 'https://wa.me/37493332414?text=%D4%B2%D5%A1%D6%80%D6%87%20%D5%B1%D5%A5%D5%A6%2C%20%D6%81%D5%A1%D5%86%D5%AF%D5%A1%D5%86%D5%B8%D6%82%D5%84%20%D5%A5%D5%84%20%D5%A3%D6%80%D5%A1%D5%B6%D6%81%D5%BE%D5%A5%D5%AC%20Seda%20Beauty%20Studio%20(093%2033%2024%2014)',
  telegramUrl: 'https://t.me/seda_beauty_studio',
  address: 'Արարատի մարզ, ք․ Վեդի / ք․ Արտաշատ',
  city: 'Վեդի / Արտաշատ',
  region: 'Արարատի մարզ',
  country: 'Հայաստան',
  branches: [
    {
      id: 'vedi',
      name: 'Vedi Studio',
      nameArmenian: 'ք․ Վեդի',
      city: 'Վեդի',
      region: 'Արարատի մարզ',
      address: 'ք․ Վեդի',
      addressFull: 'Արարատի մարզ, ք․ Վեդի',
      mapQuery: 'Vedi,+Ararat+Province,+Armenia',
      coordinates: {
        lat: 39.9133,
        lng: 44.7297,
      },
      phone: '093 33 24 14',
      phoneRaw: '+37493332414',
    },
    {
      id: 'artashat',
      name: 'Artashat Studio',
      nameArmenian: 'ք․ Արտաշատ',
      city: 'Արտաշատ',
      region: 'Արարատի մարզ',
      address: 'ք․ Արտաշատ',
      addressFull: 'Արարատի մարզ, ք․ Արտաշատ',
      mapQuery: 'Artashat,+Ararat+Province,+Armenia',
      coordinates: {
        lat: 39.9575,
        lng: 44.5447,
      },
      phone: '093 33 24 14',
      phoneRaw: '+37493332414',
    },
  ],
  coordinates: {
    lat: 39.9133,
    lng: 44.7297,
  },
  rating: 4.96,
  reviewsCount: 382,
};

export const SERVICES_LIST: Service[] = [
  // Hair Artistry & Updos (Signature Seda Services)
  {
    id: 'hair-waves',
    name: 'Signature Cascading Hollywood Waves & Gloss Curls',
    category: 'hair',
    priceAMD: 12000,
    priceUSD: 31,
    durationMinutes: 60,
    description: 'Silky, voluminous Hollywood waves or textured cascading curls crafted with heat-protecting keratin elixir for maximum bounce and lasting hold.',
    popular: true,
    image: '/images/hair-waves.jpg',
    features: ['Thermal protection and deep shine sealant', 'Custom curl density (soft wave or defined curl)', 'Long-lasting hold for all evening events', 'Volume root lifting technique'],
    aftercare: 'Do not sleep on damp hair. Use satin bonnet or silk pillowcase to preserve wave definition.'
  },
  {
    id: 'hair-bridal-updo',
    name: 'Bespoke Bridal Updo & Textured Chignon',
    category: 'hair',
    priceAMD: 18000,
    priceUSD: 46,
    durationMinutes: 90,
    description: 'Timeless European low chignon, textured bridal bun, or romantic gathered updo designed around your face shape, veil, and dress neckline.',
    popular: true,
    image: '/images/bridal-chignon.jpg',
    features: ['Veil & bridal accessory secure placement', 'Texturizing and volume anchoring', 'Weather-resistant finishing spray', 'Pre-styling consultation included'],
    aftercare: 'Carefully remove bobby pins one by one after event without pulling.'
  },
  {
    id: 'hair-salon-curls',
    name: 'Atelier Half-Up Styling & Voluminous Blowout',
    category: 'hair',
    priceAMD: 10000,
    priceUSD: 26,
    durationMinutes: 50,
    description: 'Chic half-up pinned twists with bouncy spiral curls, perfect for birthdays, photo sessions, and celebratory evenings.',
    popular: false,
    image: '/images/salon-curls.jpg',
    features: ['Featherlight invisible pin technique', 'Root-boosting blowout infusion', 'Natural touchable finish without stickiness'],
    aftercare: 'Gently finger-comb curls rather than brushing through vigorously.'
  },

  // Lashes
  {
    id: 'lash-classic',
    name: 'Classic Silk Lash Extensions (1:1)',
    category: 'lashes',
    priceAMD: 12000,
    priceUSD: 31,
    durationMinutes: 90,
    description: 'Individual silk-mink lash applied to each natural lash. Effortless, natural mascara effect customized to your eye shape.',
    popular: false,
    image: 'https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=800&auto=format&fit=crop',
    features: ['Premium Korean hypoallergenic silk lashes', 'Customized eye-mapping technique', 'Lightweight & zero irritation', 'Includes lash brush & care kit'],
    aftercare: 'Avoid water and steam for the first 24 hours. Brush gently with a clean spoolie daily.'
  },
  {
    id: 'lash-hybrid-volume',
    name: '2D / 3D Hybrid Soft Volume',
    category: 'lashes',
    priceAMD: 15000,
    priceUSD: 39,
    durationMinutes: 105,
    description: 'Our most requested signature set. Blends delicate fans with individual lashes for a fluffy, fluttery, textured elegance.',
    popular: true,
    image: 'https://images.unsplash.com/photo-1587754256282-a11d04e3472d?q=80&w=800&auto=format&fit=crop',
    features: ['Handcrafted featherlight Russian volume fans', 'Tailored curl (C, CC, or D curl)', 'Adds volume without heaviness', 'Lasts up to 4-5 weeks'],
    aftercare: 'Use oil-free makeup remover. Sleep on a silk pillowcase for extended retention.'
  },
  {
    id: 'lash-mega-volume',
    name: 'Russian Mega Volume Glam',
    category: 'lashes',
    priceAMD: 19000,
    priceUSD: 49,
    durationMinutes: 120,
    description: 'Full, dark, ultra-dense lash line with ultra-thin 0.03mm fibers. Dramatic glamour while maintaining natural lash health.',
    popular: false,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    features: ['Ultra-fine 0.03mm premium Korean fibers', 'Dense velvety eyeliner finish', 'Weightless comfort on eyes'],
    aftercare: 'Cleanse regularly with specialized lash foam. Book refill within 3 weeks.'
  },
  {
    id: 'lash-lift-botox',
    name: 'Lash Lift & Keratin Botox Infusion',
    category: 'lashes',
    priceAMD: 10000,
    priceUSD: 26,
    durationMinutes: 60,
    description: 'Lifts and curls your natural lashes from root to tip, paired with deep keratin conditioning and deep jet-black tint.',
    popular: false,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
    features: ['No extensions required - 100% natural', 'Deep peptide & keratin nourishment', 'Lasts 6 to 8 weeks', 'Waterproof after 24 hours'],
    aftercare: 'Apply lash conditioner serum nightly to maintain hydration and elasticity.'
  },

  // Brows
  {
    id: 'brow-architecture',
    name: 'Brow Architecture & Tweezing / Wax',
    category: 'brows',
    priceAMD: 4500,
    priceUSD: 12,
    durationMinutes: 35,
    description: 'Precise geometric face-mapping to define your ideal brow symmetry, followed by hypoallergenic gentle wax and precision tweezing.',
    popular: false,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
    features: ['Custom caliper facial symmetry mapping', 'Painless Italian hot wax & tweezing', 'Calming aloe soothing finish'],
    aftercare: 'Avoid aggressive exfoliation or AHAs around the brow area for 48 hours.'
  },
  {
    id: 'brow-lamination-signature',
    name: 'Signature Brow Lamination & Botox',
    category: 'brows',
    priceAMD: 10000,
    priceUSD: 26,
    durationMinutes: 60,
    description: 'Smooths unruly hairs, giving brows a sleek, feathery, full brushed-up appearance that holds shape for 6+ weeks.',
    popular: true,
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop',
    features: ['Gentle keratin formula that avoids hair damage', 'Includes botoplex deep conditioning', 'Creates instantly fuller arches'],
    aftercare: 'Do not wet brows for 24 hours. Brush into shape with brow oil every morning.'
  },
  {
    id: 'brow-full-package',
    name: 'Complete Brow Atelier (Lamination + Tint + Shape)',
    category: 'brows',
    priceAMD: 14000,
    priceUSD: 36,
    durationMinutes: 75,
    description: 'The ultimate brow transformation: Lamination, custom Bronsun hybrid tinting matching hair undertones, and precision architectural sculpting.',
    popular: false,
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop',
    features: ['All-in-one comprehensive brow makeover', 'Long-lasting hybrid stain on skin & hairs', 'Personalized color blending'],
    aftercare: 'Condition with argan or castor oil starting day 2 for healthy shine.'
  },

  // Facials & Skincare
  {
    id: 'facial-glow',
    name: 'Hydration Radiance "Glass Skin" Ritual',
    category: 'facials',
    priceAMD: 18000,
    priceUSD: 46,
    durationMinutes: 60,
    description: 'Multi-step European facial featuring hyaluronic oxygen infusion, gentle enzyme peel, lymphatic drainage massage, and cooling collagen mask.',
    popular: true,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
    features: ['Deep cellular hydration and instant glow', 'Relaxing neck & decollete lymphatic massage', 'Suitable for sensitive skin'],
    aftercare: 'Drink plenty of water and wear SPF 50 daily. Enjoy luminous makeup-ready skin!'
  },
  {
    id: 'facial-deep-cleanse',
    name: 'Deep Ultrasonic Pore Cleansing',
    category: 'facials',
    priceAMD: 15000,
    priceUSD: 38,
    durationMinutes: 75,
    description: 'Non-invasive ultrasonic cavitation peeling combined with vacuum pore extraction, soothing azulene mask, and LED phototherapy.',
    popular: false,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
    features: ['Clears congested pores & blackheads', 'Antibacterial blue LED light therapy', 'Tightens skin texture without redness'],
    aftercare: 'Avoid heavy foundation for 12 hours. Change your pillowcase tonight.'
  },

  // Nails & Russian Hardware Care
  {
    id: 'nails-russian-manicure',
    name: 'Russian Hardware Manicure & Cherry/Nude Gel',
    category: 'nails',
    priceAMD: 8000,
    priceUSD: 21,
    durationMinutes: 60,
    description: 'Immaculate diamond-bit e-file cuticle detailing, reinforced rubber base architecture, and flawless deep-pigment gel polish (cherry glaze, milky nude, butter yellow, or custom tone).',
    popular: true,
    image: '/images/cherry-manicure.jpg',
    features: ['Precision diamond e-file hardware cuticle technique', 'Strengthens weak or brittle natural nails', 'Chip-free shine lasting 3-4 weeks', 'Deep cherry, milky white, pastels & 100+ shades'],
    aftercare: 'Apply cuticle oil daily. Avoid using nails as tools to maintain apex strength.'
  },
  {
    id: 'nails-french-art',
    name: 'Atelier French Tips & Soft Gel Architecture',
    category: 'nails',
    priceAMD: 11000,
    priceUSD: 28,
    durationMinutes: 75,
    description: 'Clean square or almond French smile lines painted over sheer milky pink base, or festive diamond glitter ombré tips.',
    popular: true,
    image: '/images/french-flower.jpg',
    features: ['Crisp geometric smile lines', 'Translucent milky pink or nude foundation', 'Smooth apex leveling for natural strength', 'Optional glitter ombré finish'],
    aftercare: 'Wear gloves when handling harsh household detergents.'
  },
  {
    id: 'nails-smart-pedicure',
    name: 'Smart Disc Spa Pedicure & Gel Coating',
    category: 'nails',
    priceAMD: 12000,
    priceUSD: 31,
    durationMinutes: 75,
    description: 'Medical-grade podology smart disc treatment for silky soft heels, organic scrub, warm towel wrap, and long-lasting gel polish.',
    popular: false,
    image: '/images/milky-white.jpg',
    features: ['Eliminates calluses and rough skin gently', 'Aromatherapeutic sea salt foot bath', 'Deep moisturizing paraffin balm'],
    aftercare: 'Wear breathable socks for the first evening.'
  },
  {
    id: 'nails-gel-extensions',
    name: 'Soft Gel Tip Extensions & Aesthetic Luxury Art',
    category: 'nails',
    priceAMD: 15000,
    priceUSD: 39,
    durationMinutes: 90,
    description: 'Full-cover soft gel extensions tailored to natural nail beds, sculpted to square or almond perfection with gemstone or glitter accents.',
    popular: false,
    image: '/images/glitter-emerald.jpg',
    features: ['Natural feel & high impact resistance', 'Zero filing damage to natural nail plate', 'Custom length & shape (square, coffin, almond)'],
    aftercare: 'Schedule refills every 3 to 4 weeks.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-hair-1',
    title: 'Signature Cascading Hollywood Waves',
    category: 'hair',
    image: '/images/hair-waves.jpg',
    caption: 'Lustrous, bouncy cascading curls styled for evening elegance and photography.'
  },
  {
    id: 'g-hair-2',
    title: 'Bridal Textured Low Chignon Updo',
    category: 'hair',
    image: '/images/bridal-chignon.jpg',
    caption: 'Handcrafted European bridal low chignon with romantic face-framing tendrils.'
  },
  {
    id: 'g-hair-3',
    title: 'Studio Atelier Styling & Half-Up Curls',
    category: 'hair',
    image: '/images/salon-curls.jpg',
    caption: 'Master Seda Hovhannisyan atelier signature curl styling and pinned half-up look.'
  },
  {
    id: 'g-nail-1',
    title: 'Glossy Deep Cherry Red Manicure',
    category: 'nails',
    image: '/images/cherry-manicure.jpg',
    caption: 'Flawless square Russian cuticle work with deep cherry wine gel gloss.'
  },
  {
    id: 'g-nail-2',
    title: 'Micro-French Square & Milky Base',
    category: 'nails',
    image: '/images/french-flower.jpg',
    caption: 'Crisp hand-painted white smile lines over sheer milky translucent pink base.'
  },
  {
    id: 'g-nail-3',
    title: 'Glitter Ombré Sculpted French Tips',
    category: 'nails',
    image: '/images/glitter-emerald.jpg',
    caption: 'Sparkling diamond ombré tips paired with statement emerald jewelry.'
  },
  {
    id: 'g-nail-4',
    title: 'Clean Milk White Hardware Manicure',
    category: 'nails',
    image: '/images/milky-white.jpg',
    caption: 'Opaque milk-white gel finish with clean e-file hardware cuticle detailing.'
  },
  {
    id: 'g-nail-5',
    title: 'Pastel Butter Yellow Square Nails',
    category: 'nails',
    image: '/images/butter-yellow.jpg',
    caption: 'Soft creamy yellow seasonal gel tone on natural square nails.'
  },
  {
    id: 'g-nail-6',
    title: 'Pale Sage & Chalk Slate Clean Square',
    category: 'nails',
    image: '/images/sage-blue.jpg',
    caption: 'Velvety cool sage neutral gel finish on clean square beds with striped cuff.'
  },
  {
    id: 'g-lash-1',
    title: 'Hybrid 2D/3D Soft Volume Lashes',
    category: 'lashes',
    image: 'https://images.unsplash.com/photo-1587754256282-a11d04e3472d?q=80&w=1000&auto=format&fit=crop',
    caption: 'Soft, airy fan arrangement highlighting hazel eyes with dark brown-black silk fibers.'
  },
  {
    id: 'g-brow-1',
    title: 'Fluffy Brow Lamination & Styling',
    category: 'brows',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop',
    caption: 'Brushed-up feather lamination with warm taupe Bronsun tint for a naturally full arch.'
  },
  {
    id: 'g-studio-1',
    title: 'Seda Studio Interior & Lash Lounge',
    category: 'studio',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    caption: 'Warm ambient lighting, certified master diplomas, and private client comfort.'
  }
];

// Helper to get formatted date string YYYY-MM-DD
export function getRelativeDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Initial demo bookings (structured so already-booked slots display as unavailable)
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1',
    bookingCode: 'SEDA-7281',
    serviceId: 'lash-hybrid-volume',
    serviceName: '2D / 3D Hybrid Soft Volume',
    priceAMD: 15000,
    durationMinutes: 105,
    date: getRelativeDateString(0), // Today
    time: '11:00',
    customerName: 'Anahit Sargsyan',
    customerPhone: '+374 93 11 22 33',
    customerEmail: 'anahit.s@gmail.com',
    notes: 'Sensitive eyes, prefer C-curl',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'bk-2',
    bookingCode: 'SEDA-9104',
    serviceId: 'brow-lamination-signature',
    serviceName: 'Signature Brow Lamination & Botox',
    priceAMD: 10000,
    durationMinutes: 60,
    date: getRelativeDateString(0), // Today
    time: '14:30',
    customerName: 'Lilit Vardanyan',
    customerPhone: '+374 98 44 55 66',
    notes: 'First time lamination',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'bk-3',
    bookingCode: 'SEDA-4420',
    serviceId: 'facial-glow',
    serviceName: 'Hydration Radiance "Glass Skin" Ritual',
    priceAMD: 18000,
    durationMinutes: 60,
    date: getRelativeDateString(1), // Tomorrow
    time: '12:00',
    customerName: 'Mariam Poghosyan',
    customerPhone: '+374 77 88 99 00',
    notes: 'Event on weekend, focus on glowing dewy finish',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'bk-4',
    bookingCode: 'SEDA-6311',
    serviceId: 'nails-russian-manicure',
    serviceName: 'Russian Hardware Manicure & Gel Polish',
    priceAMD: 8000,
    durationMinutes: 60,
    date: getRelativeDateString(1), // Tomorrow
    time: '16:00',
    customerName: 'Nare Hakobyan',
    customerPhone: '+374 91 33 44 55',
    notes: 'Short square nails, nude tone',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'bk-5',
    bookingCode: 'SEDA-2289',
    serviceId: 'lash-classic',
    serviceName: 'Classic Silk Lash Extensions (1:1)',
    priceAMD: 12000,
    durationMinutes: 90,
    date: getRelativeDateString(2), // In 2 days
    time: '15:00',
    customerName: 'Sona Ghazaryan',
    customerPhone: '+374 95 12 34 56',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

export const STUDIO_REVIEWS = [
  {
    id: 'r1',
    author: 'Tatevik M.',
    rating: 5,
    date: '2 days ago',
    serviceUsed: '2D/3D Hybrid Volume Lashes',
    text: 'Seda is genuinely the most talented beauty master in Ararat Province! The lashes feel completely weightless, my retention lasted over 4 weeks, and the studio atmosphere in Vedi is pure luxury and calm.'
  },
  {
    id: 'r2',
    author: 'Elena K.',
    rating: 5,
    date: '1 week ago',
    serviceUsed: 'Brow Lamination & Styling',
    text: 'The best brow architecture and styling in Artashat. Precise, natural, and symmetrical. Seda takes time to measure your facial proportions instead of doing standard cookie-cutter brows. 10/10!'
  },
  {
    id: 'r3',
    author: 'Ani Abrahamyan',
    rating: 5,
    date: '2 weeks ago',
    serviceUsed: 'Russian Manicure & Hollywood Waves',
    text: 'Obsessed with the cleanliness, sterilization, and hair artistry here. Cleanest cuticles and gorgeous waves! It is so wonderful having such a high-end luxury studio right here in Ararat region.'
  }
];
