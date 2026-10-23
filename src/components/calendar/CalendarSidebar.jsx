import React, { useState, useRef } from 'react';
import { emojiMap } from '../../lib/calendarConstants';
import TemplateMiniPreview, { TEMPLATE_TOKENS } from './TemplateMiniPreview';
import { useCalendar } from '../../context/CalendarContext';

/* ─────────────────────────────────────────────
   Reusable helpers
───────────────────────────────────────────── */
function Label({ children, htmlFor }) {
    return (
        <label htmlFor={htmlFor} className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {children}
        </label>
    );
}

function SectionDivider({ title }) {
    return (
        <div className="flex items-center gap-2 pt-1 pb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
            <div className="flex-1 h-px bg-slate-700/60" />
        </div>
    );
}

/* Collapsible panel for advanced / extra options */
function Collapsible({ title, icon, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-700/60 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-900/40 hover:bg-slate-900/70 transition-colors text-left"
            >
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <span>{icon}</span>{title}
                </span>
                <svg
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="px-3 pb-3 pt-2 bg-slate-900/20 space-y-3">
                    {children}
                </div>
            )}
        </div>
    );
}

/* Pill button group */
function PillGroup({ options, value, onChange }) {
    return (
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
            {options.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                        value === opt.value
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-200'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

/* Toggle switch */
function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer group">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative flex-shrink-0 w-8 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${checked ? 'bg-primary-600' : 'bg-slate-700'}`}
                style={{ height: '18px' }}
            >
                <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{label}</span>
        </label>
    );
}

/* ─────────────────────────────────────────────
   Main sidebar — single-panel (no multi-step wizard)
───────────────────────────────────────────── */
export default function CalendarSidebar() {
    const {
        template, setTemplate,
        selectedCountryCode, setSelectedCountryCode, countries,
        year, setYear,
        orientation, setOrientation,
        paperSize, setPaperSize,
        viewMode, setViewMode,
        currentMonth, setCurrentMonth,
        customTitle, setCustomTitle, setHasCustomTitle,
        themeColor, setThemeColor, setHasCustomColor, hasCustomColor,
        fontFamily, setFontFamily,
        logoImage, handleLogoUpload, setLogoImage,
        showWeekends, setShowWeekends,
        showDescriptions, setShowDescriptions,
        notes, setNotes, setHasCustomNotes,
        personalEvents, handleAddPersonalEvent, handleEditPersonalEvent, handleDeletePersonalEvent,
        eventDate, setEventDate,
        eventName, setEventName,
        weekStart, setWeekStart,
        isMobileOpen, setIsMobileOpen,
        handleReset,
    } = useCalendar();

    const [editingEventId, setEditingEventId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [confirmReset, setConfirmReset] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');

    return (
        <>
            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-80 bg-slate-800 border-r border-slate-700/80 flex flex-col
                h-full md:h-[calc(100vh-68px)] print:hidden
                transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>

                {/* ── Header ── */}
                <div className="px-4 py-3.5 border-b border-slate-700 bg-slate-800 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="text-xl">🗓️</span>
                        <div>
                            <h2 className="text-sm font-bold text-white leading-tight">Calendar Studio</h2>
                            <p className="text-[10px] text-slate-500 leading-tight">Customise &amp; export your calendar</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {!confirmReset ? (
                            <button
                                onClick={() => setConfirmReset(true)}
                                title="Reset all settings"
                                className="text-[10px] font-semibold text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 border border-slate-700 hover:border-amber-500/40 px-2 py-1 rounded-lg transition-all"
                            >
                                ↺ Reset
                            </button>
                        ) : (
                            <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-600/40 rounded-lg px-2 py-1">
                                <span className="text-[10px] text-amber-300 font-semibold">Reset?</span>
                                <button
                                    onClick={() => { handleReset(); setConfirmReset(false); }}
                                    className="text-emerald-400 font-bold px-1 text-xs"
                                    title="Yes, reset"
                                >✓</button>
                                <button
                                    onClick={() => setConfirmReset(false)}
                                    className="text-slate-400 font-bold px-1 text-xs"
                                    title="Cancel"
                                >✕</button>
                            </div>
                        )}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            aria-label="Close sidebar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

                    {/* ══════════════════════════════
                        COUNTRY & YEAR
                    ══════════════════════════════ */}
                    <SectionDivider title="Country & Year" />

                    {/* Country */}
                    <div>
                        <Label>Country</Label>
                        <div className="relative">
                            <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                onBlur={() => setTimeout(() => setCountrySearch(''), 200)}
                                placeholder={`${emojiMap[selectedCountryCode] || '🌍'}  ${countries.find(c => c.id === selectedCountryCode)?.name || selectedCountryCode}`}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                aria-label="Search and select country"
                            />
                            {!countrySearch && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">🔍</span>
                            )}
                            {countrySearch.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-50 bg-slate-900 border border-slate-700 rounded-xl mt-1 max-h-52 overflow-y-auto shadow-2xl">
                                    {(() => {
                                        const filtered = countries.filter(c =>
                                            c.name.toLowerCase().includes(countrySearch.toLowerCase())
                                        ).slice(0, 10);
                                        return filtered.length > 0 ? filtered.map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => { setSelectedCountryCode(c.id); setCountrySearch(''); }}
                                                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-700 transition-colors ${
                                                    selectedCountryCode === c.id ? 'text-primary-400 bg-slate-800 font-semibold' : 'text-white'
                                                }`}
                                            >
                                                <span>{emojiMap[c.id] || '🌍'}</span>
                                                <span className="truncate">{c.name}</span>
                                                {selectedCountryCode === c.id && <span className="ml-auto text-primary-400 text-xs">✓</span>}
                                            </button>
                                        )) : (
                                            <div className="px-3 py-3 text-xs text-slate-500 text-center">No results for "{countrySearch}"</div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Year */}
                    <div>
                        <Label>Year</Label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {Array.from({ length: 9 }, (_, i) => {
                                const y = new Date().getFullYear() - 4 + i;
                                return <option key={y} value={String(y)}>{y}</option>;
                            })}
                        </select>
                    </div>

                    {/* Month (only in monthly view) */}
                    {viewMode === 'month' && (
                        <div>
                            <Label>Month</Label>
                            <select
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {Array.from({ length: 12 }).map((_, idx) => (
                                    <option key={idx} value={idx}>
                                        {new Date(parseInt(year), idx, 1).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* ══════════════════════════════
                        LAYOUT
                    ══════════════════════════════ */}
                    <SectionDivider title="Layout" />

                    <div>
                        <Label>Calendar View</Label>
                        <PillGroup
                            value={viewMode}
                            onChange={setViewMode}
                            options={[
                                { value: 'month', label: '📅 Monthly' },
                                { value: 'year',  label: '🗓️ Full Year' },
                            ]}
                        />
                    </div>

                    <div>
                        <Label>Orientation</Label>
                        <PillGroup
                            value={orientation}
                            onChange={setOrientation}
                            options={[
                                { value: 'landscape', label: '🖼 Landscape' },
                                { value: 'portrait',  label: '📄 Portrait' },
                            ]}
                        />
                    </div>

                    <div>
                        <Label>Paper Size</Label>
                        <PillGroup
                            value={paperSize}
                            onChange={setPaperSize}
                            options={[
                                { value: 'A4',     label: 'A4' },
                                { value: 'A3',     label: 'A3' },
                                { value: 'Letter', label: 'Letter' },
                            ]}
                        />
                        <p className="text-[10px] text-slate-600 mt-1.5 px-0.5">A4 = 297×210 mm · A3 = 420×297 mm · Letter = 8.5×11 in</p>
                    </div>

                    <div>
                        <Label>Week Starts On</Label>
                        <PillGroup
                            value={weekStart}
                            onChange={setWeekStart}
                            options={[
                                { value: 0, label: 'Sunday' },
                                { value: 1, label: 'Monday' },
                            ]}
                        />
                    </div>

                    {/* ══════════════════════════════
                        TEMPLATE
                    ══════════════════════════════ */}
                    <SectionDivider title="Template" />

                    <div className="grid grid-cols-2 gap-2.5">
                        {Object.keys(TEMPLATE_TOKENS).map((key) => {
                            const tokens = TEMPLATE_TOKENS[key];
                            const isSelected = template === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setTemplate(key)}
                                    aria-pressed={isSelected}
                                    aria-label={`${key} template`}
                                    className={`rounded-xl text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                                        isSelected
                                            ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-slate-800'
                                            : 'hover:ring-1 hover:ring-slate-500 hover:ring-offset-1 hover:ring-offset-slate-800'
                                    }`}
                                    style={{ padding: 0, background: 'transparent', border: 'none' }}
                                >
                                    <div className="overflow-hidden rounded-xl">
                                        <TemplateMiniPreview templateKey={key} />
                                    </div>
                                    <div className="flex items-center justify-between mt-1 px-0.5">
                                        <div>
                                            <div className={`text-xs font-bold capitalize ${isSelected ? 'text-primary-400' : 'text-slate-300'}`}>
                                                {tokens.label}
                                            </div>
                                            <div className="text-[9px] text-slate-500 truncate">{tokens.tagline}</div>
                                        </div>
                                        {isSelected && (
                                            <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* ══════════════════════════════
                        STYLE
                    ══════════════════════════════ */}
                    <SectionDivider title="Style" />

                    {/* Accent colour */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <Label>Accent Colour</Label>
                            {hasCustomColor && (
                                <button
                                    onClick={() => setHasCustomColor(false)}
                                    className="text-[10px] text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                                    title="Reset to template default"
                                >↺ Reset</button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={themeColor}
                                onChange={(e) => { setThemeColor(e.target.value); setHasCustomColor(true); }}
                                className="w-9 h-8 rounded border border-slate-700 bg-transparent cursor-pointer flex-shrink-0"
                            />
                            <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Colour presets">
                                {['#0284c7','#7c3aed','#dc2626','#16a34a','#ea580c','#0f172a','#db2777','#0d9488'].map(hex => (
                                    <button
                                        key={hex}
                                        type="button"
                                        onClick={() => { setThemeColor(hex); setHasCustomColor(true); }}
                                        aria-label={`Accent colour ${hex}`}
                                        className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-125 focus:outline-none ${
                                            themeColor.toLowerCase() === hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                                        }`}
                                        style={{ backgroundColor: hex }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Font */}
                    <div>
                        <Label>Font</Label>
                        <select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="sans">Inter (Sans-Serif)</option>
                            <option value="serif">Merriweather (Serif)</option>
                            <option value="playful">Outfit (Playful)</option>
                            <option value="monospace">Courier (Retro)</option>
                        </select>
                    </div>

                    {/* Quick toggles */}
                    <div className="space-y-2.5">
                        <Toggle label="Highlight Weekends" checked={showWeekends} onChange={setShowWeekends} />
                        <Toggle label="Show Holiday Descriptions" checked={showDescriptions} onChange={setShowDescriptions} />
                    </div>

                    {/* ══════════════════════════════
                        ADVANCED (collapsible)
                    ══════════════════════════════ */}
                    <Collapsible title="Advanced Options" icon="⚙️">
                        <div>
                            <Label>Calendar Title</Label>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => { setCustomTitle(e.target.value); setHasCustomTitle(true); }}
                                placeholder="Custom heading..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <Label>Brand Logo (PNG / JPG)</Label>
                            <div className="flex items-center gap-3">
                                {logoImage && (
                                    <div className="relative flex-shrink-0">
                                        <img src={logoImage} alt="logo" className="w-10 h-10 object-contain rounded bg-white p-1" />
                                        <button
                                            onClick={() => setLogoImage(null)}
                                            title="Remove logo"
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 text-white text-[9px] font-bold flex items-center justify-center"
                                        >✕</button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Footer Notes</Label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => { setNotes(e.target.value); setHasCustomNotes(true); }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </Collapsible>

                    {/* ══════════════════════════════
                        PERSONAL EVENTS (collapsible)
                    ══════════════════════════════ */}
                    <Collapsible
                        title={`Personal Events${personalEvents.length > 0 ? ` (${personalEvents.length})` : ''}`}
                        icon="📅"
                    >
                        <form onSubmit={handleAddPersonalEvent} className="space-y-2">
                            <input
                                type="date"
                                min={`${year}-01-01`}
                                max={`${year}-12-31`}
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder="Jane's Birthday, Exam..."
                                    className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                >Add</button>
                            </div>
                        </form>

                        {personalEvents.length > 0 && (
                            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-0.5 mt-1">
                                {personalEvents.map((evt) => (
                                    <div key={evt.id} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800 text-xs">
                                        {editingEventId === evt.id ? (
                                            <div className="flex-grow flex gap-1.5 items-center mr-2">
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if (editingName.trim()) handleEditPersonalEvent(evt.id, editingName.trim());
                                                            setEditingEventId(null);
                                                        }
                                                        if (e.key === 'Escape') setEditingEventId(null);
                                                    }}
                                                />
                                                <button type="button" onClick={() => { if (editingName.trim()) handleEditPersonalEvent(evt.id, editingName.trim()); setEditingEventId(null); }} className="text-emerald-400 font-bold px-1" title="Save">✓</button>
                                                <button type="button" onClick={() => setEditingEventId(null)} className="text-slate-400 font-bold px-1" title="Cancel">✕</button>
                                            </div>
                                        ) : (
                                            <div
                                                className="truncate pr-2 flex-grow cursor-pointer"
                                                onClick={() => { setEditingEventId(evt.id); setEditingName(evt.name); }}
                                                title="Click to edit"
                                            >
                                                <span className="text-amber-400 font-bold block text-[10px]">{evt.date}</span>
                                                <span className="text-slate-300 block truncate">{evt.name}</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleDeletePersonalEvent(evt.id)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded flex-shrink-0"
                                            title="Delete event"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Collapsible>

                    {/* bottom padding */}
                    <div className="h-2" />
                </div>
                {/* end scrollable body */}

            </aside>
        </>
    );
}
