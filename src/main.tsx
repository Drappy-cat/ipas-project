import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DevMenu from './DevMenu'
import './index.css'

const AppShell = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center sm:p-6 lg:p-8 relative overflow-hidden">
    {/* Premium Background for Desktop */}
    <div className="absolute inset-0 z-0 hidden sm:block">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-50 via-emerald-100 to-cyan-50"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-200/40 blur-3xl mix-blend-multiply animate-pulse-glow"></div>
      <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-teal-200/40 blur-3xl mix-blend-multiply animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-cyan-200/40 blur-3xl mix-blend-multiply animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      {/* subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBWMGgtNHYxMGgtNHYtMTBoLTR2MTBoLTR2LTEwaC00djEwaC00di0xMGgtNHYxMGgtNHYtMTBoLTR2MTBoLTR2LTEweiIgZmlsbD0icmdiYSgwLDAsMCwwLjAxKSIvPgo8L3N2Zz4=')] opacity-50"></div>
    </div>

    {/* Device Frame */}
    <div className="relative z-10 w-full h-screen sm:h-[850px] sm:max-h-[90vh] sm:max-w-[400px] lg:max-w-[1024px] lg:h-[700px] xl:max-w-[1200px] xl:h-[800px] sm:rounded-[3rem] lg:rounded-[2rem] sm:shadow-2xl sm:border-[8px] sm:border-gray-900 overflow-hidden bg-white flex flex-col transition-all duration-700 ease-in-out">
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
