const fs = require('fs');

// 1. Fix CalendarGeneratorPage.jsx (Toast checkmark and Dismiss X)
let genContent = fs.readFileSync('src/pages/CalendarGeneratorPage.jsx', 'utf-8');

// Replace Dismiss text X
genContent = genContent.replace(
    '✕ Dismiss',
    '<svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>Dismiss'
);

// Replace Toast ✅
genContent = genContent.replace(
    '<span>✅</span>',
    '<svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>'
);

fs.writeFileSync('src/pages/CalendarGeneratorPage.jsx', genContent, 'utf-8');


// 2. Fix CalendarSidebar.jsx (Reset confirm/cancel icons, Event delete icon)
let sideContent = fs.readFileSync('src/components/calendar/CalendarSidebar.jsx', 'utf-8');

// Replace Reset confirm ✓
sideContent = sideContent.replace(
    '>\n                                        ✓\n                                    </button>',
    '>\n                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>\n                                    </button>'
);

// Replace Reset cancel ✕
sideContent = sideContent.replace(
    '>\n                                        ✕\n                                    </button>',
    '>\n                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>\n                                    </button>'
);

// Replace Mobile close ✕
sideContent = sideContent.replace(
    'aria-label="Close customizer"\n                            >\n                                ✕\n                            </button>',
    'aria-label="Close customizer"\n                            >\n                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>\n                            </button>'
);

// Replace Logo remove ✕
sideContent = sideContent.replace(
    'leading-none"\n                                    >\n                                        ✕\n                                    </button>',
    'leading-none"\n                                    >\n                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>\n                                    </button>'
);

fs.writeFileSync('src/components/calendar/CalendarSidebar.jsx', sideContent, 'utf-8');

console.log('Replaced text symbols with SVGs.');
