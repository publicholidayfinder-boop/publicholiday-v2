# PublicHolidayFinder

A legally compliant, content-first public holiday reference website built with React, Vite, Tailwind CSS, and Cloud Firestore.

## 🎯 Project Goals

- **Content-First**: Human-written holiday descriptions, not API-generated
- **Legally Compliant**: No claims of being "official" or government-affiliated
- **Monetization-Safe**: Built to support future advertising without legal issues
- **Offline-Capable**: Works without external APIs using local JSON fallback

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS 3
- **Database**: Cloud Firestore (Firebase)
- **Routing**: React Router DOM 7
- **SEO**: React Helmet Async

## 📦 Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Cloud Firestore
3. Copy `.env.example` to `.env`
4. Add your Firebase configuration to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📊 Data Structure

### Firestore Collections

**countries** collection:
```javascript
{
  id: "GH", // Document ID = country code
  name: "Ghana",
  description: "Human-written overview...",
  createdAt: Timestamp
}
```

**holidays** collection:
```javascript
{
  id: "auto-generated",
  countryCode: "GH",
  slug: "independence-day",
  name: "Independence Day",
  date: Timestamp,
  year: 2026,
  type: "National", // or "Religious", "Observance"
  isPublicHoliday: true,
  description: "Human-written description...",
  observanceRules: "Optional rules...",
  createdAt: Timestamp
}
```

### Local JSON Fallback

Holiday data is also stored in `src/data/holidays.json` as a fallback when Firestore is unavailable.

## 🌍 Covered Countries

- 🇬🇭 Ghana
- 🇳🇬 Nigeria
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇩🇪 Germany
- 🇫🇷 France
- 🇯🇵 Japan
- 🇮🇳 India
- 🇦🇺 Australia

## ✅ Compliance Features

- ✓ No external API calls on public routes
- ✓ All content is human-written and original
- ✓ Clear disclaimers about not being an official source
- ✓ Privacy Policy and Disclaimer pages included
- ✓ Works offline with local JSON data
- ✓ SEO-optimized with unique meta tags per page

## 📄 Pages

- **Home** (`/`) - Country selector and site introduction
- **Country** (`/country/:code`) - Holiday list for specific country
- **About** (`/about`) - Mission and disclaimers
- **Privacy** (`/privacy`) - Privacy policy
- **Disclaimer** (`/disclaimer`) - Legal disclaimers

## 🎨 Design Features

- Modern gradient backgrounds
- Glass-morphism effects
- Smooth animations and transitions
- Fully responsive design
- Premium typography (Inter + Outfit fonts)

## 📝 Content Guidelines

All holiday descriptions must be:
1. Written by humans, not copied from APIs
2. Original and unique
3. Factual and informative
4. Free from copyright issues

## ⚠️ Important Notes

- This site is NOT affiliated with any government
- Always verify dates with official sources for critical planning
- Holiday data covers 2026-2027 only
- Regional variations may not be included

## 🚧 Future Enhancements

- Add more countries
- Implement holiday detail pages
- Add search functionality
- Support for multiple languages
- Calendar export (iCal format)

## 📜 License

All content is original and proprietary. Not for redistribution.

## 🤝 Contributing

This is a private project. Data contributions should be human-written and verified.
