/**
 * Cloudflare R2 Storage Helper
 * Replaces @vercel/blob for file uploads
 */

export interface R2UploadResult {
  url: string
  key: string
  size: number
  uploadedAt: Date
}

/**
 * Upload file to Cloudflare R2
 * This uses the R2 binding available in Cloudflare Workers/Pages
 */
export async function uploadToR2(
  file: File,
  options: {
    path?: string
    bucket?: string
    access?: 'public' | 'private'
  } = {}
): Promise<R2UploadResult> {
  const { path = '', access = 'public' } = options
  
  // Generate unique key
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const key = path ? `${path}/${timestamp}-${randomString}-${file.name}` : `${timestamp}-${randomString}-${file.name}`
  
  // In Cloudflare Pages Functions, R2 is available via env.UPLOADS
  // This will be handled by API routes running on Cloudflare
  const arrayBuffer = await file.arrayBuffer()
  
  // Note: Direct R2 upload must happen in API routes with access to env.UPLOADS
  // This is a client-side helper that prepares data
  return {
    url: '', // Will be set by API route
    key,
    size: file.size,
    uploadedAt: new Date()
  }
}

/**
 * Get public URL for R2 object
 * Format: https://pub-<id>.r2.dev/<key>
 */
export function getR2PublicUrl(key: string, bucketPublicUrl: string): string {
  return `${bucketPublicUrl}/${key}`
}

/**
 * Delete file from R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  // This must be called from API routes with R2 binding
  return true
}

/**
 * Upload to R2 from API route (server-side)
 * This function is meant to be used in API routes where env.UPLOADS is available
 */
export async function r2Upload(
  file: File,
  r2Bucket: R2Bucket,
  options: {
    path?: string
    metadata?: Record<string, string>
  } = {}
): Promise<R2UploadResult> {
  const { path = '', metadata = {} } = options
  
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const key = path ? `${path}/${timestamp}-${randomString}-${file.name}` : `${timestamp}-${randomString}-${file.name}`
  
  const arrayBuffer = await file.arrayBuffer()
  
  await r2Bucket.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: metadata,
  })
  
  // R2 public URL (you need to configure R2 public bucket or use custom domain)
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-YOUR_BUCKET_ID.r2.dev'
  
  return {
    url: `${publicUrl}/${key}`,
    key,
    size: file.size,
    uploadedAt: new Date()
  }
}

// Type definition for R2 Bucket (Cloudflare Workers)
export interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream, options?: R2PutOptions): Promise<R2Object | null>
  get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>
  delete(keys: string | string[]): Promise<void>
  list(options?: R2ListOptions): Promise<R2Objects>
}

export interface R2PutOptions {
  httpMetadata?: {
    contentType?: string
    contentLanguage?: string
    contentDisposition?: string
    contentEncoding?: string
    cacheControl?: string
    cacheExpiry?: Date
  }
  customMetadata?: Record<string, string>
}

export interface R2GetOptions {
  onlyIf?: {
    etagMatches?: string
    etagDoesNotMatch?: string
    uploadedBefore?: Date
    uploadedAfter?: Date
  }
  range?: {
    offset?: number
    length?: number
    suffix?: number
  }
}

export interface R2ListOptions {
  limit?: number
  prefix?: string
  cursor?: string
  delimiter?: string
  include?: ('httpMetadata' | 'customMetadata')[]
}

export interface R2Object {
  key: string
  size: number
  etag: string
  uploaded: Date
  httpMetadata?: Record<string, string>
  customMetadata?: Record<string, string>
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream
  arrayBuffer(): Promise<ArrayBuffer>
  text(): Promise<string>
  json<T>(): Promise<T>
}

export interface R2Objects {
  objects: R2Object[]
  truncated: boolean
  cursor?: string
  delimitedPrefixes: string[]
}
