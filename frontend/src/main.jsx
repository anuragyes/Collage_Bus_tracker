import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/authContext.js'
  import { Toaster } from "react-hot-toast";
createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App />
      {/* Toaster should be mounted once in your app */}
   <Toaster position="top-center"  />
    </AuthProvider>
)
