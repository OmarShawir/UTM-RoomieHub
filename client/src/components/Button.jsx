import React from 'react';

/**
 * Reusable Button component mapping to the project design system.
 * Variants: 'primary', 'secondary', 'danger'
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
