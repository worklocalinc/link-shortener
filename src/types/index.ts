export interface Link {
  id: string
  shortCode: string
  originalUrl: string
  clicks: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateLinkRequest {
  url: string
  customSlug?: string
}

export interface CreateLinkResponse {
  shortCode: string
  shortUrl: string
  qrCode: string
}

export interface Click {
  id: string
  linkId: string
  ip?: string
  userAgent?: string
  referrer?: string
  country?: string
  createdAt: Date
}
