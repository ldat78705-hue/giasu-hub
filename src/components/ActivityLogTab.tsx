import React, { useState } from 'react';
import { Activity, Clock, Filter, Download, ChevronDown } from 'lucide-react';

export interface ActivityEntry {
  id?: string;
  action: string;
  target: string;
  detail: string;
  timestamp: number;
  category: 'class' | 'tutor' | 'student' | 'finance' | 'match' | 'registration' | 'system';
}

interface ActivityLogTabProps {
  activities: ActivityEntry[];
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  class: { label: 'Lớp', color: 'bg-blue-100 text-blue-700' },
  tutor: { label: 'Gia sư', color: 'bg-purple-100 text-purple-700' },
  student: { label: 'Học sinh', color: 'bg-emerald-100 text-emerald-700' },
  finance: { label: 'Tài chính', color: 'bg-amber-100 text-amber-700' },
  match: { label: 'Ghép lớp', color: 'bg-indigo-100 text-indigo-700' },
  registration: { label: 'Đăng ký', color: 'bg-cyan-100 text-cyan-700' },
  system: { label: 'Hệ thống', color: 'bg-slate-100 text-slate-700' },
};

export const ActivityLogTab: React.FC<ActivityLogTabProps> = ({ activities }) => {
  const [filter, setFilter] = useState<string>('all');
  const [showCount, setShowCount] = useState(50);

  const filtered = activities
    .filter(a => filter === 'all' || a.category === filter)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, showCount);

  const fmt = (ts: number) => {
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const exportCSV = () => {
    const csv = '\uFEFF' + 'Thời gian,Hành động,Đối tượng,Chi tiết,Danh mục\n' + 
      filtered.map(a => `"${new Date(a.timestamp).toLocaleString('vi-VN')}","${a.action}","${a.target}","${a.detail}","${CATEGORY_LABELS[a.category]?.label || a.category}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `activity-log-${Date.now()}.csv`; a.click();
  };

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Lịch sử hoạt động
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{activities.length} hoạt động · Audit trail toàn bộ hệ thống</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-600/20">
          <Download className="w-3.5 h-3.5" /> Xuất CSV
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[{ id: 'all', label: 'Tất cả' }, ...Object.entries(CATEGORY_LABELS).map(([id, v]) => ({ id, label: v.label }))].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border transition-all ${filter === f.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>{f.label}</button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Chưa có hoạt động nào</div>
        ) : filtered.map((a, i) => (
          <div key={a.id || i} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-800">{a.action}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${CATEGORY_LABELS[a.category]?.color || 'bg-slate-100 text-slate-600'}`}>
                  {CATEGORY_LABELS[a.category]?.label || a.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{a.target} · {a.detail}</p>
            </div>
            <div className="text-[10px] text-slate-400 shrink-0 text-right">{fmt(a.timestamp)}</div>
          </div>
        ))}
      </div>

      {filtered.length >= showCount && (
        <button onClick={() => setShowCount(s => s + 50)} className="w-full py-2 text-xs text-indigo-600 font-bold cursor-pointer flex items-center justify-center gap-1">
          <ChevronDown className="w-3 h-3" /> Xem thêm
        </button>
      )}
    </div>
  );
};
