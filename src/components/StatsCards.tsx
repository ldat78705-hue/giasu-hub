import React from 'react';
import { Users, BookOpen, GraduationCap, ClipboardCheck, TrendingUp, Target, DollarSign, Calendar, ArrowUpRight, Copy } from 'lucide-react';
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
    alert('Đã copy báo cáo! Paste vào Zalo để chia sẻ.');
  };

  return (
    <div className="col-span-12 space-y-4">
      {/* ===== ROW 1: Key Metrics — 4 cards ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue — Primary KPI */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-2xl text-white shadow-lg shadow-blue-600/15 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <DollarSign className="w-4 h-4 text-blue-200" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Doanh thu</span>
            </div>
            <div className="text-2xl font-extrabold">{fmt(totalRevenue)}đ</div>
            <div className="text-xs text-blue-200 mt-1">Từ phí kết nối gia sư</div>
          </div>
          <div className="absolute -right-3 -bottom-3 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        </div>

        {/* Active Matches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Target className="w-3.5 h-3.5" /></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Đang dạy</span>
            </div>
            {doneMatches > 0 && <span className="text-[10px] text-slate-400">{doneMatches} đã xong</span>}
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{activeMatches}</div>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${matchRate}%` }} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">{matchRate}%</span>
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><ClipboardCheck className="w-3.5 h-3.5" /></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Chờ xử lý</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{pendingRegistrations + pendingApplications}</div>
          <div className="flex items-center gap-3 mt-1 text-[10px]">
            <span className="text-amber-600 font-semibold">{pendingRegistrations} đơn phụ huynh</span>
            <span className="text-blue-600 font-semibold">{pendingApplications} gia sư mới</span>
          </div>
        </div>

        {/* Classes need GS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><BookOpen className="w-3.5 h-3.5" /></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Lớp cần GS</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{pendingClasses}</div>
          <div className="text-[10px] text-slate-400 mt-1">/{totalClasses} tổng lớp</div>
        </div>
      </div>

      {/* ===== ROW 2: Quick stats + Chart ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick stats — compact 2-col layout */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          {[
            { icon: <GraduationCap className="w-3.5 h-3.5" />, bg: 'bg-purple-50', tc: 'text-purple-600', label: 'Gia sư', value: totalTutors },
            { icon: <Users className="w-3.5 h-3.5" />, bg: 'bg-emerald-50', tc: 'text-emerald-600', label: 'Học viên', value: totalStudents },
            { icon: <Calendar className="w-3.5 h-3.5" />, bg: 'bg-blue-50', tc: 'text-blue-600', label: 'Đăng ký', value: totalRegistrations },
            { icon: <ArrowUpRight className="w-3.5 h-3.5" />, bg: 'bg-indigo-50', tc: 'text-indigo-600', label: 'Liên hệ mới', value: unreadContacts },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`p-1 ${item.bg} ${item.tc} rounded-md`}>{item.icon}</div>
                <span className="text-[10px] font-bold uppercase text-slate-400">{item.label}</span>
              </div>
              <div className="text-xl font-extrabold text-slate-800">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Chart — 7 day trend */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Hoạt động 7 ngày</h3>
              <p className="text-[10px] text-slate-400">Ghép lớp & đơn đăng ký mới</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full inline-block" /> Ghép lớp</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" /> Đơn PH</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 100 }}>
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex gap-0.5" style={{ height: 80, alignItems: 'flex-end' }}>
                  <div className="flex-1 bg-blue-500 rounded-t transition-all" style={{ height: `${Math.max((d.count / maxDay) * 100, d.count > 0 ? 6 : 0)}%` }} />
                  <div className="flex-1 bg-emerald-400 rounded-t transition-all" style={{ height: `${Math.max((d.regs / maxDay) * 100, d.regs > 0 ? 6 : 0)}%` }} />
                </div>
                <span className="text-[8px] text-slate-400 font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly summary + copy */}
        <div className="lg:col-span-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tuần này</span>
            </div>
            <div className="space-y-2.5 text-[13px]">
              <div className="flex justify-between"><span className="text-slate-400">Đơn phụ huynh mới</span><span className="font-bold">{weekNewRegs}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Ghép thành công</span><span className="font-bold text-emerald-400">{weekNewMatches}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Đang dạy</span><span className="font-bold">{activeMatches}</span></div>
            </div>
          </div>
          <button onClick={copyWeeklyReport}
            className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-bold cursor-pointer border border-white/10 transition-all flex items-center justify-center gap-1.5">
            <Copy className="w-3 h-3" /> Copy báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};
