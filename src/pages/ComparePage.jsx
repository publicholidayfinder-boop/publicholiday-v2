import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { useCountry, useHolidays, useCountries } from '../hooks/useHolidays';
import HolidayCard from '../components/HolidayCard';
import FlagImage from '../components/FlagImage';

function CountryColumn({ countryCode, year, language, onCountryChange, allCountries }) {
    const { country, loading: countryLoading } = useCountry(countryCode, language);
    const { holidays, loading: holidaysLoading } = useHolidays(countryCode, year);

    return (
        <div className="flex-1">
            <div className="sticky top-[72px] bg-slate-50/90 backdrop-blur-md z-10 p-4 border-b border-slate-200 mb-6 text-center shadow-sm rounded-t-xl">
                
                {/* Country Selector */}
                <select 
                    className="w-full mb-3 py-2 px-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-bold text-slate-800"
                    value={countryCode}
                    onChange={(e) => onCountryChange(e.target.value)}
                >
                    {allCountries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                {countryLoading ? (
                     <div className="h-8 w-8 mx-auto border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                ) : country ? (
                    <>
                        <div className="flex justify-center mb-2">
                            <FlagImage countryCode={countryCode} size="xl" className="rounded-lg shadow-sm" />
                        </div>
                        <h2 className="text-2xl font-bold font-display text-slate-900">{country.name}</h2>
                        <div className="text-sm text-slate-500 mt-1 font-medium">
                            {holidays ? holidays.length : 0} holidays in {year}
                        </div>
                    </>
                ) : (
                    <div className="text-slate-500">Country not found.</div>
                )}
            </div>

            <div className="px-4 pb-8 space-y-4">
                {holidaysLoading ? (
                    <div className="text-center py-12 text-slate-400 animate-pulse">Loading holidays...</div>
                ) : holidays && holidays.length > 0 ? (
                    holidays.map(holiday => (
                        <HolidayCard key={holiday.id} holiday={holiday} />
                    ))
                ) : (
                    <div className="text-center p-8 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-slate-500 font-medium">No holidays found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ComparePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t, i18n } = useTranslation();
    const { countries } = useCountries(i18n.language);
    
    const c1 = searchParams.get('c1') || 'US';
    const c2 = searchParams.get('c2') || 'GB';
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    const yearRange = Array.from({ length: 10 }, (_, i) => 2021 + i);

    const updateParams = (newC1, newC2, newYear) => {
        setSearchParams({ c1: newC1, c2: newC2, year: newYear });
    };

    return (
        <>
            <SEO
                title={`Compare Holidays: ${c1} vs ${c2} - PublicHolidayFinder`}
                description={`Compare public holidays between ${c1} and ${c2} for the year ${year}.`}
                keywords={`compare holidays, ${c1} holidays, ${c2} holidays, side-by-side holidays`}
            />

            <div className="bg-slate-50 min-h-screen pb-12">
                <div className="bg-white border-b border-slate-200 py-8 mb-8 shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 mb-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    {t('nav.home', 'Back to Home')}
                                </Link>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 flex items-center gap-3">
                                    <span className="text-emerald-600">⚖️</span> Compare Holidays
                                </h1>
                                <p className="text-slate-500 mt-2 text-sm max-w-lg">
                                    Select two countries to view their holidays side-by-side. Perfect for remote teams coordinating across borders.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                                <span className="text-sm font-bold text-slate-700">Year:</span>
                                <select
                                    value={year}
                                    onChange={(e) => updateParams(c1, c2, e.target.value)}
                                    className="bg-white border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-bold px-3 py-1 cursor-pointer"
                                >
                                    {yearRange.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[60vh]">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 z-0"></div>
                        
                        <CountryColumn 
                            countryCode={c1} 
                            year={year} 
                            language={i18n.language} 
                            allCountries={countries}
                            onCountryChange={(val) => updateParams(val, c2, year)}
                        />
                        <CountryColumn 
                            countryCode={c2} 
                            year={year} 
                            language={i18n.language} 
                            allCountries={countries}
                            onCountryChange={(val) => updateParams(c1, val, year)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
