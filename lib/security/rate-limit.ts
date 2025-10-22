// Rate limiting utilities

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export const rateLimit = (
  identifier: string,
  limit = 10,
  windowMs = 60000, // 1 minute
): { success: boolean; remaining: number; resetTime: number } => {
  const now = Date.now()
  const key = identifier

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + windowMs }
    return { success: true, remaining: limit - 1, resetTime: store[key].resetTime }
  }

  const record = store[key]

  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    return { success: true, remaining: limit - 1, resetTime: record.resetTime }
  }

  record.count++

  if (record.count > limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime }
  }

  return { success: true, remaining: limit - record.count, resetTime: record.resetTime }
}

export const clearRateLimit = (identifier: string): void => {
  delete store[identifier]
}

export const getRateLimitStatus = (identifier: string): { count: number; resetTime: number } | null => {
  return store[identifier] || null
}
