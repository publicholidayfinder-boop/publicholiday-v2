const fs = require('fs');
const lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');

lines[428] = '                        <div className=\"relative w-full max-w-md\">';
lines[429] = '                            <span className=\"absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none\">🔍</span>';
lines[430] = '                            <input';
lines[431] = '                                id=\"country-search\"';
lines[432] = '                                type=\"text\"';
lines[433] = '                                value={countrySearch}';
lines[434] = '                                onChange={(e) => setCountrySearch(e.target.value)}';
lines[435] = '                                placeholder=\"Search countries...\"';
lines[436] = '                                className=\"w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-sm bg-slate-50 focus:bg-white\"';
lines[437] = '                            />';
lines[438] = '                            {countrySearch && (';
lines[439] = '                                <button';
lines[440] = '                                    onClick={() => setCountrySearch(\'\')}';
lines[441] = '                                    className=\"absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-xs\"';
lines[442] = '                                    aria-label=\"Clear search\"';
lines[443] = '                                >';
lines[444] = '                                    ❌';
lines[445] = '                                </button>';
lines[446] = '                            )}';

fs.writeFileSync('src/pages/HomePage.jsx', lines.join('\n'), 'utf-8');
