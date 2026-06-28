import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Bell, ChevronDown } from 'lucide-react';
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
    <header className="h-16 bg-white px-6 flex items-center justify-between shrink-0 border-b border-slate-100">
      {/* Left: Page title */}
      <h1 className="text-[18px] font-bold text-slate-800">{label}</h1>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && searchInput.trim()) onAiSearch(searchInput.trim()); }}
            placeholder="Kiếm..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400" />
          {searchInput && hasApiKey && (
            <button onClick={() => onAiSearch(searchInput.trim())} disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
              <Sparkles className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="w-10 h-10 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-50 relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
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
          className="flex items-center gap-2 cursor-pointer group" title="Cài đặt">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
            QT
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </header>
  );
};
