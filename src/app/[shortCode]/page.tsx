import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params

    const link = await prisma.link.findUnique({
      where: { shortCode },
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    // Track click asynchronously
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''

    // Update click count and create click record
    await Promise.all([
      prisma.link.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      }),
      prisma.click.create({
        data: {
          linkId: link.id,
          ip,
          userAgent,
          referrer,
        },
      }),
    ])

    // Redirect to original URL
    return NextResponse.redirect(link.originalUrl, 302)
  } catch (error) {
    console.error('Error redirecting:', error)
    return NextResponse.json(
      { error: 'Failed to redirect' },
      { status: 500 }
    )
  }
}
