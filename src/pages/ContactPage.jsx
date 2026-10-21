import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';

export default function ContactPage() {
    const [searchParams] = useSearchParams();
    const initialSubject = searchParams.get('subject') || 'General Inquiry';
    const initialCountry = searchParams.get('country') || '';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: initialSubject,
        message: initialCountry ? `Country: ${initialCountry}\n\n` : ''
    });

    const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'activation_pending' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (searchParams.get('subject')) {
            setFormData(prev => ({ ...prev, subject: searchParams.get('subject') }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('https://formsubmit.co/ajax/0ae8163424eff91da7d338c8d9f8ab96', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: formData.subject,
                    message: formData.message.trim(),
                    _subject: `[PublicHolidayFinder] ${formData.subject} from ${formData.name.trim()}`,
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            const data = await response.json();

            if (response.ok && (data.success === 'true' || data.success === true)) {
                setStatus('success');
            } else if (data.message && data.message.toLowerCase().includes('activation')) {
                setStatus('activation_pending');
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'Unable to send message at this moment.');
            }
        } catch (err) {
            console.error('Contact form submission error:', err);
            setStatus('error');
            setErrorMessage('Unable to connect to the mail server. Please use the email button below to contact us directly.');
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            subject: 'General Inquiry',
            message: ''
        });
        setStatus('idle');
        setErrorMessage('');
    };

    const mailtoLink = `mailto:support@publicholidayfinder.com?subject=${encodeURIComponent(`[PublicHolidayFinder] ${formData.subject}`)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;

    return (
        <>
            <SEO
                title="Contact Us"
                description="Get in touch with the PublicHolidayFinder team for support, feedback, or business inquiries."
                keywords="contact public holiday finder, support, feedback"
            />

            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">
                            Contact Us
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Have a question, feedback, or need to report an issue with our holiday data? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="md:col-span-2 glass-card p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a message</h2>
                            
                            {status === 'success' && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-8 text-center animate-fade-in">
                                    <div className="text-5xl mb-3">✉️</div>
                                    <h3 className="font-bold text-2xl text-emerald-900 mb-2">Message Received!</h3>
                                    <p className="text-emerald-700 max-w-md mx-auto mb-6">
                                        Thank you for reaching out. Your message has been received and our support team will get back to you shortly.
                                    </p>
                                    <button 
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                                    >
                                        <span>✍️</span> Send another message
                                    </button>
                                </div>
                            )}

                            {status === 'activation_pending' && (
                                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-8 text-center animate-fade-in">
                                    <div className="text-5xl mb-3">📬</div>
                                    <h3 className="font-bold text-2xl text-amber-950 mb-2">Form Activation Required</h3>
                                    <p className="text-amber-800 max-w-md mx-auto mb-4">
                                        A one-time activation email has been sent to our support inbox.
                                    </p>
                                    <p className="text-xs text-amber-700 max-w-md mx-auto mb-6">
                                        Please log into your Zoho Mail inbox and click the <strong>"Activate Form"</strong> button. Once clicked, this and all future messages will arrive directly in your inbox.
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        <a
                                            href={mailtoLink}
                                            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                                        >
                                            Send via Mail Client Instead
                                        </a>
                                        <button 
                                            onClick={handleReset}
                                            className="text-sm font-semibold text-amber-800 hover:text-amber-900 px-4 py-2.5"
                                        >
                                            Back to Form
                                        </button>
                                    </div>
                                </div>
                            )}

                            {status !== 'success' && status !== 'activation_pending' && (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {status === 'error' && (
                                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                                            <div>
                                                <span className="font-bold">⚠️ Submission failed: </span>
                                                <span>{errorMessage}</span>
                                            </div>
                                            <a 
                                                href={mailtoLink}
                                                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap self-start sm:self-auto transition-colors"
                                            >
                                                <span>✉️</span> Email directly
                                            </a>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                value={formData.name}
                                                onChange={handleChange}
                                                required 
                                                disabled={status === 'submitting'}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none disabled:bg-slate-100"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                required 
                                                disabled={status === 'submitting'}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none disabled:bg-slate-100"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                                        <select 
                                            id="subject" 
                                            value={formData.subject}
                                            onChange={handleChange}
                                            disabled={status === 'submitting'}
                                            className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none bg-white disabled:bg-slate-100"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Data Correction (Missing/Incorrect Holiday)</option>
                                            <option>Feedback & Suggestions</option>
                                            <option>Business/Partnership</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                                        <textarea 
                                            id="message" 
                                            rows="5" 
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            disabled={status === 'submitting'}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-y disabled:bg-slate-100"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={status === 'submitting'}
                                        className="btn btn-primary w-full md:w-auto px-8 py-3 disabled:opacity-70 flex items-center justify-center gap-2 font-semibold shadow-md active:scale-95 transition-all"
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Sending Message...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info Sidebar */}
                        <div className="space-y-6">
                            <div className="glass-card p-6">
                                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    ✉️ Get in Touch
                                </h3>
                                <p className="text-slate-600 text-sm mb-4">
                                    Fill out the form and we'll get back to you as soon as possible.
                                </p>
                                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs font-semibold">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v1H5a1 1 0 00-1 1v6a1 1 0 001 1h14a1 1 0 001-1v-6a1 1 0 00-1-1h-1v-1c0-1.657-1.343-3-3-3s-3 1.343-3 3v1H9v-1zm3 0v1H9v-1c0-1.657 1.343-3 3-3s3 1.343 3 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2" /></svg>
                                    Your message is sent securely
                                </div>
                            </div>

                            <div className="glass-card p-6 bg-gradient-to-br from-primary-50 to-white">
                                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    🛠️ Data Corrections
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    If you noticed an incorrect or missing holiday, please select "Data Correction" in the form. Include the country name and a link to an official government source if possible.
                                </p>
                            </div>
                            
                            <div className="glass-card p-6">
                                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    🕒 Response Time
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    We aim to respond to all inquiries within 24-48 hours during regular business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
