import React from 'react';
import { ActiveTab } from '../types';
import { LayoutDashboard, BookOpen, Users, GraduationCap, DollarSign, ClipboardList, Settings, ExternalLink, Globe, UserPlus, MessageCircle, Calendar, Star, ClipboardCheck, MessageSquareText, BarChart3, Upload, FileText, Wrench } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingClassesCount: number;
  pendingApplicationsCount: number;
  unreadContactsCount?: number;
  pendingRegistrationsCount?: number;
  activeMatchesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingClassesCount, pendingApplicationsCount, unreadContactsCount = 0, pendingRegistrationsCount = 0, activeMatchesCount = 0 }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; section?: string }[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'classes', label: 'Quản lý lớp', icon: <BookOpen className="w-4 h-4" />, badge: pendingClassesCount },
    { id: 'matches', label: 'Ghép lớp', icon: <ExternalLink className="w-4 h-4" />, badge: activeMatchesCount },
    { id: 'calendar' as ActiveTab, label: 'Lịch dạy', icon: <Calendar className="w-4 h-4" /> },
    { id: 'tutors', label: 'Quản lý gia sư', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'students', label: 'Quản lý học viên', icon: <Users className="w-4 h-4" /> },
    { id: 'registrations', label: 'Đăng ký học', icon: <UserPlus className="w-4 h-4" />, badge: pendingRegistrationsCount },
    { id: 'applications', label: 'Đơn ứng tuyển', icon: <ClipboardList className="w-4 h-4" />, badge: pendingApplicationsCount },
    { id: 'attendance' as ActiveTab, label: 'Điểm danh', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'reviews' as ActiveTab, label: 'Đánh giá GS', icon: <Star className="w-4 h-4" /> },
    { id: 'contacts', label: 'Liên hệ & Tư vấn', icon: <MessageCircle className="w-4 h-4" />, badge: unreadContactsCount },
    { id: 'templates' as ActiveTab, label: 'Mẫu tin nhắn', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'finance', label: 'Tài chính', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'kpi' as ActiveTab, label: 'KPI & Thống kê', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'import' as ActiveTab, label: 'Import & Trùng', icon: <Upload className="w-4 h-4" /> },
    { id: 'blog' as ActiveTab, label: 'Blog SEO', icon: <FileText className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO & Marketing', icon: <Globe className="w-4 h-4" /> },
    { id: 'advanced' as ActiveTab, label: 'Công cụ nâng cao', icon: <Wrench className="w-4 h-4" /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside id="sidebar-navigation" className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-full shrink-0 select-none border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700/80">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/25 text-sm">
          TĐ
        </div>
        <div>
          <div className="text-base font-bold tracking-tight text-white leading-none">Gia Sư Thành Đạt</div>
          <div className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.1em] mt-0.5">Quản trị viên</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-4 pt-2 pb-3">
          Quản lý
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20 shadow-inner'
                  : 'hover:bg-slate-800/80 text-slate-300 font-medium hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 space-y-3 border-t border-slate-700/80 bg-slate-900/40">
        <button
          onClick={() => setActiveTab('home')}
          className="w-full px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Xem trang công khai</span>
        </button>

        <div className="bg-slate-800/60 p-3 rounded-xl text-xs border border-slate-700/50">
          <div className="flex justify-between mb-1 font-medium">
            <span className="text-slate-400">Hệ thống</span>
            <span className="text-green-400 font-bold text-[10px]">● Online</span>
          </div>
          <div className="text-[10px] text-slate-500">Firebase Realtime Sync</div>
        </div>
      </div>
    </aside>
  );
};
