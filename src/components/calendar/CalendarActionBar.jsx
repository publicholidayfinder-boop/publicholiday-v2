import React, { useState, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';

export default function CalendarActionBar({
    handleExportPDF,
    handleExportPNG,
    handleExportICS
}) {
    const {
        exporting,
        exportingType,
        handlePrint,
        handleShareLink,
        viewMode,
        setViewMode
    } = useCalendar();

    const [exportScope, setExportScope] = useState('all');

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                handlePrint();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                handleExportPDF();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrint, handleExportPDF]);


    return (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex flex-col md:flex-row gap-3 items-center justify-between shadow-md print:hidden">

            {/* VIEW MODE TOGGLE (Center/Left) */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 w-full md:w-auto flex-shrink-0">
                <button
                    onClick={() => setViewMode('month')}
                    className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        viewMode === 'month' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    📅 Monthly View
                </button>
                <button
                    onClick={() => setViewMode('year')}
                    className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        viewMode === 'year' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    🗓️ 12-Month View
                </button>
            </div>

            {/* Export Group */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end flex-grow">

                {/* Primary: PDF */}
                <button
                    onClick={handleExportPDF}
                    disabled={exporting}
                    aria-busy={exportingType === 'pdf'}
                    aria-label="Export calendar as PDF"
                    className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:shadow-lg hover:from-red-500 hover:to-rose-500 transition-all flex items-center gap-1.5 disabled:opacity-60 shadow-md flex-shrink-0"
                >
                    {exportingType === 'pdf' ? '⌛ Generating...' : <span className="flex items-center">📄 PDF <span className="opacity-60 text-[9px] font-normal ml-1.5 bg-black/10 px-1 rounded hidden lg:block">Ctrl+E</span></span>}
                </button>

                {/* PNG */}
                <button
                    onClick={handleExportPNG}
                    disabled={exporting}
                    aria-busy={exportingType === 'png'}
                    aria-label="Export calendar as PNG image"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-60 flex-shrink-0"
                >
                    {exportingType === 'png' ? '⌛ PNG...' : '🖼️ PNG'}
                </button>

                {/* ICS with scope selector */}
                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex-shrink-0" title="Download as calendar file (.ics)">
                    <button
                        onClick={() => handleExportICS(viewMode === 'year' ? 'all' : exportScope)}
                        aria-label="Download calendar as ICS file"
                        className="text-slate-200 font-semibold text-xs px-3 py-2.5 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                        📅 ICS
                    </button>
                    <div className="w-px self-stretch bg-slate-700" aria-hidden="true" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1.5 hidden sm:inline">
                            Export:
                        </span>
                    <select
                        value={viewMode === 'year' ? 'all' : exportScope}
                        onChange={(e) => setExportScope(e.target.value)}
                        className="bg-slate-800 text-slate-400 text-[10px] font-semibold px-1.5 py-2.5 focus:outline-none cursor-pointer hover:text-slate-200 transition-colors"
                        title="ICS export scope"
                        aria-label="ICS export scope"
                    >
                        <option value="all">Full Year</option>
                        {viewMode === 'month' && <option value="month">This Month</option>}
                    </select>
                </div>

                {/* Print */}
                <button
                    onClick={handlePrint}
                    aria-label="Print calendar"
                    className="text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 hover:bg-slate-800 flex-shrink-0"
                >
                    <span className="flex items-center">🖨️ Print <span className="opacity-50 text-[9px] font-normal ml-1.5 border border-slate-700 px-1 rounded hidden lg:block">Ctrl+P</span></span>
                </button>

                {/* Right: Share */}
                <button
                    onClick={handleShareLink}
                    aria-label="Copy shareable calendar link"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                    🔗 Share
                </button>
            </div>
        </div>
    );
}
