import { API_URL } from './config'

export const getMyProgress = async (token, { limit = 30, offset = 0 } = {}) => {
  const res = await fetch(
    `${API_URL}/api/progress?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) throw new Error('Lấy tiến trình thất bại')

  return res.json() //{ total, data }
}

export const getUserProgress = async (userId, { limit = 30, offset = 0 } = {}) => {
  const res = await fetch(
    `${API_URL}/api/progress/user?limit=${limit}&offset=${offset}&id=${userId}`,
  )

  if (!res.ok) throw new Error('Lấy tiến trình thất bại')

  return res.json() //{ total, data }
}

export const saveProgress = async (
  token,
  bookId,
  lastChapterIndex,
  progressPercent,
) => {
  const res = await fetch(`${API_URL}/api/progress/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      book_id: bookId,
      last_chapter_index: lastChapterIndex,
      progress_percent: progressPercent,
    }),
  })
  return res.json()
}

export const getAllProgress = async (token) => {
  const res = await fetch(`${API_URL}/api/account/progress`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return await res.json()
}

export const getProgressByBook = async (token, bookId) => {
  const res = await fetch(`${API_URL}/api/progress/${bookId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return await res.json()
}
