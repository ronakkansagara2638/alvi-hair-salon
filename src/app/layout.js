import "./globals.css";

export const metadata = {
  title: {
    default: "The Alvi Family Salon | Hair, beauty & grooming in Nerul",
    template: "%s | The Alvi Family Salon",
  },
  description:
    "Book haircuts, colour, facials, waxing and bridal makeup at The Alvi Family Salon in Sector 21, Nerul, Navi Mumbai. Open daily 10 am – 8 pm.",
  keywords: [
    "salon in Nerul",
    "family salon Navi Mumbai",
    "haircut Nerul",
    "bridal makeup Nerul",
    "The Alvi Family Salon",
  ],
  openGraph: {
    title: "The Alvi Family Salon",
    description:
      "Hair, beauty and grooming for the whole family, beside Nerul station. Book an appointment online.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
