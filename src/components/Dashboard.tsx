import React from 'react';
import { Users, BookOpen, GraduationCap, ClipboardCheck, TrendingUp, Target, DollarSign, Calendar, Copy, Star, Trophy, UserPlus, ExternalLink, Sparkles, RefreshCw, AlertTriangle, Clock, Bell, ArrowRight } from 'lucide-react';
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
  // AI match
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
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP').length;
  const activeMatches = matches.filter(m => m.status === 'Đang dạy').length;
  const doneMatches = matches.filter(m => m.status === 'Hoàn thành').length;
  const matchRate = matches.length > 0 ? Math.round((doneMatches + activeMatches) / matches.length * 100) : 0;
  const pendingRegs = registrations.filter(r => r.status === 'Mới').length;
  const unverifiedTutors = tutors.filter(t => !t.verified).length;

  // Weekly
  const weekAgo = Date.now() - 7 * 86400000;
  const weekRegs = registrations.filter(r => r.createdAt > weekAgo).length;
  const weekMatches = matches.filter(m => m.createdAt > weekAgo).length;

  // Urgent items
  const overdueRegs = registrations.filter(r => r.status === 'Mới' && (Date.now() - r.createdAt) > 2 * 3600000).length;
  const unpaidFees = matches.filter(m => m.status === 'Đang dạy' && !m.feePaid && (Date.now() - m.startDate) > 7 * 86400000).length;
  const staleMatches = matches.filter(m => {
    if (m.status !== 'Đang dạy') return false;
    const matchAtt = attendance.filter(a => a.matchId === m.id);
    const lastAtt = matchAtt.length > 0 ? Math.max(...matchAtt.map(a => a.createdAt)) : m.startDate;
    return (Date.now() - lastAtt) > 14 * 86400000;
  }).length;

  const urgentItems = [
    overdueRegs > 0 && { icon: <Bell className="w-4 h-4" />, color: '#ef4444', label: `${overdueRegs} đơn chưa gọi > 2 giờ`, tab: 'registrations' as ActiveTab },
    unpaidFees > 0 && { icon: <DollarSign className="w-4 h-4" />, color: '#f59e0b', label: `${unpaidFees} lớp chưa thu phí > 7 ngày`, tab: 'matches' as ActiveTab },
    unverifiedTutors > 0 && { icon: <GraduationCap className="w-4 h-4" />, color: '#3b82f6', label: `${unverifiedTutors} gia sư chờ xác minh`, tab: 'tutors' as ActiveTab },
    staleMatches > 0 && { icon: <AlertTriangle className="w-4 h-4" />, color: '#f97316', label: `${staleMatches} lớp có thể đã ngưng`, tab: 'matches' as ActiveTab },
  ].filter(Boolean) as { icon: React.ReactNode; color: string; label: string; tab: ActiveTab }[];

  // 7-day chart
  const days = Array.from({ length: 7 }, (_, i) => {
    const dayStart = Date.now() - (6 - i) * 86400000;
    const dayEnd = dayStart + 86400000;
    return {
      label: new Date(dayStart).toLocaleDateString('vi-VN', { weekday: 'narrow' }),
      regs: registrations.filter(r => r.createdAt >= dayStart && r.createdAt < dayEnd).length,
      matched: matches.filter(m => m.createdAt >= dayStart && m.createdAt < dayEnd).length,
    };
  });
  const maxChart = Math.max(...days.map(d => Math.max(d.regs, d.matched)), 1);

  // Top 5 recent classes needing tutor
  const recentPending = classes
    .filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP')
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  // Top tutors
  const tutorScores: Record<string, { name: string; active: number; rating: number }> = {};
  matches.filter(m => m.status === 'Đang dạy').forEach(m => {
    if (!tutorScores[m.tutorCode]) tutorScores[m.tutorCode] = { name: m.tutorName, active: 0, rating: 0 };
    tutorScores[m.tutorCode].active++;
  });
  Object.keys(tutorScores).forEach(code => {
    const tr = reviews.filter(r => r.tutorCode === code);
    tutorScores[code].rating = tr.length > 0 ? tr.reduce((s, r) => s + r.rating, 0) / tr.length : (tutors.find(t => t.code === code)?.rating || 0);
  });
  const topTutors = Object.entries(tutorScores)
    .sort((a, b) => (b[1].active * 3 + b[1].rating * 2) - (a[1].active * 3 + a[1].rating * 2))
    .slice(0, 4);

  // AI matches display
  const aiRecommendations = (aiMatches || []).map(m => {
    const t = tutors.find(t => t.code === m.tutorCode || t.name.includes(m.tutorCode));
    return t ? { tutor: t, score: m.matchPercentage, rationale: m.aiRationale } : null;
  }).filter(Boolean) as { tutor: TutorItem; score: number; rationale: string }[];

  const copyReport = () => {
    const report = `📊 BÁO CÁO TUẦN — Gia Sư Thành Đạt\n📅 ${new Date().toLocaleDateString('vi-VN')}\n\n📋 Đơn phụ huynh mới: ${weekRegs}\n🎓 Ghép thành công: ${weekMatches}\n📚 Đang dạy: ${activeMatches}\n💰 Doanh thu: ${fmt(totalRevenue)}đ\n📈 Tỷ lệ ghép: ${matchRate}%\n\n🔗 https://giasu-dusky.vercel.app/quan-tri`;
    navigator.clipboard.writeText(report);
    alert('Đã sao chép báo cáo! Dán vào Zalo để chia sẻ.');
  };

  const medals = ['🥇', '🥈', '🥉', '4'];

  // --- CARD STYLES ---
  const card = "bg-white rounded-2xl border border-slate-200/70 p-5";
  const cardTitle = "text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2";

  return (
    <div className="col-span-12 space-y-6">

      {/* ========== ROW 1: Urgent Alerts (compact inline bar) ========== */}
      {urgentItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urgentItems.map((item, i) => (
            <button key={i} onClick={() => onNavigate(item.tab)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-all hover:shadow-md border"
              style={{ background: `${item.color}08`, borderColor: `${item.color}30`, color: item.color }}>
              {item.icon}
              <span>{item.label}</span>
              <ArrowRight className="w-3 h-3 opacity-50" />
            </button>
          ))}
        </div>
      )}

      {/* ========== ROW 2: 4 Key Metrics ========== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-5 rounded-2xl text-white relative overflow-hidden shimmer-overlay hover-lift">
          <div className="relative z-10">
            <div className="text-[11px] font-medium uppercase tracking-wider text-blue-200/80 mb-1">Doanh thu</div>
            <div className="text-[26px] font-extrabold stat-number leading-tight">{fmt(totalRevenue)}đ</div>
            <div className="text-[11px] text-blue-200/60 mt-1">Phí kết nối gia sư</div>
          </div>
        </div>
        {/* Active */}
        <button onClick={() => onNavigate('matches')} className={`${card} hover-lift text-left cursor-pointer`}>
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">Đang dạy</div>
          <div className="text-[26px] font-extrabold text-emerald-600 stat-number">{activeMatches}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${matchRate}%` }} /></div>
            <span className="text-[10px] font-bold text-emerald-600">{matchRate}%</span>
          </div>
        </button>
        {/* Pending */}
        <button onClick={() => onNavigate('registrations')} className={`${card} hover-lift text-left cursor-pointer`}>
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">Chờ xử lý</div>
          <div className="text-[26px] font-extrabold text-slate-800 stat-number">{pendingRegs}</div>
          <div className="text-[11px] text-slate-400 mt-1">đơn phụ huynh mới</div>
        </button>
        {/* Classes */}
        <button onClick={() => onNavigate('classes')} className={`${card} hover-lift text-left cursor-pointer`}>
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">Lớp cần gia sư</div>
          <div className="text-[26px] font-extrabold text-slate-800 stat-number">{pendingClasses}</div>
          <div className="text-[11px] text-slate-400 mt-1">/ {classes.length} tổng lớp</div>
        </button>
      </div>

      {/* ========== ROW 3: Chart + Weekly Summary + Quick Numbers ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* 7-Day Chart */}
        <div className={`${card} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-bold text-slate-800">Hoạt động 7 ngày</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Đơn đăng ký & ghép lớp thành công</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded-sm" /> Ghép lớp</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-sm" /> Đơn đăng ký</span>
            </div>
          </div>
          <div className="flex items-end gap-3" style={{ height: 120 }}>
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1" style={{ height: 96, alignItems: 'flex-end' }}>
                  <div className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600" style={{ height: `${Math.max((d.matched / maxChart) * 100, d.matched > 0 ? 10 : 0)}%`, minHeight: d.matched > 0 ? 4 : 0 }} />
                  <div className="flex-1 bg-emerald-400 rounded-t transition-all hover:bg-emerald-500" style={{ height: `${Math.max((d.regs / maxChart) * 100, d.regs > 0 ? 10 : 0)}%`, minHeight: d.regs > 0 ? 4 : 0 }} />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-4">Tuần này</div>
            <div className="space-y-3">
              {[
                { label: 'Đơn phụ huynh mới', value: weekRegs, color: 'text-white' },
                { label: 'Ghép thành công', value: weekMatches, color: 'text-emerald-400' },
                { label: 'Lớp đang dạy', value: activeMatches, color: 'text-white' },
                { label: 'Doanh thu', value: fmt(totalRevenue) + 'đ', color: 'text-blue-400' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-400 text-[13px]">{item.label}</span>
                  <span className={`font-bold text-[14px] ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={copyReport}
            className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-[12px] font-medium cursor-pointer border border-white/10 transition-all flex items-center justify-center gap-2">
            <Copy className="w-3.5 h-3.5" /> Sao chép báo cáo
          </button>
        </div>
      </div>

      {/* ========== ROW 4: Recent Classes + Quick Stats + Top Tutors ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent pending classes */}
        <div className={`${card} lg:col-span-1`}>
          <div className={cardTitle}>
            <BookOpen className="w-4 h-4 text-blue-600" />
            Lớp mới cần gia sư
          </div>
          {recentPending.length === 0 ? (
            <p className="text-[12px] text-slate-400 text-center py-6">Không có lớp nào cần gia sư</p>
          ) : (
            <div className="space-y-2">
              {recentPending.map(cls => (
                <div key={cls.id || cls.code} onClick={() => onNavigate('classes')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 cursor-pointer transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-slate-800 truncate">{cls.subject}</div>
                    <div className="text-[11px] text-slate-500 truncate">{cls.location} · {cls.studentInfo}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[12px] font-bold text-blue-600 stat-number">{fmt(cls.fee)}đ</span>
                    {cls.status === 'KHẨN CẤP' && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                </div>
              ))}
              {pendingClasses > 5 && (
                <button onClick={() => onNavigate('classes')} className="w-full text-center text-[11px] text-blue-600 font-semibold py-2 hover:text-blue-700 cursor-pointer">
                  Xem tất cả {pendingClasses} lớp →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick numbers grid */}
        <div className={`${card} lg:col-span-1`}>
          <div className={cardTitle}>
            <Target className="w-4 h-4 text-emerald-600" />
            Tổng quan hệ thống
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Gia sư', value: tutors.length, bg: 'bg-purple-50', color: 'text-purple-700', icon: <GraduationCap className="w-3.5 h-3.5" /> },
              { label: 'Sẵn sàng', value: tutors.filter(t => t.status === 'online').length, bg: 'bg-emerald-50', color: 'text-emerald-700', icon: <Users className="w-3.5 h-3.5" /> },
              { label: 'Học viên', value: registrations.length, bg: 'bg-blue-50', color: 'text-blue-700', icon: <UserPlus className="w-3.5 h-3.5" /> },
              { label: 'Đánh giá TB', value: tutors.length > 0 ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : '—', bg: 'bg-amber-50', color: 'text-amber-700', icon: <Star className="w-3.5 h-3.5" /> },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-xl p-3 text-center`}>
                <div className={`text-xl font-extrabold ${item.color} stat-number`}>{item.value}</div>
                <div className={`text-[10px] font-semibold ${item.color} mt-0.5 opacity-80`}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tutors */}
        <div className={`${card} lg:col-span-1`}>
          <div className={cardTitle}>
            <Trophy className="w-4 h-4 text-amber-500" />
            Gia sư nổi bật
          </div>
          {topTutors.length === 0 ? (
            <p className="text-[12px] text-slate-400 text-center py-6">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-2">
              {topTutors.map(([code, data], i) => {
                const tutor = tutors.find(t => t.code === code);
                return (
                  <div key={code} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${i === 0 ? 'bg-amber-50/80' : 'hover:bg-slate-50'}`}>
                    <span className="text-sm w-5 text-center shrink-0">{medals[i]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold text-slate-800 truncate">{data.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {data.rating > 0 && <span className="text-[10px] text-amber-600 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{data.rating.toFixed(1)}</span>}
                        <span className="text-[10px] text-blue-600 font-medium">{data.active} lớp</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========== ROW 5: AI Match Panel (only if API key configured) ========== */}
      {hasApiKey && (
        <div className={card}>
          <div className="flex items-center justify-between">
            <div className={cardTitle}>
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Ghép nối gia sư
            </div>
            {selectedClass && (
              <button onClick={onRunMatch} disabled={isMatchingLoading}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
                <RefreshCw className={`w-3 h-3 ${isMatchingLoading ? 'animate-spin' : ''}`} />
                Phân tích
              </button>
            )}
          </div>
          <div className="mt-1">
            {!selectedClass ? (
              <p className="text-[12px] text-slate-400">Chọn 1 lớp tại mục <strong className="text-blue-600 cursor-pointer" onClick={() => onNavigate('classes')}>Quản lý lớp</strong> để AI đề xuất gia sư phù hợp.</p>
            ) : isMatchingLoading ? (
              <div className="flex items-center gap-3 py-4 text-[12px] text-slate-400">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                AI đang phân tích lớp {selectedClass.code} — {selectedClass.subject}...
              </div>
            ) : aiRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {aiRecommendations.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${idx === 0 ? 'border-purple-200 bg-purple-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0`} style={{ background: item.tutor.avatarColor || '#3b82f6' }}>
                      {item.tutor.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[12px] font-bold text-slate-800 truncate">{item.tutor.name}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">{item.score}%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate italic">"{item.rationale}"</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-slate-400 mt-1">Đã chọn lớp <strong>{selectedClass.code}</strong> — {selectedClass.subject}. Nhấn <strong>Phân tích</strong> để AI tìm gia sư.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
