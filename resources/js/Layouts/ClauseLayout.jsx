import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
  ClauseLogo, Dashboard, FileText, Inbox, Signature, Repeat,
  Folder, BookOpen, Layers, Users, Building, Chart, History,
  Settings, Search, Bell, Plus,
} from '../Components/Clause/Icons';

function buildNav(sidebarCounts) {
  const c = sidebarCounts || {};
  return [
    {
      heading: 'Workspace',
      items: [
        { label: 'Dashboard',           icon: Dashboard,  route: 'dashboard' },
        { label: 'Contracts',           icon: FileText,   route: 'contracts.index', badge: c.contracts },
        { label: 'Inbox',               icon: Inbox,      route: 'inbox',           badge: c.review, pulse: c.review > 0 },
        { label: 'Awaiting signature',  icon: Signature,  route: 'signature',       badge: c.signature },
        { label: 'Renewals',            icon: Repeat,     route: 'renewals',        badge: c.expiring },
      ],
    },
    {
      heading: 'Library',
      items: [
        { label: 'Templates',    icon: Folder,    route: 'templates.index' },
        { label: 'Clause bank',  icon: BookOpen,  route: 'clauses' },
        { label: 'Playbooks',    icon: Layers,    route: 'playbooks' },
      ],
    },
    {
      heading: 'People',
      items: [
        { label: 'Counterparties', icon: Building, route: 'counterparties.index' },
        { label: 'Team',           icon: Users,    route: 'team' },
      ],
    },
    {
      heading: 'Insights',
      items: [
        { label: 'Reports',   icon: Chart,   route: 'reports' },
        { label: 'Audit log', icon: History, route: 'audit' },
      ],
    },
  ];
}

function isActive(routeName, current) {
  if (!current) return false;
  return current === routeName || current.startsWith(routeName.replace('.index', '.'));
}

export default function ClauseLayout({ children, title = '' }) {
  const { auth, url, sidebarCounts } = usePage().props;
  const currentRoute = typeof route === 'function' ? route().current() : '';
  const user = auth?.user;
  const nav = buildNav(sidebarCounts);
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'CL';

  return (
    <>
      {title && <Head title={title} />}
      <div className="app-shell">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <ClauseLogo size={26} />
            <span>Clause</span>
          </div>

          <Link
            href={typeof route === 'function' ? route('contracts.create') : '/contracts/create'}
            className="sidebar-new-btn"
          >
            <Plus size={16} />
            New contract
          </Link>

          {nav.map((section) => (
            <div className="sidebar-section" key={section.heading}>
              <div className="sidebar-heading">{section.heading}</div>
              {section.items.map((item) => {
                const active = isActive(item.route, currentRoute);
                const href = typeof route === 'function' ? route(item.route) : '#';
                return (
                  <Link
                    key={item.route}
                    href={href}
                    className={`sidebar-item ${active ? 'active' : ''}`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    {item.pulse && <span className="sidebar-pulse" />}
                    {item.badge !== undefined && (
                      <span className="sidebar-badge">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Settings at bottom */}
          <div className="sidebar-section" style={{ marginTop: 'auto' }}>
            <Link
              href={typeof route === 'function' ? route('settings') : '/settings'}
              className={`sidebar-item ${isActive('settings', currentRoute) ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role">{user?.email || ''}</div>
            </div>
            <button
              onClick={() => router.post(route('logout'))}
              className="sidebar-logout"
              title="Log out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main-content">
          <header className="topbar">
            <div className="topbar-breadcrumb">
              <span>Clause</span>
              {title && (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  <span style={{ color: 'var(--text-2)' }}>{title}</span>
                </>
              )}
            </div>
            <div className="topbar-search">
              <Search size={15} />
              <span>Search contracts...</span>
              <kbd>/</kbd>
            </div>
            <button className="topbar-icon-btn">
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
          </header>

          <main className="page">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
