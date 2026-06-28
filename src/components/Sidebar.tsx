import React, { useState } from 'react';
import { ActiveTab, AdminRole, ADMIN_ROLE_CONFIG } from '../types';
import { LayoutDashboard, BookOpen, Users, GraduationCap, DollarSign, ClipboardList, Settings, ExternalLink, UserPlus, MessageCircle, Calendar, Star, ClipboardCheck, BarChart3, Upload, FileText, Wrench, Award, Activity, Bell, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingClassesCount: number;
  pendingApplicationsCount: number;
  unreadContactsCount?: number;
  pendingRegistrationsCount?: number;
  activeMatchesCount?: number;
  adminRole?: AdminRole;
}

interface NavItem { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }
interface NavGroup { label: string; items: NavItem[] }

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingClassesCount, pendingApplicationsCount, unreadContactsCount = 0, pendingRegistrationsCount = 0, activeMatchesCount = 0, adminRole }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRole = adminRole || 'super_admin';
  const allowedTabs = ADMIN_ROLE_CONFIG[currentRole]?.tabs || [];
  const roleLabel = ADMIN_ROLE_CONFIG[currentRole]?.label || 'Admin';

  const groups: NavGroup[] = [
    {
      label: '',
      items: [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'calendar', label: 'Lịch dạy', icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Quản lý',
      items: [
        { id: 'classes', label: 'Quản lý lớp', icon: <BookOpen className="w-4 h-4" />, badge: pendingClassesCount },
        { id: 'matches', label: 'Ghép lớp', icon: <ExternalLink className="w-4 h-4" />, badge: activeMatchesCount },
        { id: 'tutors', label: 'Gia sư', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'students', label: 'Học viên', icon: <Users className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Vận hành',
      items: [
        { id: 'registrations', label: 'Đăng ký học', icon: <UserPlus className="w-4 h-4" />, badge: pendingRegistrationsCount },
        { id: 'applications', label: 'Đơn ứng tuyển', icon: <ClipboardList className="w-4 h-4" />, badge: pendingApplicationsCount },
        { id: 'attendance', label: 'Điểm danh', icon: <ClipboardCheck className="w-4 h-4" /> },
        { id: 'contacts', label: 'Liên hệ', icon: <MessageCircle className="w-4 h-4" />, badge: unreadContactsCount },
        { id: 'zalonotify', label: 'Tin nhắn Zalo', icon: <Bell className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Báo cáo',
      items: [
        { id: 'finance', label: 'Tài chính', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'performance', label: 'Hiệu suất gia sư', icon: <Award className="w-4 h-4" /> },
        { id: 'kpi', label: 'Thống kê', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'reviews', label: 'Đánh giá', icon: <Star className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Hệ thống',
      items: [
        { id: 'activity', label: 'Hoạt động', icon: <Activity className="w-4 h-4" /> },
        { id: 'import', label: 'Nhập dữ liệu', icon: <Upload className="w-4 h-4" /> },
        { id: 'blog', label: 'Blog', icon: <FileText className="w-4 h-4" /> },
        { id: 'advanced', label: 'Nâng cao', icon: <Wrench className="w-4 h-4" /> },
        { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  const totalBadge = pendingClassesCount + pendingApplicationsCount + unreadContactsCount + pendingRegistrationsCount;

  const content = (
    <>
      {/* Brand */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">GS</div>
          <div className="text-[14px] font-semibold text-white tracking-tight truncate">Gia Sư Thành Đạt</div>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-slate-500 hover:text-white cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {groups.map((group, gi) => {
          const filtered = group.items.filter(i => allowedTabs.includes(i.id));
          if (filtered.length === 0) return null;
          return (
            <div key={gi} className={group.label ? 'mt-6' : ''}>
              {group.label && (
                <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{group.label}</div>
              )}
              {filtered.map(item => {
                const active = activeTab === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-all rounded-lg ${
                      active ? 'text-white bg-indigo-600 shadow-sm shadow-indigo-600/25' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                    }`}>
                    <span className={active ? 'text-indigo-200' : 'text-slate-500'}>{item.icon}</span>
                    <span className="text-[13px] flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] font-semibold px-1.5 min-w-[18px] text-center rounded-md ${
                        active ? 'text-white bg-indigo-500' : 'text-slate-400 bg-white/[0.06]'
                      }`}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-3">
        <button onClick={() => { window.open('/', '_blank'); setMobileOpen(false); }}
          className="w-full px-3 py-2 text-[12px] font-medium text-slate-500 hover:text-slate-300 cursor-pointer transition-colors flex items-center justify-center gap-1.5 rounded-lg hover:bg-white/[0.06]">
          <ExternalLink className="w-3.5 h-3.5" /> Trang công khai
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-slate-900 text-white rounded-lg cursor-pointer">
        <Menu className="w-5 h-5" />
        {totalBadge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">{totalBadge > 9 ? '9+' : totalBadge}</span>}
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />}

      {/* Desktop */}
      <aside className="hidden lg:flex w-60 bg-slate-900 text-slate-300 flex-col h-full shrink-0 border-r border-slate-800/50">
        {content}
      </aside>

      {/* Mobile */}
      <aside className={`lg:hidden fixed top-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col h-full transition-transform duration-200 shadow-2xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {content}
      </aside>
    </>
  );
};
