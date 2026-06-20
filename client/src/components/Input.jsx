import React from 'react';

/**
 * Reusable Input component mapping to the project design system.
 */
export default function Input({
  label,
  error,
  required = false,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id}>
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}
