import { useEffect, Suspense } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './router';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MysticBackground from './components/MysticBackground';
import SeoManager from './components/SeoManager';
import NewsletterPopup from './components/feature/NewsletterPopup';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin" aria-hidden="true" />
    </div>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <ScrollToTop />
          <SeoManager />
          <MysticBackground />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 relative z-10 pt-9">
              <Suspense fallback={<PageLoader />}>
                <AppRoutes />
              </Suspense>
            </main>
            <Footer />
          </div>
          <NewsletterPopup />
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;