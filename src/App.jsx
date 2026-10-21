import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import NextHolidayBanner from './components/NextHolidayBanner';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CountryPage';
import CalendarGeneratorPage from './pages/CalendarGeneratorPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import DisclaimerPage from './pages/DisclaimerPage';
import ComparePage from './pages/ComparePage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import SearchPage from './pages/SearchPage';
import WorkingDaysPage from './pages/WorkingDaysPage';
import TimePage from './pages/TimePage';
import YearPlannerPage from './pages/YearPlannerPage';
import TodayPage from './pages/TodayPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <NextHolidayBanner />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/country/:countryCode/:year?" element={<CountryPage />} />
              <Route path="/calendar-generator" element={<CalendarGeneratorPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/working-days/:countryCode" element={<WorkingDaysPage />} />
              <Route path="/time/:countryCode" element={<TimePage />} />
              <Route path="/country/:countryCode/:year/planner" element={<YearPlannerPage />} />
              <Route path="/today/:countryCode" element={<TodayPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
