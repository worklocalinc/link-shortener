import UrlForm from '@/components/UrlForm'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Link Shortener
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Shorten your URLs, track clicks, and generate QR codes
        </p>
        <UrlForm />
      </div>
    </main>
  )
}
