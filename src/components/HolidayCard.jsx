import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getEffectiveHolidayType } from '../lib/calendarConstants';

// Generates and triggers a .ics file download for a single holiday reminder
function downloadICS(holiday) {
    const d = new Date(holiday.date);
    // Format: YYYYMMDD
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    // Alarm 1 day before at 09:00
    const alarmDate = new Date(d);
    alarmDate.setDate(alarmDate.getDate() - 1);
    const alarmStr = `${alarmDate.getFullYear()}${pad(alarmDate.getMonth() + 1)}${pad(alarmDate.getDate())}T090000`;

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//PublicHolidayFinder//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${holiday.name}`,
        `DESCRIPTION:${holiday.description || holiday.name} — Added via PublicHolidayFinder.com`,
        `UID:phf-${holiday.id || holiday.name.replace(/\s+/g, '-')}-${dateStr}@publicholidayfinder.com`,
        'BEGIN:VALARM',
        'TRIGGER:-P1DT15H',   // 1 day before at 09:00 (15h before midnight)
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${holiday.name} is tomorrow!`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${holiday.name.replace(/\s+/g, '_')}_reminder.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function HolidayCard({ holiday }) {
    const { t, i18n } = useTranslation();
    const [reminded, setReminded] = useState(false);

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString(i18n.language, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTypeConfig = (type) => {
        switch (type) {
            case 'National':
                return { className: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🏛️', label: 'National' };
            case 'Christian':
                return { className: 'bg-violet-100 text-violet-700 border-violet-200', icon: '✝', label: 'Christian' };
            case 'Islamic':
                return { className: 'bg-teal-100 text-teal-700 border-teal-200', icon: '☪', label: 'Islamic' };
            case 'Observance':
                return { className: 'bg-amber-100 text-amber-700 border-amber-200', icon: '⭐', label: 'Observance' };
            default:
                return { className: 'bg-slate-100 text-slate-700 border-slate-200', icon: '📅', label: type || 'Holiday' };
        }
    };

    const getCardAccent = (type) => {
        switch (type) {
            case 'Christian': return 'border-l-4 border-l-violet-500';
            case 'Islamic':   return 'border-l-4 border-l-teal-500';
            case 'National':  return 'border-l-4 border-l-blue-500';
            default:          return '';
        }
    };

    // Calculate days until (or since) this holiday
    const getCountdown = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const holidayDate = new Date(date);
        holidayDate.setHours(0, 0, 0, 0);
        const diffMs = holidayDate.getTime() - today.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getCountdownBadge = (date) => {
        const days = getCountdown(date);
        if (days === 0) {
            return {
                label: '🎉 Today!',
                className: 'bg-green-100 text-green-700 border border-green-300 animate-pulse',
            };
        }
        if (days === 1) {
            return {
                label: '⏰ Tomorrow',
                className: 'bg-orange-100 text-orange-700 border border-orange-300',
            };
        }
        if (days > 1 && days <= 30) {
            return {
                label: `⏳ in ${days} days`,
                className: 'bg-blue-100 text-blue-700 border border-blue-200',
            };
        }
        if (days > 30) {
            return {
                label: `📅 in ${days} days`,
                className: 'bg-slate-100 text-slate-500 border border-slate-200',
            };
        }
        // Past holiday — no badge
        return null;
    };

    const countdown = getCountdownBadge(holiday.date);
    const daysUntil = getCountdown(holiday.date);
    const isUpcoming = daysUntil >= 0;

    const handleRemind = () => {
        downloadICS(holiday);
        setReminded(true);
        setTimeout(() => setReminded(false), 3000);
    };

    const typeConfig = getTypeConfig(getEffectiveHolidayType(holiday));
    const cardAccent = getCardAccent(getEffectiveHolidayType(holiday));

    return (
        <div className={`card hover:scale-[1.02] transition-transform animate-fade-in ${cardAccent}`}>
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-display font-bold text-slate-900 pr-2">
                    {holiday.name}
                </h3>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    {holiday.type && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${typeConfig.className}`}>
                            <span>{typeConfig.icon}</span>
                            {typeConfig.label}
                        </span>
                    )}
                    {countdown && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${countdown.className}`}>
                            {countdown.label}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">{formatDate(holiday.date)}</span>
            </div>

            {holiday.description && (
                <p className="text-slate-600 text-sm leading-relaxed">
                    {holiday.description}
                </p>
            )}

            {/* Footer row: Public Holiday badge + Remind Me button */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {holiday.isPublicHoliday ? (
                    <span className="inline-flex items-center gap-2 text-xs text-green-700 font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {t('badge.national')}
                    </span>
                ) : (
                    <span /> /* spacer so Remind Me stays right-aligned */
                )}

                {/* Remind Me — only shown for upcoming holidays */}
                {isUpcoming && (
                    <button
                        onClick={handleRemind}
                        title="Download a calendar reminder (.ics)"
                        aria-label={`Add reminder for ${holiday.name}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                            reminded
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'
                        }`}
                    >
                        {reminded ? (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Added!
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                Remind me
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
