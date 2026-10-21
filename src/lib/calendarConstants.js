export const emojiMap = {
    GH: '🇬🇭', NG: '🇳🇬', US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵',
    IN: '🇮🇳', AU: '🇦🇺', ZA: '🇿🇦', TG: '🇹🇬', AT: '🇦🇹', BE: '🇧🇪', BG: '🇧🇬', HR: '🇭🇷',
    CY: '🇨🇾', CZ: '🇨🇿', DK: '🇩🇰', EE: '🇪🇪', FI: '🇫🇮', GR: '🇬🇷', HU: '🇭🇺', IE: '🇮🇪',
    IT: '🇮🇹', LV: '🇱🇻', LT: '🇱🇹', LU: '🇱🇺', MT: '🇲🇹', NL: '🇳🇱', PL: '🇵🇱', PT: '🇵🇹',
    RO: '🇷🇴', SK: '🇸🇰', SI: '🇸🇮', ES: '🇪🇸', SE: '🇸🇪', BJ: '🇧🇯', BF: '🇧🇫', CV: '🇨🇻', 
    CI: '🇨🇮', GM: '🇬🇲', GN: '🇬🇳', GW: '🇬🇼', LR: '🇱🇷', ML: '🇲🇱', MR: '🇲🇷', NE: '🇳🇪', 
    SN: '🇸🇳', SL: '🇸🇱', CN: '🇨🇳', KR: '🇰🇷', SG: '🇸🇬', MY: '🇲🇾', TH: '🇹🇭', ID: '🇮🇩',
    PH: '🇵🇭', VN: '🇻🇳', BD: '🇧🇩', PK: '🇵🇰', LK: '🇱🇰', NP: '🇳🇵', MM: '🇲🇲', KH: '🇰🇭',
    MN: '🇲🇳', KZ: '🇰🇿', UZ: '🇺🇿', AZ: '🇦🇿', GE: '🇬🇪', AM: '🇦🇲', HK: '🇭🇰', TW: '🇹🇼',
    NA: '🇳🇦', BW: '🇧🇼', ZW: '🇿🇼', MZ: '🇲🇿', LS: '🇱🇸', SZ: '🇸🇿', AO: '🇦🇴', ZM: '🇿🇲',
    MW: '🇲🇼', MG: '🇲🇬', BR: '🇧🇷', AR: '🇦🇷', CO: '🇨🇴', PE: '🇵🇪', CL: '🇨🇱', VE: '🇻🇪',
    EC: '🇪🇨', BO: '🇧🇴', PY: '🇵🇾', UY: '🇺🇾', GY: '🇬🇾', SR: '🇸🇷',
    MX: '🇲🇽', GT: '🇬🇹', BZ: '🇧🇿', HN: '🇭🇳', SV: '🇸🇻', NI: '🇳🇮', CR: '🇨🇷', PA: '🇵🇦',
    CU: '🇨🇺', JM: '🇯🇲', HT: '🇭🇹', DO: '🇩🇴', TT: '🇹🇹', BB: '🇧🇧', LC: '🇱🇨', VC: '🇻🇨',
    GD: '🇬🇩', AG: '🇦🇬', DM: '🇩🇲', KN: '🇰🇳', BS: '🇧🇸',
    KE: '🇰🇪', TZ: '🇹🇿', UG: '🇺🇬', RW: '🇷🇼', BI: '🇧🇮', ET: '🇪🇹', SO: '🇸🇴', DJ: '🇩🇯', ER: '🇪🇷', SS: '🇸🇸'
};

