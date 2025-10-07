import { API_URL } from './config'

export const createReview = async (token, bookId, content, rating) => {
  const res = await fetch(`${API_URL}/api/book/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ book_id: bookId, content, rating }),
  })
  if (!res.ok) throw new Error('Tạo review thất bại')
  return res.json()
}

export const getReviewsByBook = async (bookId) => {
  const res = await fetch(`${API_URL}/api/book/${bookId}/reviews`)
  if (!res.ok) return []
  return res.json()
}

export const updateReview = async (token, reviewId, content, rating) => {
  const res = await fetch(`${API_URL}/api/book/review/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, rating }),
  })
  if (!res.ok) throw new Error('Cập nhật review thất bại')
  return res.json()
}

export const deleteReview = async (token, reviewId) => {
  const res = await fetch(`${API_URL}/api/book/review/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Xóa review thất bại')
  return res.json()
}
