import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { SnackbarProvider } from './context/SnackbarProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </Provider>,
)
