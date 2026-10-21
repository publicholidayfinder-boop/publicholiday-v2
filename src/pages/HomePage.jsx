import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCountries, prefetchCountry } from '../hooks/useHolidays';
import SEO from '../components/SEO';
import PersonalWatchlist from '../components/PersonalWatchlist';
import TodayGlobalHolidays from '../components/TodayGlobalHolidays';
import FlagImage from '../components/FlagImage';
import { useTranslation } from 'react-i18next';
import ContinentIcon from '../components/ContinentIcon';
import { emojiMap } from '../utils/emojiMap';
import { CONTINENTS, countryToContinent } from '../lib/continents';

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const { countries, loading } = useCountries();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedContinent = searchParams.get('region') || 'All';
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
    const [countrySearch, setCountrySearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (selectedCountry) {
            navigate(`/country/${selectedCountry}/${selectedYear}`);
        }
    };

    const currentYear = new Date().getFullYear();
    // Provide a reasonable range of years: from 5 years ago to 3 years in the future
    const years = Array.from({ length: 9 }, (_, i) => currentYear - 5 + i);

    return (
        <>
            <SEO
                title="Public Holidays by Country 2026-2027"
                description={t('hero.description')}
                keywords="public holidays by country 2026, national holidays 2027, holiday calendar worldwide, public holidays worldwide"
                canonical="https://publicholidayfinder.com/"
                currentLang={i18n.language}
                schema={[
                    {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "PublicHolidayFinder",
                        "url": "https://publicholidayfinder.com",
                        "description": "Find official public holidays for 100+ countries worldwide. Plan travel, work, and events with accurate 2026-2027 holiday calendars.",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": "https://publicholidayfinder.com/country/{country_code}/{year}"
                            },
                            "query-input": "required name=country_code"
                        }
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "PublicHolidayFinder",
                        "url": "https://publicholidayfinder.com",
                        "logo": "https://publicholidayfinder.com/icon-512.png"
                    }
                ]}
            />

            {/* Hero Section */}
            {/* Hero Section with Custom Banner */}
            <section className="relative overflow-hidden bg-[#006bd6] text-white" style={{ minHeight: '360px', display: 'flex', alignItems: 'center' }}>
                {/* Background image */}
                <div 
                    className="absolute inset-0 bg-cover"
                    style={{
                        backgroundImage: `url('/images/hero-banner.png')`,
                        backgroundPosition: 'right center',
                        opacity: 1
                    }}
                />
                
                {/* Very subtle gradient just to ensure text readability on the left */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#004e9c]/60 via-transparent to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
                    <div className="max-w-lg animate-fade-in">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight drop-shadow-md">
                            Find Public Holidays<br />
                            <span className="text-emerald-400">Around the World</span>
                        </h1>
                        <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-sm mb-6 font-medium drop-shadow-sm">
                            Accurate dates, calendars and information<br />for every country.
                        </p>

                        {/* Hero Search Box */}
                        <div className="max-w-md relative bg-white p-1.5 rounded-full shadow-xl flex items-center">
                            <svg className="ml-3 w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (!countrySearch.trim()) {
                                            const el = document.getElementById('countries-section');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            return;
                                        }
                                        const match = countries.find(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
                                        if (match) {
                                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                            navigate(`/country/${match.id}/${selectedYear}`);
                                        } else {
                                            const el = document.getElementById('countries-section');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }
                                }}
                                placeholder="Search for a country..."
                                className="flex-1 py-2 px-3 text-slate-800 text-sm font-medium outline-none bg-transparent placeholder-slate-400"
                            />
                            <button
                                onClick={() => {
                                    if (!countrySearch.trim()) {
                                        const el = document.getElementById('countries-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        return;
                                    }
                                    const match = countries.find(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
                                    if (match) {
                                        navigate(`/country/${match.id}/${selectedYear}`);
                                    } else {
                                        const el = document.getElementById('countries-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-sm transition-all shadow-md active:scale-95 flex-shrink-0"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <PersonalWatchlist />
            <section className="bg-slate-50 py-8 border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <TodayGlobalHolidays />
                </div>
            </section>

            {/* Popular Countries - horizontal chip row */}
            <section className="bg-white py-4 border-b border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold text-slate-800">
                            Popular Countries
                        </h2>
                        <Link 
                            to="/#countries-section"
                            onClick={(e) => {
                                if (window.location.pathname === '/') {
                                    e.preventDefault();
                                    document.getElementById('countries-section')?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-0.5"
                        >
                            View all countries →
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-0 overflow-x-auto scrollbar-none -mx-1">
                        {[
                            { id: 'GH', name: 'Ghana' },
                            { id: 'NG', name: 'Nigeria' },
                            { id: 'US', name: 'USA' },
                            { id: 'GB', name: 'UK' },
                            { id: 'CA', name: 'Canada' },
                            { id: 'ZA', name: 'South Africa' },
                            { id: 'AU', name: 'Australia' },
                            { id: 'IN', name: 'India' },
                        ].map((c) => (
                            <Link
                                key={c.id}
                                to={`/country/${c.id}/${selectedYear}`}
                                onMouseEnter={() => prefetchCountry(c.id, selectedYear)}
                                onTouchStart={() => prefetchCountry(c.id, selectedYear)}
                                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all flex-shrink-0 group"
                            >
                                <FlagImage countryCode={c.id} size="sm" />
                                <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-800">{c.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Browse by Region - horizontal inline row */}
            <section className="bg-white border-b border-slate-100 py-4">
                <div className="container mx-auto px-4">
                    <h2 className="text-sm font-bold text-slate-800 mb-3">
                        Browse by Region
                    </h2>
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-1 pb-1">
                        {[
                            { id: 'Africa',   name: 'Africa',   color: '#10b981' },
                            { id: 'Asia',     name: 'Asia',     color: '#8b5cf6' },
                            { id: 'Europe',   name: 'Europe',   color: '#3b82f6' },
                            { id: 'Americas', name: 'Americas', color: '#f97316' },
                            { id: 'Oceania',  name: 'Oceania',  color: '#14b8a6' },
                        ].map(reg => (
                            <Link
                                key={reg.id}
                                to={`/?region=${reg.id}#countries-section`}
                                onClick={(e) => {
                                    if (window.location.pathname === '/') {
                                        e.preventDefault();
                                        setSearchParams({ region: reg.id });
                                        const el = document.getElementById('countries-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex-shrink-0 shadow-sm hover:-translate-y-0.5 ${
                                    selectedContinent === reg.id
                                        ? 'border-emerald-200 text-emerald-800 bg-emerald-50 shadow-emerald-100'
                                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300 hover:shadow-md'
                                }`}
                            >
                                <ContinentIcon continent={reg.id} className="w-5 h-5" style={{ color: reg.color }} />
                                <span>{reg.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Features Banner */}
            <section className="bg-emerald-50 border-b border-emerald-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex-shrink-0">
                                What's New
                            </span>
                            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                                Exciting new tools & coverage
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">🌍</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">211 Countries & Territories</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    We've expanded! We now cover 211 nations and territories globally, including all major Asian, African, Americas and Oceania countries.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">💼</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Working Days Calculator</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Calculate exact business days, weekends, and holidays between dates for any country.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">⏱️</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Live Local Time</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Check accurate local time, UTC offsets, DST rules, and holiday countdowns.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">🖨️</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Enhanced Print Studio</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Easily toggle between monthly and yearly views, now with perfect 1-page printing.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">⭐</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Personal Watchlist</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Pin up to 5 countries and track their upcoming holidays directly on your homepage dashboard.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">📅</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Printable Year Planner</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Generate a beautiful, color-coded, one-page A4 year planner for any country with a single click.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-display font-bold text-center mb-12">
                        {t('features.title')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">🌍</div>
                            <h3 className="text-xl font-bold mb-3">{t('features.global.title')}</h3>
                            <p className="text-slate-600">
                                {t('features.global.desc')}
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-3">{t('features.fast.title')}</h3>
                            <p className="text-slate-600">
                                {t('features.fast.desc')}
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">🖨️</div>
                            <h3 className="text-xl font-bold mb-3">{t('features.accurate.title')}</h3>
                            <p className="text-slate-600">
                                {t('features.accurate.desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Generate a Calendar — Steps Section */}
            <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
                {/* Subtle decorative blobs */}
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-14">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            {t('steps.badge', 'Quick Start Guide')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 mb-3">
                            {t('steps.title', 'How to Generate a Calendar')}
                        </h2>
                        <p className="text-slate-600 text-lg max-w-xl mx-auto">
                            {t('steps.subtitle', 'Create your custom public holiday calendar in just 5 easy steps — no sign-up required.')}
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="max-w-3xl mx-auto flex flex-col gap-5">
                        {[
                            {
                                step: '01',
                                icon: '🌍',
                                title: t('steps.step1.title', 'Select a Country'),
                                desc: t('steps.step1.desc', 'Browse 100+ countries in the grid below or type in the search bar to instantly find your country.'),
                                color: 'from-blue-500 to-primary-600',
                            },
                            {
                                step: '02',
                                icon: '📅',
                                title: t('steps.step2.title', 'Choose a Year'),
                                desc: t('steps.step2.desc', 'Pick the calendar year you need — covering past years and upcoming years including 2026 & 2027.'),
                                color: 'from-violet-500 to-purple-600',
                            },
                            {
                                step: '03',
                                icon: '🎨',
                                title: t('steps.step3.title', 'Pick a Template'),
                                desc: t('steps.step3.desc', 'Select from beautiful styles: Minimal, Corporate, Colorful, Dark, Elegant, Kids, or Floral.'),
                                color: 'from-pink-500 to-rose-500',
                            },
                            {
                                step: '04',
                                icon: '⚙️',
                                title: t('steps.step4.title', 'Customize Your Calendar'),
                                desc: t('steps.step4.desc', 'Upload your logo, pick accent colors, choose orientation, set week start, and add personal events or notes.'),
                                color: 'from-amber-500 to-orange-500',
                            },
                            {
                                step: '05',
                                icon: '📥',
                                title: t('steps.step5.title', 'Export or Print'),
                                desc: t('steps.step5.desc', 'Download your finished calendar as a PDF, PNG, or ICS file — or print it straight from your browser.'),
                                color: 'from-emerald-500 to-teal-500',
                            },
                        ].map((item, idx) => (
                            <div
                                key={item.step}
                                className="glass-card flex items-start gap-5 p-6 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group"
                                style={{ animationDelay: `${idx * 0.08}s` }}
                            >
                                {/* Step badge */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white font-black text-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {item.step}
                                </div>

                                {/* Icon + content */}
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl leading-none mt-0.5 group-hover:scale-110 transition-transform duration-300">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-1">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <Link
                            to="/calendar-generator"
                            className="inline-flex items-center gap-2 btn btn-primary text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                        >
                            {t('steps.cta', '📅 Open Calendar Generator →')}
                        </Link>
                                        <p className="text-slate-400 text-sm mt-3">{t('steps.ctaNote', 'Free forever — No account needed')}</p>
                    </div>
                </div>
            </section>

            {/* Countries Grid */}
            <section id="countries-section" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-display font-bold text-center mb-3 text-slate-900">
                        {t('explore.title', 'Explore All Countries')}
                    </h2>
                    <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto text-sm md:text-base">
                        {t('explore.subtitle', 'Select a country to view official public holidays, observances, and generate custom calendars.')}
                    </p>

                    {/* Search / Filter */}
                    <div className="flex flex-col items-center gap-6 mb-8 max-w-4xl mx-auto">
                        
                        {/* Continent Filter Tabs */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {CONTINENTS.map(continent => (
                                <Link
                                    key={continent}
                                    to={`/?region=${continent}#countries-section`}
                                    onClick={(e) => {
                                        if (window.location.pathname === '/') {
                                            e.preventDefault();
                                            setSearchParams({ region: continent });
                                        }
                                    }}
                                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                                        selectedContinent === continent
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                                    }`}
                                >
                                    {continent}
                                </Link>
                            ))}
                        </div>

                        <div className="relative w-full max-w-md">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">🔍</span>
                            <input
                                id="country-search"
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Search countries..."
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-sm bg-slate-50 focus:bg-white"
                            />
                            {countrySearch && (
                                <button
                                    onClick={() => setCountrySearch('')}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-xs"
                                    aria-label="Clear search"
                                >
                                    ❌
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        /* Skeleton grid */
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl bg-slate-200 animate-pulse h-24"
                                />
                            ))}
                        </div>
                    ) : (() => {
                        const filtered = countries.filter((c) => {
                            const matchesSearch = c.name.toLowerCase().includes(countrySearch.toLowerCase());
                            const matchesContinent = selectedContinent === 'All' || countryToContinent[c.id] === selectedContinent;
                            return matchesSearch && matchesContinent;
                        });
                        return (
                            <>
                                {countrySearch && (
                                    <p className="text-center text-sm text-slate-500 mb-4">
                                        {filtered.length} {filtered.length === 1 ? 'country' : 'countries'} found
                                    </p>
                                )}
                                {filtered.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                                        {filtered.map((country) => (
                                            <Link
                                                key={country.id}
                                                to={`/country/${country.id}/${selectedYear}`}
                                                onMouseEnter={() => prefetchCountry(country.id, selectedYear)}
                                                onTouchStart={() => prefetchCountry(country.id, selectedYear)}
                                                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                                className="card text-center hover:shadow-2xl hover:-translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:scale-105 flex flex-col items-center gap-2 py-4 px-2"
                                                aria-label={`View public holidays for ${country.name}`}
                                            >
                                                <FlagImage countryCode={country.id} size="lg" className="mx-auto" />
                                                <div className="font-semibold text-sm">{country.name}</div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-500">
                                        <div className="text-5xl mb-4">🌍</div>
                                        <p className="text-lg font-semibold">No countries match "{countrySearch}"</p>
                                        <p className="text-sm mt-1">Try a different search term.</p>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-display font-bold mb-6">
                            {t('about.title')}
                        </h2>
                        <div className="prose prose-lg">
                            <p className="text-slate-700 leading-relaxed mb-4">
                                {t('about.text')}
                            </p>
                            <p className="text-slate-700 leading-relaxed">
                                {t('whatAre.intro')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}


