import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountries, useHolidays, useCountry } from '../hooks/useHolidays';
import { getLocalDateString, getHolidayDateString, getLocalMidnightDate } from '../lib/calendarConstants';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Core parameters sync with URL
    const paramCountry = searchParams.get('country') || 'US';
    const paramYear = searchParams.get('year') || '2026';
    const paramTemplate = searchParams.get('template') || 'minimal';
    const paramOrientation = searchParams.get('orientation') || 'landscape';
    const paramView = searchParams.get('view') || 'month';

    const [selectedCountryCode, setSelectedCountryCode] = useState(paramCountry);
    const [year, setYear] = useState(paramYear);
    const [template, setTemplate] = useState(paramTemplate);
    const [orientation, setOrientation] = useState(paramOrientation);
    const [viewMode, setViewMode] = useState(paramView);
    
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [paperSize, setPaperSize] = useState('A4');
    const [themeColor, setThemeColor] = useState('#0284c7');
    const [hasCustomColor, setHasCustomColor] = useState(false); // Track manual color picker edits
    const [fontFamily, setFontFamily] = useState('sans');
    const [customTitle, setCustomTitle] = useState('');
    const [hasCustomTitle, setHasCustomTitle] = useState(false); // Track manual edits
    const [notes, setNotes] = useState(() => t('calendar.notes.default'));
    const [hasCustomNotes, setHasCustomNotes] = useState(false); // Track manual edits
    const [logoImage, setLogoImage] = useState(null);
    const [showWeekends, setShowWeekends] = useState(true);
    const [showDescriptions, setShowDescriptions] = useState(true);
    const [weekStart, setWeekStart] = useState(0); // 0 = Sunday, 1 = Monday
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Personal Events
    const [personalEvents, setPersonalEvents] = useState(() => {
        try {
            const saved = localStorage.getItem('phf_personalEvents');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    
    const [eventDate, setEventDate] = useState('');
    const [eventName, setEventName] = useState('');

    const [exportingType, setExportingType] = useState(null); // null | 'pdf' | 'png'
    const exporting = exportingType !== null;
    const [toasts, setToasts] = useState([]);

    // Load data from custom hooks
    const { countries, loading: countriesLoading } = useCountries();
    const { holidays, loading: holidaysLoading } = useHolidays(selectedCountryCode, year);
    const { country } = useCountry(selectedCountryCode, i18n.language);

    // Sync selected core states back to URL search params
    useEffect(() => {
        setSearchParams({
            country: selectedCountryCode,
            year,
            template,
            orientation,
            view: viewMode
        }, { replace: true });
    }, [selectedCountryCode, year, template, orientation, viewMode, setSearchParams]);

    // Persist personal events to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('phf_personalEvents', JSON.stringify(personalEvents));
        } catch { /* quota exceeded or private mode */ }
    }, [personalEvents]);

    // Handle Title fallback
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (!hasCustomTitle && country) {
            setCustomTitle(`${year} Public Holidays - ${country.name}`);
        }
    }, [country, year, hasCustomTitle]);

    // Reset notes default text when language changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (!hasCustomNotes) {
            setNotes(t('calendar.notes.default'));
        }
    }, [i18n.language, hasCustomNotes, t]);

    // Auto-update default template color on change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (!hasCustomColor) {
            switch (template) {
                case 'colorful': setThemeColor('#0ea5e9'); break;
                case 'corporate': setThemeColor('#0f172a'); break;
                case 'dark': setThemeColor('#10b981'); break;
                case 'elegant': setThemeColor('#78350f'); break;
                case 'kids': setThemeColor('#f59e0b'); break;
                case 'floral': setThemeColor('#ec4899'); break;
                default: setThemeColor('#475569'); break;
            }
        }
        if (template === 'compact') {
            setViewMode('year');
        }
    }, [template, hasCustomColor]);

    const showToast = useCallback((msg) => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message: msg }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const getMonthDays = useCallback((yr, mo) => {
        const firstDayOffset = (new Date(yr, mo, 1).getDay() - weekStart + 7) % 7;
        const totalDays = new Date(yr, mo + 1, 0).getDate();
        
        const days = [];
        const prevMonthTotalDays = new Date(yr, mo, 0).getDate();
        
        for (let i = firstDayOffset - 1; i >= 0; i--) {
            days.push({
                date: new Date(yr, mo - 1, prevMonthTotalDays - i),
                isCurrentMonth: false,
            });
        }
        
        for (let i = 1; i <= totalDays; i++) {
            days.push({
                date: new Date(yr, mo, i),
                isCurrentMonth: true,
            });
        }
        
        const totalGridSlots = days.length > 35 ? 42 : 35;
        const remaining = totalGridSlots - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({
                date: new Date(yr, mo + 1, i),
                isCurrentMonth: false,
            });
        }
        
        return days;
    }, [weekStart]);

    const getHolidaysForDate = useCallback((dateObj) => {
        if (!holidays) return [];
        const dateStr = getLocalDateString(dateObj);
        return holidays.filter(h => getHolidayDateString(h.date) === dateStr);
    }, [holidays]);

    const getPersonalEventsForDate = useCallback((dateObj) => {
        const dateStr = getLocalDateString(dateObj);
        return personalEvents.filter(e => e.date === dateStr);
    }, [personalEvents]);

    const nextHolidayDetails = useMemo(() => {
        if (!holidays || holidays.length === 0) return null;
        const todayMs = new Date().setHours(0, 0, 0, 0);
        const upcoming = holidays
            .map(h => ({ ...h, parsedDate: getLocalMidnightDate(h.date) }))
            .filter(h => h.parsedDate.getTime() >= todayMs)
            .sort((a, b) => a.parsedDate - b.parsedDate);
        
        const target = upcoming.length > 0 ? upcoming[0] : holidays[0];
        const targetMidnight = getLocalMidnightDate(target.date);
        const diffTime = targetMidnight.getTime() - todayMs;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
            holiday: target,
            daysRemaining: diffDays > 0 ? diffDays : 0
        };
    }, [holidays]);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoImage(event.target.result);
                showToast("Logo uploaded successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddPersonalEvent = (e) => {
        e.preventDefault();
        if (!eventDate || !eventName.trim()) return;
        const newEvent = {
            id: Date.now().toString(),
            date: eventDate,
            name: eventName.trim()
        };
        setPersonalEvents([...personalEvents, newEvent]);
        setEventName('');
        showToast("Personal event added!");

        const eventYear = eventDate.split('-')[0];
        if (eventYear !== year) {
            showToast(`Note: Event year is ${eventYear}, calendar year is ${year}.`);
        }
    };

    const handleEditPersonalEvent = (id, newName) => {
        setPersonalEvents(personalEvents.map(e => e.id === id ? { ...e, name: newName } : e));
        showToast("Personal event updated!");
    };

    const handleDeletePersonalEvent = (id) => {
        setPersonalEvents(personalEvents.filter(e => e.id !== id));
        showToast("Event removed.");
    };

    const handleReset = () => {
        setTemplate('minimal');
        setOrientation('landscape');
        setPaperSize('A4');
        setViewMode('month');
        setCurrentMonth(new Date().getMonth());
        setFontFamily('sans');
        setThemeColor('#475569');
        setHasCustomColor(false);
        setCustomTitle('');
        setHasCustomTitle(false);
        setNotes(t('calendar.notes.default'));
        setHasCustomNotes(false);
        setLogoImage(null);
        setShowWeekends(true);
        setShowDescriptions(true);
        setWeekStart(0);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShareLink = async () => {
        const currentUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(currentUrl);
            showToast("Custom Calendar Link copied!");
        } catch (err) {
            console.error("Failed to copy", err);
            showToast("Please copy link from browser search bar manually.");
        }
    };

    const value = {
        selectedCountryCode, setSelectedCountryCode,
        year, setYear,
        template, setTemplate,
        orientation, setOrientation,
        viewMode, setViewMode,
        currentMonth, setCurrentMonth,
        paperSize, setPaperSize,
        themeColor, setThemeColor,
        hasCustomColor, setHasCustomColor,
        fontFamily, setFontFamily,
        customTitle, setCustomTitle,
        hasCustomTitle, setHasCustomTitle,
        notes, setNotes,
        hasCustomNotes, setHasCustomNotes,
        logoImage, setLogoImage,
        showWeekends, setShowWeekends,
        showDescriptions, setShowDescriptions,
        weekStart, setWeekStart,
        isMobileOpen, setIsMobileOpen,
        personalEvents, setPersonalEvents,
        eventDate, setEventDate,
        eventName, setEventName,
        exportingType, setExportingType,
        exporting,
        toasts, setToasts,
        countries, countriesLoading,
        holidays, holidaysLoading,
        country,
        getMonthDays,
        getHolidaysForDate,
        getPersonalEventsForDate,
        nextHolidayDetails,
        handleLogoUpload,
        handleAddPersonalEvent,
        handleEditPersonalEvent,
        handleDeletePersonalEvent,
        handleReset,
        handlePrint,
        handleShareLink,
        showToast
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalendar() {
    return useContext(CalendarContext);
}
