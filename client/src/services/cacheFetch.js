import { db } from './cacheDB'

// ========================
// Hàm fetch có cache
// ========================
export const cacheFetch = async (
  url,
  options = {},
  { ttl = 5 * 60 * 1000, noCache = false } = {},
) => {
  const key = JSON.stringify({ url, options })
  const now = Date.now()

  // Nếu cache có dữ liệu & chưa hết hạn → dùng lại
  if (!noCache) {
    const cached = await db.cache.get(key)
    if (cached && now < cached.expiry) {
      return new Response(JSON.stringify(cached.data))
    } else if (cached) {
      // Nếu hết hạn thì xóa
      await db.cache.delete(key)
    }
  }

  // Fetch thật
  const res = await fetch(url, options)
  const clone = res.clone()
  const data = await clone.json()

  if (!noCache) {
    await db.cache.put({
      key,
      data,
      expiry: now + ttl,
    })
  }

  return res
}

// ========================
// Hàm clear cache
// ========================
export const clearCache = async () => {
  await db.cache.clear()
}
