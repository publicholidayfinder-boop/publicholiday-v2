const fs = require('fs');

// Map of mojibake sequences -> correct UTF-8 characters
const fixes = [
    // Emojis
    ["\u00f0\u009f\u0094\u008b", "\uD83D\uDCCB"], // ðŸ"‹ -> 📋
    ["\u00f0\u009f\u008c\u008d", "\uD83C\uDF0D"], // ðŸŒ -> 🌍
    ["\u00f0\u009f\u0094\u0085", "\uD83D\uDCC5"], // ðŸ"… -> 📅
    ["\u00f0\u009f\u008e\u00a8", "\uD83C\uDFA8"], // ðŸŽ¨ -> 🎨
    ["\u00e2\u009a\u0099\u00ef\u00b8\u008f", "\u2699\uFE0F"], // âš™ï¸ -> ⚙️
    ["\u00f0\u009f\u0094\u00a5", "\uD83D\uDCE5"], // ðŸ"¥ -> 📥
    ["\u00e2\u009c\u0095", "\u2715"], // âœ• -> ✕
    ["\u00f0\u009f\u0096\u00a8\u00ef\u00b8\u008f", "\uD83D\uDDA8\uFE0F"], // ðŸ–¨ï¸ -> 🖨️
    ["\u00f0\u009f\u0094\u0097", "\uD83D\uDD17"], // ðŸ"— -> 🔗
    ["\u00f0\u009f\u0097\u0094\u00ef\u00b8\u008f", "\uD83D\uDDD3\uFE0F"], // ðŸ—"ï¸ -> 🗓️
    ["\u00e2\u009c\u0085", "\u2705"], // âœ… -> ✅
    ["\u00e2\u008c\u009b", "\u231B"], // âŒ› -> ⌛
    ["\u00f0\u009f\u0094\u0084", "\uD83D\uDCC4"], // ðŸ"„ -> 📄
    ["\u00f0\u009f\u0096\u00bc\u00ef\u00b8\u008f", "\uD83D\uDDBC\uFE0F"], // ðŸ–¼ï¸ -> 🖼️
    ["\u00f0\u009f\u0092\u00a1", "\uD83D\uDCA1"], // ðŸ'¡ -> 💡
    // Dashes and punctuation  
    ["\u00e2\u0080\u0094", "\u2014"], // â€" -> —
    ["\u00e2\u0080\u0093", "\u2013"], // â€" -> –
    ["\u00e2\u0080\u009c", "\u201C"], // â€œ -> "
    ["\u00e2\u0080\u009d", "\u201D"], // â€ -> "
];

const filesToFix = [
    'src/pages/CalendarGeneratorPage.jsx',
    'src/components/calendar/CalendarSidebar.jsx',
    'src/components/calendar/CalendarActionBar.jsx',
    'src/components/calendar/CalendarWorkspace.jsx',
    'src/components/calendar/CalendarMonthGrid.jsx',
    'src/components/calendar/CalendarYearGrid.jsx',
    'src/components/calendar/CalendarErrorBoundary.jsx',
    'src/context/CalendarContext.jsx',
];

for (const filePath of filesToFix) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    for (const [bad, good] of fixes) {
        if (content.includes(bad)) {
            content = content.split(bad).join(good);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed: ' + filePath);
    } else {
        console.log('Clean: ' + filePath);
    }
}
