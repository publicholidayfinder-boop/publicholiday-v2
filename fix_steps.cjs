const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarSidebar.jsx', 'utf8');

content = content.replace(
    /\{currentStep === 1 && \(\s+<SidebarSection\s+id="template"/,
    '{currentStep === 2 && (\n                <SidebarSection\n                    id="template"'
);

content = content.replace(
    /\{currentStep === 2 && \(\s+<SidebarSection\s+id="configuration"/,
    '{currentStep === 1 && (\n                <SidebarSection\n                    id="configuration"'
);

content = content.replace(
    /\{ step: 1, label: 'Template' \},\s+\{ step: 2, label: 'Config' \},/,
    "{ step: 1, label: 'Config' },\n                        { step: 2, label: 'Template' },"
);

fs.writeFileSync('src/components/calendar/CalendarSidebar.jsx', content);
