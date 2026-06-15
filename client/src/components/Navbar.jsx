import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <img src="/logo.png" alt="UTM RoomieHub" height={36} />
          <span>RoomieHub</span>
        </NavLink>

        {/* Student Nav Links */}
        {user && user.role !== 'admin' && (
          <div className="navbar-links">
            <NavLink to="/"              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
            <NavLink to="/search"        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Search</NavLink>
            <NavLink to="/ai-match"      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>AI Match</NavLink>
            <NavLink to="/my-listings"   className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Listings</NavLink>
            <NavLink to="/chat"          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chat</NavLink>
          </div>
        )}

        {/* Admin Nav Links */}
        {user && user.role === 'admin' && (
          <div className="navbar-links">
            <NavLink to="/admin"            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            <NavLink to="/admin/users"      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Users</NavLink>
            <NavLink to="/admin/listings"   className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Listings</NavLink>
            <NavLink to="/admin/reports"    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Reports</NavLink>
            <NavLink to="/admin/analytics"  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Analytics</NavLink>
          </div>
        )}

        {/* Right Side */}
        <div className="navbar-right">
          {user ? (
            <>
              <button className="navbar-avatar" onClick={() => navigate('/profile')}>
                <img
                  src={user.profile_picture || '/default-avatar.png'}
                  alt={user.full_name}
                />
              </button>
            </>
          ) : (
            <div className="navbar-auth">
              <NavLink to="/login"    className="btn btn-secondary">Sign In</NavLink>
              <NavLink to="/register" className="btn btn-primary">Sign Up</NavLink>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
