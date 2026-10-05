import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext' 
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 🚀 2. Wrap your <App /> component inside the AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
