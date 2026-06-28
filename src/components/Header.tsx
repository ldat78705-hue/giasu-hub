import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Bell, ChevronRight } from 'lucide-react';
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
  activeTab?: ActiveTab;
}

const TAB_LABELS: Record<string, string> = {
  dashboard: 'Bảng điều khiển',
  calendar: 'Lịch dạy',
  classes: 'Quản lý lớp',
  matches: 'Ghép lớp',
  tutors: 'Gia sư',
  students: 'Học viên',
  registrations: 'Đăng ký học',
  applications: 'Đơn ứng tuyển',
  attendance: 'Điểm danh',
  contacts: 'Liên hệ',
  zalonotify: 'Tin nhắn Zalo',
  finance: 'Tài chính',
  performance: 'Hiệu suất gia sư',
  kpi: 'KPI & Thống kê',
  reviews: 'Đánh giá',
  activity: 'Lịch sử hoạt động',
  import: 'Nhập dữ liệu',
  blog: 'Blog & SEO',
  advanced: 'Nâng cao',
  settings: 'Cài đặt',
};

export const Header: React.FC<HeaderProps> = ({
  onAiSearch,
  isSearching,
  hasApiKey,
  notifications,
  onMarkNotifRead,
  onMarkAllNotifsRead,
  onNavigate,
  activeTab,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const currentLabel = activeTab ? TAB_LABELS[activeTab] || '' : '';

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
    <header id="main-header" className="h-[60px] bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {currentLabel && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-slate-400 font-medium hidden sm:inline">Quản trị</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
            <span className="text-slate-800 font-bold truncate">{currentLabel}</span>
          </div>
        )}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasApiKey ? "Tìm kiếm AI: 'gia sư Toán quận Cầu Giấy'..." : "Tìm kiếm..."}
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none text-slate-800 placeholder:text-slate-400"
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

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all relative"
          >
            <Bell className="w-[18px] h-[18px] text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm shadow-red-500/30">
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
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer hover:shadow-lg hover:shadow-blue-600/30 transition-all"
          onClick={() => onNavigate('settings')}
          title="Cài đặt"
        >
          QT
        </div>
      </div>
    </header>
  );
};
