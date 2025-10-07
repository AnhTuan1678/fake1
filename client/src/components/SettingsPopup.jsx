import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faSave, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { userAPI } from '../services/api'

const SettingsPopup = ({ defaultSetting, onClose, onSave, onChange }) => {
  const [settings, setSettings] = useState(defaultSetting)
  const [closing, setClosing] = useState(false) // để trigger animation out

  const currentUser = useSelector((state) => state.user)

  useEffect(() => {
    onChange && onChange(settings)
  }, [onChange, settings])

  const handleResetButton = async () => {
    const DEFAULT_SETTINGS = {
      fontSize: '18px',
      fontFamily: 'Times New Roman',
      lineHeight: 1.5,
      zoom: 1,
    }
    setSettings(DEFAULT_SETTINGS)
  }

  const handleSaveButton = async () => {
    localStorage.setItem('readerSettings', JSON.stringify(settings))

    const token = currentUser.token
    if (token) {
      try {
        await userAPI.updateSettings(token, settings)
        console.log('Đã lưu setting lên server')
        onSave(settings)
        handleClose() // đóng sau khi lưu
      } catch (err) {
        console.error('Lỗi khi lưu setting:', err)
      }
    } else {
      handleClose()
    }
  }

  // đóng với animation
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose(settings)
      setClosing(false)
    }, 300) // thời gian khớp với Animate.css
  }

  return (
    <>
      {/* overlay */}
      <div
        className={`cus-overlay animate__animated animate__faster ${
          closing ? 'animate__fadeOut' : 'animate__fadeIn'
        }`}
        style={{ zIndex: 999 }}
        onClick={handleClose}></div>

      {/* popup */}
      <div
        className={`position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow text-black animate__animated animate__faster ${
          closing ? 'animate__fadeOutDown' : 'animate__fadeInDown'
        }`}
        style={{ zIndex: 1000, minWidth: '350px' }}
        onClick={(e) => e.stopPropagation()}>
        {/* Nút close */}
        <button
          className='btn btn-light position-absolute top-0 end-0 m-2 p-1'
          onClick={handleClose}
          style={{ borderRadius: '50%', width: '30px', height: '30px' }}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h5>Settings</h5>

        {/* font size */}
        <div className='mb-2 d-flex'>
          <label className='text-center'>Font Size:</label>
          <div className='flex-grow-1'></div>
          <h6 className='text-center p-0 m-0'>{settings.fontSize}</h6>
          <input
            type='range'
            min='12'
            max='36'
            value={parseInt(settings.fontSize, 10)}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                fontSize: `${e.target.value}px`,
              }))
            }
          />
        </div>

        {/* font family */}
        <div className='mb-2 d-flex align-items-center'>
          <label className='text-center'>Font:</label>
          <div className='flex-grow-1'></div>
          <select
            className='form-select w-auto'
            value={settings.fontFamily}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                fontFamily: e.target.value,
              }))
            }>
            <option value='Arial' style={{ fontFamily: 'Arial' }}>
              Arial
            </option>
            <option
              value='Times New Roman'
              style={{ fontFamily: 'Times New Roman' }}>
              Times New Roman
            </option>
            <option value='Verdana' style={{ fontFamily: 'Verdana' }}>
              Verdana
            </option>
            <option value='Tahoma' style={{ fontFamily: 'Tahoma' }}>
              Tahoma
            </option>
          </select>
        </div>

        {/* line height */}
        <div className='mb-2 d-flex align-items-center'>
          <label className='text-center'>Line Height:</label>
          <div className='flex-grow-1'></div>
          <h6 className='text-center p-0 m-0'>{settings.lineHeight}</h6>
          <input
            type='range'
            min='1'
            max='2'
            step='0.1'
            value={settings.lineHeight}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                lineHeight: parseFloat(e.target.value),
              }))
            }
          />
        </div>

        {/* zoom */}
        <div className='mb-2 d-flex align-items-center'>
          <label className='text-center'>Zoom:</label>
          <div className='flex-grow-1'></div>
          <h6 className='text-center p-0 m-0'>{`${parseInt(
            settings.zoom * 100,
          )}%`}</h6>
          <input
            type='range'
            min='50'
            max='200'
            value={parseInt(settings.zoom * 100)}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                zoom: e.target.value / 100,
              }))
            }
          />
        </div>

        <div className='mt-4 d-flex'>
          {/* Nút reset */}
          <button
            className='btn btn-warning d-flex'
            onClick={handleResetButton}>
            <FontAwesomeIcon icon={faRefresh} />
          </button>
          <div className='flex-grow-1'></div>
          {/* Nút Save */}
          <button className='btn btn-success d-flex' onClick={handleSaveButton}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      </div>
    </>
  )
}

export default SettingsPopup
