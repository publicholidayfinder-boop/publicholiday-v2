import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://publicholidayfinder.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

// All 8 supported languages with their BCP-47 codes and og:locale equivalents
const SUPPORTED_LANGUAGES = [
    { lang: 'en', locale: 'en_US' },
    { lang: 'es', locale: 'es_ES' },
    { lang: 'fr', locale: 'fr_FR' },
    { lang: 'de', locale: 'de_DE' },
    { lang: 'pt', locale: 'pt_BR' },
    { lang: 'zh', locale: 'zh_CN' },
    { lang: 'ar', locale: 'ar_SA' },
    { lang: 'ja', locale: 'ja_JP' },
];

export default function SEO({
    title = 'PublicHolidayFinder',
    description = 'Find curated public holiday information for selected countries. Plan ahead with our comprehensive holiday reference.',
    keywords = 'public holidays, national holidays, holiday calendar, vacation planning',
    canonical = '',
    ogImage = DEFAULT_OG_IMAGE,
    noIndex = false,
    schema = null,
    currentLang = 'en',
}) {
    const fullTitle = title === 'PublicHolidayFinder' ? title : `${title} | PublicHolidayFinder`;
    const url = canonical || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
    const currentLocale = SUPPORTED_LANGUAGES.find(l => l.lang === currentLang)?.locale || 'en_US';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

            {/* hreflang — signals multilingual support to Google.
                Since language is browser-detected (no URL prefixes), all alternates
                share the same URL. x-default = English fallback. */}
            {SUPPORTED_LANGUAGES.map(({ lang }) => (
                <link key={lang} rel="alternate" hrefLang={lang} href={url} />
            ))}
            <link rel="alternate" hrefLang="x-default" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content={currentLocale} />
            {SUPPORTED_LANGUAGES.filter(l => l.lang !== currentLang).map(({ locale }) => (
                <meta key={locale} property="og:locale:alternate" content={locale} />
            ))}
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:site_name" content="PublicHolidayFinder" />

            {/* Twitter / X */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content={fullTitle} />

            {/* JSON-LD Structured Data — supports single object or array of schemas */}
            {schema && (Array.isArray(schema) ? schema : [schema]).map((s, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
}
