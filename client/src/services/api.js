const API_URL = import.meta.env.VITE_API_URL

import { formatterStoryDetail } from '../utils/formatter'

// =============================
// Auth APIs
// =============================
export const login = async (usernameOrEmail, password) => {
  const res = await fetch(`${API_URL}/api/account/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password }),
  })
  return await res.json()
}

export const register = async (username, email, password) => {
  const res = await fetch(`${API_URL}/api/account/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  return await res.json()
}

export const getProfile = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/account/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return await res.json()
  } catch (err) {
    console.error('Lỗi khi gọi getProfile:', err)
    return { error: 'Không thể kết nối server' }
  }
}

export const updateAvatar = async (token, formData) => {
  const res = await fetch(`${API_URL}/api/account/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // nếu có auth
    },
    body: formData,
  })
  if (!res.ok) {
    throw new Error('Upload avatar thất bại')
  }

  return await res.json()
}

// =============================
// Book APIs
// =============================
export const getAllStory = async () => {
  const res = await fetch(`${API_URL}/api/book`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()

  return data.map((book) => ({
    ...book,
    chapterCount: book.chapter_count,
    publishedDate: book.created_at,
    urlAvatar: book.url_avatar,
  }))
}

export const getStoryDetails = async (storyId) => {
  const res = await fetch(`${API_URL}/api/book/${storyId}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  const formatted = formatterStoryDetail(data)

  return formatted
}

export const getChapters = async (storyId) => {
  const res = await fetch(`${API_URL}/api/book/${storyId}/chapters`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()

  return data.map((ch) => ({
    chapterId: ch.id,
    index: ch.index,
    title: ch.title,
    releaseDate: ch.created_at || '2023-01-02',
  }))
}

export const getChapterContent = async (index, bookId) => {
  const res = await fetch(`${API_URL}/api/book/${bookId}/chapter/${index}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return await res.json()
}

export const searchBooks = async (query) => {
  if (!query || query.trim() === '') {
    throw new Error('Query không được để trống')
  }
  const res = await fetch(
    `${API_URL}/api/book/search?query=${encodeURIComponent(query)}`,
  )
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()

  return data.map((book) => ({
    ...book,
    chapterCount: book.chapter_count,
    publishedDate: book.created_at,
    urlAvatar: book.url_avatar,
  }))
}

// =============================
// User Progress / Bookshelf APIs
// =============================
export const saveProgress = async (
  token,
  bookId,
  lastChapterIndex,
  progressPercent,
) => {
  const res = await fetch(`${API_URL}/api/account/progress`, {
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
  return await res.json()
}

// Lấy tất cả tiến trình đọc
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

// Lấy tiến trình đọc 1 cuốn sách
export const getProgressByBook = async (token, bookId) => {
  const res = await fetch(`${API_URL}/api/account/progress/${bookId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return await res.json()
}

export const updateSettings = async (token, settings) => {
  const res = await fetch(`${API_URL}/api/account/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ settings }),
  })
  return await res.json()
}

export const updateProfile = async (token, profileData) => {
  const res = await fetch(`${API_URL}/api/account/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })
  return await res.json()
}

export const addToBookshelf = async (token, bookId) => {
  const res = await fetch(`${API_URL}/api/account/bookshelf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ book_id: bookId }),
  })
  return await res.json()
}

// =============================
// Lấy tủ sách của user
// =============================
export const getBookshelf = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/account/bookshelf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data = await res.json() // { books: [...] }

    // Format từng book trong tủ
    const formattedBooks = data.books.map((item) => {
      // item.Book là object book kèm theo entry
      return {
        ...formatterStoryDetail(item.Book),
        savedAt: item.saved_at, // thời gian lưu vào tủ
      }
    })

    return formattedBooks
  } catch (err) {
    console.error('Lỗi khi gọi getBookshelf:', err)
    return []
  }
}

export const removeFromBookshelf = async (token, bookId) => {
  const res = await fetch(`${API_URL}/api/account/bookshelf/${bookId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return await res.json()
}
