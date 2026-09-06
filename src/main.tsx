import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DevMenu from './DevMenu'
import './index.css'

const AppShell = () => (
  <div className="w-full h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100 overflow-hidden relative flex flex-col">
    {/* Decorative abstract shapes for colorful kids theme */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-cyan-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }} />
    </div>

    {/* App Container - Full screen on mobile, max-width on very large screens for readability if needed, but the user asked for "sesuaikan full", so we let it fill. We can just give it a subtle colorful background */}
    <div className="relative z-10 w-full h-full mx-auto shadow-2xl flex flex-col overflow-hidden bg-white/40 backdrop-blur-sm transition-all duration-300">
      <App />
      <DevMenu />
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>,
)
