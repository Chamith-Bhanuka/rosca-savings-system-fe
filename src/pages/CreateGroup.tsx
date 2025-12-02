import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';
import {
  CheckCircle,
  Users,
  DollarSign,
  Tag,
  Clock,
  AlertCircle,
  Calendar,
  Zap,
} from 'lucide-react';

import Navbar from '../components/NavBar.tsx';
import Footer from '../components/Footer';
import MegaMenu from '../components/MegaMenu.tsx';

import { useTranslation } from 'react-i18next';

interface GroupData {
  name: string;
  description: string;
  amount: number | '';
  frequency: 'monthly' | 'weekly' | 'biweekly';
  maxCycles: number | '';
  startDate: string;
  autoAccept: boolean;
}

const initialFormData: GroupData = {
  name: '',
  description: '',
  amount: '',
  frequency: 'monthly',
  maxCycles: '',
  startDate: '',
  autoAccept: false,
};

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme.value);
  const [formData, setFormData] = useState<GroupData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof GroupData, string>>
  >({});

  const { t } = useTranslation();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Create Group | Seettuwa';
  }, [theme]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      let finalValue: string | number = value;

      if (type === 'number') {
        finalValue = parseFloat(value);
        if (isNaN(finalValue)) finalValue = '';
      }

      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      // Clear error when user starts typing
      if (errors[name as keyof GroupData]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const handleAutoAcceptToggle = () => {
    setFormData((prev) => ({
      ...prev,
      autoAccept: !prev.autoAccept,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GroupData, string>> = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Group name must be at least 3 characters';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Contribution amount is required';
    }

    if (!formData.maxCycles || formData.maxCycles < 2) {
      newErrors.maxCycles = 'Minimum 2 members required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    console.log('Group Data Submitted:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      const newGroupId = 'group-' + Math.floor(Math.random() * 900 + 100);
      navigate(`/group/${newGroupId}`);
    }, 1500);
  };

  const totalPool =
    (Number(formData.amount) || 0) * (Number(formData.maxCycles) || 0);

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-[72px] pb-8 relative z-10">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <header className="text-center mb-8">
            <h1
              className={`text-4xl sm:text-5xl font-['Playfair_Display'] font-extrabold mb-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            >
              Create New Group
            </h1>
            <p
              className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Define your group details and launch your savings circle
            </p>
          </header>

          {/* Main Form Card */}
          <form onSubmit={handleSubmit}>
            <div
              className={`rounded-3xl p-6 sm:p-8 shadow-2xl ${isDark ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10' : 'bg-white border border-gray-200'}`}
            >
              {/* Grid Layout - 2 Columns on Desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                  {/* Group Identity Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Tag
                        className={`w-5 h-5 mr-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <h3
                        className={`text-lg font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                      >
                        {t('group.GroupIdentity')}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Group Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Office Savings Circle 2025"
                          className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none ${
                            isDark
                              ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                              : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                          } ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Description (Optional)
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={8}
                          placeholder="Brief description of the group's goal or members"
                          className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none resize-none ${
                            isDark
                              ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                              : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contribution Plan Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <DollarSign
                        className={`w-5 h-5 mr-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <h3
                        className={`text-lg font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                      >
                        Contribution Plan
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="amount"
                          className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Amount per Cycle (LKR) *
                        </label>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="e.g., 5000"
                          min="1"
                          className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none ${
                            isDark
                              ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                              : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                          } ${errors.amount ? 'border-red-500' : ''}`}
                        />
                        {errors.amount && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.amount}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="frequency"
                          className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Payment Frequency *
                        </label>
                        <select
                          id="frequency"
                          name="frequency"
                          value={formData.frequency}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none ${
                            isDark
                              ? 'bg-white/5 border border-white/10 text-white focus:border-[#d4a574] focus:ring-[#d4a574]/50 [&>option]:bg-[#1a110d] [&>option]:text-white'
                              : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                          }`}
                        >
                          <option value="monthly">Monthly</option>
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-Weekly</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="startDate"
                          className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Start Date *
                        </label>
                        <div className="relative">
                          <Calendar
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                          />
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full pl-11 pr-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none ${
                              isDark
                                ? 'bg-white/5 border border-white/10 text-white focus:border-[#d4a574] focus:ring-[#d4a574]/50 [&::-webkit-calendar-picker-indicator]:invert'
                                : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                            } ${errors.startDate ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.startDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6 flex flex-col">
                  {/* Membership Size Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Users
                        className={`w-5 h-5 mr-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <h3
                        className={`text-lg font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                      >
                        Group Size
                      </h3>
                    </div>

                    <div>
                      <label
                        htmlFor="maxCycles"
                        className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Total Members *
                      </label>
                      <input
                        type="number"
                        id="maxCycles"
                        name="maxCycles"
                        value={formData.maxCycles}
                        onChange={handleChange}
                        placeholder="e.g., 10"
                        min="2"
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none ${
                          isDark
                            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                        } ${errors.maxCycles ? 'border-red-500' : ''}`}
                      />
                      {errors.maxCycles && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.maxCycles}
                        </p>
                      )}

                      <div
                        className={`mt-4 p-4 rounded-lg flex items-start ${isDark ? 'bg-white/5 border border-white/10' : 'bg-blue-50 border border-blue-200'}`}
                      >
                        <Clock
                          className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                        />
                        <p
                          className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          This group will run for{' '}
                          <strong>{formData.maxCycles || 'X'}</strong> cycles,
                          requiring <strong>{formData.maxCycles || 'X'}</strong>{' '}
                          members total.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Auto-Accept Toggle */}
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <Zap
                        className={`w-5 h-5 mr-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <h3
                        className={`text-lg font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                      >
                        Join Settings
                      </h3>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label
                            htmlFor="autoAccept"
                            className={`block text-sm font-semibold mb-1 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                          >
                            Auto-Accept Members
                          </label>
                          <p
                            className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            {formData.autoAccept
                              ? 'Members can join instantly without approval'
                              : 'You must approve each join request'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAutoAcceptToggle}
                          className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ml-4 ${
                            formData.autoAccept
                              ? isDark
                                ? 'bg-[#d4a574] focus:ring-[#d4a574]'
                                : 'bg-[#b8894d] focus:ring-[#b8894d]'
                              : isDark
                                ? 'bg-gray-700 focus:ring-gray-500'
                                : 'bg-gray-300 focus:ring-gray-400'
                          }`}
                          role="switch"
                          aria-checked={formData.autoAccept}
                        >
                          <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              formData.autoAccept
                                ? 'translate-x-5'
                                : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card - Flex grow to fill remaining space */}
                  <div
                    className={`flex-1 p-6 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}
                  >
                    <div className="flex items-center mb-4">
                      <CheckCircle
                        className={`w-5 h-5 mr-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <h3
                        className={`text-lg font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                      >
                        Summary
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span
                          className={isDark ? 'text-gray-400' : 'text-gray-600'}
                        >
                          Contribution:
                        </span>
                        <span
                          className={`font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                        >
                          {formData.amount
                            ? `LKR ${formData.amount.toLocaleString()}`
                            : '—'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={isDark ? 'text-gray-400' : 'text-gray-600'}
                        >
                          Frequency:
                        </span>
                        <span
                          className={`font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                        >
                          {formData.frequency.charAt(0).toUpperCase() +
                            formData.frequency.slice(1)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={isDark ? 'text-gray-400' : 'text-gray-600'}
                        >
                          Start Date:
                        </span>
                        <span
                          className={`font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                        >
                          {formData.startDate
                            ? new Date(formData.startDate).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )
                            : '—'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={isDark ? 'text-gray-400' : 'text-gray-600'}
                        >
                          Total Members:
                        </span>
                        <span
                          className={`font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                        >
                          {formData.maxCycles || '—'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={isDark ? 'text-gray-400' : 'text-gray-600'}
                        >
                          Auto-Accept:
                        </span>
                        <span
                          className={`font-semibold ${
                            formData.autoAccept
                              ? isDark
                                ? 'text-green-400'
                                : 'text-green-700'
                              : isDark
                                ? 'text-gray-400'
                                : 'text-gray-600'
                          }`}
                        >
                          {formData.autoAccept ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>

                      <div
                        className={`pt-3 mt-3 border-t ${isDark ? 'border-white/10' : 'border-amber-300'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Total Pool:
                          </span>
                          <span
                            className={`text-xl font-bold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                          >
                            {totalPool > 0
                              ? `LKR ${totalPool.toLocaleString()}`
                              : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div
                className={`pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all duration-200 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white shadow-[#d4a574]/30 hover:shadow-[#d4a574]/50'
                      : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white shadow-[#b8894d]/30 hover:shadow-[#b8894d]/50'
                  } hover:translate-y-[-1px] disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Group...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      Create Group
                    </>
                  )}
                </button>

                <p
                  className={`text-sm text-center mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  By creating this group, you become the Group Organizer
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateGroup;
