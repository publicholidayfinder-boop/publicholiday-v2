import React from 'react';

/* ─────────────────────────────────────────────
   Reusable accordion section wrapper
───────────────────────────────────────────── */
export default function SidebarSection({ id, title, icon, badge, isOpen, onToggle, children }) {
    return (
        <div className="border-b border-slate-700">
            {/* Section header / toggle button */}
            <button
                id={`sidebar-section-${id}`}
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`sidebar-section-body-${id}`}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/40 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
            >
                <div className="flex items-center gap-2.5">
                    {icon && <span className="text-base leading-none">{icon}</span>}
                    <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider group-hover:text-white transition-colors">
                        {title}
                    </span>
                    {badge != null && (
                        <span className="text-[10px] bg-primary-900 text-primary-300 px-2 py-0.5 rounded-full font-bold leading-none">
                            {badge}
                        </span>
                    )}
                </div>
                {/* Chevron */}
                <svg
                    className={`w-4 h-4 text-slate-400 group-hover:text-slate-200 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Collapsible body — CSS grid trick for smooth height animation */}
            <div
                id={`sidebar-section-body-${id}`}
                role="region"
                aria-labelledby={`sidebar-section-${id}`}
                className="overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2 space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
