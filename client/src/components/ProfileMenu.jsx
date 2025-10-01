import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfileMenu.module.css'
import LoginPopup from './LoginPopup'
import Snackbar from './SnackBar'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faBookmark,
  faCog,
  faSignOut,
  faSignIn,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { clearCache } from '../services/cacheFetch'

const ProfileMenu = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [snack, setSnack] = useState(false)

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
          <button
            className={`dropdown-item ${styles.dropdownItem} text-danger hover-bg-danger`}
            onClick={async () => {
              clearCache()
              console.log('Đã xoá cache')
              setSnack('Đã xoá cache')
            }}>
            <FontAwesomeIcon icon={faTrash} />
            Xóa cache
          </button>
          <div className={`dropdown-divider ${styles.dropdownDivider}`}></div>
          <button
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOut} />
            Đăng xuất
          </button>
        </div>
        {snack && <Snackbar message={snack} onClose={() => setSnack(null)} />}
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
            src={avatarUrl}
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
            <FontAwesomeIcon icon={faSignIn} />
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
