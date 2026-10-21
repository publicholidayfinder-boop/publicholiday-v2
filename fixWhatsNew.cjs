const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

const targetStr = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">`;
const replaceStr = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">`;

content = content.replace(targetStr, replaceStr);

const appendCardTarget = `Easily toggle between monthly and yearly views, now with perfect 1-page printing.
                                </p>
                            </div>`;
const appendCardReplace = `Easily toggle between monthly and yearly views, now with perfect 1-page printing.
                                </p>
                            </div>
                            <Link to="/compare" className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-300 hover:shadow-md hover:border-emerald-500 transition-all group block">
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform origin-left">⚖️</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-emerald-700 transition-colors">Compare Countries</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    View two countries side-by-side. Perfect for remote teams coordinating across borders.
                                </p>
                            </Link>`;

content = content.replace(appendCardTarget, appendCardReplace);

// Also update max-w-5xl to max-w-7xl so 5 cards fit
const maxWTarget = `<div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-emerald-600`;
const maxWReplace = `<div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-emerald-600`;
content = content.replace(maxWTarget, maxWReplace);


fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
console.log('Added Compare card to HomePage.');
