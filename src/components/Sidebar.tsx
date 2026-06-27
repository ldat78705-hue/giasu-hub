import React, { useState } from 'react';
import { ActiveTab, AdminRole, ADMIN_ROLE_CONFIG } from '../types';
import { LayoutDashboard, BookOpen, Users, GraduationCap, DollarSign, ClipboardList, Settings, ExternalLink, Globe, UserPlus, MessageCircle, Calendar, Star, ClipboardCheck, BarChart3, Upload, FileText, Wrench, Award, Activity, Bell, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

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

interface NavGroup {
  label: string;
  items: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingClassesCount, pendingApplicationsCount, unreadContactsCount = 0, pendingRegistrationsCount = 0, activeMatchesCount = 0, adminRole }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRole = adminRole || 'super_admin';
  const allowedTabs = ADMIN_ROLE_CONFIG[currentRole]?.tabs || [];
  const roleLabel = ADMIN_ROLE_CONFIG[currentRole]?.label || 'Admin';
  const roleColor = ADMIN_ROLE_CONFIG[currentRole]?.color || '#2563eb';

  const groups: NavGroup[] = [
    {
      label: 'Tổng quan',
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
      label: 'Tài chính & KPI',
      items: [
        { id: 'finance', label: 'Tài chính', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'performance', label: 'Hiệu suất gia sư', icon: <Award className="w-4 h-4" /> },
        { id: 'kpi', label: 'KPI & Thống kê', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'reviews', label: 'Đánh giá', icon: <Star className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Công cụ',
      items: [
        { id: 'activity', label: 'Lịch sử hoạt động', icon: <Activity className="w-4 h-4" /> },
        { id: 'import', label: 'Import', icon: <Upload className="w-4 h-4" /> },
        { id: 'blog', label: 'Blog & SEO', icon: <FileText className="w-4 h-4" /> },
        { id: 'advanced', label: 'Nâng cao', icon: <Wrench className="w-4 h-4" /> },
        { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const totalBadge = pendingClassesCount + pendingApplicationsCount + unreadContactsCount + pendingRegistrationsCount;

  const sidebarContent = (
    <>
      <div className="p-5 flex items-center gap-3 border-b border-slate-700/80">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/25 text-sm">
          TĐ
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold tracking-tight text-white leading-none">Gia Sư Thành Đạt</div>
          <div className="text-[9px] font-bold uppercase tracking-[0.1em] mt-0.5" style={{ color: roleColor }}>{roleLabel}</div>
        </div>
        {/* Mobile close */}
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {groups.map((group) => {
          const filteredItems = group.items.filter(i => allowedTabs.includes(i.id));
          if (filteredItems.length === 0) return null;
          const isCollapsed = collapsed[group.label];
          const groupHasBadge = filteredItems.some(i => i.badge && i.badge > 0);
          const groupHasActive = filteredItems.some(i => activeTab === i.id);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer rounded-lg transition-colors ${groupHasActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="flex items-center gap-1.5">
                  {group.label}
                  {groupHasBadge && !isCollapsed ? null : groupHasBadge && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {filteredItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                        className={`px-3 py-2 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20'
                            : 'hover:bg-slate-800/80 text-slate-300 font-medium hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                          <span className="text-[13px]">{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full min-w-[20px] text-center ${
                            isActive ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-200'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 space-y-2 border-t border-slate-700/80 bg-slate-900/40">
        <button
          onClick={() => { window.open('/', '_blank'); setMobileOpen(false); }}
          className="w-full px-3 py-2 bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Xem trang công khai</span>
        </button>

        <div className="bg-slate-800/60 p-2.5 rounded-xl text-xs border border-slate-700/50">
          <div className="flex justify-between mb-0.5 font-medium">
            <span className="text-slate-400">Hệ thống</span>
            <span className="text-green-400 font-bold text-[10px]">● Online</span>
          </div>
          <div className="text-[10px] text-slate-500">Firebase Realtime Sync</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-[#0F172A] text-white rounded-xl shadow-lg cursor-pointer"
      >
        <Menu className="w-5 h-5" />
        {totalBadge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">{totalBadge > 9 ? '9+' : totalBadge}</span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-[#0F172A] text-slate-300 flex-col h-full shrink-0 border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-300 flex flex-col h-full transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  );
};
