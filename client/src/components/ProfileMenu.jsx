import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './ProfileMenu.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useSnackbar } from '../context/SnackbarContext'
import { logout } from '../redux/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faBookmark,
  faCog,
  faSignOut,
  faSignIn,
  faTrash,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { clearCache } from '../services/cacheFetch'
import nova from '../assets/image/GuestAvatar.png' // avatar mặc định

const ProfileMenu = ({ className }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  const [isOpen, setIsOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const location = useLocation()
  const { showSnackbar } = useSnackbar()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
  }

  const onOpen = () => setIsOpen(!isOpen)
  const onClose = () => {
    setClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setClosing(false)
    }, 200)
  }

  return (
    <div className={`${className} d-flex`}>
      <div className='flex-grow-1'></div>
      <div className='dropdown' onClick={onOpen}>
        <img
          className={`${styles.avatar} dropdown-toggle`}
          src={isLoggedIn ? user.avatarUrl : nova}
          alt={isLoggedIn ? user.username : 'Guest'}
        />
        <div
          className={`cus-overlay animate__animated animate__faster ${
            isOpen
              ? 'show animate__fadeIn'
              : closing
              ? 'show animate__fadeOut'
              : 'd-none'
          }`}
          onClick={onClose}></div>

        <div
          className={`dropdown-menu p-0 animate__animated animate__faster ${
            isOpen
              ? 'show animate__fadeInDown'
              : closing
              ? 'animate__fadeOutUp show'
              : ''
          } ${styles.dropdownMenu}`}>
          {isLoggedIn ? (
            <>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem}`}
                onClick={() => navigate('/profile')}>
                <FontAwesomeIcon icon={faUser} />
                Tài khoản
              </button>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem}`}
                onClick={() => navigate('/bookshelf')}>
                <FontAwesomeIcon icon={faBookmark} />
                Đánh dấu
              </button>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem}`}
                onClick={() => navigate('/settings')}>
                <FontAwesomeIcon icon={faCog} />
                Cài đặt
              </button>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem} text-danger hover-bg-danger`}
                onClick={() => {
                  clearCache()
                  showSnackbar({ message: 'Đã xoá cache' })
                }}>
                <FontAwesomeIcon icon={faTrash} />
                Xóa cache
              </button>
              <div
                className={`dropdown-divider ${styles.dropdownDivider}`}></div>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem}`}
                onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOut} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem}`}
                onClick={() =>
                  navigate('/auth?action=l', {
                    state: { from: location.pathname },
                  })
                }>
                <FontAwesomeIcon icon={faSignIn} />
                Đăng nhập
              </button>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem}`}
                onClick={() =>
                  navigate('/auth?action=r', {
                    state: { from: location.pathname },
                  })
                }>
                <FontAwesomeIcon icon={faUserPlus} />
                Đăng ký
              </button>
              <button
                className={`dropdown-item slide-in-hover ${styles.dropdownItem} text-danger hover-bg-danger`}
                onClick={() => {
                  clearCache()
                  showSnackbar({ message: 'Đã xoá cache' })
                }}>
                <FontAwesomeIcon icon={faTrash} />
                Xóa cache
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileMenu
