import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getLocalDateString, getHolidayDateString } from './calendarConstants';


// Hide elements that should not appear in exports (html2canvas ignores @media print)
const hideExportElements = (container) => {
    const hidden = [];
    // Hide any element with a class that includes 'print:hidden'
    container.querySelectorAll('[class*="print:hidden"]').forEach(el => {
        hidden.push({ el, display: el.style.display });
        el.style.display = 'none';
    });
    return hidden;
};

const restoreExportElements = (hidden) => {
    hidden.forEach(({ el, display }) => {
        el.style.display = display;
    });
};

export const handleExportPDF = async ({ calendarRef, orientation, paperSize, template, selectedCountryCode, year, setExportingType, showToast }) => {
    if (!calendarRef.current) return;
    setExportingType('pdf');
    const hidden = hideExportElements(calendarRef.current);
    try {
        if (typeof document !== 'undefined' && document.fonts) {
            await document.fonts.ready;
        }
        const exportWidth = calendarRef.current.offsetWidth || 1123;
        const exportHeight = calendarRef.current.offsetHeight || 794;
        const canvas = await html2canvas(calendarRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: template === 'dark' ? '#0f172a' : '#ffffff',
            windowWidth: exportWidth,
            windowHeight: exportHeight,
            onclone: (clonedDoc) => {
                const clonedCalendar = clonedDoc.getElementById('printable-calendar');
                if (clonedCalendar) {
                    clonedCalendar.style.transform = 'none';
                    let parent = clonedCalendar.parentElement;
                    while (parent) {
                        if (parent.style) {
                            parent.style.transform = 'none';
                        }
                        parent = parent.parentElement;
                    }
                }
            }
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdfOrientation = orientation === 'landscape' ? 'l' : 'p';
        const pdfSize = paperSize === 'Letter' ? 'letter' : 'a4';
        const pdf = new jsPDF(pdfOrientation, 'mm', pdfSize);
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${selectedCountryCode}_${year}_Calendar.pdf`);
        showToast("PDF Calendar exported!");
    } catch (err) {
        console.error(err);
        showToast("Failed to generate PDF.");
    } finally {
        restoreExportElements(hidden);
        setExportingType(null);
    }
};

export const handleExportPNG = async ({ calendarRef, template, selectedCountryCode, year, setExportingType, showToast }) => {
    if (!calendarRef.current) return;
    setExportingType('png');
    const hidden = hideExportElements(calendarRef.current);
    try {
        if (typeof document !== 'undefined' && document.fonts) {
            await document.fonts.ready;
        }
        const exportWidth = calendarRef.current.offsetWidth || 1123;
        const exportHeight = calendarRef.current.offsetHeight || 794;
        const canvas = await html2canvas(calendarRef.current, {
            scale: 2.5,
            useCORS: true,
            logging: false,
            backgroundColor: template === 'dark' ? '#0f172a' : '#ffffff',
            windowWidth: exportWidth,
            windowHeight: exportHeight,
            onclone: (clonedDoc) => {
                const clonedCalendar = clonedDoc.getElementById('printable-calendar');
                if (clonedCalendar) {
                    clonedCalendar.style.transform = 'none';
                    let parent = clonedCalendar.parentElement;
                    while (parent) {
                        if (parent.style) {
                            parent.style.transform = 'none';
                        }
                        parent = parent.parentElement;
                    }
                }
            }
        });
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedCountryCode}_${year}_Calendar.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("PNG Image downloaded!");
    } catch (err) {
        console.error(err);
        showToast("Failed to generate PNG.");
    } finally {
        restoreExportElements(hidden);
        setExportingType(null);
    }
};

export const handleExportICS = ({ holidays, personalEvents, year, selectedCountryCode, showToast, exportScope = 'all', currentMonth }) => {
    let filteredHolidays = Array.isArray(holidays) ? holidays : [];
    let filteredPersonalEvents = Array.isArray(personalEvents) ? personalEvents : [];

    if (exportScope === 'month' && typeof currentMonth === 'number') {
        filteredHolidays = filteredHolidays.filter(h => {
            const dateStr = getHolidayDateString(h.date);
            if (!dateStr) return false;
            const [yr, mo, dy] = dateStr.split('-').map(Number);
            return (mo - 1) === currentMonth;
        });

        filteredPersonalEvents = filteredPersonalEvents.filter(e => {
            const dateStr = getHolidayDateString(e.date);
            if (!dateStr) return false;
            const [yr, mo, dy] = dateStr.split('-').map(Number);
            return (mo - 1) === currentMonth;
        });
    }

    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//PublicHolidayFinder//NONSGML Holiday Calendar//EN\r\n";
    
    filteredHolidays.forEach((h, index) => {
        const dateStr = getHolidayDateString(h.date);
        if (!dateStr) return;
        const yyyymmdd = dateStr.replace(/-/g, '');
        const [yr, mo, dy] = dateStr.split('-').map(Number);
        const nextDate = new Date(yr, mo - 1, dy + 1);
        const yyyymmddNext = getLocalDateString(nextDate).replace(/-/g, '');

        icsContent += "BEGIN:VEVENT\r\n";
        icsContent += `UID:publicholiday-${h.id || index}-${year}@publicholidayfinder.com\r\n`;
        icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
        icsContent += `DTSTART;VALUE=DATE:${yyyymmdd}\r\n`;
        icsContent += `DTEND;VALUE=DATE:${yyyymmddNext}\r\n`;
        icsContent += `SUMMARY:${h.name}\r\n`;
        const safeDesc = (h.description || 'Official Public Holiday').replace(/\r?\n/g, '\\n');
        icsContent += `DESCRIPTION:${safeDesc}\r\n`;
        icsContent += "END:VEVENT\r\n";
    });

    filteredPersonalEvents.forEach((e) => {
        const dateStr = getHolidayDateString(e.date);
        if (!dateStr) return;
        const yyyymmdd = dateStr.replace(/-/g, '');
        const [yr, mo, dy] = dateStr.split('-').map(Number);
        const nextDate = new Date(yr, mo - 1, dy + 1);
        const yyyymmddNext = getLocalDateString(nextDate).replace(/-/g, '');

        icsContent += "BEGIN:VEVENT\r\n";
        icsContent += `UID:personal-${e.id}@publicholidayfinder.com\r\n`;
        icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
        icsContent += `DTSTART;VALUE=DATE:${yyyymmdd}\r\n`;
        icsContent += `DTEND;VALUE=DATE:${yyyymmddNext}\r\n`;
        icsContent += `SUMMARY:${e.name}\r\n`;
        icsContent += "DESCRIPTION:Personal Custom Event\r\n";
        icsContent += "END:VEVENT\r\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedCountryCode}_${year}_Holidays.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("ICS File downloaded!");
};
