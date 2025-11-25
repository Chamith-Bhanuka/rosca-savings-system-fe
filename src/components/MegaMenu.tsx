import React from 'react';
import { X } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, isDark }) => (
  <div
    className={`fixed inset-0 z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
  >
    {/* Backdrop */}
    <div
      className={`absolute inset-0 ${isDark ? 'bg-[#0f0806]/98' : 'bg-[#faf8f5]/98'}`}
    />

    <div className="relative z-10 w-full h-full pt-28 px-[10%] flex justify-center">
      <button
        onClick={onClose}
        className={`absolute top-8 right-[5%] text-4xl hover:rotate-90 transition-transform ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
      >
        <X />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl w-full">
        {[
          {
            title: 'Groups',
            links: ['My Groups', 'Create Group', 'Join Group', 'Trust Profile'],
          },
          {
            title: 'Actions',
            links: [
              'Contributions',
              'Live Draw / Bidding',
              'Wallet / Payments',
              'Disputes / Resolution',
            ],
          },
          {
            title: 'Insights',
            links: ['Analytics', 'Leaderboard', 'Notifications'],
          },
          {
            title: 'Settings',
            links: ['Admin Panel', 'Help / Support', 'Language: EN'],
          },
        ].map((col, idx) => (
          <div key={idx} className="flex flex-col">
            <h4
              className={`text-xs uppercase tracking-widest mb-6 pb-3 border-b ${isDark ? 'text-[#d4a574] border-white/10' : 'text-[#b8894d] border-black/10'}`}
            >
              {col.title}
            </h4>
            <ul className="space-y-4">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className={`text-lg font-light transition-all hover:translate-x-2 block ${isDark ? 'text-[#f2f0ea] hover:text-[#d4a574]' : 'text-[#1a1a1a] hover:text-[#b8894d]'}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default MegaMenu;
