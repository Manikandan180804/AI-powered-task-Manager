import React from 'react';
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Sparkles
} from 'lucide-react';
import { getTaskStatistics, getPriorityDistribution } from '../utils/taskUtils';
import { PRIORITY, PRIORITY_LABELS, PRIORITY_COLORS } from '../constants';
import AIInsightsPanel from './AIInsightsPanel';

export default function Dashboard({ tasks }) {
    const stats = getTaskStatistics(tasks);
    const priorityDist = getPriorityDistribution(tasks);

    const statCards = [
        {
            label: 'Total Tasks',
            value: stats.total,
            icon: <Circle size={24} />,
            color: 'var(--color-text-primary)',
            gradient: false
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: <CheckCircle2 size={24} />,
            color: 'var(--color-success)',
            gradient: false
        },
        {
            label: 'Active',
            value: stats.active,
            icon: <Clock size={24} />,
            color: 'var(--color-accent)',
            gradient: false
        },
        {
            label: 'Overdue',
            value: stats.overdue,
            icon: <AlertTriangle size={24} />,
            color: 'var(--color-error)',
            gradient: false
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Welcome Section */}
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h1 className="gradient-text" style={{ marginBottom: 'var(--space-sm)' }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Your productivity overview and AI-powered insights
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-lg)',
                marginBottom: 'var(--space-2xl)'
            }}>
                {statCards.map((card, index) => (
                    <div
                        key={card.label}
                        className="glass-strong"
                        style={{
                            padding: 'var(--space-lg)',
                            borderRadius: 'var(--radius-lg)',
                            position: 'relative',
                            overflow: 'hidden',
                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--color-text-tertiary)',
                                    marginBottom: 'var(--space-sm)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {card.label}
                                </div>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    color: card.color,
                                    lineHeight: 1
                                }}>
                                    {card.value}
                                </div>
                            </div>
                            <div style={{ color: card.color, opacity: 0.5 }}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Completion Rate */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-lg)',
                marginBottom: 'var(--space-2xl)'
            }}>
                {/* Completion Progress */}
                <div className="glass-strong" style={{
                    padding: 'var(--space-xl)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-lg)'
                    }}>
                        <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} />
                        <h3>Completion Rate</h3>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {stats.completionRate}%
                        </div>
                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                            {stats.completed} of {stats.total} tasks completed
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        height: '8px',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${stats.completionRate}%`,
                                background: 'var(--gradient-primary)',
                                transition: 'width 1s ease-out',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="glass-strong" style={{
                    padding: 'var(--space-xl)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>
                        Priority Distribution
                    </h3>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-md)'
                    }}>
                        {Object.entries(PRIORITY).map(([key, value]) => {
                            const count = priorityDist[value];
                            const color = PRIORITY_COLORS[value];
                            const total = Object.values(priorityDist).reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                            return (
                                <div key={value}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 'var(--space-xs)',
                                        fontSize: '0.875rem'
                                    }}>
                                        <span>{PRIORITY_LABELS[value]}</span>
                                        <span style={{ color: 'var(--color-text-tertiary)' }}>
                                            {count} ({percentage}%)
                                        </span>
                                    </div>
                                    <div style={{
                                        height: '6px',
                                        background: 'var(--color-bg-secondary)',
                                        borderRadius: '3px',
                                        overflow: 'hidden'
                                    }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${percentage}%`,
                                                background: color,
                                                transition: 'width 0.5s ease-out',
                                                borderRadius: '3px'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <AIInsightsPanel tasks={tasks} />
            </div>
        </div>
    );
}
