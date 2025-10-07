import { API_URL } from './config'

export const getCommentsByChapter = async (chapterId) => {
  const res = await fetch(`${API_URL}/api/chapter/${chapterId}/comment`)
  if (!res.ok) return []
  return res.json()
}

export const getCommentsByUser = async (userId) => {
  const res = await fetch(`${API_URL}/api/user/${userId}/comment`)
  if (!res.ok) return []
  return res.json()
}

export const getAllMyComments = async (token) => {
  const res = await fetch(`${API_URL}/api/user/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) return []
  return res.json()
}

export const createComment = async (
  token,
  chapterId,
  content,
  parentId = null,
) => {
  const res = await fetch(`${API_URL}/api/chapter/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chapter_id: chapterId,
      content,
      parent_id: parentId,
    }),
  })
  if (!res.ok) throw new Error('Tạo comment thất bại')
  return res.json()
}

export const deleteComment = async (token, commentId) => {
  const res = await fetch(`${API_URL}/api/chapter/comment/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Xóa comment thất bại')
  return res.json()
}
