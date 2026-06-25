import React, { useState } from 'react';
import { Search, Sparkles, Bell, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onAiSearch: (query: string) => void;
  isSearching: boolean;
  onQuickRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAiSearch, isSearching, onQuickRefresh }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onAiSearch(searchInput.trim());
    }
  };

  return (
    <header id="main-header" className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-xs">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm thông minh (AI search): 'Gia sư Toán Quận 1'..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all text-sm outline-none text-slate-800 placeholder:text-slate-400"
          />
          {searchInput && (
            <button
              onClick={() => onAiSearch(searchInput.trim())}
              disabled={isSearching}
              className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Kích hoạt AI Tìm kiếm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onQuickRefresh}
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Làm mới snapshot Firestore"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Đồng bộ</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full border border-green-200 shadow-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live SEO: Excellent
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors relative">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20 cursor-pointer hover:opacity-90 transition-opacity">
            QT
          </div>
        </div>
      </div>
    </header>
  );
};
