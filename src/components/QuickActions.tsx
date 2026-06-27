import React from 'react';
import { ActiveTab, TutorItem, ParentRegistration, ClassMatch, AttendanceRecord, TutorReview } from '../types';
import { AlertTriangle, UserCheck, Clock, ArrowRight, ShieldAlert, Zap, Award, TrendingDown, XCircle } from 'lucide-react';

interface QuickActionsProps {
  tutors: TutorItem[];
  registrations: ParentRegistration[];
  matches: ClassMatch[];
  attendance: AttendanceRecord[];
  reviews: TutorReview[];
  onNavigate: (tab: ActiveTab) => void;
}

// Feature A1: Quick Actions + A2: Cancel Analytics
export const QuickActions: React.FC<QuickActionsProps> = ({ tutors, registrations, matches, attendance, reviews, onNavigate }) => {
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

  const actions = [
    { show: newRegs > 0, color: 'blue', icon: <Clock className="w-4 h-4" />, label: `${newRegs} đơn mới chưa xử lý`, sub: overdueRegs > 0 ? `⚠️ ${overdueRegs} quá 24h!` : 'Nhấn để xử lý', tab: 'registrations' as ActiveTab, urgent: overdueRegs > 0 },
    { show: unverifiedTutors > 0, color: 'amber', icon: <UserCheck className="w-4 h-4" />, label: `${unverifiedTutors} GS chờ xác minh`, sub: 'Duyệt hồ sơ gia sư', tab: 'tutors' as ActiveTab, urgent: false },
    { show: dormantTutors.length > 0, color: 'orange', icon: <ShieldAlert className="w-4 h-4" />, label: `${dormantTutors.length} GS "ngủ đông"`, sub: '>30 ngày không hoạt động', tab: 'tutors' as ActiveTab, urgent: false },
    { show: cancelRate > 15, color: 'red', icon: <TrendingDown className="w-4 h-4" />, label: `Tỷ lệ hủy: ${cancelRate}%`, sub: `${cancelledRegs}/${registrations.length} đơn bị hủy`, tab: 'kpi' as ActiveTab, urgent: cancelRate > 30 },
  ].filter(a => a.show);

  if (actions.length === 0) return null;

  const urgentColors: Record<string, string> = { blue: 'border-blue-300 bg-blue-50', amber: 'border-amber-300 bg-amber-50', orange: 'border-orange-300 bg-orange-50', red: 'border-red-300 bg-red-50' };
  const iconColors: Record<string, string> = { blue: 'text-blue-600', amber: 'text-amber-600', orange: 'text-orange-600', red: 'text-red-600' };

  return (
    <div className="col-span-12">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cần xử lý ngay</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, i) => (
          <button key={i} onClick={() => onNavigate(action.tab)}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all hover:shadow-md ${action.urgent ? urgentColors[action.color] + ' animate-pulse' : urgentColors[action.color]}`}>
            <div className="flex items-start justify-between">
              <div className={`p-1.5 rounded-lg bg-white/80 ${iconColors[action.color]}`}>{action.icon}</div>
              <ArrowRight className={`w-3.5 h-3.5 ${iconColors[action.color]} opacity-50`} />
            </div>
            <div className="mt-2 text-sm font-bold text-slate-800">{action.label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{action.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
