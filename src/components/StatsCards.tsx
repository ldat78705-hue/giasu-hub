import React from 'react';
import { Users, BookOpen, GraduationCap, ClipboardCheck, TrendingUp, Target, DollarSign, Calendar, ArrowUpRight, Copy, ArrowUp } from 'lucide-react';
import { ClassMatch, ParentRegistration } from '../types';

interface StatsCardsProps {
  totalClasses: number;
  pendingClasses: number;
  totalTutors: number;
  totalStudents: number;
  pendingApplications: number;
  totalRevenue: number;
  unreadContacts: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  matches: ClassMatch[];
  registrations?: ParentRegistration[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalClasses, pendingClasses, totalTutors, totalStudents, pendingApplications,
  totalRevenue, unreadContacts, totalRegistrations, pendingRegistrations, matches, registrations = [],
}) => {
  const fmt = (val: number) => new Intl.NumberFormat('vi-VN').format(val);
  const activeMatches = matches.filter(m => m.status === 'Đang dạy').length;
  const doneMatches = matches.filter(m => m.status === 'Hoàn thành').length;
  const matchRate = matches.length > 0 ? Math.round((doneMatches + activeMatches) / matches.length * 100) : 0;

  // Weekly stats
  const weekAgo = Date.now() - 7 * 86400000;
  const weekNewRegs = registrations.filter(r => r.createdAt > weekAgo).length;
  const weekNewMatches = matches.filter(m => m.createdAt > weekAgo).length;

  // Mini chart: 7 days
  const now = Date.now();
  const days = Array.from({ length: 7 }, (_, i) => {
    const dayStart = now - (6 - i) * 86400000;
    const dayEnd = dayStart + 86400000;
    return {
      label: new Date(dayStart).toLocaleDateString('vi-VN', { weekday: 'short' }),
      date: new Date(dayStart).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      count: matches.filter(m => m.createdAt >= dayStart && m.createdAt < dayEnd).length,
      regs: registrations.filter(r => r.createdAt >= dayStart && r.createdAt < dayEnd).length,
    };
  });
  const maxDay = Math.max(...days.map(d => Math.max(d.count, d.regs)), 1);

  const copyWeeklyReport = () => {
    const report = `📊 BÁO CÁO TUẦN — Gia Sư Thành Đạt\n📅 ${new Date().toLocaleDateString('vi-VN')}\n\n📋 Đơn phụ huynh mới: ${weekNewRegs}\n🎓 Gia sư ghép thành công: ${weekNewMatches}\n📚 Lớp đang dạy: ${activeMatches}\n💰 Doanh thu: ${fmt(totalRevenue)}đ\n📈 Tỷ lệ ghép: ${matchRate}%\n\n🔗 https://giasu-dusky.vercel.app/quan-tri`;
    navigator.clipboard.writeText(report);
    alert('Đã sao chép báo cáo! Dán vào Zalo để chia sẻ.');
  };

  return (
    <div className="col-span-12 space-y-5">
      {/* ===== ROW 1: Key Metrics — 4 cards ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue — Primary KPI */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-5 rounded-2xl text-white shadow-lg shadow-blue-600/20 relative overflow-hidden hover-lift shimmer-overlay">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">Doanh thu</span>
            </div>
            <div className="text-2xl lg:text-[28px] font-extrabold stat-number leading-tight">{fmt(totalRevenue)}đ</div>
            <div className="text-[11px] text-blue-200/80 mt-2">Từ phí kết nối gia sư</div>
          </div>
        </div>

        {/* Active Matches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover-lift">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Đang dạy</span>
            </div>
            {doneMatches > 0 && <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{doneMatches} đã xong</span>}
          </div>
          <div className="text-2xl lg:text-[28px] font-extrabold text-emerald-600 stat-number">{activeMatches}</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all" style={{ width: `${matchRate}%` }} />
            </div>
            <span className="text-[11px] font-bold text-emerald-600">{matchRate}%</span>
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Chờ xử lý</span>
          </div>
          <div className="text-2xl lg:text-[28px] font-extrabold text-slate-800 stat-number">{pendingRegistrations + pendingApplications}</div>
          <div className="flex items-center gap-3 mt-2 text-[11px]">
            <span className="text-amber-600 font-semibold">{pendingRegistrations} đơn phụ huynh</span>
            <span className="text-blue-600 font-semibold">{pendingApplications} gia sư mới</span>
          </div>
        </div>

        {/* Classes need tutor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lớp cần gia sư</span>
          </div>
          <div className="text-2xl lg:text-[28px] font-extrabold text-slate-800 stat-number">{pendingClasses}</div>
          <div className="text-[11px] text-slate-400 mt-2">/{totalClasses} tổng lớp</div>
        </div>
      </div>

      {/* ===== ROW 2: Quick stats + Chart ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick stats — compact 2-col layout */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          {[
            { icon: <GraduationCap className="w-4 h-4" />, bg: 'bg-purple-50', tc: 'text-purple-600', label: 'Gia sư', value: totalTutors },
            { icon: <Users className="w-4 h-4" />, bg: 'bg-emerald-50', tc: 'text-emerald-600', label: 'Học viên', value: totalStudents },
            { icon: <Calendar className="w-4 h-4" />, bg: 'bg-blue-50', tc: 'text-blue-600', label: 'Đăng ký', value: totalRegistrations },
            { icon: <ArrowUpRight className="w-4 h-4" />, bg: 'bg-indigo-50', tc: 'text-indigo-600', label: 'Liên hệ mới', value: unreadContacts },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 ${item.bg} ${item.tc} rounded-lg flex items-center justify-center`}>{item.icon}</div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide">{item.label}</span>
              </div>
              <div className="text-xl font-extrabold text-slate-800 stat-number">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Chart — 7 day trend */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Hoạt động 7 ngày</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Ghép lớp & đơn đăng ký mới</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm inline-block" /> Ghép lớp</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm inline-block" /> Đơn phụ huynh</span>
            </div>
          </div>
          {/* Grid lines */}
          <div className="relative" style={{ height: 110 }}>
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0,1,2,3].map(i => <div key={i} className="border-b border-slate-100/80" />)}
            </div>
            <div className="relative flex items-end gap-2 h-full">
              {days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex gap-0.5" style={{ height: 88, alignItems: 'flex-end' }}>
                    <div className="flex-1 bg-blue-500 rounded-t-sm transition-all group-hover:bg-blue-600" style={{ height: `${Math.max((d.count / maxDay) * 100, d.count > 0 ? 8 : 0)}%`, minHeight: d.count > 0 ? 4 : 0 }} />
                    <div className="flex-1 bg-emerald-400 rounded-t-sm transition-all group-hover:bg-emerald-500" style={{ height: `${Math.max((d.regs / maxDay) * 100, d.regs > 0 ? 8 : 0)}%`, minHeight: d.regs > 0 ? 4 : 0 }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly summary + copy */}
        <div className="lg:col-span-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tuần này</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[13px]">Đơn phụ huynh mới</span>
                <span className="font-bold text-[15px]">{weekNewRegs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[13px]">Ghép thành công</span>
                <span className="font-bold text-emerald-400 text-[15px]">{weekNewMatches}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[13px]">Đang dạy</span>
                <span className="font-bold text-[15px]">{activeMatches}</span>
              </div>
            </div>
          </div>
          <button onClick={copyWeeklyReport}
            className="mt-5 w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[12px] font-semibold cursor-pointer border border-white/10 transition-all flex items-center justify-center gap-2">
            <Copy className="w-3.5 h-3.5" /> Sao chép báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};
