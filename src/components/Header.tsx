import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Bell } from 'lucide-react';
import { NotificationItem, ActiveTab } from '../types';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
  onAiSearch: (query: string) => void;
  isSearching: boolean;
  hasApiKey: boolean;
  notifications: NotificationItem[];
  onMarkNotifRead: (id: string) => void;
  onMarkAllNotifsRead: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAiSearch,
  isSearching,
  hasApiKey,
  notifications,
  onMarkNotifRead,
  onMarkAllNotifsRead,
  onNavigate,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onAiSearch(searchInput.trim());
    }
  };

  return (
    <header id="main-header" className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-xs">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasApiKey ? "Tìm kiếm AI: 'gia sư Toán quận Cầu Giấy'..." : "Tìm kiếm..."}
            className="w-full pl-10 pr-10 py-2 bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all text-sm outline-none text-slate-800 placeholder:text-slate-400"
          />
          {searchInput && hasApiKey && (
            <button
              onClick={() => onAiSearch(searchInput.trim())}
              disabled={isSearching}
              className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Tìm kiếm AI"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors relative"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <NotificationsPanel
              notifications={notifications}
              onMarkRead={onMarkNotifRead}
              onMarkAllRead={onMarkAllNotifsRead}
              onNavigate={onNavigate}
              onClose={() => setShowNotifs(false)}
            />
          )}
        </div>

        {/* Admin Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onNavigate('settings')}
          title="Cài đặt"
        >
          QT
        </div>
      </div>
    </header>
  );
};
