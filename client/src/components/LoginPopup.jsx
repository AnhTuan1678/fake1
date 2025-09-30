import { useState, useEffect } from 'react'
import styles from './LoginPopup.module.css'
import {
  login as loginNormal,
  register as registerNormal,
} from '../services/api'
import { useDispatch } from 'react-redux'
import { login } from '../redux/userSlice'

const LoginPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login') // 👈 tab mặc định
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('') // 👈 state lưu lỗi

  const dispatch = useDispatch()

  useEffect(() => {
    if (isOpen) {
      setUsernameOrEmail('')
      setPassword('')
      setEmail('')
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // Gửi login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('') // reset lỗi cũ
    try {
      const data = await loginNormal(usernameOrEmail, password)

      if (data.token) {
        dispatch(login(data))
        localStorage.setItem('token', data.token)
        onClose()
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error(err)
      setError('Đăng nhập thất bại')
    }
  }

  // Gửi register
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await registerNormal(usernameOrEmail, email, password)

      if (!data.error) {
        setError('') // clear lỗi
        setActiveTab('login') // chuyển về login
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error(err)
      setError('Đăng ký thất bại')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Tabs */}
        <div className={styles.tabHeader}>
          <button
            className={`${styles.tab} ${
              activeTab === 'login' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('login')}>
            Đăng nhập
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'register' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('register')}>
            Đăng ký
          </button>
        </div>

        {/* Nội dung */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type='text'
              placeholder='Username hoặc Email'
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value)
                setError('') // xoá lỗi khi gõ lại
              }}
            />
            <input
              type='password'
              placeholder='Mật khẩu'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />

            {/* Hiện lỗi */}
            {error && <div className={styles.error}>{error}</div>}

            <button type='submit'>Đăng nhập</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <input
              type='text'
              placeholder='Username'
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value)
                setError('')
              }}
            />
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
            />
            <input
              type='password'
              placeholder='Mật khẩu'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />

            {/* Hiện lỗi */}
            {error && <div className={styles.error}>{error}</div>}

            <button type='submit'>Đăng ký</button>
          </form>
        )}

        {/* Nút đóng */}
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  )
}

export default LoginPopup
