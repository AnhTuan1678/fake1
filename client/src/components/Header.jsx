import './Header.module.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileMenu from './ProfileMenu'
import SearchBar from './SearchBar'
import style from './Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import NavBar from './NavBar'

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [animation, setAnimation] = useState('')

  const navigate = useNavigate()

  const fixedRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (fixedRef.current) {
      setHeight(fixedRef.current.offsetHeight) // Hoặc .getBoundingClientRect().height
    }
  }, [])

  // scroll xuống → ẩn header
  // scroll lên → hiện header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (delta > 0 && currentScrollY > 50) {
        if (show) setAnimation('animate__slideOutUp')
        setShow(false)
      } else if (delta < -10) {
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
      <div
        className={`${style.header} animate__animated ${animation}`}
        ref={fixedRef}>
        {isMobile ? (
          <MobileHeader />
        ) : (
          <div className={`d-flex align-items-center container p-1`}>
            <div className='flex-grow-1 d-flex'>
              <h1
                className={`pt-1 logo fs-4 animate__animated animate__fadeInLeft  cursor-pointer d-inline-block p-0 m-0 ${style.logo}`}
                onClick={() => navigate(`/`)}
                style={{ fontFamily: 'Ananda' }}>
                {/* Nadark */}
                {import.meta.env.VITE_APP_NAME}
              </h1>
            </div>
            <SearchBar />
            <ProfileMenu className='ps-2' />
          </div>
        )}
      </div>
      <div style={{ height: height }}></div>
      <NavBar />
    </>
  )
}

const MobileHeader = () => {
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className='d-flex h-100'>
      {/* Nút toggle */}
      <button
        className='btn ps-1 pe-1 m-0 p-0 btn-light rounded-0 shadow'
        onClick={() => setShowSearch((prev) => !prev)}>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </button>
      <div className='d-flex w-100 flex-column p-0 ms-2 me-2 justify-content-center'>
        {/* Logo + Profile */}
        {!showSearch && (
          <div className='d-flex align-items-center p-0 m-0 animate__animated animate__fadeInDown animate__faster'>
            <h1
              className={`logo fs-4 m-0 ${style.logo} cursor-pointer`}
              style={{ fontFamily: 'Ananda' }}
              onClick={() => navigate('/')}>
              {import.meta.env.VITE_APP_NAME}
            </h1>
            <ProfileMenu className='flex-grow-1' />
          </div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <div className='d-flex p-0 animate__animated animate__fadeInDown animate__faster'>
            <SearchBar className='w-100' />
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
