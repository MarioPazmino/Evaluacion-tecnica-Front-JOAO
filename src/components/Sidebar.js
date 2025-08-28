import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    {
      path: '/',
      label: 'Lista de Clientes',
      icon: '📋'
    },
    {
      path: '/crear',
      label: 'Nuevo Cliente',
      icon: '📝'
    }
  ];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };

    if (open) {
      // prevent background scroll while drawer is open
      document.body.style.overflow = 'hidden';
      // focus first focusable element inside sidebar
      setTimeout(() => {
        if (sidebarRef.current) sidebarRef.current.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div ref={sidebarRef} tabIndex={-1} className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <span className="sidebar-icon">💼</span>
          Sistema Contable
        </h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-menu-item">
              <Link
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">👤</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Administrador</span>
            <span className="sidebar-user-role">Sistema Contable</span>
          </div>
        </div>
      </div>
  </div>
    </>
  );
};

export default Sidebar;
