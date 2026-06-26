import React from 'react';
import { ParentRegistration } from '../types';
import { UserPlus, Phone, MapPin, BookOpen, Clock, CheckCircle2, XCircle, Download } from 'lucide-react';

interface RegistrationsTabProps {
  registrations: ParentRegistration[];
  onUpdateStatus: (id: string, status: ParentRegistration['status']) => void;
}

export const RegistrationsTab: React.FC<RegistrationsTabProps> = ({ registrations, onUpdateStatus }) => {
  const fmt = (ts: number) => new Date(ts).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusColors: Record<string, string> = {
    'Mới': 'bg-blue-100 text-blue-700',
    'Đã liên hệ': 'bg-amber-100 text-amber-700',
    'Đã xếp lớp': 'bg-emerald-100 text-emerald-700',
    'Hủy': 'bg-red-100 text-red-700',
  };

  const newCount = registrations.filter(r => r.status === 'Mới').length;

  return (
    <div className="col-span-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Đăng ký tìm gia sư</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {registrations.length} đăng ký • {newCount > 0 && <span className="text-blue-600 font-bold">{newCount} mới chưa xử lý</span>}
          </p>
        </div>
        <button onClick={() => {
          const header = 'Ph\u1ee5 huynh,S\u0110T,H\u1ecdc sinh,L\u1edbp,M\u00f4n h\u1ecdc,Qu\u1eadn,H\u00ecnh th\u1ee9c,L\u1ecbch h\u1ecdc,Ghi ch\u00fa,Ng\u00e0y \u0111\u0103ng k\u00fd,Tr\u1ea1ng th\u00e1i\n';
          const rows = registrations.map(r => `"${r.parentName}","${r.phone}","${r.studentName}","${r.grade}","${r.subjects.join(', ')}","${r.district}","${r.mode}","${r.schedule}","${r.note}","${fmt(r.createdAt)}","${r.status}"`).join('\n');
          const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
          const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `dang-ky-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
        }}
          className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Chưa có đăng ký nào</p>
          <p className="text-xs text-slate-400 mt-1">Phụ huynh đăng ký trên trang công khai sẽ hiển thị tại đây</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map(reg => (
            <div key={reg.id} className={`bg-white rounded-2xl border p-5 transition-all ${reg.status === 'Mới' ? 'border-blue-300 shadow-sm' : 'border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {/* Parent info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-800">{reg.parentName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[reg.status] || 'bg-slate-100 text-slate-600'}`}>
                      {reg.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-blue-500" />{reg.phone}</span>
                    {reg.studentName && <span>HS: {reg.studentName}</span>}
                    <span>{reg.grade}</span>
                    {reg.district && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{reg.district}</span>}
                    <span>{reg.mode}</span>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1.5">
                    {reg.subjects.map((sub, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">{sub}</span>
                    ))}
                  </div>

                  {/* Schedule & Note */}
                  {reg.schedule && <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{reg.schedule}</p>}
                  {reg.note && <p className="text-xs text-slate-500 italic">"{reg.note}"</p>}

                  <p className="text-[10px] text-slate-400">{fmt(reg.createdAt)}</p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {reg.status === 'Mới' && (
                    <button onClick={() => reg.id && onUpdateStatus(reg.id, 'Đã liên hệ')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                      <Phone className="w-3 h-3" /><span>Đã liên hệ</span>
                    </button>
                  )}
                  {(reg.status === 'Mới' || reg.status === 'Đã liên hệ') && (
                    <button onClick={() => reg.id && onUpdateStatus(reg.id, 'Đã xếp lớp')}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /><span>Xếp lớp</span>
                    </button>
                  )}
                  {reg.status !== 'Hủy' && (
                    <button onClick={() => reg.id && onUpdateStatus(reg.id, 'Hủy')}
                      className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                      <XCircle className="w-3 h-3" /><span>Hủy</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
