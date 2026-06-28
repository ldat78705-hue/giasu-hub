import React, { useState } from 'react';
import { ClassApplication, TutorBooking } from '../types';
import { ClipboardList, CheckCircle2, XCircle, Clock, UserCheck, BookOpen, Phone, MessageSquare, Filter, ChevronDown, Search } from 'lucide-react';

interface ApplicationsTabProps {
  applications: ClassApplication[];
  bookings: TutorBooking[];
  onUpdateApplicationStatus: (id: string, status: ClassApplication['status']) => Promise<void>;
  onUpdateBookingStatus: (id: string, status: TutorBooking['status']) => Promise<void>;
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  applications,
  bookings,
  onUpdateApplicationStatus,
  onUpdateBookingStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'bookings'>('applications');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingApps = applications.filter(a => a.status === 'Chờ duyệt').length;
  const pendingBookings = bookings.filter(b => b.status === 'Chờ liên hệ').length;

  const searchLower = searchTerm.toLowerCase();

  const filteredApps = applications
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => !searchTerm || a.tutorName.toLowerCase().includes(searchLower) || a.subject.toLowerCase().includes(searchLower) || a.classCode.toLowerCase().includes(searchLower));

  const filteredBookings = bookings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b => !searchTerm || b.parentName.toLowerCase().includes(searchLower) || b.tutorName.toLowerCase().includes(searchLower) || b.subject.toLowerCase().includes(searchLower));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ duyệt':
      case 'Chờ liên hệ':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Đã chấp nhận':
      case 'Đã xếp lớp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Từ chối':
      case 'Hủy':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return d; }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-slate-600" />
            <span>Đơn ứng tuyển & Yêu cầu</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý đơn gia sư nhận lớp và yêu cầu thuê gia sư từ phụ huynh</p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4 }}>
          <Filter style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0 }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 4px 8px 0', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã chấp nhận">Đã chấp nhận</option>
            <option value="Từ chối">Từ chối</option>
            <option value="Chờ liên hệ">Chờ liên hệ</option>
            <option value="Đã xếp lớp">Đã xếp lớp</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, width: 160 }} className="focus-within:border-indigo-500 focus-within:bg-white transition-colors">
            <Search style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0 }} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm GS, PH, môn..."
              style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 0', fontSize: 12, width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Sub-tab Toggle */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => { setActiveSubTab('applications'); setStatusFilter('all'); }}
          className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'applications'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Gia sư nhận lớp</span>
          {pendingApps > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold min-w-[18px] text-center">
              {pendingApps}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveSubTab('bookings'); setStatusFilter('all'); }}
          className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'bookings'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>PH thuê GS</span>
          {pendingBookings > 0 && (
            <span className="px-1.5 py-0.5 bg-indigo-500 text-white rounded-full text-[10px] font-bold min-w-[18px] text-center">
              {pendingBookings}
            </span>
          )}
        </button>
      </div>

      {/* Applications Tab */}
      {activeSubTab === 'applications' && (
        <div className="bg-white rounded-lg border border-slate-200/75 shadow-sm overflow-hidden">
          {filteredApps.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-sm">Chưa có đơn ứng tuyển nào</p>
              <p className="text-xs mt-1">Khi gia sư đăng ký nhận lớp trên trang công khai, đơn sẽ hiển thị tại đây</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-bold">Gia sư</th>
                    <th className="px-6 py-3 text-left font-bold">Lớp ứng tuyển</th>
                    <th className="px-6 py-3 text-left font-bold">Số điện thoại</th>
                    <th className="px-6 py-3 text-left font-bold">Ghi chú</th>
                    <th className="px-6 py-3 text-left font-bold">Thời gian</th>
                    <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
                    <th className="px-6 py-3 text-center font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold">
                            {app.tutorName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">{app.tutorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <span className="font-mono font-bold text-indigo-600">{app.classCode}</span>
                          <p className="text-slate-500 mt-0.5">{app.classSubject}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`tel:${app.tutorPhone}`} className="text-xs text-indigo-600 font-mono font-semibold hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {app.tutorPhone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 max-w-[200px] truncate" title={app.tutorNote}>
                          {app.tutorNote || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{formatDate(app.appliedAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(app.status)}`}>
                          {app.status === 'Chờ duyệt' && <Clock className="w-3 h-3" />}
                          {app.status === 'Đã chấp nhận' && <CheckCircle2 className="w-3 h-3" />}
                          {app.status === 'Từ chối' && <XCircle className="w-3 h-3" />}
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {app.status === 'Chờ duyệt' && (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => app.id && onUpdateApplicationStatus(app.id, 'Đã chấp nhận')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Duyệt</span>
                            </button>
                            <button
                              onClick={() => app.id && onUpdateApplicationStatus(app.id, 'Từ chối')}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Từ chối</span>
                            </button>
                          </div>
                        )}
                        {app.status !== 'Chờ duyệt' && (
                          <span className="text-xs text-slate-400 text-center block">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-lg border border-slate-200/75 shadow-sm overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-sm">Chưa có yêu cầu thuê gia sư nào</p>
              <p className="text-xs mt-1">Khi phụ huynh đặt gia sư trên trang công khai, yêu cầu sẽ hiển thị tại đây</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-bold">Phụ huynh</th>
                    <th className="px-6 py-3 text-left font-bold">Gia sư muốn thuê</th>
                    <th className="px-6 py-3 text-left font-bold">Số điện thoại</th>
                    <th className="px-6 py-3 text-left font-bold">Ghi chú</th>
                    <th className="px-6 py-3 text-left font-bold">Thời gian</th>
                    <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
                    <th className="px-6 py-3 text-center font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((bk) => (
                    <tr key={bk.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold">
                            {bk.parentName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">{bk.parentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <span className="font-mono font-bold text-indigo-600">{bk.tutorCode}</span>
                          <p className="text-slate-500 mt-0.5">{bk.tutorName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`tel:${bk.parentPhone}`} className="text-xs text-indigo-600 font-mono font-semibold hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {bk.parentPhone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 max-w-[200px] truncate" title={bk.note}>
                          {bk.note || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{formatDate(bk.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(bk.status)}`}>
                          {bk.status === 'Chờ liên hệ' && <Clock className="w-3 h-3" />}
                          {bk.status === 'Đã xếp lớp' && <CheckCircle2 className="w-3 h-3" />}
                          {bk.status === 'Hủy' && <XCircle className="w-3 h-3" />}
                          {bk.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {bk.status === 'Chờ liên hệ' && (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => bk.id && onUpdateBookingStatus(bk.id, 'Đã xếp lớp')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Xếp lớp</span>
                            </button>
                            <button
                              onClick={() => bk.id && onUpdateBookingStatus(bk.id, 'Hủy')}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Hủy</span>
                            </button>
                          </div>
                        )}
                        {bk.status !== 'Chờ liên hệ' && (
                          <span className="text-xs text-slate-400 text-center block">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200/75 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Đơn ứng tuyển</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{applications.length}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">{pendingApps} chờ duyệt</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/75 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Yêu cầu thuê GS</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{bookings.length}</div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">{pendingBookings} chờ xử lý</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/75 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Đã duyệt</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {applications.filter(a => a.status === 'Đã chấp nhận').length + bookings.filter(b => b.status === 'Đã xếp lớp').length}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Tổng đã hoàn thành</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/75 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tỉ lệ duyệt</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {applications.length + bookings.length > 0
              ? Math.round(
                  ((applications.filter(a => a.status === 'Đã chấp nhận').length + bookings.filter(b => b.status === 'Đã xếp lớp').length) /
                    (applications.length + bookings.length)) * 100
                )
              : 0}%
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Trên tổng đơn</div>
        </div>
      </div>
    </div>
  );
};
