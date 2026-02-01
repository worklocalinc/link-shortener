import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

    // Get click stats
    const clicks = await prisma.click.findMany({
      where: { linkId: link.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    // Aggregate stats
    const totalClicks = link.clicks
    const uniqueIps = new Set(clicks.map(c => c.ip).filter(Boolean)).size
    const referrers = clicks.reduce((acc, click) => {
      const ref = click.referrer || 'Direct'
      acc[ref] = (acc[ref] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      link: {
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${link.shortCode}`,
        createdAt: link.createdAt,
      },
      stats: {
        totalClicks,
        uniqueVisitors: uniqueIps,
        referrers,
        recentClicks: clicks.slice(0, 10).map(c => ({
          createdAt: c.createdAt,
          country: c.country,
          referrer: c.referrer,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
