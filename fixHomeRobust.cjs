const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Globe
content = content.replace(/<div className="text-3xl mb-2">.*?<\/div>(\s*<h3 className="font-bold text-slate-800 text-sm mb-1">199 Countries & Territories<\/h3>)/g, '<div className="text-3xl mb-2">🌍</div>$1');

// 2. Briefcase
content = content.replace(/<div className="text-3xl mb-2">.*?<\/div>(\s*<h3 className="font-bold text-slate-800 text-sm mb-1">Working Days Calculator<\/h3>)/g, '<div className="text-3xl mb-2">💼</div>$1');

// 3. Stopwatch
content = content.replace(/<div className="text-3xl mb-2">.*?<\/div>(\s*<h3 className="font-bold text-slate-800 text-sm mb-1">Live Local Time<\/h3>)/g, '<div className="text-3xl mb-2">⏱️</div>$1');

// 4. Printer
content = content.replace(/<div className="text-3xl mb-2">.*?<\/div>(\s*<h3 className="font-bold text-slate-800 text-sm mb-1">Enhanced Print Studio<\/h3>)/g, '<div className="text-3xl mb-2">🖨️</div>$1');

// 5. Empty State Globe
content = content.replace(/<div className="text-5xl mb-4">.*?<\/div>(\s*<p className="text-lg font-semibold">No countries match "{countrySearch}"<\/p>)/g, '<div className="text-5xl mb-4">🌍</div>$1');

// 6. Search Bar Glass
content = content.replace(/<span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">[\s\S]*?<\/span>/g, '<span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">🔍</span>');

// 7. Search Bar Cross
content = content.replace(/aria-label="Clear search">[\s\S]*?<\/button>/g, 'aria-label="Clear search">\n                                    ❌\n                                </button>');

// 8. Free forever text
content = content.replace(/Free forever.*?No account needed/g, 'Free forever — No account needed');

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
console.log('Fixed emojis with regex.');
