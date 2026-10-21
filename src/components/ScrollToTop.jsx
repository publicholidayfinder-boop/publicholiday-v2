import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Use setTimeout to ensure scroll happens after the new page content renders
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 0);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
