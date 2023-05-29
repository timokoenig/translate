import Head from 'next/head'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>Translate</title>
        <meta
          name="description"
          content="Lightweight simple translation platform to manage your localizations."
        />
      </Head>
      <body>{children}</body>
    </html>
  )
}
