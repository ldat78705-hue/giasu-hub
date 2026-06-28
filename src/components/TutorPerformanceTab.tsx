import React, { useState } from 'react';
import { TutorItem, ClassMatch, AttendanceRecord, TutorReview } from '../types';
import { Award, Star, AlertTriangle, DollarSign, Download, Search, TrendingUp, TrendingDown, Clock, BookOpen, Calendar } from 'lucide-react';

interface TutorPerformanceTabProps {
  tutors: TutorItem[];
  matches: ClassMatch[];
  attendance: AttendanceRecord[];
  reviews: TutorReview[];
}

interface TutorPerf {
  tutor: TutorItem;
  totalSessions: number;
  taughtSessions: number;
  missedSessions: number;
  attendanceRate: number;
  activeClasses: number;
  completedClasses: number;
  avgRating: number;
  reviewCount: number;
  salary: number;
  lastActivity: number;
  isDormant: boolean;
}

export const TutorPerformanceTab: React.FC<TutorPerformanceTabProps> = ({ tutors, matches, attendance, reviews }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'attendance' | 'salary' | 'sessions' | 'dormant'>('rating');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthStart = new Date(selectedMonth + '-01');
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const monthLabel = monthStart.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  // Calculate performance for each tutor
  const perfs: TutorPerf[] = tutors.map(t => {
    const tutorMatches = matches.filter(m => m.tutorCode === t.code);
    const tutorAtt = attendance.filter(a => a.tutorCode === t.code);
    const monthAtt = tutorAtt.filter(a => {
      const d = new Date(a.date);
      return d >= monthStart && d <= monthEnd;
    });
    const tutorReviews = reviews.filter(r => r.tutorCode === t.code);
    const avgRating = tutorReviews.length > 0 ? tutorReviews.reduce((s, r) => s + r.rating, 0) / tutorReviews.length : 0;

    const taughtSessions = monthAtt.filter(a => a.status === 'Đã dạy').length;
    const missedSessions = monthAtt.filter(a => a.status !== 'Đã dạy').length;
    const totalSessions = monthAtt.length;
    const attendanceRate = totalSessions > 0 ? Math.round((taughtSessions / totalSessions) * 100) : 0;

    const activeClasses = tutorMatches.filter(m => m.status === 'Đang dạy').length;
    const completedClasses = tutorMatches.filter(m => m.status === 'Hoàn thành').length;

    // B3: Calculate salary = taught sessions × fee per session (from active matches)
    const activeFees = tutorMatches.filter(m => m.status === 'Đang dạy').map(m => m.fee);
    const avgFee = activeFees.length > 0 ? activeFees.reduce((s, f) => s + f, 0) / activeFees.length : 200000;
    const salary = taughtSessions * avgFee;

    const lastActivity = Math.max(
      t.registeredAt || 0,
      ...tutorMatches.map(m => m.createdAt),
      ...tutorAtt.map(a => a.createdAt)
    );
    const isDormant = t.verified && (Date.now() - lastActivity) > 30 * 24 * 60 * 60 * 1000;

    return { tutor: t, totalSessions, taughtSessions, missedSessions, attendanceRate, activeClasses, completedClasses, avgRating, reviewCount: tutorReviews.length, salary, lastActivity, isDormant };
  });

  const filtered = perfs
    .filter(p => !searchTerm || p.tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tutor.code.includes(searchTerm))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.avgRating - a.avgRating;
        case 'attendance': return b.attendanceRate - a.attendanceRate;
        case 'salary': return b.salary - a.salary;
        case 'sessions': return b.taughtSessions - a.taughtSessions;
        case 'dormant': return (b.isDormant ? 1 : 0) - (a.isDormant ? 1 : 0);
        default: return 0;
      }
    });

  const totalSalary = filtered.reduce((s, p) => s + p.salary, 0);
  const dormantCount = perfs.filter(p => p.isDormant).length;
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  const exportCSV = () => {
    const csv = '\uFEFF' + 'Mã GS,Tên,Số buổi dạy,Tỷ lệ ĐD,Rating,Lớp đang dạy,Lương tháng,Ngủ đông\n' +
      filtered.map(p => `"${p.tutor.code}","${p.tutor.name}",${p.taughtSessions},${p.attendanceRate}%,${p.avgRating.toFixed(1)},${p.activeClasses},${p.salary},${p.isDormant ? 'Có' : 'Không'}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `gs-performance-${selectedMonth}.csv`; a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Hiệu suất & Lương GS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{tutors.length} gia sư · {dormantCount > 0 ? `⚠️ ${dormantCount} ngủ đông` : '✅ Tất cả hoạt động'}</p>
        </div>
        <div className="flex gap-2">
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none cursor-pointer" />
          <button onClick={exportCSV} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md">
            <Download className="w-3.5 h-3.5" /> Xuất
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Tổng lương tháng</div>
          <div className="text-lg font-bold text-emerald-600 mt-1">{fmt(totalSalary)}đ</div>
          <div className="text-[10px] text-slate-400">{monthLabel}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Tổng buổi dạy</div>
          <div className="text-lg font-bold text-indigo-600 mt-1">{filtered.reduce((s, p) => s + p.taughtSessions, 0)}</div>
          <div className="text-[10px] text-slate-400">/{filtered.reduce((s, p) => s + p.totalSessions, 0)} tổng</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Gia sư hoạt động</div>
          <div className="text-lg font-bold text-indigo-600 mt-1">{perfs.filter(p => p.activeClasses > 0).length}</div>
          <div className="text-[10px] text-slate-400">/{tutors.length} tổng</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Gia sư ngủ đông</div>
          <div className={`text-lg font-bold mt-1 ${dormantCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{dormantCount}</div>
          <div className="text-[10px] text-slate-400">&gt;30 ngày không hoạt động</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm gia sư..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {([['rating', '⭐ Rating'], ['attendance', '📋 Điểm danh'], ['salary', '💰 Lương'], ['sessions', '📚 Buổi dạy'], ['dormant', '💤 Ngủ đông']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border transition-all ${sortBy === key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Gia sư</th>
                <th className="px-4 py-3 font-semibold text-center">Rating</th>
                <th className="px-4 py-3 font-semibold text-center">Buổi dạy</th>
                <th className="px-4 py-3 font-semibold text-center">Điểm danh</th>
                <th className="px-4 py-3 font-semibold text-center">Lớp</th>
                <th className="px-4 py-3 font-semibold text-right">Lương tháng</th>
                <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filtered.map((p, i) => (
                <tr key={p.tutor.id || i} className={`hover:bg-slate-50 ${p.isDormant ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: p.tutor.avatarColor }}>
                        {p.tutor.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{p.tutor.name}</div>
                        <div className="text-[10px] text-slate-400">{p.tutor.code} · {p.tutor.subjects.join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.avgRating > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700">{p.avgRating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">({p.reviewCount})</span>
                      </div>
                    ) : <span className="text-xs text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-slate-700">{p.taughtSessions}</span>
                    {p.missedSessions > 0 && <span className="text-[10px] text-red-500 ml-1">(-{p.missedSessions})</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.totalSessions > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.attendanceRate >= 80 ? 'bg-emerald-500' : p.attendanceRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p.attendanceRate}%` }} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">{p.attendanceRate}%</span>
                      </div>
                    ) : <span className="text-xs text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-indigo-600">{p.activeClasses}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({p.completedClasses} xong)</span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">{p.salary > 0 ? fmt(p.salary) + 'đ' : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {p.isDormant ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold flex items-center gap-1 justify-center">
                        <AlertTriangle className="w-2.5 h-2.5" /> Ngủ đông
                      </span>
                    ) : p.activeClasses > 0 ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Đang dạy</span>
                    ) : p.tutor.verified ? (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold">Sẵn sàng</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">Chờ duyệt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
