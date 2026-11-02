export const site = {
  name: "The Alvi Family Salon",
  shortName: "The Alvi",
  tagline:
    "Hair, beauty and grooming for the whole family, right beside Nerul station.",
  phone: "+91 90000 00000", // TODO: replace with the salon's real number
  phoneHref: "tel:+919000000000",
  email: "hello@thealvisalon.in", // TODO: replace with the salon's real email
  address: {
    line1: "Shop No. E-4, Ground Floor, Plot No. 106",
    line2: "Shiv Parvati CHS, Sector 21, Nerul",
    line3: "Opp. Nerul Railway Station, next to MTNL",
    city: "Navi Mumbai, Maharashtra 400706",
  },
  hours: [
    { days: "Monday – Saturday", time: "10:00 am – 8:00 pm" },
    { days: "Sunday", time: "10:00 am – 8:00 pm" },
  ],
  coordinates: { lat: 19.0328617, lng: 73.0196977 },
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=19.0328617,73.0196977",
  mapEmbedUrl:
    "https://www.google.com/maps?q=19.0328617,73.0196977&z=16&output=embed",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Visit us" },
];
