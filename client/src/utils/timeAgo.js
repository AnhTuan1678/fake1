export function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date // chênh lệch mili giây
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return `${diffSec} giây trước`
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  if (diffDay < 30) return `${diffDay} ngày trước`
  if (diffMonth < 12) return `${diffMonth} tháng trước`
  return `${diffYear} năm trước`
}
