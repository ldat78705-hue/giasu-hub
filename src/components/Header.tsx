import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings } from 'lucide-react';
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
  dashboard: 'Tổng quan', classes: 'Quản lý lớp', matches: 'Ghép lớp',
  tutors: 'Gia sư', students: 'Học viên', registrations: 'Đăng ký học',
  contacts: 'Liên hệ', zalonotify: 'Tin nhắn Zalo', finance: 'Tài chính',
  performance: 'Hiệu suất gia sư', kpi: 'Thống kê KPI', reviews: 'Đánh giá',
  activity: 'Nhật ký', import: 'Nhập dữ liệu', blog: 'Blog & SEO',
  advanced: 'Nâng cao', settings: 'Cài đặt', calendar: 'Lịch dạy',
  applications: 'Đơn ứng tuyển', attendance: 'Điểm danh',
};

export const Header: React.FC<HeaderProps> = ({
  onAiSearch, isSearching, hasApiKey, notifications,
  onMarkNotifRead, onMarkAllNotifsRead, onNavigate, activeTab,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const label = activeTab ? TAB_LABELS[activeTab] || '' : '';

  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <header style={{
      height: 56, background: '#fff', borderBottom: '1px solid #e2e8f0',
      padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      flexShrink: 0,
    }}>
      {/* Title */}
      <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0, flexShrink: 0 }}>{label}</h1>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 360, margin: '0 16px', position: 'relative' }}>
        <Search style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && searchInput.trim()) onAiSearch(searchInput.trim()); }}
          placeholder="Tìm kiếm học viên, lớp học..."
          style={{
            width: '100%', padding: '8px 16px 8px 36px',
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4,
            fontSize: 13, outline: 'none', color: '#334155',
          }}
        />
        {isSearching && (
          <div style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, border: '2px solid #4f46e5', borderTopColor: 'transparent',
            borderRadius: '50%', animation: 'spin 1s linear infinite',
          }} />
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Time */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{timeStr}</div>
          <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'capitalize' }}>{dateStr}</div>
        </div>

        {/* Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer',
              color: '#64748b', position: 'relative',
            }}
          >
            <Bell style={{ width: 20, height: 20 }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
                border: '2px solid #fff',
              }} />
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

        {/* Avatar */}
        <button
          onClick={() => onNavigate('settings')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#4f46e5', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
          }}>
            QT
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Admin</div>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>Quản trị</div>
          </div>
        </button>

        {/* Gear */}
        <button
          onClick={() => onNavigate('settings')}
          style={{
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8',
          }}
        >
          <Settings style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </header>
  );
};
