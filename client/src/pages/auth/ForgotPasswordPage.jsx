import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your UTM email');
      return;
    }
    setError('');
    setLoading(true);

    // Mock request — replace with real API call later
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        {!sent ? (
          <>
            <div className="auth-header">
              <h2>Forgot Password?</h2>
              <p>Enter your UTM email and we'll send you a reset link</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">UTM Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="yourname@utm.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" className="auth-back-link">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className="auth-icon-circle success">
              <Mail size={28} />
            </div>
            <h2>Check Your Inbox</h2>
            <p style={{ marginBottom: 20 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn btn-primary auth-submit" style={{ display: 'inline-block' }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}