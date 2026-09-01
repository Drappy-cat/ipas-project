import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DevMenu from './DevMenu'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <DevMenu />
  </React.StrictMode>,
)
