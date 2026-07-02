import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './ChatPages.css';

export default function ChatListPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        if (res.data.success) {
          setConversations(res.data.conversations);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const isOnline = (lastLoginStr) => {
    if (!lastLoginStr) return false;
    const lastLogin = new Date(lastLoginStr);
    const now = new Date();
    const diffMs = now - lastLogin;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins < 5;
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading conversations...</div>;
  }

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 20 }}>Messages</h1>

      <div className="chat-list-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredConversations.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><MessageCircle size={32} /></div>
          <h3>No messages yet</h3>
          <p>Start browsing listings and connect with property owners</p>
        </div>
      ) : (
        filteredConversations.map((conv) => (
          <Link key={conv.id} to={`/chat/${conv.id}`} style={{ display: 'block' }}>
            <div className="card chat-list-item">
              <div className="chat-avatar-wrap">
                <img
                  src={conv.other_user_avatar || DEFAULT_AVATAR}
                  onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  alt={conv.other_user_name}
                  className="chat-avatar"
                />
                {isOnline(conv.last_login) && (
                  <div className="chat-online-dot" style={{ backgroundColor: '#10B981' }} />
                )}
              </div>
              <div className="chat-list-content">
                <div className="chat-list-top-row">
                  <span className="chat-list-name">{conv.other_user_name}</span>
                  <span className="chat-list-time">{formatTime(conv.last_message_at)}</span>
                </div>
                <div className="chat-list-preview">{conv.last_message || 'No messages yet'}</div>
              </div>
              {conv.unread_count > 0 && <div className="chat-unread-badge">{conv.unread_count}</div>}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
