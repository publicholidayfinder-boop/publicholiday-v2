const fs = require('fs');
let content = fs.readFileSync('src/pages/CalendarGeneratorPage.jsx', 'utf8');

const oldArray = `{[
                                { step: '1', icon: '🎨', title: 'Template',  desc: 'Choose a design style',       color: 'from-pink-600 to-rose-500' },
                                { step: '2', icon: '⚙️', title: 'Config',    desc: 'Select country & year',       color: 'from-blue-600 to-sky-500' },
                                { step: '3', icon: '🖌️', title: 'Style',     desc: 'Customize colors & fonts',    color: 'from-amber-500 to-orange-500' },
                                { step: '4', icon: '📅', title: 'Events',    desc: 'Manage holidays & events',    color: 'from-violet-600 to-purple-500' },
                                { step: '5', icon: '📥', title: 'Export',    desc: 'PDF, PNG, ICS or Print',      color: 'from-emerald-600 to-teal-500' },
                            ]`;

const newArray = `{[
                                { step: '1', icon: '⚙️', title: 'Config',    desc: 'Select country & year',       color: 'from-blue-600 to-sky-500' },
                                { step: '2', icon: '🎨', title: 'Template',  desc: 'Choose a design style',       color: 'from-pink-600 to-rose-500' },
                                { step: '3', icon: '🖌️', title: 'Style',     desc: 'Customize colors & fonts',    color: 'from-amber-500 to-orange-500' },
                                { step: '4', icon: '📅', title: 'Events',    desc: 'Manage holidays & events',    color: 'from-violet-600 to-purple-500' },
                                { step: '5', icon: '📥', title: 'Export',    desc: 'PDF, PNG, ICS or Print',      color: 'from-emerald-600 to-teal-500' },
                            ]`;

content = content.replace(oldArray, newArray);
fs.writeFileSync('src/pages/CalendarGeneratorPage.jsx', content);
