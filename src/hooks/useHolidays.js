import { useState, useEffect } from 'react';
import staticCountriesList from '../data/countries.json';

// Global in-memory caches for instantaneous navigation
const countryCache = new Map();
const holidaysCache = new Map();
let countriesListCache = staticCountriesList;

const processHolidaysData = (rawList, targetYear) => {
    const yearNum = parseInt(targetYear);
    return (Array.isArray(rawList) ? rawList : [])
        .filter(h => h.year === yearNum)
        .map(h => ({
            ...h,
            name: (h.name && typeof h.name === 'object') ? (h.name.en || '') : (h.name || ''),
            description: (h.description && typeof h.description === 'object') ? (h.description.en || '') : (h.description || '')
        }));
};

const processCountryData = (localCountry, language = 'en') => {
    if (!localCountry) return null;
    const countryData = { ...localCountry };
    if (countryData.name && typeof countryData.name === 'object') {
        countryData.name = countryData.name[language] || countryData.name.en || '';
    }
    if (countryData.description && typeof countryData.description === 'object') {
        countryData.description = countryData.description[language] || countryData.description.en || '';
    }

    if (countryData.sections && Array.isArray(countryData.sections)) {
        countryData.sections = countryData.sections.map(section => {
            const newSection = { ...section };
            if (newSection.title && typeof newSection.title === 'object') {
                newSection.title = newSection.title[language] || newSection.title.en || '';
            }
            if (newSection.content && typeof newSection.content === 'object') {
                newSection.content = newSection.content[language] || newSection.content.en || '';
            }
            if (newSection.items && Array.isArray(newSection.items)) {
                newSection.items = newSection.items.map(item => {
                    const newItem = { ...item };
                    if (newItem.q && typeof newItem.q === 'object') newItem.q = newItem.q[language] || newItem.q.en || '';
                    if (newItem.a && typeof newItem.a === 'object') newItem.a = newItem.a[language] || newItem.a.en || '';
                    return newItem;
                });
            }
            return newSection;
        });
    }
    return countryData;
};

// High-speed prefetch utility for hover and touch interactions
export const prefetchCountry = (countryCode, year, language = 'en') => {
    const cleanCode = (countryCode || '').toUpperCase().trim();
    if (!cleanCode) return;
    const cKey = cleanCode + '_' + language;
    if (!countryCache.has(cKey)) {
        fetch('/data/countries/' + cleanCode + '.json')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) countryCache.set(cKey, processCountryData(data, language));
            })
            .catch(() => {});
    }

    if (year) {
        const hKey = cleanCode + '_' + year;
        if (!holidaysCache.has(hKey)) {
            fetch('/data/holidays/' + cleanCode + '.json')
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) holidaysCache.set(hKey, processHolidaysData(data, year));
                })
                .catch(() => {});
        }
    }
};

export const useCountries = () => {
    const [countries, setCountries] = useState(() => {
        const list = countriesListCache || staticCountriesList;
        return Array.isArray(list) ? list : [];
    });
    const [loading] = useState(false);
    const [error] = useState(null);

    useEffect(() => {
        if (!countriesListCache || countriesListCache.length === 0) {
            countriesListCache = staticCountriesList;
            setCountries(Array.isArray(staticCountriesList) ? staticCountriesList : []);
        }
    }, []);

    return { countries, loading, error };
};

export const useHolidays = (countryCode, year) => {
    const cleanCode = (countryCode || '').toUpperCase().trim();
    const cacheKey = cleanCode + '_' + year;
    const [holidays, setHolidays] = useState(() => holidaysCache.get(cacheKey) || []);
    const [loading, setLoading] = useState(() => !holidaysCache.has(cacheKey));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cleanCode || !year) {
            setHolidays([]);
            setLoading(false);
            return;
        }

        const key = cleanCode + '_' + year;
        if (holidaysCache.has(key)) {
            setHolidays(holidaysCache.get(key));
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        const fetchHolidays = async () => {
            try {
                const res = await fetch('/data/holidays/' + cleanCode + '.json');
                if (res.ok) {
                    const localHolidays = await res.json();
                    const filtered = processHolidaysData(localHolidays, year);
                    holidaysCache.set(key, filtered);
                    if (isMounted) setHolidays(filtered);
                } else {
                    if (isMounted) setHolidays([]);
                }
            } catch (e) {
                console.error('Failed to load holidays for ' + cleanCode + ':', e);
                if (isMounted) {
                    setError(e);
                    setHolidays([]);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchHolidays();
        return () => { isMounted = false; };
    }, [cleanCode, year]);

    return { holidays, loading, error };
};

export const useCountry = (rawCountryCode, language = 'en') => {
    const cleanCode = (rawCountryCode || '').toUpperCase().trim();
    const cacheKey = cleanCode + '_' + language;
    const [country, setCountry] = useState(() => {
        if (countryCache.has(cacheKey)) return countryCache.get(cacheKey);
        const basic = (countriesListCache || staticCountriesList).find(c => c.id === cleanCode);
        if (basic) return { id: basic.id, name: basic.name, flag: basic.flag, description: basic.description, sections: [] };
        return null;
    });
    const [loading, setLoading] = useState(() => !countryCache.has(cacheKey));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cleanCode) {
            setCountry(null);
            setLoading(false);
            return;
        }

        const key = cleanCode + '_' + language;
        if (countryCache.has(key)) {
            setCountry(countryCache.get(key));
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);

        const fetchCountry = async () => {
            try {
                const res = await fetch('/data/countries/' + cleanCode + '.json');
                if (res.ok) {
                    const localCountry = await res.json();
                    const processed = processCountryData(localCountry, language);
                    countryCache.set(key, processed);
                    if (isMounted) setCountry(processed);
                } else {
                    // Retain basic country details if available so page never crashes to Not Found
                    if (isMounted) {
                        const basic = (countriesListCache || staticCountriesList).find(c => c.id === cleanCode);
                        if (basic) {
                            setCountry(prev => prev || { id: basic.id, name: basic.name, flag: basic.flag, description: basic.description, sections: [] });
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load country data for ' + cleanCode + ':', err);
                if (isMounted) {
                    setError(err);
                    const basic = (countriesListCache || staticCountriesList).find(c => c.id === cleanCode);
                    if (basic) {
                        setCountry(prev => prev || { id: basic.id, name: basic.name, flag: basic.flag, description: basic.description, sections: [] });
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCountry();
        return () => { isMounted = false; };
    }, [cleanCode, language]);

    return { country, loading, error };
};