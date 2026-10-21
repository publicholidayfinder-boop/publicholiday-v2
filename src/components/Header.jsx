import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Header() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchOpen(false);
            setMobileMenuOpen(false);
        }
    };

    const navClass = ({ isActive }) =>
        isActive
            ? 'font-semibold text-primary-700 hover:text-primary-800 transition-colors'
            : 'font-medium text-slate-700 hover:text-primary-700 transition-colors text-sm';

    const mobileNavClass = ({ isActive }) =>
        isActive
            ? 'font-bold text-primary-700 bg-primary-50/80 px-3 py-2 rounded-lg transition-colors'
            : 'font-medium text-slate-700 hover:text-primary-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors';

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 print:hidden">
            <div className="container mx-auto px-4 py-3.5">
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <NavLink to="/" className="flex items-center group" end>
                        <img
                            src="/images/logo.png"
                            alt="PublicHolidayFinder"
                            className="h-10 md:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity"
                        />
                    </NavLink>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <NavLink to="/" className={navClass} end>
                            {t('nav.home', 'Home')}
                        </NavLink>
                        <Link to="/" className="relative group flex items-center gap-1 cursor-pointer">
                            <span className="font-medium text-slate-700 hover:text-primary-700 transition-colors text-sm">{t('nav.countries', 'Countries')}</span>
                            <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </Link>
                        <Link to="/search" className="relative group flex items-center gap-1 cursor-pointer">
                            <span className="font-medium text-slate-700 hover:text-primary-700 transition-colors text-sm">{t('nav.findHolidays', 'Holidays')}</span>
                            <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </Link>
                        <NavLink to="/calendar-generator" className={navClass}>
                            {t('nav.calendarGenerator', 'Calendar')}
                        </NavLink>
                        <NavLink to="/compare" className={navClass}>
                            {t('nav.compare', 'Compare')}
                        </NavLink>
                        <NavLink to="/about" className={navClass}>
                            {t('nav.about', 'About')}
                        </NavLink>
                    </nav>

                    {/* Right utilities: Language + Search */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSelector />

                        {searchOpen ? (
                            <form onSubmit={handleSearch} className="relative animate-fade-in">
                                <input
                                    type="text"
                                    placeholder={t('form.searchPlaceholder', 'Search...')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    onBlur={() => !searchQuery && setSearchOpen(false)}
                                    className="w-56 pl-9 pr-8 py-1.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none text-sm bg-slate-50 focus:bg-white"
                                />
                                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none text-sm">
                                    🔍
                                </span>
                            </form>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search"
                                className="w-9 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-sm transition-all active:scale-95"
                                title="Search holidays or countries"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Mobile menu trigger */}
                    <div className="flex items-center gap-2 md:hidden">
                        <LanguageSelector />
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2 animate-fade-in">
                        <form onSubmit={handleSearch} className="relative mb-2">
                            <input
                                type="text"
                                placeholder={t('form.searchPlaceholder', 'Search country or holiday...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none text-sm bg-slate-50"
                            />
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none text-sm">
                                🔍
                            </span>
                            <button
                                type="submit"
                                className="absolute inset-y-1 right-1 px-3 bg-primary-600 text-white rounded-md text-xs font-semibold"
                            >
                                Go
                            </button>
                        </form>

                        <NavLink 
                            to="/" 
                            end
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.home', 'Home')}
                        </NavLink>
                        <NavLink 
                            to="/" 
                            onClick={() => {
                                setMobileMenuOpen(false);
                                const el = document.getElementById('countries-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={mobileNavClass}
                        >
                            {t('nav.countries', 'Countries')}
                        </NavLink>
                        <NavLink 
                            to="/search" 
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.findHolidays', 'Holidays')}
                        </NavLink>
                        <NavLink 
                            to="/calendar-generator" 
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.calendarGenerator', 'Calendar')}
                        </NavLink>
                        <NavLink 
                            to="/compare" 
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.compare', 'Compare')}
                        </NavLink>
                        <NavLink 
                            to="/about" 
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            About
                        </NavLink>
                    </div>
                )}
            </div>
        </header>
    );
}
