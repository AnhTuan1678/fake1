import NotifyBlock from '../components/NotifyBlock'

const DefaultLayout = ({ children }) => {
  return (
    <div className='container cus-container shadow flex-grow-1 d-flex flex-column'>
      <NotifyBlock>
        <strong>Lưu ý</strong> Đa số ảnh trên trang web đều cần vpn để load
      </NotifyBlock>
      {children}
    </div>
  )
}

export default DefaultLayout
