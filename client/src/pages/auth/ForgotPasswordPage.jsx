import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your UTM email');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
      } else {
        setError(res.data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <div className="auth-success-state">
            <Mail size={48} className="auth-success-icon" />
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to <strong>{email}</strong>.</p>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/login" className="auth-back-link">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
