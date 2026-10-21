import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FlagImage from './FlagImage';
import { useCountries } from '../hooks/useHolidays';

export default function TodayGlobalHolidays() {
    const [todayHolidays, setTodayHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const { countries } = useCountries();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const displayDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    useEffect(() => {
        const fetchToday = async () => {
            try {
                const res = await fetch(`/data/global-${year}.json`);
                if (res.ok) {
                    const data = await res.json();
                    setTodayHolidays(data[dateStr] || []);
                }
            } catch (e) {
                console.error('Failed to load global holidays', e);
            } finally {
                setLoading(false);
            }
        };
        fetchToday();
    }, [year, dateStr]);

    if (loading || !countries.length) return null;

    if (todayHolidays.length === 0) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-2xl mb-2">??</div>
                <h2 className="font-display font-bold text-slate-800">No Global Public Holidays Today</h2>
                <p className="text-sm text-slate-500 mt-1">There are no major public holidays recorded across our 199 countries for {displayDate}.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden ">
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">??</span>
                    <div>
                        <h2 className="font-display font-bold text-white text-lg leading-tight">Today's Global Holidays</h2>
                        <p className="text-emerald-200 text-xs font-medium">{displayDate} • {todayHolidays.length} {todayHolidays.length === 1 ? 'country' : 'countries'} celebrating</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-emerald-50/30">
                <div className="flex overflow-x-auto pb-4 -mx-2 px-2 gap-4 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    {todayHolidays.map((h, i) => {
                        const countryInfo = countries.find(c => c.id === h.countryCode);
                        const countryName = countryInfo ? countryInfo.name : h.countryCode;
                        
                        return (
                            <Link 
                                key={i} 
                                to={`/country/${h.countryCode}/${year}`}
                                className="flex-shrink-0 w-64 bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-emerald-300 transition-all snap-start group"
                            >
                                <div className="flex items-start gap-3">
                                    <FlagImage countryCode={h.countryCode} size="lg" className="rounded shadow-sm mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{countryName}</div>
                                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 leading-snug">{h.name}</div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
}
