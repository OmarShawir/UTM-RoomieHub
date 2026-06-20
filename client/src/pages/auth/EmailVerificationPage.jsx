import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import './AuthPages.css';

export default function EmailVerificationPage() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

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
          <span>Click the verification link in the email to activate your account.</span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
          Didn't receive the email?
        </p>

        <button onClick={handleResend} className="btn btn-secondary auth-submit">
          {resent ? 'Email Sent!' : 'Resend Verification Email'}
        </button>

        <Link to="/login" className="btn btn-primary auth-submit" style={{ display: 'inline-block' }}>
          Go to Login
        </Link>
      </div>
    </div>
  );
}