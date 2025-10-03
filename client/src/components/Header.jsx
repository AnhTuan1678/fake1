import './Header.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileMenu from './ProfileMenu'
import SearchBar from './SearchBar'
import style from './Header.module.css'

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [animation, setAnimation] = useState('')

  const navigate = useNavigate()

  // scroll xuống → ẩn header
  // scroll lên → hiện header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        if (show) setAnimation('animate__slideOutUp')
        setShow(false)
      } else {
        if (!show) setAnimation('animate__slideInDown')
        setShow(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, show])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div className={`${style.header} animate__animated ${animation}`}>
        {isMobile ? (
          <div
            className={`d-flex flex-column align-items-center container p-1`}>
            <div className={`d-flex align-items-center container p-1`}>
              <h1
                className={`logo fs-4 animate__animated animate__fadeInLeft flex-grow-1 p-0 m-0`}
                style={{ fontFamily: 'Ananda' }}
                onClick={() => navigate(`/`)}>
                Nadark
                {/* {import.meta.env.VITE_APP_NAME} */}
              </h1>

              <ProfileMenu className='flex-grow-1' />
            </div>
            <SearchBar className='flex-grow-1' />
          </div>
        ) : (
          <div className={`d-flex align-items-center container p-1`}>
            <div className='flex-grow-1'>
              <h1
                className={`logo fs-4 animate__animated animate__fadeInLeft  cursor-pointer d-inline-block p-0 m-0`}
                onClick={() => navigate(`/`)}
                style={{ fontFamily: 'Ananda' }}>
                Nadark
                {/* {import.meta.env.VITE_APP_NAME} */}
              </h1>
            </div>

            <SearchBar />
            <ProfileMenu className='ps-2' />
          </div>
        )}
      </div>
      <div style={{ height: isMobile ? '90px' : '50px' }}></div>
    </>
  )
}

export default Header
