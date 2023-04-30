export const metadata = {
  title: "Translate",
  description:
    "Lightweight simple translation platform to manage your localizations",
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
