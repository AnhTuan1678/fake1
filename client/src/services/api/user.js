import { API_URL } from './config'

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const getUserById = async (userId) => {
  const res = await fetch(`${API_URL}/api/user/${userId}`)
  return res.json()
}

export const updateProfile = async (token, formData) => {
  const res = await fetch(`${API_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  if (!res.ok) {
    throw new Error('Upload avatar thất bại')
  }
  return res.json()
}

export const updateAvatar = async (token, formData) => {
  const res = await fetch(`${API_URL}/api/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return res.json()
}

export const updateSettings = async (token, settings) => {
  const res = await fetch(`${API_URL}/api/user/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ settings }),
  })
  return res.json()
}
