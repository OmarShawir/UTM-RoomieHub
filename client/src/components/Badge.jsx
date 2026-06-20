import React from 'react';

/**
 * Reusable Badge component mapping to the project design system.
 * Variants: 'active', 'pending', 'suspended', 'info'
 */
export default function Badge({
  children,
  variant = 'info',
  className = '',
  ...props
}) {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
