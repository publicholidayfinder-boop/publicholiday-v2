import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

const Section = ({ title, children }) => (
    <div className="glass-card p-8 mb-6">
        <h2 className="text-xl font-display font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
        <div className="text-slate-700 leading-relaxed space-y-3">{children}</div>
    </div>
);

export default function PrivacyPage() {
    return (
        <>
            <SEO
                title="Privacy Policy — PublicHolidayFinder"
                description="Read the Privacy Policy for PublicHolidayFinder. Learn what data we collect, how we use it, your rights, and how we protect your privacy when using our holiday tools."
                keywords="privacy policy, data protection, GDPR, user privacy, publicholidayfinder"
                canonical="https://publicholidayfinder.com/privacy"
            />

            <section className="bg-gradient-to-br from-blue-900 to-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-blue-300 text-sm mb-2">Legal</p>
                        <h1 className="text-4xl font-display font-bold mb-3">Privacy Policy</h1>
                        <p className="text-slate-300 text-sm">Last Updated: <strong className="text-white">September 3, 2026</strong></p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">

                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-lg mb-8">
                        <p className="text-emerald-900 text-sm font-semibold">Your privacy matters. PublicHolidayFinder does not require account registration, does not sell personal data, and stores most user preferences locally in your browser.</p>
                    </div>

                    <Section title="1. Who We Are">
                        <p>PublicHolidayFinder operates the website at <strong>publicholidayfinder.com</strong>. We provide a free public holiday database, calendar generator, working days calculator, and local time tools covering 199+ countries and territories worldwide.</p>
                        <p>For privacy-related enquiries, please use our <Link to="/contact" onClick={scrollTop} className="text-emerald-700 hover:underline font-semibold">Contact Page</Link>.</p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p><strong>Automatically Collected:</strong> When you visit our website, our hosting provider and analytics service may automatically collect browser type, operating system, anonymized IP address (country-level only), pages visited, and device type.</p>
                        <p><strong>Information You Provide:</strong> We do not require registration. If you contact us or subscribe to our newsletter, we collect only your email address for that specific purpose.</p>
                        <p><strong>Calendar Studio:</strong> Any logos you upload or personal events you add are processed entirely in your browser and are never transmitted to or stored on our servers.</p>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <ul className="list-disc pl-6 space-y-1.5">
                            <li>Operate and improve the website and its tools</li>
                            <li>Understand which countries and features are most used</li>
                            <li>Detect and prevent abuse or technical issues</li>
                            <li>Respond to contact form submissions</li>
                            <li>Send holiday update emails to newsletter subscribers (opt-in only)</li>
                        </ul>
                        <p>We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.</p>
                    </Section>

                    <Section title="4. Cookies and Local Storage">
                        <p>We use browser cookies and local storage to remember your preferences (language, country, year), improve site performance, and collect anonymized analytics. You can manage or disable cookies in your browser settings at any time.</p>
                        <div className="overflow-x-auto mt-3">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="text-left p-3 border border-slate-200 font-semibold">Cookie Type</th>
                                        <th className="text-left p-3 border border-slate-200 font-semibold">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="p-3 border border-slate-200">Essential</td><td className="p-3 border border-slate-200">Required for site preferences and navigation</td></tr>
                                    <tr><td className="p-3 border border-slate-200">Analytics</td><td className="p-3 border border-slate-200">Anonymous usage statistics to improve features</td></tr>
                                    <tr><td className="p-3 border border-slate-200">Performance</td><td className="p-3 border border-slate-200">Caching to speed up page loads</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="5. Third-Party Services">
                        <p>We may use the following third-party services which have their own privacy policies:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2">
                            <li><strong>Google Analytics</strong> — anonymized website traffic analysis</li>
                            <li><strong>Unsplash</strong> — stock photography in hero images (no user data shared)</li>
                            <li><strong>Google Fonts / CDN providers</strong> — font delivery</li>
                        </ul>
                        <p>We do not use advertising networks or behavioral tracking platforms.</p>
                    </Section>

                    <Section title="6. Data Retention">
                        <ul className="list-disc pl-6 space-y-1.5">
                            <li><strong>Analytics data:</strong> Up to 26 months, then automatically deleted</li>
                            <li><strong>Contact form messages:</strong> Up to 12 months after resolution</li>
                            <li><strong>Newsletter emails:</strong> Until you unsubscribe</li>
                            <li><strong>Calendar Studio data:</strong> Never stored — browser session only</li>
                        </ul>
                    </Section>

                    <Section title="7. Your Rights">
                        <p>Depending on your location (EEA, UK, California, etc.), you may have rights to access, correct, delete, restrict, or port your personal data, and to withdraw consent at any time. To exercise any of these rights, please contact us via our <Link to="/contact" onClick={scrollTop} className="text-emerald-700 hover:underline font-semibold">Contact Page</Link>.</p>
                    </Section>

                    <Section title="8. Children's Privacy">
                        <p>PublicHolidayFinder is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us personal data, please contact us and we will promptly delete it.</p>
                    </Section>

                    <Section title="9. Data Security">
                        <p>We implement industry-standard security measures including HTTPS encryption, access controls, and regular security reviews. However, no internet transmission is completely secure, and we cannot guarantee the absolute security of information transmitted to our site.</p>
                    </Section>

                    <Section title="10. Changes to This Policy">
                        <p>We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised date. Your continued use of PublicHolidayFinder after any changes constitutes your acceptance of the updated policy.</p>
                    </Section>

                    <Section title="11. Contact Us">
                        <p>If you have any questions regarding this Privacy Policy or your personal data, please contact us through our <Link to="/contact" onClick={scrollTop} className="text-emerald-700 hover:underline font-semibold">Contact Page</Link>.</p>
                    </Section>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Link to="/terms" onClick={scrollTop} className="btn btn-secondary text-sm px-6 py-2.5">Terms of Service</Link>
                        <Link to="/disclaimer" onClick={scrollTop} className="btn btn-secondary text-sm px-6 py-2.5">Disclaimer</Link>
                        <Link to="/contact" onClick={scrollTop} className="btn btn-primary text-sm px-6 py-2.5">Contact Us</Link>
                    </div>

                </div>
            </div>
        </>
    );
}
