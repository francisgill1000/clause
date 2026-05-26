import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Search, X, ChevronDown, ArrowUp, ArrowDown } from './Icons';

/* ─── Button ─── */
export function Btn({ variant = 'secondary', size = 'md', icon: Icon, children, className = '', ...rest }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim();
  return (
    <button className={cls} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
    </button>
  );
}

/* ─── Badge ─── */
export function Badge({ status = 'neutral', children }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {children}
    </span>
  );
}

/* ─── Card ─── */
export function Card({ title, action, children, padding = true, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <span className="card-title">{title}</span>
          {action}
        </div>
      )}
      <div className={`card-body${padding ? '' : ' no-pad'}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── StatTile ─── */
export function StatTile({ label, value, currency, delta, deltaDir, sub }) {
  return (
    <div className="stat-tile">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {currency && <span className="stat-currency">{currency}</span>}
        {value}
      </div>
      {(delta || sub) && (
        <div className="stat-row">
          {delta && (
            <span className={`stat-delta ${deltaDir || 'up'}`}>
              {deltaDir === 'down' ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
              {delta}
            </span>
          )}
          {sub && <span className="stat-sub">{sub}</span>}
        </div>
      )}
    </div>
  );
}

/* ─── Tabs ─── */
export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${value === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          {t.count !== undefined && <span className="tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ─── Toolbar ─── */
export function Toolbar({ children }) {
  return <div className="toolbar">{children}</div>;
}

/* ─── CustomerCell ─── */
export function CustomerCell({ customer, sub }) {
  const initials = customer
    ? customer.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <div className="customer-cell">
      <div className="customer-avatar">{initials}</div>
      <div>
        <div className="customer-name">{customer}</div>
        {sub && <div className="customer-sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ─── PageHeader ─── */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

/* ─── Input ─── */
export function Input({ prefix, className = '', ...props }) {
  return (
    <div className={`input-wrap ${className}`}>
      {prefix && <span className="input-prefix">{prefix}</span>}
      <input {...props} />
    </div>
  );
}

/* ─── Select ─── */
export function Select({ children, className = '', ...props }) {
  return (
    <select className={`clause-select ${className}`} {...props}>
      {children}
    </select>
  );
}

/* ─── Textarea ─── */
export function Textarea({ className = '', ...props }) {
  return <textarea className={`clause-textarea ${className}`} {...props} />;
}

/* ─── Drawer ─── */
export function Drawer({ open, onClose, title, footer, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`drawer-panel ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">{title}</span>
          <button className="drawer-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </>
  );
}

/* ─── Toast system ─── */
const ToastCtx = createContext(null);

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div className="toast-host">
        {toasts.map((t) => (
          <div key={t.id} className="toast">{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function Toast({ message }) {
  return <div className="toast">{message}</div>;
}

export function ToastHost() {
  return <div className="toast-host" />;
}

/* ─── Field ─── */
export function Field({ label, children, hint }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
