import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import axios from 'axios';

const Support: React.FC = () => {
  // Contact Form State
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // Newsletter State
  const [subEmail, setSubEmail] = useState('');

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/v1/support/contact',
        formData
      );
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
      await axios.post('http://localhost:5000/api/v1/support/subscribe', {
        email: subEmail,
      });
      alert('Subscribed successfully!');
      setSubEmail('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to subscribe');
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <Navbar />

      <main className="pt-[100px] px-4 lg:px-[20%] pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-['Playfair_Display'] text-gray-900 mb-4">
            How can we help?
          </h1>
          <p className="text-gray-500">
            Our support team is just a message away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* LEFT: Contact Form */}
          <div className="md:col-span-2 bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleContact} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-3 border rounded-lg focus:border-[#d4a574] outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:border-[#d4a574] outline-none"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                >
                  <option value="">Select Topic...</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Account Access">Account Access</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full p-3 border rounded-lg focus:border-[#d4a574] outline-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-[#d4a574] transition"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* RIGHT: Newsletter & Info */}
          <div className="space-y-8">
            {/* Info Box */}
            <div className="bg-[#d4a574]/10 p-6 rounded-xl border border-[#d4a574]/30">
              <h3 className="font-bold text-[#d4a574] mb-2">Direct Contact</h3>
              <p className="text-sm text-gray-600 mb-1">
                Email: support@seettuwa.com
              </p>
              <p className="text-sm text-gray-600">Phone: +94 77 123 4567</p>
            </div>

            {/* Newsletter Box */}
            <div className="bg-black text-white p-8 rounded-xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">
                📩
              </div>
              <h3 className="font-bold text-xl mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest platform news and savings tips.
              </p>

              <input
                type="email"
                placeholder="Enter email address"
                className="w-full p-2 rounded mb-3 text-black text-sm"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
              />
              <button
                onClick={handleSubscribe}
                className="w-full py-2 bg-[#d4a574] text-black font-bold text-sm rounded hover:bg-white transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
