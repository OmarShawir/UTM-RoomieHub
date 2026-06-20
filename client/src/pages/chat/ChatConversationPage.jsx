import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, MoreVertical, Flag, Ban, X } from 'lucide-react';
import './ChatPages.css';

const contactsById = {
  '1': { name: 'Sarah Ahmad', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', online: true },
  '2': { name: 'Ahmad Zaki', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', online: false },
  '3': { name: 'Fatimah Ali', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', online: true },
};

const initialMessages = [
  { id: 1, sender: 'other', content: "Hi! I'm interested in your listing. Is it still available?", time: '10:30 AM' },
  { id: 2, sender: 'me', content: "Yes, it's still available! Would you like to schedule a viewing?", time: '10:32 AM' },
  { id: 3, sender: 'other', content: 'That would be great! What times work for you this week?', time: '10:35 AM' },
  { id: 4, sender: 'me', content: "I'm free on Wednesday or Thursday afternoon. Which works better for you?", time: '10:38 AM' },
];

export default function ChatConversationPage() {
  const { id } = useParams();
  const contact = contactsById[id] || contactsById['1'];

  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', content: draft, time: 'Now' }]);
    setDraft('');
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 800 }}>
      <div className="card chat-conversation-card">

        <div className="chat-conv-header">
          <Link to={`/profile/${id}`} className="chat-conv-header-info" style={{ flex: 1 }}>
            <div className="chat-avatar-wrap">
              <img src={contact.avatar} alt={contact.name} className="chat-avatar" style={{ width: 40, height: 40 }} />
              {contact.online && <div className="chat-online-dot" />}
            </div>
            <div>
              <div className="chat-conv-name">{contact.name}</div>
              <div className="chat-conv-status">{contact.online ? 'Active now' : 'Offline'}</div>
            </div>
          </Link>

          <div className="chat-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical size={18} />
            {menuOpen && (
              <div className="chat-menu-dropdown">
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

        <div className="chat-messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
              <div className={`chat-bubble ${msg.sender}`}>
                <div>{msg.content}</div>
                <div className="chat-bubble-time">{msg.time}</div>
              </div>
            </div>
          ))}
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
            <h2>Report {contact.name}</h2>
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
              <textarea rows={4} placeholder="Describe what happened..." value={reportDetails} onChange={(e) => setReportDetails(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setReportOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => setReportOpen(false)}>Submit Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {blockOpen && (
        <div className="modal-overlay" onClick={() => setBlockOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Block {contact.name}?</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              They won't be able to message you anymore, and you won't see their listings.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setBlockOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => setBlockOpen(false)}>Block</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
