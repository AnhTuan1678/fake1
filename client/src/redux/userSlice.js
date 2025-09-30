import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: null,
  id: null,
  token: null,
  avatarUrl: null,
  isLoggedIn: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, token, id, avatarUrl } = action.payload
      state.username = username
      state.token = token
      state.id = id
      state.avatarUrl = avatarUrl
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.username = null
      state.token = null
      state.id = null
      state.avatarUrl = null
      state.isLoggedIn = false
    },
    updateToken: (state, action) => {
      state.token = action.payload
    },
    updateAvatar: (state, action) => {
      state.avatarUrl = action.payload
    },
  },
})

export const { login, logout, updateToken, updateAvatar } = userSlice.actions
export default userSlice.reducer
