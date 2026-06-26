import React from 'react';
import { ContactMessage } from '../types';
import { Phone, MessageCircle, Clock, CheckCircle2, Trash2, Eye, EyeOff } from 'lucide-react';

interface ContactsTabProps {
  contacts: ContactMessage[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ contacts, onMarkRead, onDelete }) => {
  const unreadCount = contacts.filter(c => !c.isRead).length;
  const sorted = [...contacts].sort((a, b) => b.createdAt - a.createdAt);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Liên hệ & Tư vấn</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {contacts.length} tin nhắn
            {unreadCount > 0 && <span className="text-red-500 font-bold ml-1">· {unreadCount} chưa đọc</span>}
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-sm">Chưa có tin nhắn nào</p>
          <p className="text-xs mt-1">Tin nhắn từ khách hàng sẽ hiển thị tại đây</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(msg => (
            <div key={msg.id}
              className={`p-4 rounded-xl border transition-all ${
                msg.isRead ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50/30'
              }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-800">{msg.name}</span>
                    {!msg.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>}
                  </div>
                  <a href={`tel:${msg.phone}`} className="text-xs text-blue-600 font-semibold flex items-center gap-1 mb-2">
                    <Phone className="w-3 h-3" /> {msg.phone}
                  </a>
                  <p className="text-sm text-slate-600 leading-relaxed">{msg.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" /> {formatTime(msg.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!msg.isRead ? (
                    <button onClick={() => msg.id && onMarkRead(msg.id)}
                      className="p-1.5 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-lg cursor-pointer transition-colors" title="Đánh dấu đã đọc">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="p-1.5 text-green-500" title="Đã đọc">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                  <button onClick={() => msg.id && onDelete(msg.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors" title="Xóa">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
