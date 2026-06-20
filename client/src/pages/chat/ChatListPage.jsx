import { Link } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import './ChatPages.css';

const conversations = [
  { id: '1', name: 'Sarah Ahmad', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', lastMessage: 'Is the room still available?', time: '2m ago', unread: 2, online: true },
  { id: '2', name: 'Ahmad Zaki', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', lastMessage: 'Thank you for the information!', time: '1h ago', unread: 0, online: false },
  { id: '3', name: 'Fatimah Ali', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', lastMessage: 'Can we schedule a viewing?', time: '3h ago', unread: 1, online: true },
];

export default function ChatListPage() {
  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 20 }}>Messages</h1>

      <div className="chat-list-search">
        <Search size={18} />
        <input type="text" placeholder="Search conversations..." />
      </div>

      {conversations.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><MessageCircle size={32} /></div>
          <h3>No messages yet</h3>
          <p>Start browsing listings and connect with property owners</p>
        </div>
      ) : (
        conversations.map((conv) => (
          <Link key={conv.id} to={`/chat/${conv.id}`} style={{ display: 'block' }}>
            <div className="card chat-list-item">
              <div className="chat-avatar-wrap">
                <img src={conv.avatar} alt={conv.name} className="chat-avatar" />
                {conv.online && <div className="chat-online-dot" />}
              </div>
              <div className="chat-list-content">
                <div className="chat-list-top-row">
                  <span className="chat-list-name">{conv.name}</span>
                  <span className="chat-list-time">{conv.time}</span>
                </div>
                <div className="chat-list-preview">{conv.lastMessage}</div>
              </div>
              {conv.unread > 0 && <div className="chat-unread-badge">{conv.unread}</div>}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