export const templatesConfig = {
    minimal: {
        bg: 'bg-white',
        border: 'border-slate-200',
        text: 'text-slate-800',
        headerBg: 'bg-slate-50 border-b border-slate-200',
        dayHeaderBg: 'bg-slate-100/50',
        dayCell: 'hover:bg-slate-50',
        weekendCell: 'bg-slate-50/50',
        holidayBadge: 'bg-slate-100 text-slate-700 font-medium',
        decorations: null,
    },
    colorful: {
        bg: 'bg-gradient-to-tr from-white to-sky-50/20',
        border: 'border-blue-100',
        text: 'text-slate-800',
        headerBg: 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white rounded-t-xl',
        dayHeaderBg: 'bg-sky-50/50 text-sky-700 font-semibold',
        dayCell: 'hover:bg-sky-50/30 rounded-lg',
        weekendCell: 'bg-pink-50/30',
        holidayBadge: 'bg-primary-100 text-primary-800 font-semibold rounded-full px-2 py-0.5',
        decorations: null,
    },
    corporate: {
        bg: 'bg-white',
        border: 'border-slate-300',
        text: 'text-slate-900',
        headerBg: 'bg-slate-800 text-white border-b-2 border-slate-900',
        dayHeaderBg: 'bg-slate-100 text-slate-800 font-bold',
        dayCell: 'hover:bg-slate-50 border border-slate-200',
        weekendCell: 'bg-slate-100/30',
        holidayBadge: 'bg-blue-900 text-white font-bold rounded px-1.5 py-0.5',
        decorations: null,
    },
    dark: {
        bg: 'bg-slate-900',
        border: 'border-slate-800',
        text: 'text-slate-100',
        headerBg: 'bg-slate-950 border-b border-slate-800 text-white',
        dayHeaderBg: 'bg-slate-900/80 text-slate-400 font-medium',
        dayCell: 'hover:bg-slate-800/50 text-slate-300',
        weekendCell: 'bg-slate-800/20',
        holidayBadge: 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-semibold rounded px-1.5 py-0.5',
        decorations: null,
    },
    elegant: {
        bg: 'bg-amber-50/10',
        border: 'border-amber-900/20',
        text: 'text-stone-900',
        headerBg: 'bg-stone-100 border-b border-stone-300',
        dayHeaderBg: 'bg-stone-50 text-stone-600 font-serif italic',
        dayCell: 'hover:bg-stone-50 border-stone-200',
        weekendCell: 'bg-stone-100/30',
        holidayBadge: 'bg-stone-200 text-stone-800 font-serif italic border-l-2 border-amber-600 pl-1.5 py-0.5',
        decorations: null,
    },
    kids: {
        bg: 'bg-amber-50/30',
        border: 'border-amber-300 border-dashed border-2',
        text: 'text-slate-800',
        headerBg: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white rounded-t-2xl p-4',
        dayHeaderBg: 'bg-yellow-100 text-yellow-800 font-bold rounded-lg m-1',
        dayCell: 'hover:bg-amber-100/50 rounded-xl m-0.5 border border-dashed border-amber-200',
        weekendCell: 'bg-orange-50/50',
        holidayBadge: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold rounded-full px-2 py-0.5',
        decorations: null,
    },
    floral: {
        bg: 'bg-rose-50/20',
        border: 'border-rose-200',
        text: 'text-rose-950',
        headerBg: 'bg-rose-100/70 border-b border-rose-200 text-rose-900',
        dayHeaderBg: 'bg-rose-50 text-rose-800 font-medium',
        dayCell: 'hover:bg-rose-50/50',
        weekendCell: 'bg-pink-50/40',
        holidayBadge: 'bg-pink-100 text-rose-800 border border-pink-200 font-medium rounded-md px-1.5 py-0.5',
        decorations: 'floral',
    },
    compact: {
        bg: 'bg-white',
        border: 'border-slate-200',
        text: 'text-slate-800',
        headerBg: 'bg-slate-50 border-b border-slate-200',
        dayHeaderBg: 'bg-slate-100/50 text-xs',
        dayCell: 'text-xs p-1',
        weekendCell: 'bg-slate-50',
        holidayBadge: 'bg-red-100 text-red-800 text-[10px] font-bold rounded px-1',
        decorations: null,
    }
};

