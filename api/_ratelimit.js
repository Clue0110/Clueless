// Optional per-endpoint IP rate limiting via Upstash. If the Upstash env vars
// aren't set (e.g. local dev), limiting is silently disabled so nothing breaks.
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis // undefined = not yet checked, null = disabled
const limiters = {}

function getRedis() {
  if (redis !== undefined) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  redis = url && token ? new Redis({ url, token }) : null
  if (!redis) console.warn('[ratelimit] Upstash env not set — rate limiting disabled (dev mode)')
  return redis
}

// name namespaces the limit (e.g. 'pitch' vs 'chat') so endpoints get separate budgets.
export async function rateLimit(req, { name = 'default', max = 10, window = '1 d' } = {}) {
  const r = getRedis()
  if (!r) return { success: true }
  if (!limiters[name]) {
    limiters[name] = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(max, window),
      prefix: `clueless:${name}`,
    })
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon'
  return limiters[name].limit(ip)
}
