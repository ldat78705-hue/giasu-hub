import React, { useState } from 'react';
import { ContactMessage } from '../types';
import { Phone, MessageCircle, Clock, CheckCircle2, Trash2, Download, Search } from 'lucide-react';

interface ContactsTabProps {
  contacts: ContactMessage[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ contacts, onMarkRead, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const fmtDate = (ts: number) => new Date(ts).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filtered = contacts
    .filter(c => {
      if (filterRead === 'unread') return !c.isRead;
      if (filterRead === 'read') return c.isRead;
      return true;
    })
    .filter(c => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.message || '').toLowerCase().includes(q);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const exportCsv = () => {
    const header = 'Họ tên,SĐT,Nội dung,Thời gian,Trạng thái\n';
    const rows = contacts.map(c =>
      `"${c.name}","${c.phone}","${(c.message || '').replace(/"/g, '""')}","${fmtDate(c.createdAt)}","${c.isRead ? 'Đã đọc' : 'Chưa đọc'}"`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `lien-he-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Liên hệ & Tư vấn</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {contacts.length} tin nhắn
            {unreadCount > 0 && <span className="text-red-500 font-bold ml-1">· {unreadCount} chưa đọc</span>}
          </p>
        </div>
        <button onClick={exportCsv}
          className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Search + Filter */}
      {contacts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SĐT, nội dung..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
          </div>
          <div className="flex gap-2">
            {[
              { val: 'all' as const, label: 'Tất cả' },
              { val: 'unread' as const, label: `Chưa đọc${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
              { val: 'read' as const, label: 'Đã đọc' },
            ].map(f => (
              <button key={f.val} onClick={() => setFilterRead(f.val)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  filterRead === f.val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}>{f.label}</button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-sm">{contacts.length === 0 ? 'Chưa có tin nhắn nào' : 'Không tìm thấy kết quả'}</p>
          <p className="text-xs mt-1">{contacts.length === 0 ? 'Tin nhắn từ khách hàng sẽ hiển thị tại đây' : 'Thử thay đổi bộ lọc'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => (
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
                  <button onClick={() => msg.id && window.confirm(`Xóa tin nhắn của ${msg.name}?`) && onDelete(msg.id)}
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
