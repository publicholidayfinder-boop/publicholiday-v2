import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountries } from '../hooks/useHolidays';
import SEO from '../components/SEO';
import HolidayCard from '../components/HolidayCard';
import { emojiMap } from '../utils/emojiMap';

export default function SearchPage() {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const { countries, loading: countriesLoading } = useCountries();
    const [allHolidays, setAllHolidays] = useState([]);
    const [holidaysLoading, setHolidaysLoading] = useState(false);

    // Fetch all holidays from local JSON for client-side search
    useEffect(() => {
        const fetchAllHolidays = async () => {
            setHolidaysLoading(true);
            try {
                const res = await fetch('/data/holidays.json');
                if (res.ok) {
                    const data = await res.json();
                    const holidayList = Array.isArray(data) ? data : (data?.holidays || []);
                    setAllHolidays(holidayList);
                }
            } catch (err) {
                console.error('Failed to load holidays for search', err);
            } finally {
                setHolidaysLoading(false);
            }
        };

        if (query) {
            fetchAllHolidays();
        }
    }, [query]);

    // Handle internal search input
    const [localQuery, setLocalQuery] = useState(query);
    const handleSearch = (e) => {
        e.preventDefault();
        if (localQuery.trim()) {
            setSearchParams({ q: localQuery.trim() });
        }
    };

    // Keep internal state in sync with URL
    useEffect(() => {
        setLocalQuery(query);
    }, [query]);

    // Filter results
    const { matchingCountries, matchingHolidays } = useMemo(() => {
        if (!query) return { matchingCountries: [], matchingHolidays: [] };
        
        const q = query.toLowerCase().trim();
        const countriesList = Array.isArray(countries) ? countries : [];

        // Filter countries
        const mCountries = countriesList.filter(c => 
            c.name && c.name.toLowerCase().includes(q)
        );

        // Filter holidays (Limit to 50 to avoid rendering issues)
        const holidaysList = Array.isArray(allHolidays) ? allHolidays : (allHolidays?.holidays || []);
        const mHolidays = holidaysList
            .filter(h => 
                h && h.name && (
                    h.name.toLowerCase().includes(q) || 
                    (h.type && typeof h.type === 'string' && h.type.toLowerCase().includes(q))
                )
            )
            .slice(0, 50);

        return { matchingCountries: mCountries, matchingHolidays: mHolidays };
    }, [query, countries, allHolidays]);

    const isLoading = countriesLoading || holidaysLoading;
    const hasSearched = query.length > 0;
    const currentYear = new Date().getFullYear();

    return (
        <>
            <SEO 
                title={query ? `Search Results for "${query}"` : 'Search Public Holidays by Country'} 
                description={`Search public holidays and countries on PublicHolidayFinder. Find official holidays for 100+ countries worldwide.`}
                canonical="https://publicholidayfinder.com/search"
            />
            
            <div className="container mx-auto px-4 py-12 min-h-[60vh]">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header & Search Bar */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-display font-bold text-slate-900 mb-6">
                            Search Results
                        </h1>
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                                placeholder="Search for a country or holiday..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-lg shadow-sm"
                            />
                            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-xl pointer-events-none">
                                🔍
                            </span>
                            <button 
                                type="submit"
                                className="absolute inset-y-2 right-2 px-6 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {!hasSearched ? (
                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-6xl mb-4">🌍</div>
                            <h2 className="text-2xl font-bold text-slate-700 mb-2">Find any holiday or country</h2>
                            <p className="text-slate-500">Type in the search box above to get started.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-slate-600">Searching...</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Countries Results */}
                            {matchingCountries.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-sm">
                                            {matchingCountries.length}
                                        </span>
                                        Countries matching "{query}"
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {matchingCountries.map(country => (
                                            <Link
                                                key={country.id}
                                                to={`/country/${country.id}/${currentYear}`}
                                                className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-primary-400 hover:shadow-md transition-all group"
                                            >
                                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                                                    {emojiMap[country.id] || '🌍'}
                                                </div>
                                                <span className="font-semibold text-slate-800 text-center">
                                                    {country.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Holidays Results */}
                            {matchingHolidays.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded text-sm">
                                            {matchingHolidays.length}{matchingHolidays.length === 50 ? '+' : ''}
                                        </span>
                                        Holidays matching "{query}"
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {matchingHolidays.map((holiday, idx) => {
                                            // Add country info to holiday object for display if possible
                                            const country = countries.find(c => c.id === holiday.countryCode);
                                            
                                            return (
                                                <div key={`${holiday.id}-${idx}`} className="relative group">
                                                    <HolidayCard holiday={holiday} />
                                                    {/* Contextual overlay showing country */}
                                                    {country && (
                                                        <Link 
                                                            to={`/country/${country.id}/${holiday.year}`}
                                                            className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center gap-1.5"
                                                        >
                                                            {emojiMap[country.id]} {country.name}
                                                        </Link>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* No Results */}
                            {matchingCountries.length === 0 && matchingHolidays.length === 0 && (
                                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-5xl mb-4">🤷</div>
                                    <h2 className="text-2xl font-bold text-slate-700 mb-2">No results found</h2>
                                    <p className="text-slate-500">We couldn't find any countries or holidays matching "{query}".</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
