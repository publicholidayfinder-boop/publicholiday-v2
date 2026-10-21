import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

const Section = ({ title, children }) => (
    <div className="glass-card p-8 mb-6">
        <h2 className="text-xl font-display font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
        <div className="text-slate-700 leading-relaxed space-y-3">{children}</div>
    </div>
);

export default function DisclaimerPage() {
    return (
        <>
            <SEO
                title="Disclaimer — PublicHolidayFinder"
                description="Read the full disclaimer for PublicHolidayFinder. Understand the limitations of our public holiday data covering 211+ countries, regional variations, and the importance of verifying dates with official sources."
                keywords="disclaimer, legal notice, public holiday disclaimer, publicholidayfinder"
                canonical="https://publicholidayfinder.com/disclaimer"
            />

            <section className="bg-gradient-to-br from-amber-800 to-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-amber-300 text-sm mb-2">Legal</p>
                        <h1 className="text-4xl font-display font-bold mb-3">Disclaimer</h1>
                        <p className="text-slate-300 text-sm">Last Updated: <strong className="text-white">September 3, 2026</strong></p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg mb-8">
                        <p className="text-amber-900 font-semibold text-sm">Please read this disclaimer carefully before using or relying on any information from PublicHolidayFinder.</p>
                    </div>

                    <Section title="1. General Information Only">
                        <p>All content on PublicHolidayFinder — including holiday dates, descriptions, working day calculations, timezone information, and calendar tools — is provided for <strong>general informational and planning purposes only</strong>.</p>
                        <p>Nothing on this website constitutes legal, financial, employment, or professional advice.</p>
                    </Section>

                    <Section title="2. Not an Official Source">
                        <p>PublicHolidayFinder is an independent, privately operated website. It is:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2">
                            <li><strong>NOT</strong> affiliated with any government, ministry, or official authority</li>
                            <li><strong>NOT</strong> an authorized publisher of official public holiday declarations</li>
                            <li><strong>NOT</strong> responsible for changes to public holiday schedules made by governments</li>
                            <li><strong>NOT</strong> endorsed by any national holiday commission or employer body</li>
                        </ul>
                    </Section>

                    <Section title="3. Accuracy of Holiday Data">
                        <p>We cover public holiday data for <strong>211+ countries and territories</strong> spanning 2021 to 2029. Holiday information may be incorrect or outdated due to:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2">
                            <li>Last-minute government announcements or proclamations</li>
                            <li>Lunar and religious calendar variations (Islamic, Hebrew, Buddhist, Hindu) that can shift by 1–2 days depending on moon sighting</li>
                            <li>Regional or state-level differences not captured in national-level data</li>
                            <li>Special one-time holidays or emergency cancellations declared with little notice</li>
                            <li>Differences between observed and actual holiday dates</li>
                        </ul>
                        <p className="font-semibold text-slate-800 bg-amber-50 p-3 rounded-lg mt-3">Always confirm critical dates with your country's official government website or relevant public authority.</p>
                    </Section>

                    <Section title="4. Working Days Calculator">
                        <p>The Working Days Calculator provides estimates based on our holiday database. Results may not account for company-specific holidays, regional public holidays within a country, or be accurate for legal, payroll, or contractual deadline calculations. For official business day calculations, consult your legal or HR professional.</p>
                    </Section>

                    <Section title="5. Local Time and Timezone Information">
                        <p>Timezone data and DST rules are sourced from the IANA timezone database. However, governments occasionally change timezone rules with short notice. For time-critical activities (flights, financial transactions, international meetings), always verify with an authoritative time source.</p>
                    </Section>

                    <Section title="6. Regional Variations">
                        <p>Our data primarily reflects <strong>national public holidays</strong>. We do not guarantee coverage of state/provincial holidays, sector-specific holidays, school holidays, or local municipal observances.</p>
                    </Section>

                    <Section title="7. Limitation of Liability">
                        <p>To the fullest extent permitted by applicable law, PublicHolidayFinder shall not be held liable for any direct, indirect, incidental, or consequential damages arising from reliance on holiday dates, working day counts, or timezone data from this website. Your use of PublicHolidayFinder is entirely at your own risk.</p>
                    </Section>

                    <Section title="8. Recommended Verification Sources">
                        <p>For authoritative holiday information, please consult:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2">
                            <li>Your country's official government portal or ministry of labor/employment</li>
                            <li>National holiday gazette or public sector calendars</li>
                            <li>Your employer's HR or legal department</li>
                            <li>Local government offices or embassies for country-specific queries</li>
                        </ul>
                    </Section>

                    <Section title="9. Changes to This Disclaimer">
                        <p>We reserve the right to modify this disclaimer at any time. Changes take effect immediately upon posting to this page. Your continued use of PublicHolidayFinder constitutes acceptance of the revised disclaimer.</p>
                    </Section>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Link to="/terms" onClick={scrollTop} className="btn btn-secondary text-sm px-6 py-2.5">Terms of Service</Link>
                        <Link to="/privacy" onClick={scrollTop} className="btn btn-secondary text-sm px-6 py-2.5">Privacy Policy</Link>
                        <Link to="/contact" onClick={scrollTop} className="btn btn-primary text-sm px-6 py-2.5">Contact Us</Link>
                    </div>

                </div>
            </div>
        </>
    );
}