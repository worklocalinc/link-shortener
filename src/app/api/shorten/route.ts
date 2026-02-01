import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { generateShortCode, isValidUrl, isValidShortCode } from '../../../lib/utils'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const { url, customSlug } = await request.json()

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Please provide a valid URL' },
        { status: 400 }
      )
    }

    let shortCode: string

    // Handle custom slug
    if (customSlug) {
      if (!isValidShortCode(customSlug)) {
        return NextResponse.json(
          { error: 'Custom slug must be 4-20 alphanumeric characters' },
          { status: 400 }
        )
      }

      const existing = await prisma.link.findUnique({
        where: { shortCode: customSlug },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'This custom slug is already taken' },
          { status: 409 }
        )
      }

      shortCode = customSlug
    } else {
      // Generate unique short code
      let attempts = 0
      do {
        shortCode = generateShortCode()
        const existing = await prisma.link.findUnique({
          where: { shortCode },
        })
        if (!existing) break
        attempts++
      } while (attempts < 10)

      if (attempts >= 10) {
        return NextResponse.json(
          { error: 'Failed to generate unique code. Please try again.' },
          { status: 500 }
        )
      }
    }

    // Create link
    const link = await prisma.link.create({
      data: {
        shortCode,
        originalUrl: url,
      },
    })

    // Generate QR code
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`
    const shortUrl = `${baseUrl}/${shortCode}`
    const qrCode = await QRCode.toDataURL(shortUrl)

    return NextResponse.json({
      shortCode: link.shortCode,
      shortUrl,
      qrCode,
    })
  } catch (error) {
    console.error('Error shortening URL:', error)
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    )
  }
}
