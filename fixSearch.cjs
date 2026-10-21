const fs = require('fs');
let lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');

// Lines 0-129 are good (up to and including "if (match) {")
// Lines 130+ start with the closing divs which are wrong - we need to insert the missing button body first
const before = lines.slice(0, 130); // includes "if (match) {"
const after = lines.slice(130);     // starts with "</div>" (closing of search pill div)

const missing = [
    '                                        navigate(`/country/${match.id}/${selectedYear}`);',
    '                                    } else {',
    '                                        const el = document.getElementById(\'countries-section\');',
    '                                        if (el) el.scrollIntoView({ behavior: \'smooth\' });',
    '                                    }',
    '                                }}',
    '                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-sm transition-all shadow-md active:scale-95 flex-shrink-0"',
    '                            >',
    '                                Search',
    '                            </button>',
    '                        </div>',
    '                    </div>',
    '                </div>',
    '            </section>',
];

const fixed = [...before, ...missing, ...after];
fs.writeFileSync('src/pages/HomePage.jsx', fixed.join('\n'), 'utf-8');
console.log('Fixed! Total lines:', fixed.length);
