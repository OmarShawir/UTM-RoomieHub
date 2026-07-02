import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/unauthorized'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-col brand-col">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/Logo1.svg" alt="UTM RoomieHub" className="site-footer-logo theme-logo-light" />
            <img src="/LogoDarkmode.png" alt="UTM RoomieHub" className="site-footer-logo theme-logo-dark" />
          </div>
          <p>
            Connecting UTM students with verified rooms, trusted roommates, and smarter housing choices.
          </p>
        </div>

        <div className="site-footer-links">
          <div>
            <h3>Explore</h3>
            <Link to="/search">Search Listings</Link>
            <Link to="/ai-match">AI Match</Link>
            <Link to="/my-listings">My Listings</Link>
          </div>

          <div>
            <h3>Support</h3>
            <Link to="/chat">Chat</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/register">Create Account</Link>
          </div>

          <div>
            <h3>Policies</h3>
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 UTM RoomieHub. Exclusive to Universiti Teknologi Malaysia students.</p>
      </div>
    </footer>
  );
}