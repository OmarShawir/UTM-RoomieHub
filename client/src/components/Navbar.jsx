import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, FileText, MessageSquare, User, LogOut, Bell, Menu, X, LayoutDashboard, Sparkles, Heart, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DEFAULT_AVATAR } from '../utils/defaults';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        if (res.data.success) {
          setConversations(res.data.conversations);
          const total = res.data.conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
          setUnreadCount(total);
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      }
    };

    fetchConversations();

    // Poll every 10 seconds to keep the notification badge real-time
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/unauthorized'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/Logo1.svg" alt="UTM RoomieHub" className="logo-img theme-logo-light" />
          <img src="/LogoDarkmode.png" alt="UTM RoomieHub" className="logo-img theme-logo-dark" />
        </NavLink>

        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          {(!user || user.role !== 'admin') && (
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Home size={18} />
              <span>Home</span>
            </NavLink>
          )}
          {user && user.role !== 'admin' && (
            <>
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
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              borderRadius: '50%',
              transition: 'background 0.2s, color 0.2s',
              marginRight: user ? '8px' : '16px'
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <>
              <div className="dropdown-container" ref={notifRef}>
                <button
                  className="nav-notification"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>

                {notifDropdownOpen && (
                  <div className="notif-dropdown-menu">
                    <div className="notif-dropdown-header">
                      <span>Notifications</span>
                      {unreadCount > 0 && <span className="badge badge-info" style={{ background: 'var(--color-primary)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{unreadCount} new</span>}
                    </div>
                    <div className="notif-dropdown-items">
                      {conversations.length === 0 ? (
                        <div className="notif-empty">No notifications yet</div>
                      ) : (
                        conversations.slice(0, 5).map((conv) => {
                          const hasUnread = conv.unread_count > 0;
                          return (
                            <div
                              key={conv.id}
                              className="notif-dropdown-item"
                              onClick={() => {
                                navigate(`/chat/${conv.id}`);
                                setNotifDropdownOpen(false);
                              }}
                              style={{ backgroundColor: hasUnread ? 'rgba(123, 30, 30, 0.03)' : 'transparent' }}
                            >
                              <img
                                src={conv.other_user_avatar || DEFAULT_AVATAR}
                                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                                alt=""
                                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div className="notif-item-content">
                                <div className="notif-item-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span>{conv.other_user_name}</span>
                                  {hasUnread && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />}
                                </div>
                                <div className="notif-item-desc" style={{ fontWeight: hasUnread ? '600' : 'normal', color: hasUnread ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                                  {hasUnread ? `Sent a message: "${conv.last_message}"` : conv.last_message || 'No messages yet'}
                                </div>
                                <div className="notif-item-time">
                                  {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>


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
            <NavLink to="/chat" className="nav-notification margin-r-12">
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
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
    </nav>

    {/* Mobile Drawer Menu */}
    {mobileMenuOpen && (
      <div className="mobile-nav-drawer">
          <div className="mobile-drawer-links">
            {/* Theme Toggle (Mobile Drawer) */}
            <div className="mobile-nav-link" onClick={toggleTheme} style={{ cursor: 'pointer' }}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>Theme: {theme === 'light' ? 'Dark' : 'Light'}</span>
            </div>
            <div className="mobile-drawer-divider" style={{ margin: '8px 0' }} />

            {(!user || user.role !== 'admin') && (
              <NavLink to="/" className="mobile-nav-link">
                <Home size={20} />
                <span>Home</span>
              </NavLink>
            )}
            {user && user.role !== 'admin' && (
              <>
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
    </>
  );
}