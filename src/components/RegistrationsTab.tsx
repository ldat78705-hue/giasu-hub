import React, { useState } from 'react';
import { ParentRegistration } from '../types';
import { UserPlus, Phone, MapPin, Clock, CheckCircle2, XCircle, Download, Search, ArrowUpDown, AlertTriangle, Sparkles } from 'lucide-react';
import { getOverdueRegistrations } from '../utils';

interface RegistrationsTabProps {
  registrations: ParentRegistration[];
  onUpdateStatus: (id: string, status: ParentRegistration['status']) => void;
  onUpdateNote?: (id: string, note: string) => void;
  onSuggestTutor?: (reg: ParentRegistration) => void;
}

export const RegistrationsTab: React.FC<RegistrationsTabProps> = ({ registrations, onUpdateStatus, onUpdateNote, onSuggestTutor }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'status'>('newest');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const overdueRegs = getOverdueRegistrations(registrations);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(r => r.id!).filter(Boolean)));
  };
  const batchUpdateStatus = (status: ParentRegistration['status']) => {
    selectedIds.forEach(id => onUpdateStatus(id, status));
    setSelectedIds(new Set());
  };

  const fmt = (ts: number) => new Date(ts).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusColors: Record<string, string> = {
    'Mới': 'bg-blue-100 text-blue-700',
    'Đã liên hệ': 'bg-amber-100 text-amber-700',
    'Đã xếp lớp': 'bg-emerald-100 text-emerald-700',
    'Hủy': 'bg-red-100 text-red-700',
  };

  const newCount = registrations.filter(r => r.status === 'Mới').length;

  const statusOrder: Record<string, number> = { 'Mới': 0, 'Đã liên hệ': 1, 'Đã xếp lớp': 2, 'Hủy': 3 };

  const filtered = registrations
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return r.parentName.toLowerCase().includes(q) || r.phone.includes(q) ||
        (r.studentName || '').toLowerCase().includes(q) || r.subjects.some(s => s.toLowerCase().includes(q)) ||
        (r.district || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'name') return a.parentName.localeCompare(b.parentName, 'vi');
      return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
    });

  const exportCsv = () => {
    const header = 'Phụ huynh,SĐT,Học sinh,Lớp,Môn học,Quận,Hình thức,Lịch học,Ghi chú,Ghi chú admin,Ngày đăng ký,Trạng thái\n';
    const rows = registrations.map(r =>
      `"${r.parentName}","${r.phone}","${r.studentName}","${r.grade}","${r.subjects.join(', ')}","${r.district}","${r.mode}","${r.schedule}","${r.note}","${(r.adminNote || '').replace(/"/g, '""')}","${fmt(r.createdAt)}","${r.status}"`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `dang-ky-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="col-span-12 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Đăng ký tìm gia sư</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {registrations.length} đăng ký • {newCount > 0 && <span className="text-blue-600 font-bold">{newCount} mới chưa xử lý</span>}
          </p>
        </div>
        <button onClick={exportCsv}
          className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Filter + Search */}
      {registrations.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SĐT, môn, quận..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { val: 'all', label: 'Tất cả', color: '' },
              { val: 'Mới', label: `Mới${newCount > 0 ? ` (${newCount})` : ''}`, color: 'text-blue-600' },
              { val: 'Đã liên hệ', label: 'Đã liên hệ', color: 'text-amber-600' },
              { val: 'Đã xếp lớp', label: 'Đã xếp lớp', color: 'text-emerald-600' },
              { val: 'Hủy', label: 'Hủy', color: 'text-red-600' },
            ].map(f => (
              <button key={f.val} onClick={() => setStatusFilter(f.val)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  statusFilter === f.val ? 'bg-blue-600 text-white border-blue-600' : `bg-white ${f.color || 'text-slate-600'} border-slate-200 hover:border-blue-300`
                }`}>{f.label}</button>
            ))}
          </div>
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none cursor-pointer">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>
        </div>
      )}

      {/* Overdue Alert - #22 Reminder */}
      {overdueRegs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800">{overdueRegs.length} đơn đăng ký quá 24h chưa liên hệ!</p>
            <p className="text-[10px] text-amber-600 mt-0.5">{overdueRegs.map(r => r.parentName).join(', ')}</p>
          </div>
          <button onClick={() => { setStatusFilter('Mới'); setSortBy('oldest'); }}
            className="px-3 py-1.5 bg-amber-600 text-white text-[10px] font-bold rounded-lg cursor-pointer">Xem ngay</button>
        </div>
      )}

      {/* Batch Actions - #21 */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-blue-800">Đã chọn {selectedIds.size} đơn</span>
          <div className="flex gap-2">
            <button onClick={() => batchUpdateStatus('Đã liên hệ')}
              className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"><Phone className="w-3 h-3" /> Đã liên hệ</button>
            <button onClick={() => batchUpdateStatus('Đã xếp lớp')}
              className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Xếp lớp</button>
            <button onClick={() => batchUpdateStatus('Hủy')}
              className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"><XCircle className="w-3 h-3" /> Hủy</button>
            <button onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer">Bỏ chọn</button>
          </div>
        </div>
      )}

      {/* Select All */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll}
            className="w-4 h-4 rounded cursor-pointer" />
          <span className="text-[10px] text-slate-500">Chọn tất cả ({filtered.length})</span>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">{registrations.length === 0 ? 'Chưa có đăng ký nào' : 'Không tìm thấy kết quả'}</p>
          <p className="text-xs text-slate-400 mt-1">
            {registrations.length === 0 ? 'Phụ huynh đăng ký trên trang công khai sẽ hiển thị tại đây' : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(reg => (
            <div key={reg.id} className={`bg-white rounded-2xl border p-5 transition-all ${reg.status === 'Mới' ? 'border-blue-300 shadow-sm' : selectedIds.has(reg.id || '') ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
              <div className="flex items-start gap-3">
                {reg.id && <input type="checkbox" checked={selectedIds.has(reg.id)} onChange={() => toggleSelect(reg.id!)}
                  className="w-4 h-4 mt-1 rounded cursor-pointer shrink-0" />}
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

                  {/* Status History */}
                  {reg.statusHistory && reg.statusHistory.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reg.statusHistory.map((h, i) => (
                        <span key={i} className="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          {h.status} · {new Date(h.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Admin Note */}
                  <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                    {editingNote === reg.id ? (
                      <div className="flex gap-1">
                        <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                          placeholder="VD: Cần GS nữ, kiên nhẫn..." autoFocus
                          className="flex-1 px-2 py-1 text-xs border border-blue-300 rounded bg-blue-50 outline-none" />
                        <button onClick={() => { if (reg.id && onUpdateNote) { onUpdateNote(reg.id, noteText); } setEditingNote(null); }}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold cursor-pointer">Lưu</button>
                        <button onClick={() => setEditingNote(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] cursor-pointer">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingNote(reg.id || null); setNoteText(reg.adminNote || ''); }}
                        className="text-[10px] text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                        {reg.adminNote ? <span className="text-slate-500 italic">📝 {reg.adminNote}</span> : '+ Ghi chú admin'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {onSuggestTutor && (reg.status === 'Mới' || reg.status === 'Đã liên hệ') && (
                    <button onClick={() => onSuggestTutor(reg)}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /><span>Đề xuất GS</span>
                    </button>
                  )}
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
