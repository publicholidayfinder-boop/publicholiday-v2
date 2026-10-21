const fs = require('fs');
let lines = fs.readFileSync('src/components/calendar/CalendarSidebar.jsx', 'utf-8').split('\n');

let out = [];
let i = 0;
while (i < lines.length) {
    let line = lines[i];

    if (line.includes('const [openSections, setOpenSections] = useState({')) {
        // Skip the state and toggle
        while (!lines[i].includes('const toggleSection')) {
            i++;
        }
        while (!lines[i].includes('};') && !lines[i].includes('}));')) {
            i++;
        }
        i++; // skip toggle definition end
        out.push('    const [currentStep, setCurrentStep] = useState(1);');
        i++;
        continue;
    }

    if (line.includes('<SidebarSection')) {
        // We found a SidebarSection open tag.
        // We need to extract the id, title, icon.
        let idStr = '';
        let titleStr = '';
        let iconStr = '';
        
        let j = i;
        while (!lines[j].includes('>')) {
            if (lines[j].includes('id=')) idStr = lines[j].match(/id="([^"]+)"/)[1];
            if (lines[j].includes('title=')) titleStr = lines[j].match(/title="([^"]+)"/)[1];
            if (lines[j].includes('icon=')) iconStr = lines[j].match(/icon="([^"]+)"/)[1];
            j++;
        }
        
        // map id to step number
        let stepNum = 1;
        if (idStr === 'configuration') stepNum = 2;
        if (idStr === 'aesthetics') stepNum = 3;
        if (idStr === 'events') stepNum = 4;

        out.push(`                {currentStep === ${stepNum} && (`);
        out.push(`                    <div className="p-6 flex-1 flex flex-col">`);
        out.push(`                        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-700">`);
        out.push(`                            <span className="text-lg leading-none">${iconStr}</span>`);
        out.push(`                            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">${titleStr}</h3>`);
        out.push(`                            <span className="ml-auto text-[10px] text-slate-500 font-bold bg-slate-800 px-2 py-1 rounded-full">STEP ${stepNum} OF 4</span>`);
        out.push(`                        </div>`);
        out.push(`                        <div className="flex-1 space-y-6">`); // body wrapper
        
        i = j + 1; // skip the '>'
        continue;
    }

    if (line.includes('</SidebarSection>')) {
        out.push(`                        </div>`); // close body wrapper
        out.push(`                    </div>`); // close p-6 container
        out.push(`                )}`); // close currentStep condition
        i++;
        continue;
    }

    // Insert the sticky footer before the final closing </aside>
    if (line.includes('</aside>')) {
        out.push(`                {/* ── Wizard Footer (Back / Next) ── */}`);
        out.push(`                <div className="p-4 border-t border-slate-700 bg-slate-800/90 sticky bottom-0 z-20 flex justify-between gap-3 mt-auto">`);
        out.push(`                    <button`);
        out.push(`                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}`);
        out.push(`                        disabled={currentStep === 1}`);
        out.push(`                        className={\`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 \${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}\`}`);
        out.push(`                    >`);
        out.push(`                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>`);
        out.push(`                        Back`);
        out.push(`                    </button>`);
        out.push(`                    <button`);
        out.push(`                        onClick={() => {`);
        out.push(`                            if (currentStep < 4) setCurrentStep(prev => prev + 1);`);
        out.push(`                            else setIsMobileOpen(false);`);
        out.push(`                        }}`);
        out.push(`                        className="flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white shadow-lg active:scale-95"`);
        out.push(`                    >`);
        out.push(`                        {currentStep === 4 ? 'Finish' : 'Next'}`);
        out.push(`                        {currentStep < 4 && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>}`);
        out.push(`                    </button>`);
        out.push(`                </div>`);
        out.push(line); // </aside>
        i++;
        continue;
    }

    out.push(line);
    i++;
}

fs.writeFileSync('src/components/calendar/CalendarSidebar.jsx', out.join('\n'), 'utf-8');
console.log('Wizard conversion complete!');
