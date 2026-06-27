import React from 'react';
import { Users, BookOpen, GraduationCap, ClipboardCheck, TrendingUp, MessageCircle, Calendar, Target } from 'lucide-react';
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
  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val);
  const activeMatches = matches.filter(m => m.status === 'Đang dạy').length;
  const doneMatches = matches.filter(m => m.status === 'Hoàn thành').length;
  const matchRate = matches.length > 0 ? Math.round((doneMatches + activeMatches) / matches.length * 100) : 0;

  // F23: Weekly stats
  const weekAgo = Date.now() - 7 * 86400000;
  const weekNewRegs = registrations.filter(r => r.createdAt > weekAgo).length;
  const weekNewMatches = matches.filter(m => m.createdAt > weekAgo).length;

  // Mini chart data: last 7 days of new items
  const now = Date.now();
  const days = Array.from({ length: 7 }, (_, i) => {
    const dayStart = now - (6 - i) * 86400000;
    const dayEnd = dayStart + 86400000;
    return {
      label: new Date(dayStart).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      count: matches.filter(m => m.createdAt >= dayStart && m.createdAt < dayEnd).length,
    };
  });
  const maxDay = Math.max(...days.map(d => d.count), 1);

  return (
    <div className="col-span-12 space-y-5">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card: Học viên */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Học viên</div>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalStudents}</div>
        </div>

        {/* Card: Lớp cần GS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Lớp cần GS</div>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><BookOpen className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{pendingClasses}</div>
          <div className="text-[10px] text-slate-400 mt-1">/{totalClasses} tổng</div>
        </div>

        {/* Card: Gia sư */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Gia sư</div>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><GraduationCap className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalTutors}</div>
        </div>

        {/* Card: Đơn chờ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Đơn chờ</div>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><ClipboardCheck className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{pendingApplications}</div>
        </div>

        {/* Card: Đang dạy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Đang dạy</div>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Target className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{activeMatches}</div>
          <div className="text-[10px] text-slate-400 mt-1">{doneMatches} đã xong</div>
        </div>

        {/* Card: Liên hệ mới */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs group hover:border-red-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Liên hệ</div>
            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><MessageCircle className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-bold text-red-600">{unreadContacts}</div>
          <div className="text-[10px] text-slate-400 mt-1">chưa đọc</div>
        </div>
      </div>

      {/* Second Row: Charts + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mini Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Ghép lớp 7 ngày qua</h3>
              <p className="text-[10px] text-slate-400">Số lượng ghép lớp mới mỗi ngày</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> {matchRate}% thành công
            </div>
          </div>
          <div className="flex items-end gap-2 h-24">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-slate-100 rounded-t-md relative overflow-hidden" style={{ height: 80 }}>
                  <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all"
                    style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }} />
                </div>
                <span className="text-[9px] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue + Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Doanh thu</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalRevenue)}đ</div>
            <div className="text-[10px] text-slate-400">Từ phí gia sư</div>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">ĐK tìm gia sư</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{totalRegistrations}</div>
            <div className="text-[10px] text-amber-600 font-semibold">{pendingRegistrations} mới chưa xử lý</div>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tỷ lệ ghép thành công</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${matchRate}%` }} />
              </div>
              <span className="text-sm font-bold text-emerald-600">{matchRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* F23: Weekly Report — Copy to Zalo */}
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/15 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-indigo-200" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">Báo cáo tuần</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-indigo-200">Đơn PH mới</span><span className="font-bold">{weekNewRegs}</span></div>
              <div className="flex justify-between"><span className="text-indigo-200">GS ghép thành công</span><span className="font-bold">{weekNewMatches}</span></div>
              <div className="flex justify-between"><span className="text-indigo-200">Liên hệ mới</span><span className="font-bold">{unreadContacts}</span></div>
              <div className="flex justify-between"><span className="text-indigo-200">Tổng lớp đang dạy</span><span className="font-bold">{activeMatches}</span></div>
            </div>
          </div>
          <button onClick={() => {
            const report = `📊 BÁO CÁO TUẦN — Gia Sư Thành Đạt\n📅 ${new Date().toLocaleDateString('vi-VN')}\n\n📋 Đơn PH mới: ${weekNewRegs}\n🎓 GS ghép thành công: ${weekNewMatches}\n💬 Liên hệ mới: ${unreadContacts}\n📚 Lớp đang dạy: ${activeMatches}\n💰 Doanh thu: ${formatCurrency(totalRevenue)}đ\n📈 Tỷ lệ ghép: ${matchRate}%\n\n🔗 https://giasu-dusky.vercel.app/dashboard`;
            navigator.clipboard.writeText(report);
            alert('Đã copy báo cáo! Paste vào Zalo để chia sẻ.');
          }} className="mt-4 w-full py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold cursor-pointer border border-white/20 transition-all">
            📋 Copy báo cáo → Zalo
          </button>
        </div>
      </div>
    </div>
  );
};
