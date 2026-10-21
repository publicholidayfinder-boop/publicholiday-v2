import React from 'react';

/* ─────────────────────────────────────────────
   Per-template inline-style design tokens
   (inline styles are immune to Tailwind purging)
───────────────────────────────────────────── */
export const TEMPLATE_TOKENS = {
    minimal: {
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        headerBg: '#f8fafc',
        headerBorder: '#e2e8f0',
        headerText: '#1e293b',
        subText: '#64748b',
        dayNameBg: '#f1f5f9',
        dayNameText: '#475569',
        cellBg: '#ffffff',
        cellText: '#334155',
        todayBg: '#0284c7',
        todayText: '#ffffff',
        holidayDot: '#0284c7',
        weekendBg: '#f8fafc',
        label: 'Minimal',
        tagline: 'Office Desk Classic',
    },
    colorful: {
        cardBg: '#f0f9ff',
        cardBorder: '#bae6fd',
        headerBg: 'linear-gradient(to right, #0ea5e9, #3b82f6, #6366f1)',
        headerBorder: 'transparent',
        headerText: '#ffffff',
        subText: '#38bdf8',
        dayNameBg: '#e0f2fe',
        dayNameText: '#0369a1',
        cellBg: '#ffffff',
        cellText: '#1e40af',
        todayBg: '#6366f1',
        todayText: '#ffffff',
        holidayDot: '#f43f5e',
        weekendBg: '#fdf2f8',
        label: 'Colorful',
        tagline: 'Gradient Headings',
    },
    corporate: {
        cardBg: '#ffffff',
        cardBorder: '#cbd5e1',
        headerBg: '#1e293b',
        headerBorder: '#0f172a',
        headerText: '#ffffff',
        subText: '#94a3b8',
        dayNameBg: '#f1f5f9',
        dayNameText: '#1e293b',
        cellBg: '#ffffff',
        cellText: '#0f172a',
        todayBg: '#1e3a8a',
        todayText: '#ffffff',
        holidayDot: '#1d4ed8',
        weekendBg: '#f8fafc',
        label: 'Corporate',
        tagline: 'Navy Business Grid',
    },
    dark: {
        cardBg: '#0f172a',
        cardBorder: '#1e293b',
        headerBg: '#020617',
        headerBorder: '#1e293b',
        headerText: '#f1f5f9',
        subText: '#10b981',
        dayNameBg: '#1e293b',
        dayNameText: '#64748b',
        cellBg: '#0f172a',
        cellText: '#cbd5e1',
        todayBg: '#10b981',
        todayText: '#022c22',
        holidayDot: '#10b981',
        weekendBg: '#1e293b',
        label: 'Dark',
        tagline: 'Neon Charcoal',
    },
    elegant: {
        cardBg: '#fffbeb',
        cardBorder: '#d6c4a0',
        headerBg: '#f5f0e8',
        headerBorder: '#d6c4a0',
        headerText: '#44403c',
        subText: '#78716c',
        dayNameBg: '#fafaf9',
        dayNameText: '#57534e',
        cellBg: '#fffbeb',
        cellText: '#292524',
        todayBg: '#78350f',
        todayText: '#fef3c7',
        holidayDot: '#b45309',
        weekendBg: '#f5f5f4',
        label: 'Elegant',
        tagline: 'Georgia Serif Border',
    },
    kids: {
        cardBg: '#fffbeb',
        cardBorder: '#fcd34d',
        headerBg: 'linear-gradient(to right, #facc15, #fb923c, #f87171)',
        headerBorder: 'transparent',
        headerText: '#ffffff',
        subText: '#f59e0b',
        dayNameBg: '#fef9c3',
        dayNameText: '#92400e',
        cellBg: '#fffbeb',
        cellText: '#44403c',
        todayBg: '#f59e0b',
        todayText: '#ffffff',
        holidayDot: '#a855f7',
        weekendBg: '#fff7ed',
        label: 'Kids',
        tagline: 'Rounded Playful Shapes',
    },
    floral: {
        cardBg: '#fff1f2',
        cardBorder: '#fecdd3',
        headerBg: '#ffe4e6',
        headerBorder: '#fecdd3',
        headerText: '#881337',
        subText: '#be123c',
        dayNameBg: '#fff1f2',
        dayNameText: '#9f1239',
        cellBg: '#fff1f2',
        cellText: '#4c0519',
        todayBg: '#e11d48',
        todayText: '#ffffff',
        holidayDot: '#ec4899',
        weekendBg: '#fdf2f8',
        label: 'Floral',
        tagline: 'Soft Rose Ornaments',
    },
    compact: {
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        headerBg: '#f8fafc',
        headerBorder: '#e2e8f0',
        headerText: '#1e293b',
        subText: '#64748b',
        dayNameBg: '#f1f5f9',
        dayNameText: '#64748b',
        cellBg: '#ffffff',
        cellText: '#475569',
        todayBg: '#475569',
        todayText: '#ffffff',
        holidayDot: '#ef4444',
        weekendBg: '#f8fafc',
        label: 'Compact',
        tagline: '12-Month Yearly Sheet',
    },
};

