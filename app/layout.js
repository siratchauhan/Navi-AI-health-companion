import "./globals.css";

export const metadata = {
  title: "Navi — Your Safe Space for Growing Up",
  description:
    "Navi is a private, medically-informed AI companion that helps teens navigate puberty and adolescent health questions without fear or judgment.",
  keywords: ["adolescent health", "teen health", "puberty", "AI companion", "anonymous"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
