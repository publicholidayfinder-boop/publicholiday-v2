const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarActionBar.jsx', 'utf-8');

content = content.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';"
);

const hookCode = `
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                handlePrint();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                handleExportPDF();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrint, handleExportPDF]);
`;

content = content.replace(
  "const [exportScope, setExportScope] = useState('all');",
  "const [exportScope, setExportScope] = useState('all');\n" + hookCode
);

content = content.replace(
  "{exportingType === 'pdf' ? '⌛ Generating...' : '📄 PDF'}",
  "{exportingType === 'pdf' ? '⌛ Generating...' : <span className=\"flex items-center\">📄 PDF <span className=\"opacity-60 text-[9px] font-normal ml-1.5 bg-black/10 px-1 rounded hidden lg:block\">Ctrl+E</span></span>}"
);

content = content.replace(
  "🖨️ Print",
  "<span className=\"flex items-center\">🖨️ Print <span className=\"opacity-50 text-[9px] font-normal ml-1.5 border border-slate-700 px-1 rounded hidden lg:block\">Ctrl+P</span></span>"
);

fs.writeFileSync('src/components/calendar/CalendarActionBar.jsx', content, 'utf-8');
console.log('Added keyboard shortcuts and hints');
