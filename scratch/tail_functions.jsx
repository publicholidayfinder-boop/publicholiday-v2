
function MobileNeighboringCountries({ currentCountryCode, year }) {
    const neighbors = {
        'US': [{ id: 'CA', name: 'Canada', flag: '🇨🇦' }],
        'GB': [{ id: 'FR', name: 'France', flag: '🇫🇷' }, { id: 'DE', name: 'Germany', flag: '🇩🇪' }],
        'NG': [{ id: 'GH', name: 'Ghana', flag: '🇬🇭' }, { id: 'ZA', name: 'South Africa', flag: '🇿🇦' }],
        'GH': [{ id: 'NG', name: 'Nigeria', flag: '🇳🇬' }, { id: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { id: 'KE', name: 'Kenya', flag: '🇰🇪' }, { id: 'TG', name: 'Togo', flag: '🇹🇬' }, { id: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' }]
    };

    const currentNeighbors = neighbors[currentCountryCode] || [
        { id: 'NG', name: 'Nigeria', flag: '🇳🇬' },
        { id: 'GH', name: 'Ghana', flag: '🇬🇭' },
        { id: 'ZA', name: 'South Africa', flag: '🇿🇦' },
        { id: 'KE', name: 'Kenya', flag: '🇰🇪' }
    ].filter(c => c.id !== currentCountryCode).slice(0, 3);

    if (currentNeighbors.length === 0) return null;

    return (
        <div className="flex flex-col gap-3">
            {currentNeighbors.map((country) => (
                <Link
                    key={country.id}
                    to={`/country/${country.id}/${year}`}
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <FlagImage countryCode={country.id} size="md" />
                        <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 truncate">
                                {country.name}
                            </div>
                            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                                Public Holidays {year}
                            </div>
                        </div>
                    </div>
                    <div className="text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </Link>
            ))}
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const questionStr = (question && typeof question === 'object') ? (question.en || '') : (question || '');
    const answerStr = (answer && typeof answer === 'object') ? (answer.en || '') : (answer || '');

    return (
        <li className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
            >
                <h4 className="font-bold text-slate-900 pr-8">{questionStr}</h4>
                <div className={`flex-shrink-0 ml-4 p-1 rounded-full bg-primary-50 text-primary-600 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 pt-0 text-slate-600 border-t border-slate-50">
                    {answerStr}
                </div>
            </div>
        </li>
    );
}
