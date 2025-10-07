import { API_URL } from './config'

export const login = async (usernameOrEmail, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password }),
  })
  return res.json()
}

export const register = async (username, email, password) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  return res.json()
}

export const changePassword = async (token, oldPassword, newPassword) => {
  const res = await fetch(`${API_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  })
  console.log(res)
  if (!res.ok) throw new Error('Đổi mật khẩu thất bại')
  return res.json()
}
