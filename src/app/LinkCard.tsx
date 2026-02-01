'use client'

import { useState } from 'react'

interface LinkCardProps {
  shortCode: string
  shortUrl: string
  qrCode: string
}

export default function LinkCard({ shortCode, shortUrl, qrCode }: LinkCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = shortUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {qrCode && (
          <div className="flex-shrink-0">
            <img
              src={qrCode}
              alt="QR Code"
              className="w-32 h-32 rounded-lg"
            />
          </div>
        )}
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm text-gray-500 mb-1">Your shortened link:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold text-blue-600 hover:text-blue-700 break-all"
          >
            {shortUrl}
          </a>
          
          <div className="mt-4 flex gap-2 justify-center md:justify-start">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            
            <a
              href={`/api/stats/${shortCode}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
            >
              View Stats
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
