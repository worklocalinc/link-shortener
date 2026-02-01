import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from './app/api/db'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/') {
    return NextResponse.next()
  }
  
  // Extract short code from pathname
  const shortCode = pathname.slice(1)
  
  // Validate short code format
  if (!/^[a-zA-Z0-9]{4,20}$/.test(shortCode)) {
    return NextResponse.next()
  }
  
  try {
    const link = await prisma.link.findUnique({
      where: { shortCode },
    })
    
    if (!link) {
      return NextResponse.next()
    }
    
    // Track click asynchronously (don't await)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    
    prisma.link.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    }).catch(console.error)
    
    prisma.click.create({
      data: {
        linkId: link.id,
        ip,
        userAgent,
        referrer,
      },
    }).catch(console.error)
    
    // Redirect to original URL
    return NextResponse.redirect(link.originalUrl, 302)
  } catch (error) {
    console.error('Error in middleware:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: '/:shortCode([a-zA-Z0-9]{4,20})',
}
