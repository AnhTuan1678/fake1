import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout'
import Home from './pages/Home'
import StoryDetail from './pages/StoryDetail'
import Reader from './pages/Reader'
import Header from './components/Header'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Bookshelf from './pages/Bookshelf'
import AddStory from './pages/AddStory'
import AddChapter from './pages/AddChapter'
import Tutorial from './pages/Tutorial'
import RecentlyRead from './pages/Recently'
import UserProfile from './pages/UserProfile'
import UserAuth from './pages/UserAuth'
import { getProfile } from './services/api/user'
import { useEffect } from 'react'
import { store } from './redux/store'
import { login, logout } from './redux/userSlice'
import SearchPage from './pages/SearchPage'
import './assets/styles/index.css'
import NotFound from './pages/NotFound'

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
          <Route
            path='/'
            element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            }
          />
          <Route path='/story/:id' element={<StoryDetail />} />
          <Route path='/story/:id/chapter/:chapterIndex' element={<Reader />} />
          <Route path='/profile' element={<Profile />} />
          <Route
            path='/bookshelf'
            element={
              <DefaultLayout>
                <Bookshelf />
              </DefaultLayout>
            }
          />
          <Route path='/action/addStory' element={<AddStory />} />
          <Route path='/action/addChapter' element={<AddChapter />} />
          <Route path='/tutorial' element={<Tutorial />} />
          <Route
            path='/recently'
            element={
              <DefaultLayout>
                <RecentlyRead />
              </DefaultLayout>
            }
          />
          <Route path='/user' element={<UserProfile />} />
          <Route path='/auth' element={<UserAuth />} />
          <Route path='/hot' element={<DefaultLayout></DefaultLayout>} />
          <Route
            path='/search'
            element={
              <DefaultLayout>
                <SearchPage />
              </DefaultLayout>
            }
          />
          <Route path='/*' element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
