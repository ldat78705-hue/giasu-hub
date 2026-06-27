import React from 'react';
import { NotificationItem, ActiveTab } from '../types';
import { Bell, UserCheck, BookOpen, BookOpenCheck, Settings2, Clock, CheckCircle2, X, UserPlus, MessageCircle } from 'lucide-react';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
  onClose,
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'application':
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
      case 'booking':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'class':
        return <BookOpenCheck className="w-4 h-4 text-emerald-600" />;
      case 'registration':
        return <UserPlus className="w-4 h-4 text-amber-600" />;
      case 'contact':
        return <MessageCircle className="w-4 h-4 text-cyan-600" />;
      case 'system':
      default:
        return <Settings2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const getIconBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'application': return 'bg-indigo-50';
      case 'booking': return 'bg-blue-50';
      case 'class': return 'bg-emerald-50';
      case 'registration': return 'bg-amber-50';
      case 'contact': return 'bg-cyan-50';
      case 'system':
      default: return 'bg-slate-100';
    }
  };

  const timeAgo = (ts: number) => {
    const seconds = Math.floor((Date.now() - ts) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-scale-in overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-600" />
          <h3 className="font-bold text-sm text-slate-800">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-bold min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Đọc tất cả</span>
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold">Chưa có thông báo</p>
          </div>
        ) : (
          notifications.slice(0, 20).map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.id) onMarkRead(notif.id);
                const navMap: Record<string, ActiveTab> = {
                  application: 'applications', booking: 'applications',
                  class: 'matches', registration: 'registrations',
                  contact: 'contacts', system: 'dashboard',
                };
                onNavigate(navMap[notif.type] || 'dashboard');
                onClose();
              }}
              className={`px-5 py-3.5 border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors flex items-start gap-3 ${
                !notif.isRead ? 'bg-blue-50/20' : ''
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${getIconBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs leading-snug ${!notif.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{notif.message}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(notif.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={() => { onNavigate('applications'); onClose(); }}
            className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Xem tất cả đơn ứng tuyển →
          </button>
        </div>
      )}
    </div>
  );
};
