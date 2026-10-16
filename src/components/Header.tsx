import React from 'react';
import { Sprout, Heart, Droplets, MessageCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'identify' | 'garden' | 'calculator';
  setActiveTab: (tab: 'identify' | 'garden' | 'calculator') => void;
  gardenCount: number;
  openChat: () => void;
  isChatOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gardenCount,
  openChat,
  isChatOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('identify')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-stone-900 tracking-tight">FloraCare</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  AI 닥터
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block font-medium">
                식물 도감 & 맞춤 케어 솔루션
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('identify')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'identify'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>식물 식별 & 진단</span>
            </button>

            <button
              onClick={() => setActiveTab('garden')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                activeTab === 'garden'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>내 정원</span>
              {gardenCount > 0 && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ml-1 ${
                    activeTab === 'garden'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {gardenCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span className="hidden sm:inline">물주기 계산기</span>
              <span className="sm:hidden">물주기</span>
            </button>
          </nav>

          {/* Chatbot Launch Button */}
          <button
            onClick={openChat}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              isChatOpen
                ? 'bg-teal-50 border-teal-300 text-teal-800 ring-2 ring-teal-400/30'
                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 shadow-xs'
            }`}
          >
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="hidden md:inline font-medium">초록닥터 AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
