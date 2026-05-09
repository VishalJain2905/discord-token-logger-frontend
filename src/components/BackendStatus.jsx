import { useState, useEffect } from 'react'
import { API_ORIGIN } from '../api'

const BackendStatus = () => {
  const [status, setStatus] = useState('checking')
  const [lastActivity, setLastActivity] = useState(null)
  const [tokenCount, setTokenCount] = useState(0)
  const [error, setError] = useState(null)

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_ORIGIN}/api/health`)
      if (response.ok) {
        const data = await response.json()
        setStatus('connected')
        setError(null)
        return data
      } else {
        throw new Error('Backend not responding')
      }
    } catch (err) {
      setStatus('disconnected')
      setError(err.message)
      return null
    }
  }

  const checkTokens = async () => {
    try {
      const response = await fetch(`${API_ORIGIN}/api/tokens`)
      if (response.ok) {
        const data = await response.json()
        setTokenCount(data.tokens.length)
        if (data.lastModified) {
          setLastActivity(new Date(data.lastModified))
        }
      }
    } catch (err) {
      console.error('Error checking tokens:', err)
    }
  }



  useEffect(() => {
    checkBackendHealth()
    checkTokens()
    
    // Check status every 10 seconds
    const interval = setInterval(() => {
      checkBackendHealth()
      checkTokens()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'disconnected': return 'text-red-400'
      case 'checking': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '🟢'
      case 'disconnected': return '🔴'
      case 'checking': return '🟡'
      case 'error': return '🔴'
      default: return '⚪'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Backend Connected'
      case 'disconnected': return 'Backend Disconnected'
      case 'checking': return 'Checking Status...'
      case 'error': return 'Error Occurred'
      default: return 'Unknown Status'
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Backend Status</h3>
        <button
          onClick={() => {
            checkBackendHealth()
            checkTokens()
          }}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {error && (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
          </div>
        </div>

        {/* Token Count */}
        <div className="flex items-center space-x-3">
          <span className="text-lg">📊</span>
          <div>
            <span className="text-slate-300">
              Tokens Captured: <span className="font-bold text-white">{tokenCount}</span>
            </span>
          </div>
        </div>

        {/* Last Activity */}
        {lastActivity && (
          <div className="flex items-center space-x-3">
            <span className="text-lg">⏰</span>
            <div>
              <span className="text-slate-300 text-sm">
                Last Activity: {lastActivity.toLocaleString()}
              </span>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default BackendStatus
