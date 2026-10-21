const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarSidebar.jsx', 'utf-8');
content = content.replace(`import SidebarSection from './SidebarSection';\n`, '');
fs.writeFileSync('src/components/calendar/CalendarSidebar.jsx', content, 'utf-8');
console.log('Removed SidebarSection import.');
