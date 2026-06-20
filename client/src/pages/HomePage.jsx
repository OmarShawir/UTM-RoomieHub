import { Link } from 'react-router-dom';
import { Search, Home as HomeIcon, Users, Shield } from 'lucide-react';
import './HomePage.css';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find your ideal accommodation with advanced filters and preferences',
  },
  {
    icon: HomeIcon,
    title: 'Verified Listings',
    description: 'Browse authentic listings from verified UTM students',
  },
  {
    icon: Users,
    title: 'Roommate Matching',
    description: 'Find compatible roommates based on lifestyle preferences',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'UTM-exclusive platform ensuring student safety and trust',
  },
];

export default function HomePage() {
  return (
    <div className="page-wrapper home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <h1>Find Your Perfect Student Housing</h1>
        <p>Connecting UTM students with safe, affordable, and convenient accommodation</p>
        <div className="home-hero-actions">
          <Link to="/search" className="btn btn-hero-light">Browse Listings</Link>
          <Link to="/listings/create" className="btn btn-hero-outline">Post a Listing</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-section">
        <h2>Why Choose UTM RoomieHub?</h2>
        <div className="home-features-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="card feature-card">
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats">
        <div className="home-stats-grid">
          <div className="stat-item">
            <div className="stat-number">1,200+</div>
            <div className="stat-label">Active Listings</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">UTM Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* AI Matching Section */}
      <section className="home-section">
        <h2>AI-Powered Smart Matching</h2>
        <div className="home-ai-grid">
          <div className="card ai-card">
            <div className="ai-icon ai-icon-primary">
              <Search size={28} />
            </div>
            <h3>Find Your Perfect Room</h3>
            <p>Set your preferences and let our AI recommend the best accommodations for you</p>
            <Link to="/preferences/room" className="btn btn-primary">Get Room Recommendations</Link>
          </div>

          <div className="card ai-card">
            <div className="ai-icon ai-icon-secondary">
              <Users size={28} />
            </div>
            <h3>Match with Roommates</h3>
            <p>Find compatible roommates based on lifestyle and personality matching</p>
            <Link to="/preferences/lifestyle" className="btn btn-primary">Find Roommate Matches</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <h2>Ready to Find Your New Home?</h2>
        <p>Join thousands of UTM students finding their perfect accommodation</p>
        <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
      </section>

    </div>
  );
}

