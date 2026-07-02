import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Send, MoreVertical, Flag, Ban, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './ChatPages.css';

export default function ChatConversationPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesContainerRef = useRef(null);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals / Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Fetch conversation metadata and messages
  useEffect(() => {
    let active = true;

    const fetchDetails = async () => {
      try {
        const res = await api.get(`/chat/conversations/${id}`);
        if (res.data.success && active) {
          setConversation(res.data.conversation);
        }
      } catch (err) {
        console.error('Failed to fetch conversation details:', err);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/conversations/${id}/messages`);
        if (res.data.success && active) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    const markRead = async () => {
      try {
        await api.put(`/chat/conversations/${id}/read`);
      } catch (err) {
        console.error('Failed to mark conversation as read:', err);
      }
    };

    fetchDetails();
    fetchMessages();
    markRead();

    // Poll for new messages every 3 seconds to keep chat real-time
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    try {
      const res = await api.post(`/chat/conversations/${id}/messages`, {
        content: draft.trim(),
      });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setDraft('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleBlockUser = async () => {
    try {
      const res = await api.post(`/chat/conversations/${id}/block`);
      if (res.data.success) {
        alert('User blocked successfully.');
        navigate('/chat');
      }
    } catch (err) {
      console.error('Failed to block user:', err);
    }
  };

  const handleReportUser = async () => {
    if (!reportReason) {
      alert('Please select a reason.');
      return;
    }
    try {
      const res = await api.post(`/chat/conversations/${id}/report`, {
        reason: reportReason,
        description: reportDetails,
      });
      if (res.data.success) {
        alert('Report submitted successfully.');
        setReportOpen(false);
        setReportReason('');
        setReportDetails('');
      }
    } catch (err) {
      console.error('Failed to report user:', err);
    }
  };

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const getOnlineStatus = (lastLoginStr) => {
    if (!lastLoginStr) return { online: false, text: 'Offline' };
    const lastLogin = new Date(lastLoginStr);
    const now = new Date();
    const diffMs = now - lastLogin;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 5) {
      return { online: true, text: 'Active now' };
    }
    if (diffMins < 60) {
      return { online: false, text: `Active ${diffMins}m ago` };
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return { online: false, text: `Active ${diffHours}h ago` };
    }
    return { online: false, text: `Active ${lastLogin.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` };
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading conversation...</div>;
  }

  if (!conversation) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Conversation not found.</div>;
  }

  const status = getOnlineStatus(conversation.last_login);

  return (
    <div className="page-wrapper" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/chat" className="auth-back-link" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} /> Back to Messages
        </Link>
      </div>

      <div className="card chat-conversation-card">
        <div className="chat-conv-header">
          <Link to={`/profile/${conversation.other_user_id}`} className="chat-conv-header-info" style={{ flex: 1 }}>
            <div className="chat-avatar-wrap">
              <img
                src={conversation.other_user_avatar || DEFAULT_AVATAR}
                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                alt={conversation.other_user_name}
                className="chat-avatar"
                style={{ width: 40, height: 40 }}
              />
              {status.online && <div className="chat-online-dot" style={{ backgroundColor: '#10B981' }} />}
            </div>
            <div>
              <div className="chat-conv-name">{conversation.other_user_name}</div>
              <div className="chat-conv-status">{status.text}</div>
            </div>
          </Link>

          <div className="chat-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ position: 'relative', cursor: 'pointer' }}>
            <MoreVertical size={18} />
            {menuOpen && (
              <div className="chat-menu-dropdown" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 10 }}>
                <button onClick={() => { setReportOpen(true); setMenuOpen(false); }}>
                  <Flag size={14} /> Report User
                </button>
                <button onClick={() => { setBlockOpen(true); setMenuOpen(false); }}>
                  <Ban size={14} /> Block User
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={messagesContainerRef} className="chat-messages-area" style={{ minHeight: 300, maxHeight: 500, overflowY: 'auto', padding: 16 }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 40 }}>
              No messages yet. Send a message to start the conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`chat-bubble-row ${isMe ? 'me' : 'other'}`}>
                  <div className={`chat-bubble ${isMe ? 'me' : 'other'}`}>
                    <div>{msg.content}</div>
                    <div className="chat-bubble-time">{formatMessageTime(msg.sent_at)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form className="chat-input-row" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="btn btn-primary"><Send size={18} /></button>
        </form>
      </div>

      {/* Report User Modal */}
      {reportOpen && (
        <div className="modal-overlay" onClick={() => setReportOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Report {conversation.other_user_name}</h2>
            <div className="form-group">
              <label>Reason</label>
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                <option value="">Select a reason</option>
                <option value="spam">Spam</option>
                <option value="fraud">Fraud / Scam</option>
                <option value="harassment">Harassment</option>
                <option value="misconduct">Inappropriate behavior</option>
              </select>
            </div>
            <div className="form-group">
              <label>Details</label>
              <textarea
                rows={4}
                placeholder="Describe what happened..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setReportOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReportUser}>Submit Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {blockOpen && (
        <div className="modal-overlay" onClick={() => setBlockOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Block {conversation.other_user_name}?</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              They won't be able to message you anymore, and you won't see their listings.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setBlockOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleBlockUser}>Block</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
