import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Navbar from '../../components/NavBar';
import MegaMenu from '../../components/MegaMenu';
import Footer from '../../components/Footer';
import { FileText, Clock } from 'lucide-react';

interface StaticPageProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const StaticPage: React.FC<StaticPageProps> = ({
  title,
  lastUpdated,
  children,
}) => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = `${title} - Seettuwa`;
  }, [theme, title]);

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <style>{`
        /* Custom prose styles for dark mode */
        .prose-themed h2 {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.75rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: ${isDark ? '#d4a574' : '#b8894d'};
        }
        
        .prose-themed h3 {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: 1.375rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: ${isDark ? '#c39464' : '#a67a42'};
        }
        
        .prose-themed h4 {
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: ${isDark ? '#f2f0ea' : '#1f2937'};
        }
        
        .prose-themed p {
          line-height: 1.75;
          margin-bottom: 1rem;
          color: ${isDark ? '#d1d5db' : '#4b5563'};
        }
        
        .prose-themed ul, .prose-themed ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        
        .prose-themed li {
          margin-bottom: 0.5rem;
          color: ${isDark ? '#d1d5db' : '#4b5563'};
        }
        
        .prose-themed strong {
          font-weight: 600;
          color: ${isDark ? '#f2f0ea' : '#1f2937'};
        }
        
        .prose-themed a {
          color: ${isDark ? '#d4a574' : '#b8894d'};
          text-decoration: underline;
          font-weight: 500;
        }
        
        .prose-themed a:hover {
          color: ${isDark ? '#c39464' : '#a67a42'};
        }
        
        .prose-themed blockquote {
          border-left: 4px solid ${isDark ? '#d4a574' : '#b8894d'};
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: ${isDark ? '#9ca3af' : '#6b7280'};
        }
        
        .prose-themed code {
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'Courier New', monospace;
          color: ${isDark ? '#d4a574' : '#b8894d'};
        }
        
        .prose-themed hr {
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          margin: 2rem 0;
        }
      `}</style>

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText
                  className={`w-8 h-8 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                />
                <h1
                  className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold ${
                    isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                  }`}
                >
                  {title}
                </h1>
              </div>

              {lastUpdated && (
                <div
                  className={`flex items-center gap-2 text-sm pb-4 border-b ${
                    isDark
                      ? 'text-gray-500 border-white/10'
                      : 'text-gray-500 border-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Last Updated: {lastUpdated}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose-themed max-w-none">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaticPage;