/* ─────────────────────────────────────────────
   Mini calendar thumbnail — pure inline styles,
   no Tailwind classes, so nothing gets purged.
───────────────────────────────────────────── */
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
// 15 cells: days 1-15, "today" = day 8, holiday dot on day 3
const CELLS = Array.from({ length: 15 }, (_, i) => i + 1);
const TODAY_DAY = 8;
const HOLIDAY_DAY = 3;

export default function TemplateMiniPreview({ templateKey }) {
    const t = TEMPLATE_TOKENS[templateKey];
    if (!t) return null;

    const isGradient = (v) => typeof v === 'string' && v.startsWith('linear-gradient');
    const isKids = templateKey === 'kids';
    const isDark = templateKey === 'dark';
    const isElegant = templateKey === 'elegant';

    return (
        <div style={{
            background: t.cardBg,
            border: `1.5px solid ${t.cardBorder}`,
            borderRadius: isKids ? '10px' : '6px',
            overflow: 'hidden',
            width: '100%',
            fontFamily: isElegant ? 'Georgia, serif' : 'system-ui, sans-serif',
            boxShadow: isDark ? '0 0 0 1px #334155' : '0 1px 4px rgba(0,0,0,0.08)',
            userSelect: 'none',
            pointerEvents: 'none', // thumbnail is decorative only
        }}>
            {/* Header */}
            <div style={{
                background: isGradient(t.headerBg) ? t.headerBg : t.headerBg,
                borderBottom: `1px solid ${t.headerBorder}`,
                padding: '5px 6px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div>
                    <div style={{
                        fontSize: '7px',
                        fontWeight: 700,
                        color: t.headerText,
                        letterSpacing: '0.04em',
                        fontStyle: isElegant ? 'italic' : 'normal',
                        textTransform: isElegant ? 'none' : 'uppercase',
                    }}>
                        January 2026
                    </div>
                    <div style={{ fontSize: '5px', color: t.subText, marginTop: '1px', fontWeight: 500 }}>
                        Public Holidays
                    </div>
                </div>
                {/* Mini accent bar / badge */}
                <div style={{
                    width: '16px',
                    height: '8px',
                    borderRadius: isKids ? '4px' : '2px',
                    background: isGradient(t.headerBg) ? 'rgba(255,255,255,0.3)' : t.todayBg,
                    opacity: 0.85,
                }} />
            </div>

            {/* Day-name strip */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                background: t.dayNameBg,
                borderBottom: `1px solid ${t.cardBorder}`,
                padding: '1px 2px',
            }}>
                {DAYS.map((d, i) => (
                    <div key={i} style={{
                        fontSize: '5px',
                        fontWeight: 700,
                        color: (i === 0 || i === 6) ? t.holidayDot : t.dayNameText,
                        textAlign: 'center',
                        padding: '1.5px 0',
                        fontStyle: isElegant ? 'italic' : 'normal',
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Cell grid — 15 cells in 7 columns = 3 rows */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                padding: '2px',
                gap: '1px',
                background: t.cardBg,
            }}>
                {CELLS.map((day) => {
                    const isToday = day === TODAY_DAY;
                    const isHoliday = day === HOLIDAY_DAY;
                    const colIndex = (day - 1) % 7;
                    const isWeekend = colIndex === 0 || colIndex === 6;

                    return (
                        <div key={day} style={{
                            background: isToday ? t.todayBg : isWeekend ? t.weekendBg : t.cellBg,
                            borderRadius: isKids ? '3px' : isToday ? '50%' : '2px',
                            width: '100%',
                            aspectRatio: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            border: isToday ? 'none'
                                : templateKey === 'corporate' ? `0.5px solid ${t.cardBorder}`
                                : 'none',
                        }}>
                            <span style={{
                                fontSize: '5px',
                                fontWeight: isToday ? 700 : 500,
                                color: isToday ? t.todayText : isWeekend ? t.holidayDot : t.cellText,
                                lineHeight: 1,
                                fontStyle: isElegant ? 'italic' : 'normal',
                            }}>
                                {day}
                            </span>
                            {isHoliday && (
                                <div style={{
                                    width: '3px',
                                    height: '3px',
                                    borderRadius: '50%',
                                    background: t.holidayDot,
                                    position: 'absolute',
                                    bottom: '1px',
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
