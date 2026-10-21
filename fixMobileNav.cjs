const fs = require('fs');
let content = fs.readFileSync('src/components/Header.jsx', 'utf-8');

const mobileNavPoint = `<NavLink 
                            to="/calendar-generator" 
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.calendarGenerator', 'Calendar')}
                        </NavLink>`;
const mobileNavReplace = `<NavLink 
                            to="/calendar-generator" 
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.calendarGenerator', 'Calendar')}
                        </NavLink>
                        <NavLink 
                            to="/compare" 
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.compare', 'Compare')}
                        </NavLink>`;
content = content.replace(mobileNavPoint, mobileNavReplace);
fs.writeFileSync('src/components/Header.jsx', content, 'utf-8');
console.log('Fixed mobile nav.');
