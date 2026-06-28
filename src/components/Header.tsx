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
  dashboard: 'Bảng điều khiển', calendar: 'Lịch dạy', classes: 'Quản lý lớp',
  matches: 'Ghép lớp', tutors: 'Gia sư', students: 'Học viên',
  registrations: 'Đăng ký học', applications: 'Đơn ứng tuyển', attendance: 'Điểm danh',
  contacts: 'Liên hệ', zalonotify: 'Tin nhắn Zalo', finance: 'Tài chính',
  performance: 'Hiệu suất gia sư', kpi: 'Thống kê', reviews: 'Đánh giá',
  activity: 'Hoạt động', import: 'Nhập dữ liệu', blog: 'Blog',
  advanced: 'Nâng cao', settings: 'Cài đặt',
};

export const Header: React.FC<HeaderProps> = ({
  onAiSearch, isSearching, hasApiKey, notifications, onMarkNotifRead, onMarkAllNotifsRead, onNavigate, activeTab,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const label = activeTab ? TAB_LABELS[activeTab] || '' : '';

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-5 lg:px-6 flex items-center justify-between shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] min-w-0">
        <span className="text-slate-400 hidden sm:inline">Quản trị</span>
        <ChevronRight className="w-3 h-3 text-slate-300 hidden sm:block" />
        <span className="text-slate-800 font-semibold truncate">{label}</span>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-sm mx-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && searchInput.trim()) onAiSearch(searchInput.trim()); }}
            placeholder={hasApiKey ? "Tìm kiếm..." : "Tìm kiếm..."}
            className="w-full pl-9 pr-9 py-[7px] bg-slate-100 border border-slate-200/60 rounded-lg text-[13px] outline-none focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400" />
          {searchInput && hasApiKey && (
            <button onClick={() => onAiSearch(searchInput.trim())} disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
              <Sparkles className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="w-8 h-8 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100 relative">
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <NotificationsPanel notifications={notifications} onMarkRead={onMarkNotifRead}
              onMarkAllRead={onMarkAllNotifsRead} onNavigate={onNavigate} onClose={() => setShowNotifs(false)} />
          )}
        </div>
        <button onClick={() => onNavigate('settings')}
          className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[11px] font-semibold cursor-pointer hover:bg-indigo-700 transition-colors" title="Cài đặt">
          QT
        </button>
      </div>
    </header>
  );
};
