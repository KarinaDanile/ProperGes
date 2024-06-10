import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastProvider } from 'rc-toastr'
import "rc-toastr/dist/index.css"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-tooltip/dist/react-tooltip.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider
      config={{
        position: 'top-right',
        duration: 1000,
        
      }}
     
    >
      <App />
    </ToastProvider>
  </React.StrictMode>,
)
