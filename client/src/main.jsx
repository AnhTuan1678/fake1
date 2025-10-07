import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { SnackbarProvider } from './context/SnackbarProvider.jsx'
import SnowEffect from './components/SnowEffect'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SnackbarProvider>
      <SnowEffect count={40} />
      <App />
    </SnackbarProvider>
  </Provider>,
)
