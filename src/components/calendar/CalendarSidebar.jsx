import React, { useState, useRef } from 'react';
import { emojiMap } from '../../lib/calendarConstants';
import TemplateMiniPreview, { TEMPLATE_TOKENS } from './TemplateMiniPreview';
import SidebarSection from './SidebarSection';
import { useCalendar } from '../../context/CalendarContext';

/* ─────────────────────────────────────────────
   Main sidebar
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
        showToast
    } = useCalendar();

    const sidebarRef = useRef(null);
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [confirmReset, setConfirmReset] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [countrySearch, setCountrySearch] = useState('');
    const [finished, setFinished] = useState(false);

    // Step-derived open sections — controlled by wizard currentStep
    const openSections = {
        template: currentStep === 2,
        configuration: currentStep === 1,
        aesthetics: currentStep === 3,
        events: currentStep === 4,
    };
    const toggleSection = () => {};

    // First-visit hint — dismissed via localStorage
    const [showHint, setShowHint] = React.useState(() => {
        try { return !localStorage.getItem('cs_hint_dismissed'); } catch { return true; }
    });
    const dismissHint = () => {
        setShowHint(false);
        try { localStorage.setItem('cs_hint_dismissed', '1'); } catch {}
    };

    return (
        <>
            {/* Mobile Sidebar Backdrop */}
            {isMobileOpen && (
                <div 
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            <aside 
                ref={sidebarRef}
                className={`
                fixed md:static inset-y-0 left-0 z-50
                w-80 md:w-96 bg-slate-800 border-r border-slate-700 flex flex-col overflow-y-auto h-full md:h-[calc(100vh-68px)] print:hidden
                transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>

                {/* ── Panel Header ── */}
                <div className="p-6 border-b border-slate-700 bg-slate-800/80 sticky top-0 z-20 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🎨</span>
                            <h2 className="text-xl font-bold font-display text-white">Calendar Studio</h2>
                        </div>

                        <div className="flex items-center gap-2">
                            {!confirmReset ? (
                                <button
                                    id="sidebar-reset-btn"
                                    onClick={() => setConfirmReset(true)}
                                    title="Reset all customisations to defaults"
                                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 border border-slate-700 hover:border-amber-500/40 px-2.5 py-1.5 rounded-lg transition-all duration-150"
                                >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset
                                </button>
                            ) : (
                                <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-600/40 rounded-lg px-2.5 py-1.5">
                                    <span className="text-[11px] text-amber-300 font-semibold">Reset all?</span>
                                    <button
                                        id="sidebar-reset-confirm-btn"
                                        onClick={() => { handleReset(); setConfirmReset(false); }}
                                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors px-1"
                                        title="Yes, reset"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button
                                        id="sidebar-reset-cancel-btn"
                                        onClick={() => setConfirmReset(false)}
                                        className="text-[11px] font-bold text-slate-400 hover:text-slate-200 transition-colors px-1"
                                        title="Cancel"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="md:hidden p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                aria-label="Close customizer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">Design your perfect custom printable calendar in seconds.</p>

                {/* ── Step Progress Bar ── */}
                <div className="flex items-center gap-1.5 mt-1">
                    {[
                        { step: 1, label: 'Config' },
                        { step: 2, label: 'Template' },
                        { step: 3, label: 'Style' },
                        { step: 4, label: 'Events' },
                    ].map(({ step, label }) => (
                        <button
                            key={step}
                            onClick={() => setCurrentStep(step)}
                            className={`flex-1 flex flex-col items-center gap-1 group focus:outline-none`}
                        >
                            <div className={`h-1.5 w-full rounded-full transition-all duration-200 ${currentStep >= step ? 'bg-primary-500' : 'bg-slate-600'}`} />
                            <span className={`text-[9px] font-semibold transition-colors ${currentStep === step ? 'text-primary-400' : 'text-slate-600'}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
                </div>

                {/* ═══ STEP 1 OF 4 ═══ */}
                {/* ── Section 1: Template ── */}
                {currentStep === 2 && (
                <SidebarSection
                    id="template"
                    title="Choose Template"
                    icon="🖼"
                    isOpen={openSections.template}
                    onToggle={() => {}}
                >
                    {showHint && (
                        <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-3">
                            <span className="text-lg leading-none mt-0.5">👆</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-amber-300 mb-0.5">Pick your style</p>
                                <p className="text-[11px] text-amber-200/70 leading-relaxed">Click any template to preview it live on the right. Then tap <strong className="text-amber-300">Next</strong> to continue.</p>
                            </div>
                            <button onClick={dismissHint} className="text-amber-500/60 hover:text-amber-300 transition-colors flex-shrink-0 mt-0.5" title="Dismiss tip" aria-label="Dismiss tip">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        {Object.keys(TEMPLATE_TOKENS).map((key) => {
                            const tokens = TEMPLATE_TOKENS[key];
                            const isSelected = template === key;

                            return (
                                <button
                                    key={key}
                                    onClick={() => setTemplate(key)}
                                    aria-label={`Select ${key} template`}
                                    aria-pressed={isSelected}
                                    className={`group relative rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                                        isSelected
                                            ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-slate-800'
                                            : 'hover:ring-1 hover:ring-slate-500 hover:ring-offset-1 hover:ring-offset-slate-800'
                                    }`}
                                    style={{ padding: 0, background: 'transparent', border: 'none' }}
                                >
                                    <div className="overflow-hidden rounded-xl">
                                        <TemplateMiniPreview templateKey={key} />
                                    </div>
                                    <div className={`flex items-center justify-between mt-1.5 px-0.5 transition-colors`}>
                                        <div>
                                            <div className={`text-xs font-bold capitalize transition-colors ${isSelected ? 'text-primary-400' : 'text-slate-200 group-hover:text-white'}`}>
                                                {tokens.label}
                                            </div>
                                            <div className="text-[9px] text-slate-500 mt-0.5 truncate leading-tight">
                                                {tokens.tagline}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center ml-1">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </SidebarSection>

                )}

                {/* ═══ STEP 2 OF 4 ═══ */}
                {/* ── Section 2: Configuration ── */}
                {currentStep === 1 && (
                <SidebarSection
                    id="configuration"
                    title="Configuration"
                    icon="⚙️"
                    isOpen={openSections.configuration}
                    onToggle={() => {}}
                >
                    <div>
                    <div className="flex items-start gap-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-3">
                        <span className="text-lg leading-none mt-0.5">🌍</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-blue-300 mb-0.5">Set up your calendar</p>
                            <p className="text-[11px] text-blue-200/70 leading-relaxed">Type your <strong className="text-blue-300">country</strong> to load public holidays automatically. Then set the year, orientation and paper size.</p>
                        </div>
                    </div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Country</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                onBlur={() => setTimeout(() => setCountrySearch(''), 200)}
                                placeholder={`${emojiMap[selectedCountryCode] || '🌍'}  ${countries.find(c => c.id === selectedCountryCode)?.name || selectedCountryCode}`}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                aria-label="Search and select country"
                            />
                            {!countrySearch && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">🔍</span>
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
                                                <span>{emojiMap[c.id] || '🌍'}</span>
                                                <span className="truncate">{c.name}</span>
                                                {selectedCountryCode === c.id && <span className="ml-auto text-primary-400 text-xs">✓</span>}
                                            </button>
                                        )) : (
                                            <div className="px-3 py-3 text-xs text-slate-500 text-center">No countries found for "{countrySearch}"</div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {Array.from({ length: 9 }, (_, i) => {
                                const y = new Date().getFullYear() - 5 + i;
                                return (
                                    <option key={y} value={String(y)}>{y}</option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Orientation</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setOrientation('landscape')}
                                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                                    orientation === 'landscape' ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700'
                                }`}
                            >
                                🖼 Landscape
                            </button>
                            <button
                                onClick={() => setOrientation('portrait')}
                                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                                    orientation === 'portrait' ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700'
                                }`}
                            >
                                📄 Portrait
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 flex justify-between px-0.5">
                            <span>Landscape → wider page (A4: 297×210mm)</span>
                            <span>Portrait → taller (210×297mm)</span>
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-slate-400">Paper Size</label>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wide flex items-center gap-1">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                PDF / PNG export only
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            <button
                                onClick={() => setPaperSize('A4')}
                                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                                    paperSize === 'A4' ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                A4 (Standard)
                            </button>
                            <button
                                onClick={() => setPaperSize('A3')}
                                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                                    paperSize === 'A3' ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                A3 (Poster)
                            </button>
                            <button
                                onClick={() => setPaperSize('Letter')}
                                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                                    paperSize === 'Letter' ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                Letter (US)
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 px-0.5">
                            A4 = 297×210mm · A3 = 420×297mm · Letter = 8.5×11in
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Week Starts On</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setWeekStart(0)}
                                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
                                    weekStart === 0 ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700'
                                }`}
                            >
                                Sunday
                            </button>
                            <button
                                onClick={() => setWeekStart(1)}
                                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
                                    weekStart === 1 ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700'
                                }`}
                            >
                                Monday
                            </button>
                        </div>
                    </div>

                    {viewMode === 'month' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Active Month</label>
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
                </SidebarSection>

                )}

                {/* ═══ STEP 3 OF 4 ═══ */}
                {/* ── Section 3: Aesthetics ── */}
                {currentStep === 3 && (
                <SidebarSection
                    id="aesthetics"
                    title="Aesthetics & Customization"
                    icon="✨"
                    isOpen={openSections.aesthetics}
                    onToggle={() => {}}
                >
                    <div>
                    <div className="flex items-start gap-2.5 bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 mb-3">
                        <span className="text-lg leading-none mt-0.5">🎨</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-violet-300 mb-0.5">Make it yours</p>
                            <p className="text-[11px] text-violet-200/70 leading-relaxed">Choose a <strong className="text-violet-300">colour theme</strong>, font, and optionally add your logo. Changes appear live in the preview instantly.</p>
                        </div>
                    </div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Calendar Title</label>
                        <input
                            type="text"
                            value={customTitle}
                            onChange={(e) => { setCustomTitle(e.target.value); setHasCustomTitle(true); }}
                            placeholder="Enter custom calendar heading..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-medium text-slate-400">Theme Accent</label>
                                {hasCustomColor && (
                                    <button
                                        onClick={() => setHasCustomColor(false)}
                                        className="text-[10px] text-primary-400 hover:text-primary-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                        title="Reset to template default color"
                                    >
                                        <span>↺</span> Reset
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={themeColor}
                                    onChange={(e) => { setThemeColor(e.target.value); setHasCustomColor(true); }}
                                    className="w-10 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                />
                                <span className="text-xs text-slate-400 uppercase font-mono">{themeColor}</span>
                            </div>
                            <div className="flex gap-1.5 mt-2 flex-wrap" role="group" aria-label="Colour presets">
                                {['#0284c7','#7c3aed','#dc2626','#16a34a','#ea580c','#0f172a','#db2777','#0d9488'].map(hex => (
                                    <button
                                        key={hex}
                                        type="button"
                                        onClick={() => { setThemeColor(hex); setHasCustomColor(true); }}
                                        title={hex}
                                        aria-label={`Set accent colour to ${hex}`}
                                        className={`w-5 h-5 rounded-full border-2 transition-all duration-150 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                                            themeColor.toLowerCase() === hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                                        }`}
                                        style={{ backgroundColor: hex }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Typography</label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="sans">Inter (Sans-Serif)</option>
                                <option value="serif">Merriweather (Serif)</option>
                                <option value="playful">Outfit (Playful)</option>
                                <option value="monospace">Courier (Retro Monospace)</option>
                            </select>
                            <div
                                className="mt-1.5 px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700/50 text-slate-300 flex items-baseline gap-2"
                                style={{
                                    fontFamily: fontFamily === 'serif' ? 'Georgia, serif'
                                        : fontFamily === 'playful' ? 'Outfit, sans-serif'
                                        : fontFamily === 'monospace' ? 'Courier, monospace'
                                        : 'Inter, sans-serif'
                                }}
                            >
                                <span className="text-base font-bold">Aa</span>
                                <span className="text-[10px] opacity-70">The quick brown fox</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand Logo (PNG / JPG)</label>
                        <div className="flex items-center gap-3">
                            {logoImage && (
                                <div className="relative flex-shrink-0">
                                    <img src={logoImage} alt="logo" className="w-10 h-10 object-contain rounded bg-white p-1" />
                                    <button
                                        onClick={() => setLogoImage(null)}
                                        title="Remove logo"
                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 text-white text-[9px] font-bold flex items-center justify-center leading-none"
                                    >
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
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

                    <div className="space-y-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showWeekends}
                                onChange={(e) => setShowWeekends(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-500 focus:ring-0"
                            />
                            <span className="text-xs text-slate-300 font-medium">Highlight Weekends</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showDescriptions}
                                onChange={(e) => setShowDescriptions(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-500 focus:ring-0"
                            />
                            <span className="text-xs text-slate-300 font-medium">Show Descriptions at Bottom</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Add Footer Notes</label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => { setNotes(e.target.value); setHasCustomNotes(true); }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </SidebarSection>

                )}

                {/* ═══ STEP 4 OF 4 ═══ */}
                {/* ── Section 4: Personal Events ── */}
                {currentStep === 4 && (
                <SidebarSection
                    id="events"
                    title="Personal Events"
                    icon="📅"
                    badge={personalEvents.length > 0 ? `${personalEvents.length} Active` : null}
                    isOpen={openSections.events}
                    onToggle={() => {}}
                >
                    <div className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-3">
                        <span className="text-lg leading-none mt-0.5">📅</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-emerald-300 mb-0.5">Add your personal dates</p>
                            <p className="text-[11px] text-emerald-200/70 leading-relaxed">Add <strong className="text-emerald-300">birthdays, anniversaries</strong>, or any special dates. They'll appear highlighted on your calendar. Hit <strong className="text-emerald-300">Finish</strong> when ready!</p>
                        </div>
                    </div>
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
                            >
                                Add
                            </button>
                        </div>
                    </form>

                    {personalEvents.length > 0 && (
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                            {personalEvents.map((evt) => (
                                <div key={evt.id} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800 text-xs">
                                    {editingEventId === evt.id ? (
                                        <div className="flex-grow flex gap-1.5 items-center mr-2">
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="bg-slate-850 border border-slate-750 rounded px-1.5 py-0.5 text-xs text-white w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        if (editingName.trim()) {
                                                            handleEditPersonalEvent(evt.id, editingName.trim());
                                                        }
                                                        setEditingEventId(null);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingEventId(null);
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (editingName.trim()) {
                                                        handleEditPersonalEvent(evt.id, editingName.trim());
                                                    }
                                                    setEditingEventId(null);
                                                }}
                                                className="text-emerald-400 hover:text-emerald-300 font-bold px-1"
                                                title="Save"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingEventId(null)}
                                                className="text-slate-400 hover:text-slate-300 font-bold px-1"
                                                title="Cancel"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="truncate pr-2 flex-grow cursor-pointer group"
                                            onClick={() => {
                                                setEditingEventId(evt.id);
                                                setEditingName(evt.name);
                                            }}
                                            title="Click to edit name"
                                        >
                                            <span className="text-amber-400 font-bold block text-[10px]">{evt.date}</span>
                                            <span className="text-slate-300 block truncate group-hover:text-amber-300 transition-colors">
                                                {evt.name} <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 ml-1">✏️</span>
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleDeletePersonalEvent(evt.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </SidebarSection>
                )}

                {/* ── Wizard Footer ── */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/95 backdrop-blur-md sticky bottom-0 z-20 flex flex-col gap-3 shadow-xl">
                    {finished && (
                        <div className="flex items-start gap-2.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-3 shadow-lg animate-slide-up">
                            <span className="text-xl leading-none">🎉</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-emerald-300 mb-0.5">Your calendar is ready!</p>
                                <p className="text-[11px] text-emerald-200/80 leading-relaxed">Use the <strong className="text-emerald-300">export buttons</strong> at the top of the preview to download as PDF, PNG, or print.</p>
                            </div>
                            <button
                                onClick={() => setFinished(false)}
                                className="text-emerald-500/60 hover:text-emerald-300 transition-colors flex-shrink-0"
                                aria-label="Dismiss"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setCurrentStep(prev => Math.max(1, prev - 1)); setFinished(false); }}
                            disabled={currentStep === 1}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${currentStep === 1 ? 'opacity-0 pointer-events-none border-transparent' : 'border-slate-600 text-slate-300 hover:bg-slate-700 bg-slate-800'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <button
                            onClick={() => {
                                if (currentStep < 4) {
                                    setCurrentStep(prev => prev + 1);
                                    setFinished(false);
                                } else {
                                    setFinished(true);
                                    if (showToast) {
                                        showToast('🎉 Your calendar is ready! Use the export buttons at the top of the preview.');
                                    }
                                    setIsMobileOpen(false);
                                    setTimeout(() => {
                                        if (sidebarRef.current) {
                                            sidebarRef.current.scrollTo({ top: sidebarRef.current.scrollHeight, behavior: 'smooth' });
                                        }
                                    }, 50);
                                }
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-white ${currentStep === 4 && finished ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-primary-600 hover:bg-primary-500'}`}
                        >
                            {currentStep === 4 ? (
                                finished ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        Done!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        Finish
                                    </>
                                )
                            ) : (
                                <>
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}




