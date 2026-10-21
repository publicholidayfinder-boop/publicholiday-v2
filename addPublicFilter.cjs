const fs = require('fs');
let content = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8');

// 1. Add publicOnly state right after the existing selectedType state
const stateTarget = `const [selectedType, setSelectedType] = React.useState('All');`;
const stateReplace = `const [selectedType, setSelectedType] = React.useState('All');
    const [publicOnly, setPublicOnly] = React.useState(false);`;
content = content.replace(stateTarget, stateReplace);

// 2. Update activeFilterCount to account for publicOnly
const filterCountTarget = `const activeFilterCount = (selectedMonth !== 'All' ? 1 : 0)
        + (selectedReligion !== 'All' ? 1 : 0)
        + (selectedType !== 'All' ? 1 : 0);`;
const filterCountReplace = `const activeFilterCount = (selectedMonth !== 'All' ? 1 : 0)
        + (selectedReligion !== 'All' ? 1 : 0)
        + (selectedType !== 'All' ? 1 : 0)
        + (publicOnly ? 1 : 0);`;
content = content.replace(filterCountTarget, filterCountReplace);

// 3. Also reset publicOnly in handleResetFilters
const resetTarget = `const handleResetFilters = () => {
        setSelectedMonth('All');
        setSelectedReligion('All');
        setSelectedType('All');
    };`;
const resetReplace = `const handleResetFilters = () => {
        setSelectedMonth('All');
        setSelectedReligion('All');
        setSelectedType('All');
        setPublicOnly(false);
    };`;
content = content.replace(resetTarget, resetReplace);

// 4. Replace the raw `holidays` used in .map() with a filtered version
// The table currently uses `holidays` directly. We need a derived list.
// Add displayedHolidays right after handleResetFilters:
const afterResetTarget = `const stats = React.useMemo(() => {`;
const afterResetReplace = `// Derived list that respects the Public Only toggle
    const displayedHolidays = React.useMemo(() => {
        if (!holidays) return [];
        if (publicOnly) return holidays.filter(h => h.isPublicHoliday === true || h.type === 'public');
        return holidays;
    }, [holidays, publicOnly]);

    const stats = React.useMemo(() => {`;
content = content.replace(afterResetTarget, afterResetReplace);

// 5. Replace the raw `holidays` in the table rendering with displayedHolidays
//    First: replace `holidays.length === 0`
content = content.replace(
    `) : holidays.length === 0 ? (`,
    `) : displayedHolidays.length === 0 ? (`
);
//    Second: replace the big .map() reference
content = content.replace(
    `(mobileExpanded ? holidays : holidays.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 && !window.matchMedia('print').matches ? 5 : holidays.length)).map((holiday, idx) => {`,
    `(mobileExpanded ? displayedHolidays : displayedHolidays.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 && !window.matchMedia('print').matches ? 5 : displayedHolidays.length)).map((holiday, idx) => {`
);
//    Third: update the mobile accordion show more threshold
content = content.replace(
    `{holidays.length > 5 && (`,
    `{displayedHolidays.length > 5 && (`
);

// 6. Add the toggle button bar above the table thead, inside the structured-table wrapper div
const theadTarget = `{/* Structured Table */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>`;
const theadReplace = `{/* Structured Table */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            {/* Filter Toggle Bar */}
                            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/60 print:hidden">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    {displayedHolidays.length} {publicOnly ? 'Public' : 'Total'} Holiday{displayedHolidays.length !== 1 ? 's' : ''}
                                </span>
                                <button
                                    onClick={() => setPublicOnly(!publicOnly)}
                                    className={\`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all \${
                                        publicOnly
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                            : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400 hover:text-emerald-700'
                                    }\`}
                                    title={publicOnly ? 'Show all holidays including observances' : 'Show public holidays only (excludes observances)'}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                                    </svg>
                                    {publicOnly ? '✓ Public Only' : 'Public Only'}
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>`;
content = content.replace(theadTarget, theadReplace);

fs.writeFileSync('src/pages/CountryPage.jsx', content, 'utf-8');
console.log('Done! Holiday type filter toggle added.');
