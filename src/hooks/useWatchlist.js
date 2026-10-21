import { useState, useEffect } from 'react';

const WATCHLIST_KEY = 'phf_watchlist';
const MAX_WATCHLIST = 5;

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(WATCHLIST_KEY);
            if (saved) {
                setWatchlist(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load watchlist', e);
        }
    }, []);

    const saveWatchlist = (newList) => {
        setWatchlist(newList);
        try {
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newList));
        } catch (e) {
            console.error('Failed to save watchlist', e);
        }
    };

    const toggleCountry = (countryCode) => {
        if (watchlist.includes(countryCode)) {
            saveWatchlist(watchlist.filter(c => c !== countryCode));
            return true;
        } else {
            if (watchlist.length >= MAX_WATCHLIST) {
                return false;
            }
            saveWatchlist([...watchlist, countryCode]);
            return true;
        }
    };

    const isPinned = (countryCode) => {
        return watchlist.includes(countryCode);
    };

    return { watchlist, toggleCountry, isPinned, isFull: watchlist.length >= MAX_WATCHLIST, max: MAX_WATCHLIST };
}
