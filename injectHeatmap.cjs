const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// 1. Replace the Filter Toggle Bar (line 390-409) to add view toggle buttons
const filterBarStart = 390;
const filterBarEnd = 409;

const newFilterBar = [
    '                            {/* Filter Toggle Bar */}',
    '                            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/60 print:hidden">',
    '                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">',
    '                                    {displayedHolidays.length} {publicOnly ? "Public" : "Total"} Holiday{displayedHolidays.length !== 1 ? "s" : ""}',
    '                                </span>',
    '                                <div className="flex items-center gap-2">',
    '                                    {/* View toggle */}',
    '                                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">',
    '                                        <button',
    '                                            onClick={() => setViewMode("table")}',
    '                                            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${viewMode === "table" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}',
    '                                            title="Table view"',
    '                                        >',
    '                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 4v16M3 6a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6z" /></svg>',
    '                                            List',
    '                                        </button>',
    '                                        <button',
    '                                            onClick={() => setViewMode("heatmap")}',
    '                                            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${viewMode === "heatmap" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}',
    '                                            title="Calendar heatmap view"',
    '                                        >',
    '                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    '                                            Calendar',
    '                                        </button>',
    '                                    </div>',
    '                                    {/* Public Only toggle */}',
    '                                    <button',
    '                                        onClick={() => setPublicOnly(prev => !prev)}',
    '                                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${',
    '                                            publicOnly',
    '                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"',
    '                                                : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400 hover:text-emerald-700"',
    '                                        }`}',
    '                                        title={publicOnly ? "Show all holidays" : "Show public holidays only"}',
    '                                    >',
    '                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
    '                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />',
    '                                        </svg>',
    '                                        {publicOnly ? "✓ Public Only" : "Public Only"}',
    '                                    </button>',
    '                                </div>',
    '                            </div>',
    '                            {/* Conditional view */}',
    '                            {viewMode === "heatmap" ? (',
    '                                <div className="p-4">',
    '                                    <HolidayHeatmap holidays={publicOnly ? displayedHolidays : holidays} year={year} />',
    '                                </div>',
    '                            ) : (',
];

// Remove the old filter bar lines
lines.splice(filterBarStart, filterBarEnd - filterBarStart + 1, ...newFilterBar);

// Now we need to close the ternary after the table's closing tag
// Find the </table> after the new insertion and add closing ) : null }
const tableEndIdx = lines.findIndex((l, i) => i > filterBarStart + newFilterBar.length && l.includes('</table>'));
console.log('Table end at:', tableEndIdx);
if (tableEndIdx > -1) {
    lines.splice(tableEndIdx + 1, 0, '                            )}');
}

fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Injected heatmap toggle into CountryPage. Table end at:', tableEndIdx);
