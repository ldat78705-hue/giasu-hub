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
    const header = 'Họ tên,Số điện thoại,Nội dung,Thời gian,Trạng thái\n';
    const rows = contacts.map(c =>
      `"${c.name}","${c.phone}","${(c.message || '').replace(/"/g, '""')}","${fmtDate(c.createdAt)}","${c.isRead ? 'Đã đọc' : 'Chưa đọc'}"`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `lien-he-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Liên hệ & Tư vấn</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {contacts.length} tin nhắn
            {unreadCount > 0 && <span className="text-red-500 font-bold ml-1">· {unreadCount} chưa đọc</span>}
          </p>
        </div>
        <button onClick={exportCsv}
          className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Search + Filter */}
      {contacts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại, nội dung..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500" />
          </div>
          <div className="flex gap-2">
            {[
              { val: 'all' as const, label: 'Tất cả' },
              { val: 'unread' as const, label: `Chưa đọc${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
              { val: 'read' as const, label: 'Đã đọc' },
            ].map(f => (
              <button key={f.val} onClick={() => setFilterRead(f.val)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                  filterRead === f.val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
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
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Người gửi</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nội dung</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: 130 }}>Thời gian</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: 90 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(msg => (
                <tr key={msg.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: msg.isRead ? 'transparent' : 'rgba(79,70,229,0.03)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = msg.isRead ? '#f8fafc' : 'rgba(79,70,229,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = msg.isRead ? 'transparent' : 'rgba(79,70,229,0.03)')}
                >
                  <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: msg.isRead ? 500 : 700, color: '#1e293b', fontSize: 13 }}>{msg.name}</span>
                      {!msg.isRead && <span style={{ width: 7, height: 7, background: '#4f46e5', borderRadius: '50%', flexShrink: 0 }} />}
                    </div>
                    <a href={`tel:${msg.phone}`} style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2, textDecoration: 'none' }}>
                      <Phone style={{ width: 11, height: 11 }} /> {msg.phone}
                    </a>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569', lineHeight: 1.6, maxWidth: 400 }}>
                    {msg.message || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không có nội dung</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock style={{ width: 11, height: 11 }} /> {formatTime(msg.createdAt)}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                      {!msg.isRead ? (
                        <button onClick={() => msg.id && onMarkRead(msg.id)} title="Đánh dấu đã đọc"
                          style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#16a34a')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
                          <CheckCircle2 style={{ width: 15, height: 15 }} />
                        </button>
                      ) : (
                        <span style={{ padding: 4, color: '#16a34a' }}><CheckCircle2 style={{ width: 15, height: 15 }} /></span>
                      )}
                      <button onClick={() => msg.id && window.confirm(`Xóa tin nhắn của ${msg.name}?`) && onDelete(msg.id)} title="Xóa"
                        style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
                        <Trash2 style={{ width: 15, height: 15 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
