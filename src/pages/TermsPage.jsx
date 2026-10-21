import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

const Section = ({ title, children }) => (
    <div className="glass-card p-8 mb-6">
        <h2 className="text-xl font-display font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
        <div className="text-slate-700 leading-relaxed space-y-3">{children}</div>
    </div>
);

export default function TermsPage() {
    return (
        <>
            <SEO
                title="Terms of Service — PublicHolidayFinder"
                description="Read the Terms of Service for PublicHolidayFinder. Understand the rules, rights, and responsibilities when using our public holiday database, calendar generator, and related tools."
                keywords="terms of service, terms and conditions, terms of use, publicholidayfinder"
                canonical="https://publicholidayfinder.com/terms"
            />

            <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-slate-400 text-sm mb-2">Legal</p>
                        <h1 className="text-4xl font-display font-bold mb-3">Terms of Service</h1>
                        <p className="text-slate-300 text-sm">Effective Date: <strong className="text-white">September 1, 2026</strong> &nbsp;·&nbsp; Last Updated: <strong className="text-white">September 3, 2026</strong></p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">

                    <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg mb-8">
                        <p className="text-amber-900 text-sm">By accessing or using <strong>PublicHolidayFinder</strong> (publicholidayfinder.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
                    </div>

                    <Section title="1. About Our Service">
                        <p>PublicHolidayFinder is a free, independent informational website providing public holiday data, a printable calendar generator, a working days calculator, local time information, and holiday search tools covering 199+ countries and territories worldwide.</p>
                        <p>Our services are provided free of charge and do not require account registration.</p>
                    </Section>

                    <Section title="2. Permitted Use">
                        <p>You may use PublicHolidayFinder for personal, educational, and general informational purposes including:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2">
                            <li>Looking up public holiday dates for any supported country</li>
                            <li>Generating and downloading printable calendars (PDF, PNG, ICS) for personal or professional use</li>
                            <li>Using the working days calculator and local time tools for planning purposes</li>
                            <li>Sharing links to pages on PublicHolidayFinder</li>
                        </ul>
                    </Section>

                    <Section title="3. Prohibited Use">
                        <p>You must not:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2">
                            <li>Systematically scrape, crawl, or mirror our website content without express written permission</li>
                            <li>Use automated bots or scripts to extract data in bulk from our services</li>
                            <li>Republish or redistribute our holiday data commercially without a license</li>
                            <li>Attempt to disrupt, overload, or interfere with the availability of our website</li>
                            <li>Use our services in any way that violates applicable laws or regulations</li>
                            <li>Present our data as an official or government-authorized source</li>
                        </ul>
                    </Section>

                    <Section title="4. Intellectual Property">
                        <p>The website design, layout, code, logo, and written content are the intellectual property of PublicHolidayFinder. Holiday names and dates are derived from publicly available information and open-source libraries.</p>
                        <p>Calendars generated using our Calendar Studio may be downloaded, printed, and shared freely. You retain full ownership of any personal logos or events you input — we do not store this data on our servers.</p>
                    </Section>

                    <Section title="5. Disclaimer of Warranties">
                        <p>PublicHolidayFinder is provided on an <strong>"as is" and "as available"</strong> basis. We make no warranties regarding the completeness or accuracy of holiday dates, especially for lunar/religious holidays which may shift by 1–2 days. Always verify important dates with official government sources before making critical decisions.</p>
                    </Section>

                    <Section title="6. Limitation of Liability">
                        <p>To the fullest extent permitted by law, PublicHolidayFinder shall not be liable for any direct, indirect, incidental, or consequential damages arising from reliance on our holiday data, working day counts, timezone information, or decisions made based on our information.</p>
                    </Section>

                    <Section title="7. Third-Party Links">
                        <p>Our website may contain links to external websites. We have no control over the content, availability, or privacy practices of those sites. Inclusion of any external link does not imply endorsement by PublicHolidayFinder.</p>
                    </Section>

                    <Section title="8. Changes to These Terms">
                        <p>We may revise these Terms of Service at any time. Updated terms will be published on this page with a new effective date. Your continued use of the website after any changes constitutes acceptance of the revised terms.</p>
                    </Section>

                    <Section title="9. Contact Us">
                        <p>If you have any questions about these Terms of Service, please reach out through our <Link to="/contact" onClick={scrollTop} className="text-emerald-700 hover:text-emerald-800 underline font-semibold">Contact Page</Link>.</p>
                    </Section>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Link to="/privacy" onClick={scrollTop} className="btn btn-secondary text-sm px-6 py-2.5">Privacy Policy</Link>
                        <Link to="/disclaimer" onClick={scrollTop} className="btn btn-secondary text-sm px-6 py-2.5">Disclaimer</Link>
                        <Link to="/contact" onClick={scrollTop} className="btn btn-primary text-sm px-6 py-2.5">Contact Us</Link>
                    </div>

                </div>
            </div>
        </>
    );
}
