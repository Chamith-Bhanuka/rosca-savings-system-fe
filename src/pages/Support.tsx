import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import {
  MessageCircle,
  Send,
  Mail,
  Phone,
  HelpCircle,
  Bell,
  CheckCircle,
} from 'lucide-react';
import {
  contactAdmin,
  subscribeNewsletter,
} from '../services/support.service.ts';

const Support: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [subEmail, setSubEmail] = useState('');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Support - Seettuwa';
  }, [theme]);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await contactAdmin(formData);
      console.info(response.message);
      alert('Message sent! Check your inbox for confirmation.');
      setFormData({ email: '', subject: '', message: '' });
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subEmail) return;
    try {
      const response = await subscribeNewsletter(subEmail);
      console.info(response.message);
      alert('Subscribed successfully!');
      setSubEmail('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to subscribe');
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle
                className={`w-10 h-10 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
              />
              <h1
                className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold ${
                  isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                }`}
              >
                How can we help?
              </h1>
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Our support team is just a message away
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Contact Form */}
            <div
              className={`lg:col-span-2 rounded-2xl shadow-lg p-6 sm:p-8 ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle
                  className={`w-6 h-6 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                />
                <h2
                  className={`text-xl font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                >
                  Send us a Message
                </h2>
              </div>

              <form onSubmit={handleContact} className="space-y-6">
                <div>
                  <label
                    className={`flex items-center gap-2 text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    className={`w-full p-3 rounded-lg border outline-none transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                    }`}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Subject
                  </label>
                  <select
                    className={`w-full p-3 rounded-lg border outline-none transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white focus:border-[#d4a574] focus:bg-white/10 [&>option]:bg-[#1a110d] [&>option]:text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#b8894d] focus:bg-white [&>option]:bg-white [&>option]:text-gray-900'
                    }`}
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Topic...</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Account Access">Account Access</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className={`w-full p-3 rounded-lg border outline-none transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                    }`}
                    placeholder="Please describe your issue or question..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT: Newsletter & Info */}
            <div className="space-y-6">
              {/* Info Box */}
              <div
                className={`rounded-2xl shadow-lg p-6 ${
                  isDark
                    ? 'bg-[#d4a574]/10 border border-[#d4a574]/30'
                    : 'bg-[#b8894d]/10 border border-[#b8894d]/30'
                }`}
              >
                <h3
                  className={`font-bold text-lg mb-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                >
                  Direct Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Email
                      </p>
                      <p
                        className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        support@seettuwa.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Phone
                      </p>
                      <p
                        className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        +94 77 123 4567
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Box */}
              <div
                className={`rounded-2xl shadow-lg p-8 text-center relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-[#1a110d] to-[#2a1a0d] border border-[#d4a574]/30'
                    : 'bg-gradient-to-br from-[#b8894d] to-[#8b6635] border border-[#8b6635]'
                }`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Bell className="w-20 h-20 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Bell
                      className={`w-6 h-6 ${isDark ? 'text-[#d4a574]' : 'text-white'}`}
                    />
                    <h3
                      className={`font-bold text-xl ${isDark ? 'text-[#d4a574]' : 'text-white'}`}
                    >
                      Stay Updated
                    </h3>
                  </div>
                  <p
                    className={`text-sm mb-5 ${isDark ? 'text-gray-400' : 'text-white/80'}`}
                  >
                    Get the latest platform news and savings tips
                  </p>

                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={`w-full p-3 rounded-lg mb-3 text-sm outline-none transition-all ${
                      isDark
                        ? 'bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-[#d4a574]'
                        : 'bg-white/90 border border-white text-gray-900 placeholder:text-gray-500 focus:bg-white'
                    }`}
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={!subEmail}
                    className={`w-full py-3 font-bold text-sm rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      isDark
                        ? 'bg-[#d4a574] text-black hover:bg-[#c39464]'
                        : 'bg-white text-[#b8894d] hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