export const fontMap = {
    sans: 'font-sans',
    serif: 'font-serif',
    playful: 'font-display',
    monospace: 'font-mono'
};

/**
 * Formats a Date object as YYYY-MM-DD in local time, bypassing UTC timezone shifts.
 * @param {Date} dateObj
 * @returns {string} YYYY-MM-DD
 */
export const getLocalDateString = (dateObj) => {
    if (!dateObj || !(dateObj instanceof Date)) return '';
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Normalizes a holiday or event date value into a timezone-safe YYYY-MM-DD string.
 * Supports JS Date, ISO String, pure date string, and Firestore Timestamp.
 * @param {any} hDateValue
 * @returns {string} YYYY-MM-DD
 */
export const getHolidayDateString = (hDateValue) => {
    if (!hDateValue) return '';
    if (hDateValue instanceof Date) {
        return getLocalDateString(hDateValue);
    }
    if (typeof hDateValue === 'string') {
        return hDateValue.split('T')[0];
    }
    // Support Firestore Timestamp object with toDate()
    if (typeof hDateValue === 'object' && typeof hDateValue.toDate === 'function') {
        return getLocalDateString(hDateValue.toDate());
    }
    return getLocalDateString(new Date(hDateValue));
};

/**
 * Returns a local Date object representing midnight (00:00:00.000) for the given holiday date,
 * ensuring timezone-safe comparison with local today.
 * @param {any} hDateValue
 * @returns {Date}
 */
export const getLocalMidnightDate = (hDateValue) => {
    const dateStr = getHolidayDateString(hDateValue);
    if (!dateStr) return new Date();
    const [yr, mo, dy] = dateStr.split('-').map(Number);
    return new Date(yr, mo - 1, dy, 0, 0, 0, 0);
};

// Keywords used to detect Christian holidays by name when type is "National"
const CHRISTIAN_KEYWORDS = [
    'christmas', 'easter', 'good friday', 'holy friday', 'boxing day',
    'epiphany', 'ascension', 'pentecost', 'whit', 'corpus christi',
    'all saints', 'all souls', 'assumption', 'immaculate conception',
    'palm sunday', 'holy thursday', 'holy saturday', 'holy week',
    'advent', 'nativity', 'annunciation', 'transfiguration', 'st. stephen',
    'saint stephen', 'st stephen', 'st. patrick', 'saint patrick',
    'reformation day', 'shrove', 'ash wednesday', 'lent',
];

// Keywords used to detect Islamic holidays by name when type is "National"
const ISLAMIC_KEYWORDS = [
    'eid', 'ramadan', 'mawlid', 'moulid', 'milad', 'prophet',
    'muharram', 'ashura', 'isra', 'laylat', 'al-fitr', 'al-adha',
    'hijri', 'islamic new year', 'eid-ul', 'eid ul',
    'shaqq', 'arafah', 'sacrifice', 'feast of the sacrifice',
];

/**
 * Returns the effective holiday type, using keyword-based name detection
 * to reclassify holidays that are stored as "National" but are clearly
 * Christian or Islamic in origin (e.g. Christmas, Easter, Eid).
 * @param {{ type: string, name: string }} holiday
 * @returns {'Christian'|'Islamic'|'National'|'Observance'|string}
 */
export const getEffectiveHolidayType = (holiday) => {
    if (!holiday) return 'National';
    // If already explicitly typed as Christian or Islamic, trust the data
    if (holiday.type === 'Christian' || holiday.type === 'Islamic') return holiday.type;

    const nameLower = (holiday.name || '').toLowerCase();

    if (CHRISTIAN_KEYWORDS.some(kw => nameLower.includes(kw))) return 'Christian';
    if (ISLAMIC_KEYWORDS.some(kw => nameLower.includes(kw))) return 'Islamic';

    return holiday.type || 'National';
};
