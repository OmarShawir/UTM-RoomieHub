import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, FileText, MessageSquare, User, LogOut, Bell, Menu, X, LayoutDashboard, Sparkles, Heart, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/unauthorized'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <img src="public/Logo1.svg" alt="UTM RoomieHub" className="logo-img" />
        </NavLink>

        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          {user && user.role !== 'admin' && (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <Home size={18} />
                <span>Home</span>
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <Search size={18} />
                <span>Search</span>
              </NavLink>
              <NavLink to="/ai-match" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <Sparkles size={18} />
                <span>AI Match</span>
              </NavLink>
              <NavLink to="/my-listings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <FileText size={18} />
                <span>My Listings</span>
              </NavLink>
              <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <MessageSquare size={18} />
                <span>Chat</span>
              </NavLink>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <User size={18} />
                <span>Users</span>
              </NavLink>
              <NavLink to="/admin/listings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <FileText size={18} />
                <span>Listings</span>
              </NavLink>
              <NavLink to="/admin/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <AlertTriangle size={18} />
                <span>Reports</span>
              </NavLink>
              <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <Sparkles size={18} />
                <span>Analytics</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Right Actions - Desktop */}
        <div className="navbar-right desktop-only">
          {user ? (
            <>
              <NavLink to="/notifications" className="nav-notification">
                <Bell size={20} />
                <span className="notification-badge">2</span>
              </NavLink>

              <div className="dropdown-container" ref={dropdownRef}>
                <button
                  className="navbar-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.full_name || 'User Profile'}
                    />
                  ) : (
                    <User size={24} />
                  )}
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-user-info">
                      <p className="dropdown-user-name">{user.full_name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <NavLink to="/profile" className="dropdown-item">
                      <User size={16} />
                      <span>My Profile</span>
                    </NavLink>
                    {user.role !== 'admin' && (
                      <NavLink to="/wishlist" className="dropdown-item">
                        <Heart size={16} />
                        <span>Wishlist</span>
                      </NavLink>
                    )}
                    {user.role === 'admin' && (
                      <NavLink to="/admin" className="dropdown-item text-primary">
                        <LayoutDashboard size={16} />
                        <span>Admin Panel</span>
                      </NavLink>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <NavLink to="/login" className="btn btn-secondary btn-sm">Sign In</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="mobile-only flex-align-center">
          {user && (
            <NavLink to="/notifications" className="nav-notification margin-r-12">
              <Bell size={20} />
              <span className="notification-badge">2</span>
            </NavLink>
          )}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-links">
            {user && user.role !== 'admin' && (
              <>
                <NavLink to="/" className="mobile-nav-link">
                  <Home size={20} />
                  <span>Home</span>
                </NavLink>
                <NavLink to="/search" className="mobile-nav-link">
                  <Search size={20} />
                  <span>Search</span>
                </NavLink>
                <NavLink to="/ai-match" className="mobile-nav-link">
                  <Sparkles size={20} />
                  <span>AI Match</span>
                </NavLink>
                <NavLink to="/my-listings" className="mobile-nav-link">
                  <FileText size={20} />
                  <span>My Listings</span>
                </NavLink>
                <NavLink to="/chat" className="mobile-nav-link">
                  <MessageSquare size={20} />
                  <span>Chat</span>
                </NavLink>
              </>
            )}

            {user && user.role === 'admin' && (
              <>
                <NavLink to="/admin" end className="mobile-nav-link">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/users" className="mobile-nav-link">
                  <User size={20} />
                  <span>Users</span>
                </NavLink>
                <NavLink to="/admin/listings" className="mobile-nav-link">
                  <FileText size={20} />
                  <span>Listings</span>
                </NavLink>
                <NavLink to="/admin/reports" className="mobile-nav-link">
                  <Bell size={20} />
                  <span>Reports</span>
                </NavLink>
                <NavLink to="/admin/analytics" className="mobile-nav-link">
                  <Sparkles size={20} />
                  <span>Analytics</span>
                </NavLink>
              </>
            )}

            {user ? (
              <div className="mobile-drawer-user-section">
                <div className="mobile-drawer-divider" />
                <NavLink to="/profile" className="mobile-nav-link">
                  <User size={20} />
                  <span>My Profile</span>
                </NavLink>
                {user.role !== 'admin' && (
                  <NavLink to="/wishlist" className="mobile-nav-link">
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </NavLink>
                )}
                <button className="mobile-nav-link mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="mobile-drawer-auth">
                <div className="mobile-drawer-divider" />
                <NavLink to="/login" className="mobile-nav-link">Sign In</NavLink>
                <NavLink to="/register" className="mobile-nav-link primary-auth">Sign Up</NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}