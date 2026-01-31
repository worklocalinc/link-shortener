export const metadata = {
  title: 'Link Shortener',
  description: 'A simple, fast URL shortening service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
