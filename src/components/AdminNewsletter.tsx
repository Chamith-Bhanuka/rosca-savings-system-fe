import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import axios from 'axios';
import { Mail, Send, FileText, AlertTriangle } from 'lucide-react';

const AdminNewsletter: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Newsletter Broadcaster - Seettuwa';
  }, [theme]);

  const handleBroadcast = async () => {
    if (!subject.trim() || !content.trim()) {
      alert('Please fill in both subject and content fields.');
      return;
    }

    if (!window.confirm('Are you sure? This will email ALL subscribers.'))
      return;

    setSending(true);
    try {
      const token = localStorage.getItem('accessToken');

      // Simple HTML wrap for professional look
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; background-color: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #d4a574, #b8894d); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Seettuwa Update</h1>
            </div>
            <div style="padding: 30px;">
              <div style="font-size: 16px; color: #333; line-height: 1.6;">${content}</div>
            </div>
            <div style="background-color: #f5f5f5; padding: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="font-size: 12px; color: #999; margin: 0;">You received this because you subscribed to Seettuwa.</p>
            </div>
          </div>
        </div>
      `;

      const res = await axios.post(
        'http://localhost:5000/api/v1/support/broadcast',
        { subject, content: htmlContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setSubject('');
      setContent('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Broadcast failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Mail
                className={`w-8 h-8 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
              />
              <h1
                className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold ${
                  isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                }`}
              >
                Newsletter Broadcaster
              </h1>
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Send announcements and updates to all subscribers
            </p>
          </div>

          {/* Warning Banner */}
          <div
            className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
              isDark
                ? 'bg-yellow-500/10 border border-yellow-500/30'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isDark ? 'text-yellow-400' : 'text-yellow-600'
              }`}
            />
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}
              >
                Broadcast Notice
              </p>
              <p
                className={`text-sm ${isDark ? 'text-yellow-300/80' : 'text-yellow-700'}`}
              >
                This will send an email to ALL subscribers. Please review your
                content carefully before sending.
              </p>
            </div>
          </div>

          {/* Main Form */}
          <div
            className={`rounded-2xl shadow-lg p-6 sm:p-8 ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="space-y-6">
              {/* Subject Field */}
              <div>
                <label
                  className={`flex items-center gap-2 text-sm font-bold mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Email Subject
                </label>
                <input
                  type="text"
                  className={`w-full p-3 rounded-lg border outline-none transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                  }`}
                  placeholder="e.g. Monthly Savings Tips"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Content Field */}
              <div>
                <label
                  className={`flex items-center gap-2 text-sm font-bold mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email Content
                </label>
                <textarea
                  rows={12}
                  className={`w-full p-3 rounded-lg border outline-none transition-all font-mono text-sm ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                  }`}
                  placeholder="<p>Hello Subscribers,</p>
<p>We're excited to share...</p>
<p>Best regards,<br>The Seettuwa Team</p>"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p
                  className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                >
                  You can type plain text or use HTML tags for formatting. The
                  content will be wrapped in a professional email template.
                </p>
              </div>

              {/* Preview Section */}
              {content && (
                <div>
                  <label
                    className={`text-sm font-bold mb-2 block ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Preview
                  </label>
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? 'bg-white/5 border-white/10'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div
                      className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleBroadcast}
                disabled={sending || !subject.trim() || !content.trim()}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                }`}
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Broadcast...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send to All Subscribers
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminNewsletter;
