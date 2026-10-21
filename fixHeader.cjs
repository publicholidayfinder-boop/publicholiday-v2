const fs = require('fs');
let content = fs.readFileSync('src/components/Header.jsx', 'utf-8');

// Fix emojis
content = content.replace(/ðŸ“…/g, '📅');
content = content.replace(/ðŸ” /g, '🔍');

// Add Compare to desktop nav
const desktopNavPoint = `<NavLink to="/calendar-generator" className={navClass}>
                            {t('nav.calendarGenerator', 'Calendar')}
                        </NavLink>`;
const desktopNavReplace = `<NavLink to="/calendar-generator" className={navClass}>
                            {t('nav.calendarGenerator', 'Calendar')}
                        </NavLink>
                        <NavLink to="/compare" className={navClass}>
                            {t('nav.compare', 'Compare')}
                        </NavLink>`;
content = content.replace(desktopNavPoint, desktopNavReplace);

// Add Compare to mobile nav
const mobileNavPoint = `<NavLink 
                            to="/calendar-generator"
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.calendarGenerator', 'Calendar Generator')}
                        </NavLink>`;
const mobileNavReplace = `<NavLink 
                            to="/calendar-generator"
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileNavClass}
                        >
                            {t('nav.calendarGenerator', 'Calendar Generator')}
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
console.log('Fixed Header.jsx');
