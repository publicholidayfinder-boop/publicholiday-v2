import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

export default function Footer() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer className="bg-[#064e3b] text-emerald-100/80 mt-16 border-t border-emerald-800/40 print:hidden">
            <div className="container mx-auto px-4 py-12">
                {/* 5-Column Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
                    {/* Brand Section */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1">
                        <Link to="/" onClick={scrollTop} className="flex items-center gap-2 mb-3 group">
                            <img
                                src="/images/logo.png"
                                alt="PublicHolidayFinder"
                                className="h-8 w-auto object-contain group-hover:opacity-90 transition-opacity"
                            />
                        </Link>
                        <p className="text-emerald-100/60 text-xs leading-relaxed mb-5 max-w-[200px]">
                            Your trusted source for public holiday information, calendars and dates around the world.
                        </p>
                        <div className="flex items-center gap-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                                className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors text-xs font-bold">
                                f
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                                className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors text-xs font-bold">
                                𝕏
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                                className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors text-xs">
                                ◎
                            </a>
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Explore</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><a href="/#countries-section" className="hover:text-white transition-colors">Countries</a></li>
                            <li><Link to="/search" onClick={scrollTop} className="hover:text-white transition-colors">Holidays by Month</Link></li>
                            <li><Link to="/calendar-generator?year=2026" onClick={scrollTop} className="hover:text-white transition-colors">Calendar 2026</Link></li>
                            <li><Link to="/calendar-generator?year=2027" onClick={scrollTop} className="hover:text-white transition-colors">Calendar 2027</Link></li>
                            <li><Link to="/search" onClick={scrollTop} className="hover:text-white transition-colors">Upcoming Holidays</Link></li>
                        </ul>
                    </div>

                    {/* Tools Links */}
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Tools</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link to="/calendar-generator" onClick={scrollTop} className="hover:text-white transition-colors">Printable Calendar</Link></li>
                            <li><Link to="/calendar-generator" onClick={scrollTop} className="hover:text-white transition-colors">ICS Calendar Export</Link></li>
                            <li><Link to="/compare" onClick={scrollTop} className="hover:text-white transition-colors">Holiday Countdown</Link></li>
                            <li><Link to="/search" onClick={scrollTop} className="hover:text-white transition-colors">Is Today a Holiday?</Link></li>
                            <li><Link to="/about" onClick={scrollTop} className="hover:text-white transition-colors">Sitemap</Link></li>
                        </ul>
                    </div>

                    {/* About Links */}
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">About</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link to="/about" onClick={scrollTop} className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" onClick={scrollTop} className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/privacy" onClick={scrollTop} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" onClick={scrollTop} className="hover:text-white transition-colors">Terms of Use</Link></li>
                            <li><Link to="/disclaimer" onClick={scrollTop} className="hover:text-white transition-colors">Disclaimer</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Newsletter</h4>
                        <p className="text-emerald-100/60 text-xs leading-relaxed mb-3">
                            Get updates about holidays and important dates.
                        </p>
                        {subscribed ? (
                            <div className="bg-emerald-800/80 border border-emerald-600/60 rounded-lg p-3 text-emerald-200 text-xs font-semibold">
                                ✓ Thanks for subscribing!
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    required
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 text-xs outline-none focus:ring-2 focus:ring-emerald-400 w-full"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors shadow-sm"
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="border-t border-emerald-800/60 pt-6 flex items-center justify-center text-xs text-emerald-200/50">
                    <p>© {new Date().getFullYear()} PublicHolidayFinder.com — All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
