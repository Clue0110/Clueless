// Optional IP rate limiting via Upstash. If the Upstash env vars aren't set
// (e.g. local dev), limiting is silently disabled so nothing breaks.
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let limiter // undefined = not yet initialized, null = disabled

function getLimiter() {
  if (limiter !== undefined) return limiter
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(10, '1 d'), // 10 pitches per IP per day
      prefix: 'clueless',
    })
  } else {
    limiter = null
    console.warn('[ratelimit] Upstash env not set — rate limiting disabled (dev mode)')
  }
  return limiter
}

export async function rateLimit(req) {
  const l = getLimiter()
  if (!l) return { success: true }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon'
  return l.limit(ip)
}
