export const CATEGORIES = [
  {
    id: "hair",
    name: "Hair",
    blurb: "Cuts, colour, spa and smoothing for every hair type.",
  },
  {
    id: "beauty",
    name: "Beauty",
    blurb: "Threading, waxing and nail care by our senior beauticians.",
  },
  {
    id: "skin",
    name: "Skin",
    blurb: "Clean-ups and facials tailored to your skin.",
  },
  {
    id: "bridal",
    name: "Bridal & Occasion",
    blurb: "Makeup and styling for weddings, parties and festivals.",
  },
];

export const SERVICES = [
  // Hair
  { id: "haircut-men", category: "hair", name: "Haircut — Men", duration: 30, price: 200 },
  { id: "haircut-women", category: "hair", name: "Haircut — Women", duration: 45, price: 400 },
  { id: "haircut-kids", category: "hair", name: "Haircut — Kids", duration: 30, price: 250 },
  { id: "beard-trim", category: "hair", name: "Beard Trim & Shave", duration: 30, price: 150 },
  { id: "hair-wash-blow-dry", category: "hair", name: "Hair Wash & Blow Dry", duration: 30, price: 300 },
  { id: "root-touch-up", category: "hair", name: "Hair Colour — Root Touch-up", duration: 45, price: 900 },
  { id: "global-colour", category: "hair", name: "Hair Colour — Global", duration: 90, price: 1800 },
  { id: "hair-spa", category: "hair", name: "Hair Spa", duration: 60, price: 800 },
  { id: "keratin", category: "hair", name: "Keratin / Smoothening", duration: 150, price: 3500 },

  // Beauty
  { id: "eyebrow-threading", category: "beauty", name: "Eyebrow Threading", duration: 15, price: 60 },
  { id: "full-face-threading", category: "beauty", name: "Full Face Threading", duration: 30, price: 250 },
  { id: "arms-waxing", category: "beauty", name: "Waxing — Full Arms", duration: 30, price: 350 },
  { id: "legs-waxing", category: "beauty", name: "Waxing — Full Legs", duration: 40, price: 450 },
  { id: "manicure", category: "beauty", name: "Manicure", duration: 40, price: 450 },
  { id: "pedicure", category: "beauty", name: "Pedicure", duration: 50, price: 600 },

  // Skin
  { id: "bleach", category: "skin", name: "Bleach", duration: 30, price: 400 },
  { id: "fruit-cleanup", category: "skin", name: "Fruit Clean-up", duration: 40, price: 600 },
  { id: "fruit-facial", category: "skin", name: "Fruit Facial", duration: 50, price: 900 },
  { id: "gold-facial", category: "skin", name: "Gold Facial", duration: 70, price: 1600 },

  // Bridal & Occasion
  { id: "hair-styling", category: "bridal", name: "Hair Styling", duration: 45, price: 800 },
  { id: "saree-draping", category: "bridal", name: "Saree Draping", duration: 30, price: 500 },
  { id: "party-makeup", category: "bridal", name: "Party Makeup", duration: 90, price: 2500 },
  { id: "bridal-makeup", category: "bridal", name: "Bridal Makeup", duration: 180, price: 9000 },
];

export function getService(id) {
  return SERVICES.find((service) => service.id === id) || null;
}

export function servicesByCategory(categoryId) {
  return SERVICES.filter((service) => service.category === categoryId);
}
