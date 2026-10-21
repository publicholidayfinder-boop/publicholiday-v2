import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCountry, useHolidays } from '../hooks/useHolidays';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { emojiMap } from '../utils/emojiMap';
import { getEffectiveHolidayType } from '../lib/calendarConstants';
import { countryToContinent } from '../lib/continents';
import { handleExportICS } from '../lib/exportUtils';
import MiniCalendarMatrix from '../components/calendar/MiniCalendarMatrix';
import { useWatchlist } from '../hooks/useWatchlist';
import FlagImage from '../components/FlagImage';
import HolidayHeatmap from '../components/HolidayHeatmap';

const renderParagraphWithLinks = (text) => {
    if (typeof text !== 'string') return text;
    // Matches markdown link [Link Text](url)
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        const [fullMatch, linkText, url] = match;
        const matchIndex = match.index;
        
        if (matchIndex > lastIndex) {
            parts.push(text.slice(lastIndex, matchIndex));
        }
        
        parts.push(
            <a 
                key={url + '-' + matchIndex} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold"
            >
                {linkText}
            </a>
        );
        
        lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
};

export default function CountryPage() {
    const { t, i18n } = useTranslation();
    const { countryCode: rawCountryCode, year: yearParam } = useParams();
    const countryCode = (rawCountryCode || '').toUpperCase().trim();
    const navigate = useNavigate();
    const year = yearParam || String(new Date().getFullYear());
    const { toggleCountry, isPinned, isFull } = useWatchlist();
    const pinned = isPinned(countryCode);

    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 9 }, (_, i) => currentYear - 5 + i);

    const handleYearChange = (newYear) => {
        navigate(`/country/${countryCode}/${newYear}`);
    };

    const [viewMode, setViewMode] = useState('table'); // 'table' | 'heatmap'
    const [copied, setCopied] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `Public Holidays in ${country?.name || 'this country'} ${year}`,
            text: `Check out the complete list of public holidays and observances in ${country?.name || 'this country'} for ${year}.`,
            url: window.location.href
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                // Native share sheet opened successfully
            } catch (err) {
                // User cancelled or it failed, fallback to copy if it wasn't a user cancellation
                if (err.name !== 'AbortError') {
                    fallbackCopy();
                }
            }
        } else {
            fallbackCopy();
        }
    };

    const fallbackCopy = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const { country, loading: countryLoading } = useCountry(countryCode, i18n.language);
    const { holidays, loading: holidaysLoading } = useHolidays(countryCode, year);

    const handleDownloadAllICS = () => {
        handleExportICS({
            holidays: holidays || [],
            personalEvents: [],
            year,
            selectedCountryCode: countryCode,
            showToast: () => {},
            exportScope: 'all'
        });
    };

    const nextHoliday = React.useMemo(() => {
        if (!holidays || holidays.length === 0) return null;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const upcoming = holidays
            .map(h => ({ ...h, d: new Date(h.date) }))
            .filter(h => !isNaN(h.d.getTime()) && h.d >= now)
            .sort((a, b) => a.d - b.d);
        
        if (upcoming.length === 0) return null;
        const target = upcoming[0];
        const diffMs = target.d.getTime() - now.getTime();
        const daysToGo = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        return {
            ...target,
            daysToGo,
            formattedDate: target.d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        };
    }, [holidays]);

    // Canonicalise: /country/GH → /country/GH/2026
    React.useEffect(() => {
        if (!yearParam) {
            navigate(`/country/${countryCode}/${year}`, { replace: true });
        }
    }, [countryCode, yearParam, year, navigate]);

    const [selectedMonth, setSelectedMonth] = React.useState('All');
    const [selectedReligion, setSelectedReligion] = React.useState('All');
    const [selectedType, setSelectedType] = React.useState('All');
    const [publicOnly, setPublicOnly] = React.useState(false);

    const { filteredHolidays, months, religions, types } = React.useMemo(() => {
        if (!holidays) return { filteredHolidays: [], months: [], religions: [], types: [] };

        const monthsSet = new Set();
        const religionsSet = new Set();
        const typesSet = new Set();

        holidays.forEach(h => {
            const date = new Date(h.date);
            if (!isNaN(date.getTime())) {
                monthsSet.add(date.getMonth());
            }
            if (h.religion) religionsSet.add(h.religion);
            if (h.type) typesSet.add(h.type);
        });

        const filtered = holidays.filter(h => {
            const date = new Date(h.date);
            const monthMatch = selectedMonth === 'All' || date.getMonth().toString() === selectedMonth;
            const religionMatch = selectedReligion === 'All' || h.religion === selectedReligion;
            const typeMatch = selectedType === 'All' || h.type === selectedType;
            return monthMatch && religionMatch && typeMatch;
        });

        return {
            filteredHolidays: filtered,
            months: Array.from(monthsSet).sort((a, b) => a - b),
            religions: Array.from(religionsSet).sort(),
            types: Array.from(typesSet).sort()
        };
    }, [holidays, selectedMonth, selectedReligion, selectedType]);

    // Derived: are any filters active?
    const activeFilterCount = (selectedMonth !== 'All' ? 1 : 0)
        + (selectedReligion !== 'All' ? 1 : 0)
        + (selectedType !== 'All' ? 1 : 0);
    const isFiltered = activeFilterCount > 0;

    const handleResetFilters = () => {
        setSelectedMonth('All');
        setSelectedReligion('All');
        setSelectedType('All');
    };

    // Derived list that respects the Public Only toggle
    const displayedHolidays = React.useMemo(() => {
        if (!holidays) return [];
        if (publicOnly) return holidays.filter(h => h.isPublicHoliday === true || h.type === 'public');
        return holidays;
    }, [holidays, publicOnly]);

    const stats = React.useMemo(() => {
        if (!holidays) return { total: 0, christian: 0, islamic: 0, national: 0, observance: 0 };
        const total = holidays.length;
        const christian  = holidays.filter(h => getEffectiveHolidayType(h) === 'Christian').length;
        const islamic    = holidays.filter(h => getEffectiveHolidayType(h) === 'Islamic').length;
        const national   = holidays.filter(h => getEffectiveHolidayType(h) === 'National').length;
        const observance = holidays.filter(h => getEffectiveHolidayType(h) === 'Observance').length;
        return { total, christian, islamic, national, observance };
    }, [holidays]);

    const schemas = React.useMemo(() => {
        if (!country) return null;

        const baseSchemaList = [];

        // 1. BreadcrumbList Schema
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": t('nav.findHolidays') || "Home",
                    "item": "https://publicholidayfinder.com"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": country.name,
                    "item": `https://publicholidayfinder.com/country/${countryCode}`
                }
            ]
        };
        baseSchemaList.push(breadcrumbSchema);

        // 2. ItemList with detailed Event schemas for each holiday
        if (holidays && holidays.length > 0) {
            const listItems = holidays.map((h, index) => {
                const holidayDesc = h.description || `${h.name} is a ${h.type || 'public'} holiday in ${country.name} on ${new Date(h.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`;
                
                return {
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Event",
                        "name": h.name,
                        "description": holidayDesc,
                        "startDate": h.date,
                        "endDate": h.date,
                        "eventStatus": "https://schema.org/EventScheduled",
                        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                        "location": {
                            "@type": "Place",
                            "name": country.name,
                            "address": {
                                "@type": "PostalAddress",
                                "addressCountry": countryCode
                            }
                        }
                    }
                };
            });

            const itemListSchema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `${country.name} Public Holidays ${year}`,
                "description": `Comprehensive list of official public holidays in ${country.name} for the year ${year}.`,
                "numberOfItems": holidays.length,
                "itemListElement": listItems
            };
            baseSchemaList.push(itemListSchema);
        }

        // 3. FAQPage Schema (from country FAQ sections if present)
        if (country.sections && country.sections.length > 0) {
            const faqItems = [];
            country.sections.forEach(section => {
                if (section.items && section.items.length > 0) {
                    section.items.forEach(item => {
                        if (item.q && item.a) {
                            faqItems.push({
                                "@type": "Question",
                                "name": item.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": item.a
                                }
                            });
                        }
                    });
                }
            });

            if (faqItems.length > 0) {
                const faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqItems
                };
                baseSchemaList.push(faqSchema);
            }
        }

        return baseSchemaList;
    }, [country, holidays, countryCode, year, t]);

    if (countryLoading && !country) {
        return (
            <>
                
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-600">{t('loading.text')}</p>
                </div>
            </>
        );
    }

    if (!country) {
        return (
            <>
                <SEO title="Country Not Found" description="The requested country could not be found. Discover official holiday calendars for countries worldwide." />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Country Not Found</h1>
                    <p className="text-slate-600">The requested country could not be found.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO
                title={`${country.name} Public Holidays ${year} — ${stats.total} Official Holidays`}
                description={`${country.name} has ${stats.total} public holidays in ${year}, including ${stats.christian} Christian, ${stats.islamic} Islamic and ${stats.national} national holidays. View dates, names, and descriptions for all official holidays.`}
                keywords={`${country.name} public holidays ${year}, ${country.name} national holidays, official holidays ${country.name} ${year}, ${countryCode} holidays`}
                canonical={`https://publicholidayfinder.com/country/${countryCode}/${year}`}
                ogImage={`https://publicholidayfinder.com/og/countries/${countryCode}.svg`}
                schema={schemas}
                currentLang={i18n.language}
            />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Print-only header */}
                <div className="hidden print:block mb-6 pb-4 border-b-2 border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Public Holidays in {country?.name} — {year}
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">Complete official list of public holidays and observances</p>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-slate-800 text-sm">PublicHolidayFinder.com</div>
                            <div className="text-xs text-slate-500">Printed {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="mb-4 print:hidden">
                    <nav className="text-xs font-medium text-slate-500 flex items-center gap-2">
                        <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/" className="hover:text-emerald-700 transition-colors">Countries</Link>
                        <span>/</span>
                        <span className="text-slate-800 font-semibold">{country.name}</span>
                    </nav>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-1 gap-6 mb-8 items-start">
                    
                    {/* LEFT COLUMN (Main Content) */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        
                        {/* Country Header Card */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 print:hidden">
                            <FlagImage countryCode={countryCode} size="2xl" className="rounded-md" />
                            <div>
                                <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-tight">
                                    Public Holidays in {country.name} {year}
                                </h1>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Complete list of public holidays and observances in {country.name} for the year {year}.
                                </p>
                            </div>
                        </div>

                        {/* Structured Table */}
                        <div id="holiday-table-section" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            {/* Filter Toggle Bar */}
                            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/60 print:hidden">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        {displayedHolidays.length} {publicOnly ? "Public" : "Total"} Holiday{displayedHolidays.length !== 1 ? "s" : ""}
                                    </span>
                                    {parseInt(year) === new Date().getFullYear() && (
                                        selectedMonth === new Date().getMonth().toString() ? (
                                            <button
                                                onClick={() => setSelectedMonth('All')}
                                                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200 transition-all"
                                                title="Clear month filter"
                                            >
                                                {new Date().toLocaleString('en-US', { month: 'short' })}
                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setSelectedMonth(new Date().getMonth().toString());
                                                    setViewMode('table');
                                                    document.getElementById('holiday-table-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }}
                                                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100 transition-all"
                                                title="Jump to this month's holidays"
                                            >
                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                This month
                                            </button>
                                        )
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* View toggle */}
                                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                                        <button
                                            onClick={() => setViewMode("table")}
                                            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${viewMode === "table" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                            title="Table view"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 4v16M3 6a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6z" /></svg>
                                            List
                                        </button>
                                        <button
                                            onClick={() => setViewMode("heatmap")}
                                            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${viewMode === "heatmap" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                            title="Calendar heatmap view"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Calendar
                                        </button>
                                    </div>
                                    {/* Public Only toggle */}
                                    <button
                                        onClick={() => setPublicOnly(prev => !prev)}
                                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                                            publicOnly
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400 hover:text-emerald-700"
                                        }`}
                                        title={publicOnly ? "Show all holidays" : "Show public holidays only"}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                                        </svg>
                                        {publicOnly ? "✓ Public Only" : "Public Only"}
                                    </button>
                                </div>
                            </div>
                            {/* Conditional view */}
                            {viewMode === "heatmap" ? (
                                <div className="p-4">
                                    <HolidayHeatmap holidays={publicOnly ? displayedHolidays : holidays} year={year} />
                                </div>
                            ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Holiday</th>
                                            <th className="py-3 px-4 hidden md:table-cell print:table-cell">Day</th>
                                            <th className="py-3 px-4 text-right">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {holidaysLoading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-10 text-slate-500">
                                                    <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-2" />
                                                    Loading holiday calendar...
                                                </td>
                                            </tr>
                                        ) : displayedHolidays.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-10 text-slate-500">
                                                    No public holidays found for {year}.
                                                </td>
                                            </tr>
                                        ) : (
                                            (mobileExpanded ? displayedHolidays : displayedHolidays.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 && !window.matchMedia('print').matches ? 5 : displayedHolidays.length)).map((holiday, idx) => {
                                                const d = new Date(holiday.date);
                                                const dayFormatted = !isNaN(d.getTime())
                                                    ? d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
                                                    : holiday.date;
                                                const weekdayFormatted = !isNaN(d.getTime())
                                                    ? d.toLocaleDateString('en-US', { weekday: 'long' })
                                                    : '-';
                                                const effectiveType = getEffectiveHolidayType(holiday);
                                                
                                                return (
                                                    <tr key={holiday.id || idx} className="hover:bg-slate-50/60 transition-colors">
                                                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap text-xs sm:text-sm">
                                                            {dayFormatted}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-bold text-slate-900 text-xs sm:text-sm">{holiday.name}</div>
                                                            {showDetails && holiday.description && (
                                                                <div className="text-xs text-slate-500 mt-1 leading-relaxed">{holiday.description}</div>
                                                            )}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell print:table-cell">
                                                            {weekdayFormatted}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                            {holiday.isPublicHoliday || effectiveType === 'National' ? (
                                                                <span className="badge-public">Public Holiday</span>
                                                            ) : effectiveType === 'Christian' || effectiveType === 'Islamic' || effectiveType === 'Religious' ? (
                                                                <span className="badge-religious">Religious Holiday</span>
                                                            ) : (
                                                                <span className="badge-observance">{effectiveType || 'Observance'}</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            )}

                            {/* Accordion / Toggle Footer */}
                            <div className="p-3 bg-white border-t border-slate-100 text-xs print:hidden">
                                <div className="hidden md:block w-full text-left pl-4">
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                                    >
                                        {showDetails ? 'Hide holiday details and notes ∧' : 'Show holiday details and notes ∨'}
                                    </button>
                                </div>
                                {displayedHolidays.length > 5 && (
                                    <div className="md:hidden w-full text-center">
                                        <button
                                            onClick={() => setMobileExpanded(!mobileExpanded)}
                                            className="font-bold text-emerald-700"
                                        >
                                            {mobileExpanded ? 'Collapse ∧' : `View all holidays (${holidays.length}) ∨`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Related Tools Banner */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 p-5 shadow-sm">
                            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>🔧</span> Related Tools for {country.name}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <Link
                                    to={`/working-days/${countryCode}`}
                                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-emerald-200/60 hover:border-emerald-400 hover:shadow-sm transition-all text-center group"
                                >
                                    <span className="text-2xl">⏱</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 leading-tight">Working Days</div>
                                        <div className="text-[10px] text-slate-500">Business day counter</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/time/${countryCode}`}
                                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-violet-200/60 hover:border-violet-400 hover:shadow-sm transition-all text-center group"
                                >
                                    <span className="text-2xl">🕐</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-violet-700 leading-tight">Current Time</div>
                                        <div className="text-[10px] text-slate-500">Live clock &amp; timezone</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/country/${countryCode}/${parseInt(year) - 1}`}
                                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-200/60 hover:border-slate-400 hover:shadow-sm transition-all text-center group"
                                >
                                    <span className="text-2xl">◀</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-slate-700 leading-tight">{parseInt(year) - 1} Holidays</div>
                                        <div className="text-[10px] text-slate-500">Previous year</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/country/${countryCode}/${parseInt(year) + 1}`}
                                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-blue-200/60 hover:border-blue-400 hover:shadow-sm transition-all text-center group"
                                >
                                    <span className="text-2xl">▶</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 leading-tight">{parseInt(year) + 1} Holidays</div>
                                        <div className="text-[10px] text-slate-500">Next year</div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* About Public Holidays Card (Desktop) */}
                        <div className="hidden md:flex print:hidden bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex-col justify-between">
                            <div>
                                <h3 className="font-display font-bold text-base text-slate-900 mb-3">
                                    About Public Holidays in {country.name}
                                </h3>
                                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                                    {country.description || `In ${country.name}, public holidays are observed on national days that commemorate important events in the country's history as well as religious celebrations that are significant to the population. Banks, government offices and most businesses are closed on official public holidays. Some holidays may be observed on the nearest weekday when they fall on a weekend.`}
                                </p>
                            </div>
                            {country.sections && country.sections.length > 0 && (
                                <a 
                                    href="#country-extended-info" 
                                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                                >
                                    Read more about {country.name} holidays →
                                </a>
                            )}
                        </div>

                        {/* Related Countries in Region (Desktop) */}
                        <div className="hidden md:block print:hidden">
                            <NeighboringCountries currentCountryCode={countryCode} year={year} />
                        </div>

                    </div>


                    {/* RIGHT COLUMN (Sidebar) */}
                    <div className="md:col-span-1 flex flex-col gap-6 print:hidden">
                        
                        {/* Actions Row */}
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                            <div className="relative">
                                <select
                                    value={year}
                                    onChange={(e) => handleYearChange(e.target.value)}
                                    className="appearance-none pl-3 pr-7 py-1.5 bg-white text-slate-800 font-bold rounded-lg text-xs border border-slate-200 hover:border-emerald-300 outline-none cursor-pointer transition-colors shadow-sm w-[100px]"
                                    aria-label="Select year"
                                >
                                    {yearRange.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </span>
                            </div>
                            <button
                                onClick={handleDownloadAllICS}
                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download ICS
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-1.5 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Print
                            </button>
                            <button
                                onClick={handleShare}
                                className={`flex items-center gap-1.5 bg-white border text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all ${
                                    copied ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                                }`}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                {copied ? 'Copied!' : 'Share'}
                            </button>
                            <Link
                                to={`/country/${countryCode}/${year}/planner`}
                                className="flex items-center gap-1.5 bg-white border border-violet-400 text-violet-700 hover:bg-violet-50 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                                title="Open printable year planner"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Year Planner
                            </Link>
                            <Link
                                to={`/calendar-generator?country=${countryCode}&year=${year}`}
                                className="flex items-center gap-1.5 bg-white border border-rose-400 text-rose-700 hover:bg-rose-50 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                                title="Open in Calendar Studio"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                Studio
                            </Link>
                            <button
                                onClick={() => {
                                    if (!pinned && isFull) {
                                        alert("Watchlist is full! You can only pin up to 5 countries.");
                                        return;
                                    }
                                    toggleCountry(countryCode);
                                }}
                                className={`flex items-center gap-1.5 bg-white border text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all ${
                                    pinned ? "border-amber-400 text-amber-700 bg-amber-50" : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                                title={pinned ? "Remove from Watchlist" : "Add to Watchlist"}
                            >
                                <svg className={`w-3 h-3 ${pinned ? "fill-amber-400 text-amber-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                {pinned ? "Saved" : "Save"}
                            </button>
                        </div>

                        {/* Mini Calendar Matrix */}
                            <Link
                                to={`/today/${countryCode}`}
                                className="flex items-center gap-1.5 bg-white border border-sky-400 text-sky-700 hover:bg-sky-50 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                                title="Is it a public holiday today?"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Holiday today?
                            </Link>
                        <MiniCalendarMatrix holidays={holidays} year={year} countryCode={countryCode} />

                        {/* Days until next holiday */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="font-display font-bold text-base text-slate-900 mb-4">
                                    Days until next holiday
                                </h3>
                                {nextHoliday ? (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-lg text-lg flex-shrink-0">
                                            📅
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{nextHoliday.name}</div>
                                            <div className="text-[11px] text-slate-500 mb-3">{nextHoliday.formattedDate}</div>
                                            <div className="flex items-baseline gap-1">
                                                <div className="text-4xl font-extrabold text-emerald-600 tracking-tight leading-none">{nextHoliday.daysToGo}</div>
                                                <div className="text-[11px] font-semibold text-slate-500">days to go</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500 py-4">
                                        No upcoming holidays remaining in {year}.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Holiday tools (Desktop) */}
                        <div className="hidden md:flex bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex-col justify-between">
                            <div>
                                <h3 className="font-display font-bold text-base text-slate-900 mb-3">
                                    Holiday tools
                                </h3>
                                <div className="space-y-2 mt-3">
                                    <Link
                                        to={`/calendar-generator?country=${countryCode}&year=${year}`}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm flex-shrink-0">📄</div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Printable Calendar</div>
                                            <div className="text-[10px] text-slate-500">Download printable PDF calendar</div>
                                        </div>
                                    </Link>

                                    <Link
                                        to={`/working-days/${countryCode}`}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">⏱</div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Working Days Calculator</div>
                                            <div className="text-[10px] text-slate-500">Count business days in {country.name}</div>
                                        </div>
                                    </Link>

                                    <Link
                                        to={`/time/${countryCode}`}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-sm flex-shrink-0">🕐</div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 group-hover:text-violet-700">Current Time in {country.name}</div>
                                            <div className="text-[10px] text-slate-500">Live clock &amp; timezone info</div>
                                        </div>
                                    </Link>

                                    {nextHoliday && (
                                        <a
                                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(nextHoliday.name)}&details=${encodeURIComponent(nextHoliday.description || nextHoliday.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">📅</div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Add to Google Calendar</div>
                                                <div className="text-[10px] text-slate-500">Add all holidays to your calendar</div>
                                            </div>
                                        </a>
                                    )}

                                    <button
                                        onClick={handleDownloadAllICS}
                                        className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">⏱️</div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Holiday Countdown</div>
                                            <div className="text-[10px] text-slate-500">See countdown to all holidays</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Related Countries List */}
                        <div className="md:hidden">
                            <h3 className="font-display font-bold text-base text-slate-900 mb-4">
                                Related Countries
                            </h3>
                            <MobileNeighboringCountries currentCountryCode={countryCode} year={year} />
                            <Link to="/" className="w-full py-2.5 px-4 text-center rounded-xl border border-slate-200 text-emerald-700 hover:bg-slate-50 font-semibold text-xs transition-all block mt-4">
                                View more countries
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Extended Country Information (SEO Rich) */}
                {country.sections && country.sections.length > 0 && (
                    <div id="country-extended-info" className="mb-12">
                        {country.sections.map((section, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6">
                                <h2 className="text-xl font-display font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                                    {section.title}
                                </h2>
                                <div className="prose prose-sm text-slate-700 max-w-none">
                                    {section.content && section.content.split('\n').map((paragraph, pIndex) => (
                                        <p key={pIndex} className="mb-3 leading-relaxed text-xs sm:text-sm">
                                            {renderParagraphWithLinks(paragraph)}
                                        </p>
                                    ))}
                                    {section.items && (
                                        <ul className="space-y-3 mt-4 list-none pl-0">
                                            {section.items.map((item, iIndex) => (
                                                <FAQItem key={iIndex} question={item.q} answer={item.a} />
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function NeighboringCountries({ currentCountryCode, year }) {
    const { t } = useTranslation();
    const neighbors = {
        'US': [{ id: 'CA', name: 'Canada', flag: '🇨🇦' }],
        'CA': [{ id: 'US', name: 'United States', flag: '🇺🇸' }],
        'GB': [{ id: 'FR', name: 'France', flag: '🇫🇷' }, { id: 'DE', name: 'Germany', flag: '🇩🇪' }],
        'FR': [{ id: 'DE', name: 'Germany', flag: '🇩🇪' }, { id: 'GB', name: 'United Kingdom', flag: '🇬🇧' }],
        'DE': [{ id: 'FR', name: 'France', flag: '🇫🇷' }, { id: 'GB', name: 'United Kingdom', flag: '🇬🇧' }],
        'NG': [{ id: 'GH', name: 'Ghana', flag: '🇬🇭' }, { id: 'ZA', name: 'South Africa', flag: '🇿🇦' }],
        'GH': [{ id: 'NG', name: 'Nigeria', flag: '🇳🇬' }, { id: 'ZA', name: 'South Africa', flag: '🇿🇦' }],
        'ZA': [{ id: 'NG', name: 'Nigeria', flag: '🇳🇬' }, { id: 'GH', name: 'Ghana', flag: '🇬🇭' }, { id: 'NA', name: 'Namibia', flag: '🇳🇦' }, { id: 'BW', name: 'Botswana', flag: '🇧🇼' }, { id: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }],
        'AU': [{ id: 'JP', name: 'Japan', flag: '🇯🇵' }, { id: 'IN', name: 'India', flag: '🇮🇳' }],
        'JP': [{ id: 'AU', name: 'Australia', flag: '🇦🇺' }, { id: 'IN', name: 'India', flag: '🇮🇳' }, { id: 'CN', name: 'China', flag: '🇨🇳' }],
        'IN': [{ id: 'JP', name: 'Japan', flag: '🇯🇵' }, { id: 'AU', name: 'Australia', flag: '🇦🇺' }, { id: 'CN', name: 'China', flag: '🇨🇳' }],
        'CN': [{ id: 'JP', name: 'Japan', flag: '🇯🇵' }, { id: 'KR', name: 'South Korea', flag: '🇰🇷' }],
        'KR': [{ id: 'JP', name: 'Japan', flag: '🇯🇵' }, { id: 'CN', name: 'China', flag: '🇨🇳' }],
        'MY': [{ id: 'SG', name: 'Singapore', flag: '🇸🇬' }, { id: 'TH', name: 'Thailand', flag: '🇹🇭' }, { id: 'ID', name: 'Indonesia', flag: '🇮🇩' }],
        'SG': [{ id: 'MY', name: 'Malaysia', flag: '🇲🇾' }, { id: 'ID', name: 'Indonesia', flag: '🇮🇩' }],
        'TH': [{ id: 'MY', name: 'Malaysia', flag: '🇲🇾' }, { id: 'VN', name: 'Vietnam', flag: '🇻🇳' }],
        'ID': [{ id: 'MY', name: 'Malaysia', flag: '🇲🇾' }, { id: 'SG', name: 'Singapore', flag: '🇸🇬' }],
        'VN': [{ id: 'TH', name: 'Thailand', flag: '🇹🇭' }, { id: 'CN', name: 'China', flag: '🇨🇳' }],
        'PH': [{ id: 'ID', name: 'Indonesia', flag: '🇮🇩' }, { id: 'MY', name: 'Malaysia', flag: '🇲🇾' }],
        'PK': [{ id: 'IN', name: 'India', flag: '🇮🇳' }, { id: 'AF', name: 'Afghanistan', flag: '🇦🇫' }],
        'BD': [{ id: 'IN', name: 'India', flag: '🇮🇳' }, { id: 'MM', name: 'Myanmar', flag: '🇲🇲' }],
        'LK': [{ id: 'IN', name: 'India', flag: '🇮🇳' }],
        'NP': [{ id: 'IN', name: 'India', flag: '🇮🇳' }, { id: 'CN', name: 'China', flag: '🇨🇳' }],
        'MM': [{ id: 'TH', name: 'Thailand', flag: '🇹🇭' }, { id: 'CN', name: 'China', flag: '🇨🇳' }],
        'KH': [{ id: 'TH', name: 'Thailand', flag: '🇹🇭' }, { id: 'VN', name: 'Vietnam', flag: '🇻🇳' }],
        'MN': [{ id: 'CN', name: 'China', flag: '🇨🇳' }, { id: 'RU', name: 'Russia', flag: '🇷🇺' }],
        'KZ': [{ id: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' }, { id: 'CN', name: 'China', flag: '🇨🇳' }],
        'UZ': [{ id: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' }, { id: 'TJ', name: 'Tajikistan', flag: '🇹🇯' }],
        'AZ': [{ id: 'GE', name: 'Georgia', flag: '🇬🇪' }, { id: 'AM', name: 'Armenia', flag: '🇦🇲' }],
        'GE': [{ id: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' }, { id: 'AM', name: 'Armenia', flag: '🇦🇲' }],
        'AM': [{ id: 'GE', name: 'Georgia', flag: '🇬🇪' }, { id: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' }],
        'HK': [{ id: 'CN', name: 'China', flag: '🇨🇳' }, { id: 'TW', name: 'Taiwan', flag: '🇹🇼' }],
        'TW': [{ id: 'CN', name: 'China', flag: '🇨🇳' }, { id: 'HK', name: 'Hong Kong', flag: '🇭🇰' }],
        'NA': [{ id: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { id: 'BW', name: 'Botswana', flag: '🇧🇼' }, { id: 'AO', name: 'Angola', flag: '🇦🇴' }],
        'BW': [{ id: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { id: 'NA', name: 'Namibia', flag: '🇳🇦' }, { id: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }],
        'ZW': [{ id: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { id: 'BW', name: 'Botswana', flag: '🇧🇼' }, { id: 'MZ', name: 'Mozambique', flag: '🇲🇿' }, { id: 'ZM', name: 'Zambia', flag: '🇿🇲' }],
        'MZ': [{ id: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { id: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }, { id: 'MW', name: 'Malawi', flag: '🇲🇼' }, { id: 'SZ', name: 'Eswatini', flag: '🇸🇿' }],
        'LS': [{ id: 'ZA', name: 'South Africa', flag: '🇿🇦' }],
        'SZ': [{ id: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { id: 'MZ', name: 'Mozambique', flag: '🇲🇿' }],
        'AO': [{ id: 'NA', name: 'Namibia', flag: '🇳🇦' }, { id: 'ZM', name: 'Zambia', flag: '🇿🇲' }],
        'ZM': [{ id: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }, { id: 'AO', name: 'Angola', flag: '🇦🇴' }, { id: 'MW', name: 'Malawi', flag: '🇲🇼' }],
        'MW': [{ id: 'MZ', name: 'Mozambique', flag: '🇲🇿' }, { id: 'ZM', name: 'Zambia', flag: '🇿🇲' }],
        'MG': [{ id: 'MZ', name: 'Mozambique', flag: '🇲🇿' }],
        'BR': [{ id: 'AR', name: 'Argentina', flag: '🇦🇷' }, { id: 'CO', name: 'Colombia', flag: '🇨🇴' }, { id: 'PE', name: 'Peru', flag: '🇵🇪' }, { id: 'VE', name: 'Venezuela', flag: '🇻🇪' }, { id: 'BO', name: 'Bolivia', flag: '🇧🇴' }, { id: 'PY', name: 'Paraguay', flag: '🇵🇾' }, { id: 'UY', name: 'Uruguay', flag: '🇺🇾' }, { id: 'GY', name: 'Guyana', flag: '🇬🇾' }, { id: 'SR', name: 'Suriname', flag: '🇸🇷' }],
        'AR': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'CL', name: 'Chile', flag: '🇨🇱' }, { id: 'BO', name: 'Bolivia', flag: '🇧🇴' }, { id: 'PY', name: 'Paraguay', flag: '🇵🇾' }, { id: 'UY', name: 'Uruguay', flag: '🇺🇾' }],
        'CO': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'PE', name: 'Peru', flag: '🇵🇪' }, { id: 'VE', name: 'Venezuela', flag: '🇻🇪' }, { id: 'EC', name: 'Ecuador', flag: '🇪🇨' }],
        'PE': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'CO', name: 'Colombia', flag: '🇨🇴' }, { id: 'CL', name: 'Chile', flag: '🇨🇱' }, { id: 'EC', name: 'Ecuador', flag: '🇪🇨' }, { id: 'BO', name: 'Bolivia', flag: '🇧🇴' }],
        'CL': [{ id: 'AR', name: 'Argentina', flag: '🇦🇷' }, { id: 'PE', name: 'Peru', flag: '🇵🇪' }, { id: 'BO', name: 'Bolivia', flag: '🇧🇴' }],
        'VE': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'CO', name: 'Colombia', flag: '🇨🇴' }, { id: 'GY', name: 'Guyana', flag: '🇬🇾' }],
        'EC': [{ id: 'CO', name: 'Colombia', flag: '🇨🇴' }, { id: 'PE', name: 'Peru', flag: '🇵🇪' }],
        'BO': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'AR', name: 'Argentina', flag: '🇦🇷' }, { id: 'PE', name: 'Peru', flag: '🇵🇪' }, { id: 'CL', name: 'Chile', flag: '🇨🇱' }, { id: 'PY', name: 'Paraguay', flag: '🇵🇾' }],
        'PY': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'AR', name: 'Argentina', flag: '🇦🇷' }, { id: 'BO', name: 'Bolivia', flag: '🇧🇴' }],
        'UY': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'AR', name: 'Argentina', flag: '🇦🇷' }],
        'GY': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'VE', name: 'Venezuela', flag: '🇻🇪' }, { id: 'SR', name: 'Suriname', flag: '🇸🇷' }],
        'SR': [{ id: 'BR', name: 'Brazil', flag: '🇧🇷' }, { id: 'GY', name: 'Guyana', flag: '🇬🇾' }],
        'MX': [{ id: 'US', name: 'United States', flag: '🇺🇸' }, { id: 'GT', name: 'Guatemala', flag: '🇬🇹' }, { id: 'BZ', name: 'Belize', flag: '🇧🇿' }],
        'GT': [{ id: 'MX', name: 'Mexico', flag: '🇲🇽' }, { id: 'BZ', name: 'Belize', flag: '🇧🇿' }, { id: 'HN', name: 'Honduras', flag: '🇭🇳' }, { id: 'SV', name: 'El Salvador', flag: '🇸🇻' }],
        'BZ': [{ id: 'MX', name: 'Mexico', flag: '🇲🇽' }, { id: 'GT', name: 'Guatemala', flag: '🇬🇹' }],
        'HN': [{ id: 'GT', name: 'Guatemala', flag: '🇬🇹' }, { id: 'SV', name: 'El Salvador', flag: '🇸🇻' }, { id: 'NI', name: 'Nicaragua', flag: '🇳🇮' }],
        'SV': [{ id: 'GT', name: 'Guatemala', flag: '🇬🇹' }, { id: 'HN', name: 'Honduras', flag: '🇭🇳' }],
        'NI': [{ id: 'HN', name: 'Honduras', flag: '🇭🇳' }, { id: 'CR', name: 'Costa Rica', flag: '🇨🇷' }],
        'CR': [{ id: 'NI', name: 'Nicaragua', flag: '🇳🇮' }, { id: 'PA', name: 'Panama', flag: '🇵🇦' }],
        'PA': [{ id: 'CR', name: 'Costa Rica', flag: '🇨🇷' }, { id: 'CO', name: 'Colombia', flag: '🇨🇴' }],
        'CU': [{ id: 'US', name: 'United States', flag: '🇺🇸' }, { id: 'BS', name: 'Bahamas', flag: '🇧🇸' }, { id: 'HT', name: 'Haiti', flag: '🇭🇹' }, { id: 'JM', name: 'Jamaica', flag: '🇯🇲' }],
        'JM': [{ id: 'CU', name: 'Cuba', flag: '🇨🇺' }, { id: 'HT', name: 'Haiti', flag: '🇭🇹' }],
        'HT': [{ id: 'DO', name: 'Dominican Republic', flag: '🇩🇴' }, { id: 'CU', name: 'Cuba', flag: '🇨🇺' }, { id: 'JM', name: 'Jamaica', flag: '🇯🇲' }],
        'DO': [{ id: 'HT', name: 'Haiti', flag: '🇭🇹' }, { id: 'CU', name: 'Cuba', flag: '🇨🇺' }],
        'TT': [{ id: 'GD', name: 'Grenada', flag: '🇬🇩' }, { id: 'VE', name: 'Venezuela', flag: '🇻🇪' }, { id: 'BB', name: 'Barbados', flag: '🇧🇧' }],
        'BB': [{ id: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' }, { id: 'LC', name: 'Saint Lucia', flag: '🇱🇨' }, { id: 'GD', name: 'Grenada', flag: '🇬🇩' }],
        'LC': [{ id: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' }, { id: 'BB', name: 'Barbados', flag: '🇧🇧' }, { id: 'DM', name: 'Dominica', flag: '🇩🇲' }],
        'VC': [{ id: 'LC', name: 'Saint Lucia', flag: '🇱🇨' }, { id: 'GD', name: 'Grenada', flag: '🇬🇩' }, { id: 'BB', name: 'Barbados', flag: '🇧🇧' }],
        'GD': [{ id: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' }, { id: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' }],
        'AG': [{ id: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' }],
        'DM': [{ id: 'LC', name: 'Saint Lucia', flag: '🇱🇨' }, { id: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' }],
        'KN': [{ id: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' }],
        'BS': [{ id: 'US', name: 'United States', flag: '🇺🇸' }, { id: 'CU', name: 'Cuba', flag: '🇨🇺' }],
        'KE': [{ id: 'TZ', name: 'Tanzania', flag: '🇹🇿' }, { id: 'UG', name: 'Uganda', flag: '🇺🇬' }, { id: 'SS', name: 'South Sudan', flag: '🇸🇸' }, { id: 'ET', name: 'Ethiopia', flag: '🇪🇹' }, { id: 'SO', name: 'Somalia', flag: '🇸🇴' }],
        'TZ': [{ id: 'KE', name: 'Kenya', flag: '🇰🇪' }, { id: 'UG', name: 'Uganda', flag: '🇺🇬' }, { id: 'RW', name: 'Rwanda', flag: '🇷🇼' }, { id: 'BI', name: 'Burundi', flag: '🇧🇮' }, { id: 'MZ', name: 'Mozambique', flag: '🇲🇿' }, { id: 'MW', name: 'Malawi', flag: '🇲🇼' }, { id: 'ZM', name: 'Zambia', flag: '🇿🇲' }],
        'UG': [{ id: 'KE', name: 'Kenya', flag: '🇰🇪' }, { id: 'SS', name: 'South Sudan', flag: '🇸🇸' }, { id: 'RW', name: 'Rwanda', flag: '🇷🇼' }, { id: 'TZ', name: 'Tanzania', flag: '🇹🇿' }],
        'RW': [{ id: 'UG', name: 'Uganda', flag: '🇺🇬' }, { id: 'TZ', name: 'Tanzania', flag: '🇹🇿' }, { id: 'BI', name: 'Burundi', flag: '🇧🇮' }],
        'BI': [{ id: 'RW', name: 'Rwanda', flag: '🇷🇼' }, { id: 'TZ', name: 'Tanzania', flag: '🇹🇿' }],
        'ET': [{ id: 'ER', name: 'Eritrea', flag: '🇪🇷' }, { id: 'DJ', name: 'Djibouti', flag: '🇩🇯' }, { id: 'SO', name: 'Somalia', flag: '🇸🇴' }, { id: 'KE', name: 'Kenya', flag: '🇰🇪' }, { id: 'SS', name: 'South Sudan', flag: '🇸🇸' }],
        'SO': [{ id: 'DJ', name: 'Djibouti', flag: '🇩🇯' }, { id: 'ET', name: 'Ethiopia', flag: '🇪🇹' }, { id: 'KE', name: 'Kenya', flag: '🇰🇪' }],
        'DJ': [{ id: 'ER', name: 'Eritrea', flag: '🇪🇷' }, { id: 'ET', name: 'Ethiopia', flag: '🇪🇹' }, { id: 'SO', name: 'Somalia', flag: '🇸🇴' }],
        'ER': [{ id: 'DJ', name: 'Djibouti', flag: '🇩🇯' }, { id: 'ET', name: 'Ethiopia', flag: '🇪🇹' }],
        'SS': [{ id: 'ET', name: 'Ethiopia', flag: '🇪🇹' }, { id: 'KE', name: 'Kenya', flag: '🇰🇪' }, { id: 'UG', name: 'Uganda', flag: '🇺🇬' }],
        'CM': [{ id: 'NG', name: 'Nigeria', flag: '🇳🇬' }, { id: 'TD', name: 'Chad', flag: '🇹🇩' }, { id: 'CF', name: 'Central African Republic', flag: '🇨🇫' }, { id: 'CG', name: 'Republic of the Congo', flag: '🇨🇬' }, { id: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' }, { id: 'GA', name: 'Gabon', flag: '🇬🇦' }],
        'CF': [{ id: 'CM', name: 'Cameroon', flag: '🇨🇲' }, { id: 'TD', name: 'Chad', flag: '🇹🇩' }, { id: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩' }, { id: 'CG', name: 'Republic of the Congo', flag: '🇨🇬' }, { id: 'SS', name: 'South Sudan', flag: '🇸🇸' }],
        'TD': [{ id: 'CM', name: 'Cameroon', flag: '🇨🇲' }, { id: 'CF', name: 'Central African Republic', flag: '🇨🇫' }, { id: 'NE', name: 'Niger', flag: '🇳🇪' }],
        'CG': [{ id: 'CM', name: 'Cameroon', flag: '🇨🇲' }, { id: 'CF', name: 'Central African Republic', flag: '🇨🇫' }, { id: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩' }, { id: 'GA', name: 'Gabon', flag: '🇬🇦' }, { id: 'AO', name: 'Angola', flag: '🇦🇴' }],
        'CD': [{ id: 'CG', name: 'Republic of the Congo', flag: '🇨🇬' }, { id: 'CF', name: 'Central African Republic', flag: '🇨🇫' }, { id: 'SS', name: 'South Sudan', flag: '🇸🇸' }, { id: 'RW', name: 'Rwanda', flag: '🇷🇼' }, { id: 'BI', name: 'Burundi', flag: '🇧🇮' }, { id: 'ZM', name: 'Zambia', flag: '🇿🇲' }, { id: 'AO', name: 'Angola', flag: '🇦🇴' }],
        'GQ': [{ id: 'CM', name: 'Cameroon', flag: '🇨🇲' }, { id: 'GA', name: 'Gabon', flag: '🇬🇦' }],
        'GA': [{ id: 'CM', name: 'Cameroon', flag: '🇨🇲' }, { id: 'CG', name: 'Republic of the Congo', flag: '🇨🇬' }, { id: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' }],
        'ST': [{ id: 'GA', name: 'Gabon', flag: '🇬🇦' }, { id: 'CM', name: 'Cameroon', flag: '🇨🇲' }]
    };

    const currentNeighbors = neighbors[currentCountryCode] || [
        { id: 'NG', name: 'Nigeria', flag: '🇳🇬' },
        { id: 'GH', name: 'Ghana', flag: '🇬🇭' },
        { id: 'ZA', name: 'South Africa', flag: '🇿🇦' },
        { id: 'KE', name: 'Kenya', flag: '🇰🇪' },
        { id: 'US', name: 'USA', flag: '🇺🇸' },
    ].filter(c => c.id !== currentCountryCode).slice(0, 5);

    const continentName = countryToContinent[currentCountryCode] || 'the Region';

    if (currentNeighbors.length === 0) return null;

    return (
        <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-display font-bold text-slate-900">
                    Related Countries in {continentName}
                </h2>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none items-center">
                {currentNeighbors.map((country) => (
                    <Link
                        key={country.id}
                        to={`/country/${country.id}/${year}`}
                        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                        className="flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all group min-w-[160px] flex-shrink-0"
                    >
                        <FlagImage countryCode={country.id} size="sm" />
                        <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 truncate">
                                {country.name}
                            </div>
                            <div className="text-[10px] text-emerald-700 mt-0.5">
                                Public Holidays {year} →
                            </div>
                        </div>
                    </Link>
                ))}
                
                {/* Scroll arrow (Mockup design) */}
                <button className="hidden md:flex items-center justify-center w-8 h-12 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 text-slate-400 hover:text-emerald-600 transition-colors shadow-sm ml-2 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}


function MobileNeighboringCountries({ currentCountryCode, year }) {
    const neighbors = {
        'US': [{ id: 'CA', name: 'Canada', flag: '🇨🇦' }],
        'GB': [{ id: 'FR', name: 'France', flag: '🇫🇷' }, { id: 'DE', name: 'Germany', flag: '🇩🇪' }],
        'NG': [{ id: 'GH', name: 'Ghana', flag: '🇬🇭' }, { id: 'ZA', name: 'South Africa', flag: '🇿🇦' }],
        'GH': [{ id: 'NG', name: 'Nigeria', flag: '🇳🇬' }, { id: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { id: 'KE', name: 'Kenya', flag: '🇰🇪' }, { id: 'TG', name: 'Togo', flag: '🇹🇬' }, { id: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' }]
    };

    const currentNeighbors = neighbors[currentCountryCode] || [
        { id: 'NG', name: 'Nigeria', flag: '🇳🇬' },
        { id: 'GH', name: 'Ghana', flag: '🇬🇭' },
        { id: 'ZA', name: 'South Africa', flag: '🇿🇦' },
        { id: 'KE', name: 'Kenya', flag: '🇰🇪' }
    ].filter(c => c.id !== currentCountryCode).slice(0, 3);

    if (currentNeighbors.length === 0) return null;

    return (
        <div className="flex flex-col gap-3">
            {currentNeighbors.map((country) => (
                <Link
                    key={country.id}
                    to={`/country/${country.id}/${year}`}
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <FlagImage countryCode={country.id} size="md" />
                        <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 truncate">
                                {country.name}
                            </div>
                            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                                Public Holidays {year}
                            </div>
                        </div>
                    </div>
                    <div className="text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </Link>
            ))}
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const questionStr = (question && typeof question === 'object') ? (question.en || '') : (question || '');
    const answerStr = (answer && typeof answer === 'object') ? (answer.en || '') : (answer || '');

    return (
        <li className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
            >
                <h4 className="font-bold text-slate-900 pr-8">{questionStr}</h4>
                <div className={`flex-shrink-0 ml-4 p-1 rounded-full bg-primary-50 text-primary-600 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 pt-0 text-slate-600 border-t border-slate-50">
                    {answerStr}
                </div>
            </div>
        </li>
    );
}
