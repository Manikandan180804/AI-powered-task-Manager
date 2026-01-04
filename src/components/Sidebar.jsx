import React from 'react';
import {
    LayoutDashboard,
    ListTodo,
    Clock,
    Calendar,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import { FILTER_OPTIONS, VIEW_MODES } from '../constants';
import { getTaskStatistics } from '../utils/taskUtils';

export default function Sidebar({ currentView, currentFilter, onViewChange, onFilterChange, tasks, isOpen }) {
    const stats = getTaskStatistics(tasks);

    const menuItems = [
        {
            type: 'view',
            value: VIEW_MODES.DASHBOARD,
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard'
        },
        { type: 'divider' },
        {
            type: 'filter',
            value: FILTER_OPTIONS.ALL,
            icon: <ListTodo size={20} />,
            label: 'All Tasks',
            count: stats.total
        },
        {
            type: 'filter',
            value: FILTER_OPTIONS.TODAY,
            icon: <Clock size={20} />,
            label: 'Today',
            count: stats.today
        },
        {
            type: 'filter',
            value: FILTER_OPTIONS.UPCOMING,
            icon: <Calendar size={20} />,
            label: 'Upcoming',
            count: stats.active - stats.today
        },
        {
            type: 'filter',
            value: FILTER_OPTIONS.OVERDUE,
            icon: <AlertTriangle size={20} />,
            label: 'Overdue',
            count: stats.overdue
        },
        {
            type: 'filter',
            value: FILTER_OPTIONS.COMPLETED,
            icon: <CheckCircle2 size={20} />,
            label: 'Completed',
            count: stats.completed
        }
    ];

    const handleClick = (item) => {
        if (item.type === 'view') {
            onViewChange(item.value);
        } else if (item.type === 'filter') {
            onViewChange(VIEW_MODES.LIST);
            onFilterChange(item.value);
        }
    };

    const isActive = (item) => {
        if (item.type === 'view') {
            return currentView === item.value;
        } else if (item.type === 'filter') {
            return currentView === VIEW_MODES.LIST && currentFilter === item.value;
        }
        return false;
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 90,
                        display: 'none',
                        '@media (max-width: 768px)': {
                            display: 'block'
                        }
                    }}
                    onClick={() => onViewChange(currentView)} // Just to trigger sidebar close
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: isOpen ? '280px' : '0',
                    minWidth: isOpen ? '280px' : '0',
                    background: 'var(--color-bg-secondary)',
                    borderRight: isOpen ? '1px solid hsla(0, 0%, 100%, 0.1)' : 'none',
                    padding: isOpen ? 'var(--space-lg)' : '0',
                    overflow: isOpen ? 'auto' : 'hidden',
                    transition: 'all var(--transition-base)',
                    position: 'sticky',
                    top: '73px',
                    height: 'calc(100vh - 73px)',
                    zIndex: 95
                }}
            >
                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-xs)',
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity var(--transition-base)'
                }}>
                    {menuItems.map((item, index) => {
                        if (item.type === 'divider') {
                            return (
                                <div
                                    key={`divider-${index}`}
                                    style={{
                                        height: '1px',
                                        background: 'hsla(0, 0%, 100%, 0.1)',
                                        margin: 'var(--space-sm) 0'
                                    }}
                                />
                            );
                        }

                        const active = isActive(item);

                        return (
                            <button
                                key={item.value}
                                onClick={() => handleClick(item)}
                                className="btn btn-ghost"
                                style={{
                                    justifyContent: 'flex-start',
                                    padding: 'var(--space-md)',
                                    background: active ? 'var(--color-surface)' : 'transparent',
                                    color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            >
                                <div style={{ color: active ? 'var(--color-primary)' : 'inherit' }}>
                                    {item.icon}
                                </div>
                                <span style={{ flex: 1, textAlign: 'left' }}>
                                    {item.label}
                                </span>
                                {item.count !== undefined && item.count > 0 && (
                                    <span
                                        className="badge"
                                        style={{
                                            background: active ? 'var(--color-primary)' : 'var(--color-surface)',
                                            color: active ? 'white' : 'var(--color-text-secondary)',
                                            border: 'none',
                                            minWidth: '24px',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
