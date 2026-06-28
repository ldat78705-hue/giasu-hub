import React from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign, Copy, Star, Trophy, Sparkles, RefreshCw, AlertTriangle, Bell, ArrowRight, ChevronRight, Target, UserPlus, Eye, Clock } from 'lucide-react';
import { ClassItem, TutorItem, ClassMatch, ParentRegistration, AttendanceRecord, TutorReview, TransactionItem, ActiveTab } from '../types';

interface DashboardProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  matches: ClassMatch[];
  registrations: ParentRegistration[];
  attendance: AttendanceRecord[];
  reviews: TutorReview[];
  transactions: TransactionItem[];
  totalRevenue: number;
  onNavigate: (tab: ActiveTab) => void;
  selectedClass?: ClassItem;
  aiMatches?: { tutorCode: string; matchPercentage: number; aiRationale: string }[];
  isMatchingLoading: boolean;
  onRunMatch: () => void;
  hasApiKey: boolean;
}

const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

export const Dashboard: React.FC<DashboardProps> = ({
  classes, tutors, matches, registrations, attendance, reviews, transactions,
  totalRevenue, onNavigate, selectedClass, aiMatches, isMatchingLoading, onRunMatch, hasApiKey,
}) => {
  // ===== ALL BUSINESS LOGIC UNTOUCHED =====
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP').length;
  const activeMatches = matches.filter(m => m.status === 'Đang dạy').length;
  const doneMatches = matches.filter(m => m.status === 'Hoàn thành').length;
  const matchRate = matches.length > 0 ? Math.round((doneMatches + activeMatches) / matches.length * 100) : 0;
  const pendingRegs = registrations.filter(r => r.status === 'Mới').length;
  const unverifiedTutors = tutors.filter(t => !t.verified).length;

  const weekAgo = Date.now() - 7 * 86400000;
  const weekRegs = registrations.filter(r => r.createdAt > weekAgo).length;
  const weekMatches = matches.filter(m => m.createdAt > weekAgo).length;

  const overdueRegs = registrations.filter(r => r.status === 'Mới' && (Date.now() - r.createdAt) > 2 * 3600000).length;
  const unpaidFees = matches.filter(m => m.status === 'Đang dạy' && !m.feePaid && (Date.now() - m.startDate) > 7 * 86400000).length;
  const staleMatches = matches.filter(m => {
    if (m.status !== 'Đang dạy') return false;
    const ma = attendance.filter(a => a.matchId === m.id);
    const last = ma.length > 0 ? Math.max(...ma.map(a => a.createdAt)) : m.startDate;
    return (Date.now() - last) > 14 * 86400000;
  }).length;

  const alerts = [
    overdueRegs > 0 && { label: `${overdueRegs} đơn chưa gọi > 2 giờ`, tab: 'registrations' as ActiveTab, urgent: true },
    unpaidFees > 0 && { label: `${unpaidFees} lớp chưa thu phí`, tab: 'matches' as ActiveTab, urgent: true },
    unverifiedTutors > 0 && { label: `${unverifiedTutors} gia sư chờ xác minh`, tab: 'tutors' as ActiveTab, urgent: false },
    staleMatches > 0 && { label: `${staleMatches} lớp có thể đã ngưng`, tab: 'matches' as ActiveTab, urgent: false },
  ].filter(Boolean) as { label: string; tab: ActiveTab; urgent: boolean }[];

  // 7 days with weekday labels
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const days = Array.from({ length: 7 }, (_, i) => {
    const s = Date.now() - (6 - i) * 86400000, e = s + 86400000;
    const d = new Date(s);
    return {
      day: dayLabels[d.getDay()],
      regs: registrations.filter(r => r.createdAt >= s && r.createdAt < e).length,
      matched: matches.filter(m => m.createdAt >= s && m.createdAt < e).length,
    };
  });
  const maxC = Math.max(...days.map(d => d.regs + d.matched), 1);

  const recentPending = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP')
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5);

  const ts: Record<string, { name: string; active: number; rating: number }> = {};
  matches.filter(m => m.status === 'Đang dạy').forEach(m => {
    if (!ts[m.tutorCode]) ts[m.tutorCode] = { name: m.tutorName, active: 0, rating: 0 };
    ts[m.tutorCode].active++;
  });
  Object.keys(ts).forEach(c => {
    const r = reviews.filter(rv => rv.tutorCode === c);
    ts[c].rating = r.length > 0 ? r.reduce((s, rv) => s + rv.rating, 0) / r.length : (tutors.find(t => t.code === c)?.rating || 0);
  });
  const topT = Object.entries(ts).sort((a, b) => (b[1].active * 3 + b[1].rating * 2) - (a[1].active * 3 + a[1].rating * 2)).slice(0, 4);

  const aiRec = (aiMatches || []).map(m => {
    const t = tutors.find(t => t.code === m.tutorCode || t.name.includes(m.tutorCode));
    return t ? { tutor: t, score: m.matchPercentage, rationale: m.aiRationale } : null;
  }).filter(Boolean) as { tutor: TutorItem; score: number; rationale: string }[];

  const copyReport = () => {
    const r = `📊 BÁO CÁO TUẦN — Gia Sư Thành Đạt\n📅 ${new Date().toLocaleDateString('vi-VN')}\n\n📋 Đơn mới: ${weekRegs}\n🎓 Ghép: ${weekMatches}\n📚 Đang dạy: ${activeMatches}\n💰 Doanh thu: ${fmt(totalRevenue)}đ\n📈 Tỷ lệ: ${matchRate}%\n\n🔗 https://giasu-dusky.vercel.app/quan-tri`;
    navigator.clipboard.writeText(r);
    alert('Đã sao chép báo cáo!');
  };

  const avgRating = tutors.length > 0 ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : '0';

  // Y-axis labels for chart
  const ySteps = [0, Math.ceil(maxC / 4), Math.ceil(maxC / 2), Math.ceil(maxC * 3 / 4), maxC];

  // ===== RENDER =====
  return (
    <div className="col-span-12 space-y-5">

      {/* ===== ALERT BAR ===== */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{alerts.map(a => a.label).join(' · ')}</span>
          </div>
          <button onClick={() => onNavigate(alerts[0].tab)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-semibold rounded-lg cursor-pointer transition-colors">
            Duyệt ngay
          </button>
        </div>
      )}

      {/* ===== 4 METRIC CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Doanh thu', value: fmt(totalRevenue) + 'đ', sub: 'Phí kết nối 7 ngày', icon: <DollarSign className="w-5 h-5" />, iconBg: 'bg-blue-100 text-blue-600', tab: 'finance' as ActiveTab },
          { label: 'Đang dạy', value: String(activeMatches), sub: `${matchRate}% tỷ lệ ghép`, icon: <Target className="w-5 h-5" />, iconBg: 'bg-green-100 text-green-600', tab: 'matches' as ActiveTab },
          { label: 'Chờ xử lý', value: String(pendingRegs), sub: 'Đơn phụ huynh mới', icon: <UserPlus className="w-5 h-5" />, iconBg: 'bg-orange-100 text-orange-600', tab: 'registrations' as ActiveTab },
          { label: 'Cần gia sư', value: String(pendingClasses), sub: `/ ${classes.length} tổng lớp`, icon: <BookOpen className="w-5 h-5" />, iconBg: 'bg-purple-100 text-purple-600', tab: 'classes' as ActiveTab },
        ].map((m, i) => (
          <div key={i} onClick={() => onNavigate(m.tab)}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${m.iconBg} flex items-center justify-center`}>{m.icon}</div>
              <span className="text-[13px] text-slate-500 font-medium">{m.label}</span>
            </div>
            <div className="text-[26px] font-bold text-slate-900 leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div className="text-[12px] text-slate-400 mt-1">{m.sub}</div>
            {/* Progress bar for "Cần gia sư" */}
            {i === 3 && classes.length > 0 && (
              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(pendingClasses / classes.length) * 100}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== CHART ROW: Chart (left) + Tổng Quan & Gia Sư (right) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* === LEFT: Chart + Weekly + Classes (2 cols) === */}
        <div className="lg:col-span-2 space-y-4">

          {/* Chart Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide">Hoạt động 7 ngày</h3>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm" /> Cứu dạy</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded-sm" /> Ghép thành công</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-100 rounded-sm" /> Đăng ký</span>
              </div>
            </div>
            {/* Chart with Y-axis */}
            <div className="flex gap-2" style={{ height: 180 }}>
              {/* Y labels */}
              <div className="flex flex-col justify-between text-[10px] text-slate-400 w-6 text-right py-1 shrink-0">
                {[...ySteps].reverse().map((v, i) => <span key={i}>{v}</span>)}
              </div>
              {/* Bars */}
              <div className="flex-1 flex items-end gap-3 border-l border-b border-slate-200 pl-2 pb-1">
                {days.map((d, i) => {
                  const total = d.regs + d.matched;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full max-w-[36px] bg-blue-500 rounded-t-md transition-all hover:bg-blue-600" style={{ height: `${Math.max((total / maxC) * 100, total > 0 ? 5 : 0)}%`, minHeight: total > 0 ? 4 : 0 }} />
                      <span className="text-[11px] text-slate-500 font-medium">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Weekly Summary Bar */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide mb-4">Tuần này</h3>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-4 text-[13px]">
              <span className="flex items-center gap-2">
                <span className="text-red-500 font-bold">{weekRegs}</span>
                <span className="text-slate-500">Đơn phụ huynh mới</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-slate-800">🎓</span>
                <span className="text-slate-500">Ghép thành công</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-slate-800">📚</span>
                <span className="text-slate-500">Lớp đang dạy</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-slate-800">💰</span>
                <span className="text-slate-500">{fmt(totalRevenue)}đ</span>
              </span>
            </div>
            <button onClick={copyReport}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-semibold rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Copy className="w-4 h-4" /> Sao chép báo cáo
            </button>
          </div>

          {/* Classes Table */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide">Lớp mới cần gia sư</h3>
              {pendingClasses > 5 && (
                <button onClick={() => onNavigate('classes')} className="text-[12px] font-medium text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">Xem tất cả</button>
              )}
            </div>
            {recentPending.length === 0 ? (
              <p className="text-[13px] text-slate-400 py-6 text-center">Không có lớp nào</p>
            ) : (
              <div className="space-y-0">
                {recentPending.map((cls, idx) => (
                  <div key={cls.id || cls.code}
                    className={`flex items-center gap-4 py-3.5 ${idx < recentPending.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    {/* Subject icon */}
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-slate-800 truncate">{cls.subject}</div>
                      <div className="text-[12px] text-slate-400 truncate">{cls.location}</div>
                    </div>
                    {/* Status badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      cls.status === 'KHẨN CẤP' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      Cần gia sư
                    </span>
                    {/* Fee */}
                    <span className="text-[13px] font-semibold text-slate-700 shrink-0 w-24 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(cls.fee)}đ</span>
                    {/* Detail button */}
                    <button onClick={() => onNavigate('classes')}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors shrink-0">
                      Chi tiết
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* === RIGHT COLUMN (1 col) === */}
        <div className="space-y-4">

          {/* Tổng Quan - 2×2 grid */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide mb-4">Tổng quan</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <GraduationCap className="w-5 h-5" />, label: 'Tổng gia sư', value: String(tutors.length), color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: <Users className="w-5 h-5" />, label: 'Gia sư sẵn sàng', value: String(tutors.filter(t => t.status === 'online').length), color: 'text-green-600', bg: 'bg-green-50' },
                { icon: <UserPlus className="w-5 h-5" />, label: 'Tổng đăng ký', value: String(registrations.length), color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: <Star className="w-5 h-5" />, label: 'Điểm đánh giá', value: avgRating + ' ⭐', color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-xl p-3.5`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={item.color}>{item.icon}</span>
                  </div>
                  <div className={`text-[20px] font-bold ${item.color}`} style={{ fontVariantNumeric: 'tabular-nums' }}>{item.value}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gia sư nổi bật */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide mb-4">Gia sư nổi bật</h3>
            {topT.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-slate-50 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-[13px] text-slate-400">Chưa có dữ liệu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topT.map(([code, data], i) => {
                  const tutor = tutors.find(t => t.code === code);
                  return (
                    <div key={code} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0`}
                        style={{ background: tutor?.avatarColor || (i === 0 ? '#f59e0b' : i === 1 ? '#6366f1' : i === 2 ? '#10b981' : '#64748b') }}>
                        {tutor?.avatar || data.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-800 truncate">{data.name}</div>
                        <div className="flex items-center gap-2 text-[11px] mt-0.5">
                          <span className="text-amber-600 font-medium">{data.rating.toFixed(1)} ★</span>
                          <span className="text-slate-400">{data.active} lớp</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Match Card */}
          {hasApiKey && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-500" /> AI Ghép nối
                </h3>
                {selectedClass && (
                  <button onClick={onRunMatch} disabled={isMatchingLoading}
                    className="px-3 py-1.5 text-[12px] font-semibold cursor-pointer transition-colors bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1.5">
                    <RefreshCw className={`w-3 h-3 ${isMatchingLoading ? 'animate-spin' : ''}`} /> Phân tích
                  </button>
                )}
              </div>
              {!selectedClass ? (
                <p className="text-[12px] text-slate-400">Chọn 1 lớp tại <span className="text-blue-600 font-medium cursor-pointer" onClick={() => onNavigate('classes')}>Quản lý lớp</span> để AI đề xuất.</p>
              ) : isMatchingLoading ? (
                <div className="flex items-center gap-2 py-4 text-[12px] text-slate-400">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  Đang phân tích {selectedClass.code}...
                </div>
              ) : aiRec.length > 0 ? (
                <div className="space-y-2.5">
                  {aiRec.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0" style={{ background: item.tutor.avatarColor || '#6366f1' }}>
                        {item.tutor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-slate-800 truncate">{item.tutor.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.rationale}</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 shrink-0">{item.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-slate-400">Đã chọn {selectedClass.code}. Nhấn Phân tích để tìm.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
