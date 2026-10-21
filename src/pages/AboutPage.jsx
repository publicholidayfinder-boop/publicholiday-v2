import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

const stats = [
    { value: '211+', label: 'Countries & Territories', icon: '🌍' },
    { value: '2021–2029', label: 'Holiday Data Coverage', icon: '📅' },
    { value: '100%', label: 'Free — No Account Needed', icon: '🔓' },
    { value: '4', label: 'Powerful Free Tools', icon: '⚙️' },
];

const tools = [
    {
        icon: '📅',
        title: 'Printable Calendar Studio',
        desc: 'Generate beautiful monthly or full-year calendars for any country. Choose from multiple templates, orientations, and color themes. Export as PDF, PNG, or ICS.',
        link: '/calendar-generator',
    },
    {
        icon: '💼',
        title: 'Working Days Calculator',
        desc: 'Calculate the exact number of business days, weekends, and public holidays between any two dates for any supported country.',
        link: '/working-days/GH',
    },
    {
        icon: '⏱️',
        title: 'Live Local Time',
        desc: 'Check the current local time, UTC offset, daylight saving time rules, and upcoming holiday countdowns for any country.',
        link: '/time/GH',
    },
    {
        icon: '🔍',
        title: 'Holiday Search',
        desc: 'Search for holidays by name, month, or date across all 211 countries at once. Find out what the world is celebrating today.',
        link: '/search',
    },
];

const regions = [
    { name: 'Africa', count: '54', icon: '🌍', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Americas', count: '54', icon: '🌎', color: 'bg-amber-100 text-amber-800' },
    { name: 'Asia', count: '45+', icon: '🌏', color: 'bg-violet-100 text-violet-800' },
    { name: 'Europe', count: '40+', icon: '🏰', color: 'bg-blue-100 text-blue-800' },
    { name: 'Oceania', count: '14', icon: '🏝️', color: 'bg-teal-100 text-teal-800' },
];

export default function AboutPage() {
    return (
        <>
            <SEO
                title="About PublicHolidayFinder — 211 Countries, Free Holiday Tools"
                description="PublicHolidayFinder covers public holidays for 211 countries and territories worldwide. Explore our free calendar generator, working days calculator, and live time tools."
                keywords="about public holiday finder, holiday reference, global holiday data, free calendar generator, working days calculator"
                canonical="https://publicholidayfinder.com/about"
            />

            {/* Hero Banner */}
            <section className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-1.5 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
                        🌍 About Us
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4 leading-tight">
                        Your Global Holiday<br />Reference, Free Forever
                    </h1>
                    <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto leading-relaxed">
                        PublicHolidayFinder gives you accurate public holiday dates, printable calendars, business day calculators, and live time tools for <strong className="text-white">211 countries and territories</strong> — completely free, no account required.
                    </p>
                </div>
            </section>

            {/* Stats Row */}
            <section className="bg-white border-b border-slate-100 py-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {stats.map((s) => (
                            <div key={s.label} className="text-center">
                                <div className="text-3xl mb-1">{s.icon}</div>
                                <div className="text-2xl md:text-3xl font-display font-extrabold text-slate-900">{s.value}</div>
                                <div className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-14">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Mission */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            PublicHolidayFinder was built with one goal: make it effortless to find, plan around, and print public holiday information for any country in the world. Whether you're planning international travel, managing a remote team across time zones, scheduling payroll around bank holidays, or simply printing a wall calendar for your family — we have you covered.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            We believe essential planning tools should be free, fast, and frustration-free. No paywalls, no sign-ups, no pop-ups — just the information you need, exactly when you need it.
                        </p>
                    </div>

                    {/* What Makes Us Different */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">What Makes Us Different</h2>
                        <ul className="space-y-4">
                            {[
                                { icon: '🌐', title: 'Truly Global Coverage', desc: '211 countries and territories across Africa, the Americas, Asia, Europe, and Oceania — including many smaller nations and island territories often overlooked by other holiday sites.' },
                                { icon: '📆', title: 'Multi-Year Data (2021–2029)', desc: 'Our holiday database spans from 2021 through 2029, so you can look back at past holidays or plan years into the future.' },
                                { icon: '🖨️', title: 'Professional Print Studio', desc: 'Generate and print beautiful calendars in multiple styles, orientations, and languages. Export to PDF, PNG, or ICS calendar format.' },
                                { icon: '⚡', title: 'Blazing Fast & Reliable', desc: 'Holiday data is stored locally — no external API calls mean instant load times and full reliability even on slow connections.' },
                                { icon: '🔓', title: 'Always Free', desc: 'Every feature — calendar generator, working days calculator, time tools, and more — is completely free with no account required.' },
                                { icon: '🇬🇧', title: 'English Holiday Names', desc: 'All holiday names are displayed in English across all countries, making it easy for international teams and travelers to understand at a glance.' },
                            ].map((item) => (
                                <li key={item.title} className="flex items-start gap-4">
                                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                                    <div>
                                        <strong className="text-slate-800">{item.title}:</strong>{' '}
                                        <span className="text-slate-600">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Tools */}
                    <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Our Free Tools</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {tools.map((tool) => (
                                <Link
                                    key={tool.title}
                                    to={tool.link}
                                    onClick={scrollTop}
                                    className="glass-card p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                                >
                                    <div className="text-3xl mb-3">{tool.icon}</div>
                                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{tool.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{tool.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Coverage by Region */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Global Coverage by Region</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            We cover sovereign nations, territories, and dependencies across every continent. Holiday data runs from 2021 to 2029 and is updated regularly.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {regions.map((r) => (
                                <Link
                                    key={r.name}
                                    to={`/?region=${r.name}#countries-section`}
                                    className={`${r.color} rounded-xl p-4 text-center hover:opacity-80 transition-opacity`}
                                >
                                    <div className="text-2xl mb-1">{r.icon}</div>
                                    <div className="font-bold text-sm">{r.name}</div>
                                    <div className="text-xs opacity-75 mt-0.5">{r.count} countries</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimers */}
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-5">Important Disclaimers</h2>
                        <div className="space-y-4">
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                                <p className="text-sm text-amber-900">
                                    <strong>Not an Official Source:</strong> PublicHolidayFinder is an independent informational website and is not affiliated with any government agency or official holiday authority.
                                </p>
                            </div>
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Verification Recommended:</strong> While we strive for accuracy, holiday dates and observances can change. Always verify critical dates with official government sources for important planning decisions.
                                </p>
                            </div>
                            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
                                <p className="text-sm text-emerald-900">
                                    <strong>Lunar & Religious Holidays:</strong> Some holidays based on the Islamic, Hebrew, or other lunar calendars may vary by one to two days from predicted dates depending on moon sighting in each country.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center py-6">
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">Ready to explore?</h2>
                        <p className="text-slate-500 mb-6">Find holidays for your country or generate a printable calendar in seconds.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link to="/" onClick={scrollTop} className="btn btn-primary px-8 py-3 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                🌍 Browse All Countries
                            </Link>
                            <Link to="/calendar-generator" onClick={scrollTop} className="btn btn-secondary px-8 py-3 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                📅 Open Calendar Studio
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}