import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * Wraps children with a CSS animation that re-triggers on every route change.
 * Uses the route pathname as a React key to force remount → replay animation.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}
