import React, { useState } from 'react';
import { Sparkles, TrendingUp, Target, Lightbulb, RefreshCw } from 'lucide-react';
import { getProductivityInsights } from '../services/aiService';

export default function AIInsightsPanel({ tasks }) {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadInsights = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getProductivityInsights(tasks);
            setInsights(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!insights && !loading && !error) {
        return (
            <div className="glass-strong" style={{
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <Sparkles size={48} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>
                    Get AI-Powered Insights
                </h3>
                <p style={{
                    marginBottom: 'var(--space-lg)',
                    color: 'var(--color-text-secondary)'
                }}>
                    Let AI analyze your tasks and provide personalized productivity recommendations
                </p>
                <button
                    onClick={loadInsights}
                    className="btn btn-primary"
                >
                    <Sparkles size={20} />
                    Generate Insights
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="glass-strong" style={{
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-lg)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="animate-pulse" style={{ marginBottom: 'var(--space-md)' }}>
                        <Sparkles size={32} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <p>AI is analyzing your tasks...</p>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)',
                    marginTop: 'var(--space-lg)'
                }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: '60px' }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-strong" style={{
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
            }}>
                <p style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>
                    {error}
                </p>
                <button
                    onClick={loadInsights}
                    className="btn btn-secondary btn-sm"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="glass-strong animate-fade-in" style={{
            padding: 'var(--space-xl)',
            borderRadius: 'var(--radius-lg)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-xl)'
            }}>
                <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)'
                }}>
                    <Sparkles size={24} style={{ color: 'var(--color-primary)' }} />
                    AI Insights
                </h3>
                <button
                    onClick={loadInsights}
                    className="btn btn-ghost btn-sm"
                    title="Refresh insights"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Statistics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-xl)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'var(--color-primary)'
                    }}>
                        {insights.statistics.completionRate}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        Completion
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'var(--color-accent)'
                    }}>
                        {insights.statistics.active}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        Active
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: insights.statistics.overdue > 0 ? 'var(--color-error)' : 'var(--color-success)'
                    }}>
                        {insights.statistics.overdue}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        Overdue
                    </div>
                </div>
            </div>

            {/* Completion Analysis */}
            <div style={{
                marginBottom: 'var(--space-lg)',
                padding: 'var(--space-md)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--color-primary)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-sm)'
                }}>
                    <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                    <h4>Analysis</h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {insights.completionAnalysis}
                </p>
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-md)'
                }}>
                    <Lightbulb size={18} style={{ color: 'var(--color-warning)' }} />
                    <h4>Recommendations</h4>
                </div>
                <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)'
                }}>
                    {insights.recommendations.map((rec, index) => (
                        <li
                            key={index}
                            style={{
                                padding: 'var(--space-sm)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                                color: 'var(--color-text-secondary)',
                                paddingLeft: 'var(--space-lg)',
                                position: 'relative'
                            }}
                        >
                            <span style={{
                                position: 'absolute',
                                left: 'var(--space-sm)',
                                color: 'var(--color-primary)'
                            }}>
                                •
                            </span>
                            {rec}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Focus Areas */}
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-md)'
                }}>
                    <Target size={18} style={{ color: 'var(--color-accent)' }} />
                    <h4>Focus Areas</h4>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    {insights.focusAreas.map((area, index) => (
                        <span
                            key={index}
                            className="badge"
                            style={{
                                background: 'var(--color-accent)20',
                                color: 'var(--color-accent)',
                                border: '1px solid var(--color-accent)'
                            }}
                        >
                            {area}
                        </span>
                    ))}
                </div>
            </div>

            {/* Motivational Tip */}
            {
                insights.motivationalTip && (
                    <div style={{
                        marginTop: 'var(--space-lg)',
                        padding: 'var(--space-md)',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        ✨ {insights.motivationalTip}
                    </div>
                )
            }
        </div >
    );
}
