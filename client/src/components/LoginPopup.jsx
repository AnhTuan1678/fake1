import { useState } from 'react'
import styles from './LoginPopup.module.css'
import {
  login as loginNormal,
  register as registerNormal,
} from '../services/api'
import { useDispatch } from 'react-redux'
import { login } from '../redux/userSlice'

const LoginPopup = ({ activeTab, onClose }) => {
  const [tab, setTab] = useState(activeTab || 'login')
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch()

  // Gửi login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
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

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await registerNormal(usernameOrEmail, email, password)

      if (!data.error) {
        setError('')
        setTab('login')
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error(err)
      setError('Đăng ký thất bại')
    }
  }

  return (
    <div className=''>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Tabs */}
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tab} ${
                tab === 'login' ? styles.active : ''
              }`}
              onClick={() => setTab('login')}>
              Đăng nhập
            </button>
            <button
              className={`${styles.tab} ${
                tab === 'register' ? styles.active : ''
              }`}
              onClick={() => setTab('register')}>
              Đăng ký
            </button>
          </div>

          {/* Nội dung */}
          {tab === 'login' ? (
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
    </div>
  )
}

export default LoginPopup
