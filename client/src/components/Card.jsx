import React from 'react';

/**
 * Reusable Card component mapping to the project design system.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  // Figma files sometimes use CardContent wrapper.
  // We'll support standard sub-elements or custom classes.
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
}
