import React from 'react';
import { Plus, Search, Sparkles, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Header({ onNewTask, onToggleSidebar, sidebarOpen }) {
    return (
        <header style={{
            background: 'var(--color-bg-secondary)',
            borderBottom: '1px solid hsla(0, 0%, 100%, 0.1)',
            padding: 'var(--space-lg) var(--space-xl)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'var(--blur-md)',
            WebkitBackdropFilter: 'var(--blur-md)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-lg)'
            }}>
                {/* Logo & Menu Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <button
                        onClick={onToggleSidebar}
                        className="btn btn-ghost"
                        style={{ padding: '0.5rem' }}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <LayoutDashboard size={28} style={{ color: 'var(--color-primary)' }} />
                        <h1 className="gradient-text" style={{
                            fontSize: '1.5rem',
                            margin: 0,
                            whiteSpace: 'nowrap'
                        }}>
                            AI Task Manager
                        </h1>
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                            <Sparkles size={10} />
                            AI
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <button
                        onClick={onNewTask}
                        className="btn btn-primary"
                    >
                        <Plus size={20} />
                        <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>
                            New Task
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
