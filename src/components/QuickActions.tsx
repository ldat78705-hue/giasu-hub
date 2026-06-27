import React from 'react';
import { ActiveTab, TutorItem, ParentRegistration, ClassMatch, AttendanceRecord, TutorReview, TransactionItem } from '../types';
import { AlertTriangle, UserCheck, Clock, ArrowRight, ShieldAlert, Zap, Award, TrendingDown, XCircle, Calendar, DollarSign, Bell } from 'lucide-react';

interface QuickActionsProps {
  tutors: TutorItem[];
  registrations: ParentRegistration[];
  matches: ClassMatch[];
  attendance: AttendanceRecord[];
  reviews: TutorReview[];
  transactions?: TransactionItem[];
  onNavigate: (tab: ActiveTab) => void;
}

// Feature A1: Quick Actions + A2: Cancel Analytics + Feature 1: Trial reminders + Feature 3: Task reminders
export const QuickActions: React.FC<QuickActionsProps> = ({ tutors, registrations, matches, attendance, reviews, transactions = [], onNavigate }) => {
  const unverifiedTutors = tutors.filter(t => !t.verified).length;
  const newRegs = registrations.filter(r => r.status === 'Mới').length;
  const overdueRegs = registrations.filter(r => r.status === 'Mới' && (Date.now() - r.createdAt) > 24 * 60 * 60 * 1000).length;
  const cancelledRegs = registrations.filter(r => r.status === 'Hủy').length;
  const cancelRate = registrations.length > 0 ? Math.round((cancelledRegs / registrations.length) * 100) : 0;

  // Feature B2: GS dormant (no activity in 30 days)
  const dormantTutors = tutors.filter(t => {
    const tutorMatches = matches.filter(m => m.tutorCode === t.code && m.status === 'Đang dạy');
    const lastActivity = Math.max(
      t.registeredAt || 0,
      ...tutorMatches.map(m => m.createdAt),
      ...attendance.filter(a => a.tutorCode === t.code).map(a => a.createdAt)
    );
    return t.verified && (Date.now() - lastActivity) > 30 * 24 * 60 * 60 * 1000;
  });

  // Feature 3: Task Reminders
  const regsOver2h = registrations.filter(r => r.status === 'Mới' && (Date.now() - r.createdAt) > 2 * 60 * 60 * 1000).length;
  
  // Feature 1: Trial reminders — trials scheduled for today/tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const upcomingTrials = registrations.filter(r => r.trialDate && (r.trialDate === today || r.trialDate === tomorrow) && r.trialStatus === 'Đã đặt').length;

  // Overdue payments (matched > 28 days but no payment)
  const overduePayments = matches.filter(m => {
    if (m.status !== 'Đang dạy') return false;
    const daysSinceStart = (Date.now() - m.startDate) / (1000 * 60 * 60 * 24);
    const hasPayment = transactions.some(t => t.targetName.includes(m.studentName || '') && t.type === 'Thu phí gia sư');
    return daysSinceStart > 28 && !hasPayment;
  }).length;

  // F30: Stale matches — active but no attendance in >14 days
  const staleMatches = matches.filter(m => {
    if (m.status !== 'Đang dạy') return false;
    const matchAtt = attendance.filter(a => a.matchId === m.id);
    const lastAtt = matchAtt.length > 0 ? Math.max(...matchAtt.map(a => a.createdAt)) : m.startDate;
    return (Date.now() - lastAtt) > 14 * 86400000;
  }).length;

  // F34/F40: Unpaid connection fees with severity levels
  const unpaidFees = matches.filter(m => m.status === 'Đang dạy' && !m.feePaid && (Date.now() - m.startDate) > 3 * 86400000).length;
  const unpaidUrgent = matches.filter(m => m.status === 'Đang dạy' && !m.feePaid && (Date.now() - m.startDate) > 7 * 86400000).length;
  const unpaidCritical = matches.filter(m => m.status === 'Đang dạy' && !m.feePaid && (Date.now() - m.startDate) > 14 * 86400000).length;
  // F44: Matches active > 90 days
  const longMatches = matches.filter(m => m.status === 'Đang dạy' && (Date.now() - m.startDate) > 90 * 86400000).length;

  const actions = [
    { show: regsOver2h > 0, color: 'red', icon: <Bell className="w-4 h-4" />, label: `${regsOver2h} đơn chưa gọi > 2h`, sub: '⏰ Cần liên hệ ngay!', tab: 'registrations' as ActiveTab, urgent: true },
    { show: upcomingTrials > 0, color: 'purple', icon: <Calendar className="w-4 h-4" />, label: `${upcomingTrials} buổi học thử sắp tới`, sub: 'Hôm nay/ngày mai', tab: 'registrations' as ActiveTab, urgent: false },
    { show: newRegs > 0, color: 'blue', icon: <Clock className="w-4 h-4" />, label: `${newRegs} đơn mới chưa xử lý`, sub: overdueRegs > 0 ? `⚠️ ${overdueRegs} quá 24h!` : 'Nhấn để xử lý', tab: 'registrations' as ActiveTab, urgent: overdueRegs > 0 },
    { show: unverifiedTutors > 0, color: 'amber', icon: <UserCheck className="w-4 h-4" />, label: `${unverifiedTutors} GS chờ xác minh`, sub: 'Duyệt hồ sơ gia sư', tab: 'tutors' as ActiveTab, urgent: false },
    { show: dormantTutors.length > 0, color: 'orange', icon: <ShieldAlert className="w-4 h-4" />, label: `${dormantTutors.length} GS "ngủ đông"`, sub: '>30 ngày không hoạt động', tab: 'tutors' as ActiveTab, urgent: false },
    { show: staleMatches > 0, color: 'orange', icon: <AlertTriangle className="w-4 h-4" />, label: `${staleMatches} lớp có thể đã ngưng`, sub: '>14 ngày không điểm danh', tab: 'matches' as ActiveTab, urgent: staleMatches > 2 },
    { show: unpaidCritical > 0, color: 'red', icon: <DollarSign className="w-4 h-4" />, label: `🚨 ${unpaidCritical} lớp NỢ PHÍ >14 ngày`, sub: 'Cần thu phí ngay!', tab: 'matches' as ActiveTab, urgent: true },
    { show: unpaidUrgent > 0 && unpaidCritical === 0, color: 'orange', icon: <DollarSign className="w-4 h-4" />, label: `${unpaidUrgent} lớp chưa thu phí >7 ngày`, sub: 'GS cần nộp phí sớm', tab: 'matches' as ActiveTab, urgent: true },
    { show: unpaidFees > 0 && unpaidUrgent === 0, color: 'amber', icon: <DollarSign className="w-4 h-4" />, label: `${unpaidFees} lớp chưa thu phí KN`, sub: 'GS nhận lớp >3 ngày', tab: 'matches' as ActiveTab, urgent: false },
    { show: overduePayments > 0, color: 'red', icon: <DollarSign className="w-4 h-4" />, label: `${overduePayments} GS nợ phí >28 ngày`, sub: 'Cần xử lý!', tab: 'finance' as ActiveTab, urgent: overduePayments > 2 },
    { show: longMatches > 0, color: 'blue', icon: <Calendar className="w-4 h-4" />, label: `${longMatches} lớp dạy >3 tháng`, sub: 'Xem xét gia hạn/kết thúc', tab: 'matches' as ActiveTab, urgent: false },
    { show: cancelRate > 15, color: 'red', icon: <TrendingDown className="w-4 h-4" />, label: `Tỷ lệ hủy: ${cancelRate}%`, sub: `${cancelledRegs}/${registrations.length} đơn bị hủy`, tab: 'kpi' as ActiveTab, urgent: cancelRate > 30 },
  ].filter(a => a.show);

  if (actions.length === 0) return null;

  const urgentColors: Record<string, string> = { blue: 'border-blue-300 bg-blue-50', amber: 'border-amber-300 bg-amber-50', orange: 'border-orange-300 bg-orange-50', red: 'border-red-300 bg-red-50', purple: 'border-purple-300 bg-purple-50' };
  const iconColors: Record<string, string> = { blue: 'text-blue-600', amber: 'text-amber-600', orange: 'text-orange-600', red: 'text-red-600', purple: 'text-purple-600' };

  return (
    <div className="col-span-12">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cần xử lý ({actions.length})</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.slice(0, 8).map((action, i) => (
          <button key={i} onClick={() => onNavigate(action.tab)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left cursor-pointer transition-all hover:shadow-sm ${action.urgent ? urgentColors[action.color] : urgentColors[action.color]}`}>
            <div className={`${iconColors[action.color]} shrink-0`}>{action.icon}</div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">{action.label}</div>
              <div className="text-[9px] text-slate-500">{action.sub}</div>
            </div>
            <ArrowRight className={`w-3 h-3 ${iconColors[action.color]} opacity-40 shrink-0`} />
          </button>
        ))}
      </div>
    </div>
  );
};
