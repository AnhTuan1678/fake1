import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfileMenu.module.css'
import LoginPopup from './LoginPopup'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faBookmark,
  faCog,
  faSignOut,
  faSignIn,
} from '@fortawesome/free-solid-svg-icons'
const ProfileMenu = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const { avatarUrl, isLoggedIn, username } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  const closeMenu = () => {
    setClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setClosing(false)
    }, 300)
  }

  const urlAvatarBase =
    'https://scontent-sin2-2.xx.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeGY5-ZpsNOey_c7-29U9g91Wt9TLzuBU1Ba31MvO4FTUOlq_2GlO-T68hCT4Ni_iLwpIsH52d3rp2wUR1p-rnV1&_nc_ohc=2CKwNU0IXg0Q7kNvwHBREsT&_nc_oc=AdnvjRKArtcxP6w3Dc9DyiCWgOY2rQtOxIwX2qE9HpiHp6-Ot6bILOsC4vhTGpRfQsAB-eFTQVRB2Kldj-RuZabP&_nc_zt=24&_nc_ht=scontent-sin2-2.xx&oh=00_AfZ_BT4Z8W-fThCJOAZQoTdZFDXNo72qpU1vo_V3WC0HuA&oe=68FE523A'

  const DropMenu = () => {
    return (
      <>
        <div
          className={`${styles.dropdownOverlay} animate__animated ${
            isOpen ? 'show animate__fadeIn' : 'd-none'
          } ${styles.backdrop}`}
          onClick={closeMenu}></div>
        <div
          className={`dropdown-menu animate__animated animate__faster ${
            isOpen
              ? 'show animate__fadeInDown'
              : closing
              ? 'animate__fadeOutUp show'
              : ''
          } ${styles.dropdownMenu}`}>
          <button
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={() => {
              // Handle profile click
              navigate('/profile')
            }}>
            <FontAwesomeIcon icon={faUser} />
            Tài khoản
          </button>
          <button
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={() => {
              // Handle profile click
              navigate('/bookshelf')
            }}>
            <FontAwesomeIcon icon={faBookmark} />
            Đánh dấu
          </button>
          <button
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={() => {
              // Handle settings click
              navigate('/settings')
            }}>
            <FontAwesomeIcon icon={faCog} />
            Cài đặt
          </button>
          <div className={`dropdown-divider ${styles.dropdownDivider}`}></div>
          <button
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOut} />
            Đăng xuất
          </button>
        </div>
      </>
    )
  }
  return (
    <div className={`${className} d-flex`}>
      <div className='flex-grow-1'></div>
      {isLoggedIn ? (
        <div
          className={`cursor-pointer ${styles.dropdownContainer}`}
          onClick={toggleMenu}>
          <img
            className={styles.avatar}
            src={avatarUrl || urlAvatarBase}
            alt={username}
          />
          <DropMenu />
        </div>
      ) : (
        <div
          className={`${styles.avatar} align-items-center justify-content-center position-relative`}>
          <button
            className={`btn btn-link ${styles.login} position-absolute top-50 translate-middle p-1`}
              onClick={() => setShowLogin(true)}>
              <FontAwesomeIcon icon={faSignIn}/>
            Đăng nhập
          </button>
        </div>
      )}
      <LoginPopup
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false)
        }}
      />
    </div>
  )
}

export default ProfileMenu
