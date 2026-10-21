const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const TYPE_STYLES = {
    public:      { bg: 'bg-emerald-500', text: 'text-white', dot: 'bg-emerald-500', label: 'Public Holiday' },
    bank:        { bg: 'bg-sky-400',     text: 'text-white', dot: 'bg-sky-400',     label: 'Bank Holiday' },
    optional:    { bg: 'bg-amber-400',   text: 'text-white', dot: 'bg-amber-400',   label: 'Optional' },
    observance:  { bg: 'bg-violet-400',  text: 'text-white', dot: 'bg-violet-400',  label: 'Observance' },
    default:     { bg: 'bg-slate-400',   text: 'text-white', dot: 'bg-slate-400',   label: 'Other' },
};

function getStyle(holiday) {
    if (!holiday) return null;
    if (holiday.isPublicHoliday || holiday.type === 'public') return TYPE_STYLES.public;
    if (holiday.type === 'bank') return TYPE_STYLES.bank;
    if (holiday.type === 'optional') return TYPE_STYLES.optional;
    if (holiday.type === 'observance') return TYPE_STYLES.observance;
    return TYPE_STYLES.default;
}

function MonthHeatmap({ year, monthIndex, holidayMap }) {
    const firstDay = new Date(year, monthIndex, 1);
    const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">{MONTH_NAMES[monthIndex]}</div>
            <div className="grid grid-cols-7 gap-0.5">
                {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-[9px] font-bold text-slate-400 pb-1">{d}</div>
                ))}
                {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const dateStr = `${year}-${String(monthIndex+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const holiday = holidayMap[dateStr];
                    const style = getStyle(holiday);
                    const isToday = dateStr === todayStr;
                    const dow = (new Date(year, monthIndex, day).getDay() + 6) % 7;
                    const isWeekend = dow >= 5;

                    let cellCls = 'relative w-full aspect-square rounded flex items-center justify-center text-[10px] font-semibold cursor-default transition-transform hover:scale-110';
                    if (style) {
                        cellCls += ` ${style.bg} ${style.text}`;
                    } else if (isWeekend) {
                        cellCls += ' bg-slate-100 text-slate-500';
                    } else {
                        cellCls += ' text-slate-700 hover:bg-slate-50';
                    }
                    if (isToday) {
                        cellCls += ' ring-2 ring-offset-1 ring-slate-900';
                    }

                    return (
                        <div
                            key={i}
                            className={cellCls}
                            title={holiday ? holiday.name : dateStr}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function HolidayHeatmap({ holidays, year }) {
    const yearInt = parseInt(year);

    // Build date -> holiday map (highest-priority type wins)
    const typePriority = { public: 4, bank: 3, optional: 2, observance: 1 };
    const holidayMap = {};
    if (holidays) {
        holidays
            .filter(h => h.year === yearInt)
            .forEach(h => {
                const existing = holidayMap[h.date];
                const curr = typePriority[h.type] || 0;
                const prev = existing ? (typePriority[existing.type] || 0) : -1;
                if (!existing || curr > prev) holidayMap[h.date] = h;
            });
    }

    const publicCount    = Object.values(holidayMap).filter(h => h.isPublicHoliday || h.type === 'public').length;
    const bankCount      = Object.values(holidayMap).filter(h => h.type === 'bank').length;
    const optionalCount  = Object.values(holidayMap).filter(h => h.type === 'optional').length;
    const observanceCount = Object.values(holidayMap).filter(h => h.type === 'observance').length;

    return (
        <div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 mb-5 text-xs">
                {publicCount > 0 && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-emerald-500 inline-block flex-shrink-0"></span>
                        <span className="text-slate-600 font-medium">Public Holiday ({publicCount})</span>
                    </span>
                )}
                {bankCount > 0 && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-sky-400 inline-block flex-shrink-0"></span>
                        <span className="text-slate-600 font-medium">Bank Holiday ({bankCount})</span>
                    </span>
                )}
                {optionalCount > 0 && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-amber-400 inline-block flex-shrink-0"></span>
                        <span className="text-slate-600 font-medium">Optional ({optionalCount})</span>
                    </span>
                )}
                {observanceCount > 0 && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-violet-400 inline-block flex-shrink-0"></span>
                        <span className="text-slate-600 font-medium">Observance ({observanceCount})</span>
                    </span>
                )}
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded ring-2 ring-slate-900 ring-offset-1 bg-white inline-block flex-shrink-0"></span>
                    <span className="text-slate-600 font-medium">Today</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-100 inline-block flex-shrink-0"></span>
                    <span className="text-slate-600 font-medium">Weekend</span>
                </span>
            </div>
            {/* 4x3 Grid of months */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => (
                    <MonthHeatmap key={i} year={yearInt} monthIndex={i} holidayMap={holidayMap} />
                ))}
            </div>
        </div>
    );
}