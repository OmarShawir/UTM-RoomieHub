import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, XCircle, Loader, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import './AuthPages.css';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState(searchParams.get('email') || '');

  // Token verification state — starts as 'pending' so user must click button
  // (auto-verify on load would be consumed by Gmail's link scanner before user clicks)
  const [verifyStatus, setVerifyStatus] = useState(token ? 'pending' : 'idle');
  const [verifyMessage, setVerifyMessage] = useState('');

  // Resend state
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manual verify — only called on button click
  const handleVerify = async () => {
    setVerifyStatus('loading');
    try {
      const res = await api.get(`/auth/verify-email?token=${token}`);
      if (res.data.success) {
        setVerifyStatus('success');
        setVerifyMessage('Your email has been verified successfully! You can now log in.');
      } else {
        setVerifyStatus('error');
        setVerifyMessage(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setVerifyStatus('error');
      setVerifyMessage(err?.response?.data?.message || 'Invalid or expired verification link.');
    }
  };

  const handleResend = async () => {
    if (!email) {
      setResendError('Please enter your email address');
      return;
    }
    setLoading(true);
    setResendError('');
    try {
      await api.post('/auth/resend-verification', { email });
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (err) {
      setResendError(err?.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  // ── Pending: token present, awaiting user click ───────
  if (verifyStatus === 'pending') {
    return (
      <div className="auth-page">
        <div className="card auth-card" style={{ textAlign: 'center' }}>
          <ShieldCheck size={48} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--color-primary)' }} />
          <h2>Confirm Email Verification</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28 }}>
            Click the button below to verify your UTM RoomieHub account.
          </p>
          <button onClick={handleVerify} className="btn btn-primary auth-submit">
            Verify My Account
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────
  if (verifyStatus === 'loading') {
    return (
      <div className="auth-page">
        <div className="card auth-card" style={{ textAlign: 'center' }}>
          <Loader size={40} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
          <h2>Verifying your email...</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────
  if (verifyStatus === 'success') {
    return (
      <div className="auth-page">
        <div className="card auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={48} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--color-success)' }} />
          <h2>Email Verified!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>{verifyMessage}</p>
          <Link to="/login" className="btn btn-primary auth-submit" style={{ display: 'inline-block' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────
  if (verifyStatus === 'error') {
    return (
      <div className="auth-page">
        <div className="card auth-card" style={{ textAlign: 'center' }}>
          <XCircle size={48} style={{ margin: '0 auto 16px', display: 'block', color: '#dc2626' }} />
          <h2>Verification Failed</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>{verifyMessage}</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
            Request a new verification link:
          </p>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="resendEmail">Your UTM Email</label>
            <input
              id="resendEmail"
              type="email"
              placeholder="yourname@graduate.utm.my"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {resendError && <div className="auth-error">{resendError}</div>}
          <button onClick={handleResend} className="btn btn-secondary auth-submit" disabled={loading}>
            {loading ? 'Sending...' : resent ? 'Email Sent! Check spam folder.' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    );
  }

  // ── Idle: no token, post-registration waiting page ────
  return (
    <div className="auth-page">
      <div className="card auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-icon-circle">
          <Mail size={28} />
        </div>
        <h2>Verify Your Email</h2>
        <p style={{ marginBottom: 20 }}>
          We've sent a verification email to your UTM email address
        </p>

        <div className="auth-info-box" style={{ textAlign: 'left' }}>
          <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Click the verification link in the email to activate your account. <strong>Check your spam folder</strong> if you don't see it.</span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '20px 0 10px' }}>
          Didn't receive the email?
        </p>

        <div className="form-group" style={{ textAlign: 'left' }}>
          <label htmlFor="resendEmail">Your UTM Email</label>
          <input
            id="resendEmail"
            type="email"
            placeholder="yourname@graduate.utm.my"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {resendError && <div className="auth-error">{resendError}</div>}

        <button onClick={handleResend} className="btn btn-secondary auth-submit" disabled={loading}>
          {loading ? 'Sending...' : resent ? 'Email Sent! Check spam folder.' : 'Resend Verification Email'}
        </button>

        <Link to="/login" className="btn btn-primary auth-submit" style={{ display: 'inline-block' }}>
          Go to Login
        </Link>
      </div>
    </div>
  );
}
