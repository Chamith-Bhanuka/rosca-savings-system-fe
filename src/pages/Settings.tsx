import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import { useAuth } from '../context/authContext.tsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Building2,
  CreditCard,
  Camera,
  Save,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bankAccount: '',
    bankName: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Settings - Seettuwa';
  }, [theme]);

  // Load Initial Data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bankAccount: user.bankDetails?.accountNumber || '',
        bankName: user.bankDetails?.bankName || '',
      });
      setPreviewImage(user.profileImage || null);
    }
  }, [user]);

  // Handle Text Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Submit Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const data = new FormData();

      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('phone', formData.phone);

      const bankDetails = {
        accountNumber: formData.bankAccount,
        bankName: formData.bankName,
      };
      data.append('bankDetails', JSON.stringify(bankDetails));

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      await axios.put('http://localhost:5000/api/v1/user/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile Updated Successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete('http://localhost:5000/api/v1/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Delete failed');
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
            <h1
              className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold mb-2 ${
                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
              }`}
            >
              Account Settings
            </h1>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Manage your profile information and preferences
            </p>
          </div>

          {/* Main Settings Card */}
          <div
            className={`rounded-2xl shadow-lg mb-8 ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              {/* Profile Image Section */}
              <div>
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile Photo
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={previewImage || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className={`w-24 h-24 rounded-full object-cover border-2 ${
                        isDark ? 'border-[#d4a574]' : 'border-[#b8894d]'
                      }`}
                    />
                    <label
                      className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all ${
                        isDark
                          ? 'bg-[#d4a574] hover:bg-[#c39464] text-black'
                          : 'bg-[#b8894d] hover:bg-[#a67a42] text-white'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-lg mb-1 ${
                        isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                      }`}
                    >
                      Update Profile Picture
                    </h3>
                    <p
                      className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div
                className={`pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white focus:border-[#d4a574] focus:bg-white/10'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#b8894d] focus:bg-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white focus:border-[#d4a574] focus:bg-white/10'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#b8894d] focus:bg-white'
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white focus:border-[#d4a574] focus:bg-white/10'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#b8894d] focus:bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div
                className={`pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  Bank Details
                </h2>
                <p
                  className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Required for receiving payouts from groups
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g. Commercial Bank"
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div
                className={`pt-6 flex justify-end border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div
            className={`rounded-2xl p-6 shadow-lg ${
              isDark
                ? 'bg-red-900/10 border border-red-500/30'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle
                className={`w-6 h-6 flex-shrink-0 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}
              />
              <div>
                <h3
                  className={`font-bold text-lg mb-2 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  Danger Zone
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-red-300/80' : 'text-red-700'
                  }`}
                >
                  Once you delete your account, there is no going back. All your
                  data, groups, and transactions will be permanently deleted.
                  Please be certain.
                </p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white'
                  : 'bg-white border border-red-300 text-red-600 hover:bg-red-600 hover:text-white'
              }`}
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
