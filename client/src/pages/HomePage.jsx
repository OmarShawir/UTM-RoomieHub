import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">

      {/* Hero */}
      <section className="home-hero">
        <h1>Find Your Perfect Room at UTM</h1>
        <p>Browse verified listings, get AI-powered recommendations, and find compatible roommates — all in one place.</p>
        <div className="home-hero-actions">
          <Link to="/search"           className="btn btn-primary">Browse Rooms</Link>
          <Link to="/ai-match"         className="btn btn-secondary">AI Match</Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="home-actions">
        <Link to="/search"             className="action-card">
          <span className="action-icon">🔍</span>
          <h3>Search Rooms</h3>
          <p>Filter by price, type and distance</p>
        </Link>
        <Link to="/map"                className="action-card">
          <span className="action-icon">🗺️</span>
          <h3>Map View</h3>
          <p>See listings near UTM campus</p>
        </Link>
        <Link to="/ai-match"           className="action-card">
          <span className="action-icon">✨</span>
          <h3>AI Room Match</h3>
          <p>Get personalised recommendations</p>
        </Link>
        <Link to="/ai-match/roommates" className="action-card">
          <span className="action-icon">🤝</span>
          <h3>Find Roommate</h3>
          <p>Match by lifestyle compatibility</p>
        </Link>
        <Link to="/listings/create"    className="action-card">
          <span className="action-icon">➕</span>
          <h3>Post a Room</h3>
          <p>List your room for free</p>
        </Link>
        <Link to="/chat"               className="action-card">
          <span className="action-icon">💬</span>
          <h3>Messages</h3>
          <p>Chat with other students</p>
        </Link>
      </section>

    </div>
  );
}
