import { useState } from 'react'
import TokenDrainer from './components/TokenDrainer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
        </div>
        </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <a href="#" className="text-white font-medium text-sm hover:text-blue-400 transition-colors">
                Getting Started
              </a>
              <a href="#" className="text-slate-300 font-medium text-sm hover:text-white transition-colors">
                Premium
              </a>
        </div>
      </div>
        </div>
      </nav>

      {/* Main Content */}
      <TokenDrainer />
    </div>
  )
}

export default App