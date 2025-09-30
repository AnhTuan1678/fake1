import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// Key lưo vào localStorage
const STORAGE_KEY = 'userState'

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (!serializedState) return undefined
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Load state error:', err)
    return undefined
  }
}

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (err) {
    console.error('Save state error:', err)
  }
}

const persistedState = loadState()

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: persistedState,
})

store.subscribe(() => saveState(store.getState()))
