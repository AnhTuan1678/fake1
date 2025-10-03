import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import StoryDetail from './pages/StoryDetail'
import Reader from './pages/Reader'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/LoginPopup'
import Profile from './pages/Profile'
import Bookshelf from './pages/Bookshelf'
import AddStory from './pages/AddStory'
import AddChapter from './pages/AddChapter'
import Tutorial from './pages/Tutorial'
import { getProfile } from './services/api'
import { useEffect } from 'react'
import { store } from './redux/store'
import { login, logout } from './redux/userSlice'

function App() {
  // Lấy dữ liệu user
  useEffect(() => {
    const token = localStorage.getItem('token')
    async function fetchProfile() {
      try {
        const data = await getProfile(token)
        if (!data.error)
          store.dispatch(
            login({
              username: data.username,
              token: token,
              id: data.id,
              avatarUrl: data['avatar_url'],
            }),
          )
        else {
          store.dispatch(logout())
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.log(error)
        store.dispatch(logout())
        localStorage.removeItem('token')
      }
    }
    if (token) fetchProfile()
  }, [])

  return (
    <div className='app'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/story/:id' element={<StoryDetail />} />
          <Route path='/story/:id/chapter/:chapterIndex' element={<Reader />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/bookshelf' element={<Bookshelf />} />
          <Route path='/action/addStory' element={<AddStory />} />
          <Route path='/action/addChapter' element={<AddChapter />} />
          <Route path='/tutorial' element={<Tutorial />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
