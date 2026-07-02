import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    matricNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.matricNo || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (!form.email.endsWith('@graduate.utm.my')) {
      setError('Please use your UTM email (@graduate.utm.my)');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        fullName: form.fullName,
        studentId: form.matricNo,
        email: form.email,
        password: form.password,
      });
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-header">
          <img src="/Logo1.svg" alt="UTM RoomieHub" className="auth-logo theme-logo-light" />
          <img src="/LogoDarkmode.png" alt="UTM RoomieHub" className="auth-logo theme-logo-dark" />
          <h2>Create Account</h2>
          <p>Join UTM RoomieHub to find your perfect student housing</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="matricNo">Student ID</label>
            <input
              id="matricNo"
              name="matricNo"
              type="text"
              placeholder="e.g., A21EC0001"
              value={form.matricNo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">UTM Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="yourname@graduate.utm.my"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <label className="auth-checkbox-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to the Terms of Service and Privacy Policy
          </label>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign In</Link>
          </p>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/" className="auth-back-link">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
