import './Header.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileMenu from './ProfileMenu'
import SearchBar from './SearchBar'
import AnandaFont from '../assets/Ananda.ttf'
import style from './Header.module.css'

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSearch = (/*query*/) => {}

  return (
    <div className={`${style.header} `}>
      {isMobile ? (
        <div className={`d-flex flex-column align-items-center container p-2 `}>
          <div className={`d-flex align-items-center container p-2 `}>
            <h1
              className={`logo ${style.logo} fs-1 me-4 text-white animate__animated animate__fadeInLeft flex-grow-1`}
              style={{ fontFamily: 'Ananda' }}
              onClick={() => navigate(`/`)}>
              {/* Nadark */}
              {import.meta.env.VITE_APP_NAME}
            </h1>

            <ProfileMenu className='flex-grow-1' />
          </div>
          <SearchBar
            className='flex-grow-1'
            onSearch={(q) => handleSearch(q)}
          />
        </div>
      ) : (
        <div className={`d-flex align-items-center container p-2 `}>
          <div className='flex-grow-1'>
            <h1
              className={`logo ${style.logo} fs-1 me-4 text-white animate__animated animate__fadeInLeft  cursor-pointer d-inline-block`}
              onClick={() => navigate(`/`)}
              style={{ fontFamily: 'Ananda' }}>
              {/* Nadark */}
              {import.meta.env.VITE_APP_NAME}
            </h1>
          </div>

          <SearchBar
            className='flex-grow-1'
            onSearch={(q) => handleSearch(q)}
          />
          <ProfileMenu className='flex-grow-1' />
        </div>
      )}
    </div>
  )
}

export default Header
