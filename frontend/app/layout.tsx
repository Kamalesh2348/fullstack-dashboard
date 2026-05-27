import "./globals.css";

export const metadata = {
  title: "Fullstack Dashboard",
  description: "Business analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}