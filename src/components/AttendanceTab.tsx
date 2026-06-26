import React, { useState } from 'react';
import { AttendanceRecord, ClassMatch } from '../types';
import { ClipboardCheck, Plus, Search, Download, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AttendanceTabProps {
  attendance: AttendanceRecord[];
  matches: ClassMatch[];
  onAddRecord: (r: AttendanceRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ attendance, matches, onAddRecord, onDeleteRecord }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selMatch, setSelMatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<AttendanceRecord['status']>('Đã dạy');
  const [note, setNote] = useState('');

  const activeMatches = matches.filter(m => m.status === 'Đang dạy');

  const filtered = attendance
    .filter(a => !searchTerm || a.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) || a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || a.classCode.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(a => !dateFilter || a.date === dateFilter)
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalTaught = attendance.filter(a => a.status === 'Đã dạy').length;
  const totalMissed = attendance.filter(a => a.status !== 'Đã dạy').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const m = activeMatches.find(x => x.id === selMatch);
    if (!m) return;
    onAddRecord({ matchId: m.id!, classCode: m.classCode, tutorCode: m.tutorCode, tutorName: m.tutorName, studentName: m.studentName || '', date, status, note, createdAt: Date.now() });
    setShowAdd(false); setNote('');
  };

  const exportCsv = () => {
    const header = 'Mã lớp,Gia sư,Học sinh,Ngày,Trạng thái,Ghi chú\n';
    const rows = attendance.map(a => `"${a.classCode}","${a.tutorName}","${a.studentName}","${a.date}","${a.status}","${a.note || ''}"`).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `diem-danh-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  const statusIcon = (s: string) => {
    if (s === 'Đã dạy') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    if (s === 'Hủy') return <XCircle className="w-3.5 h-3.5 text-red-500" />;
    return <Clock className="w-3.5 h-3.5 text-amber-500" />;
  };
  const statusColor = (s: string) => {
    if (s === 'Đã dạy') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'Hủy') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-emerald-600" /> Điểm danh buổi học</h2>
          <p className="text-xs text-slate-500 mt-0.5">{attendance.length} buổi · Đã dạy: <span className="font-bold text-emerald-600">{totalTaught}</span> · Vắng: <span className="font-bold text-red-500">{totalMissed}</span></p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export</button>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-600/20"><Plus className="w-4 h-4" /> Điểm danh</button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm GS, HS, mã lớp..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
        </div>
        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none cursor-pointer" />
        </div>
        {dateFilter && <button onClick={() => setDateFilter('')} className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer">Xóa lọc</button>}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
          <ClipboardCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-sm">{attendance.length === 0 ? 'Chưa có bản ghi điểm danh' : 'Không tìm thấy'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Ngày</th>
                <th className="px-4 py-3 font-semibold">Mã lớp</th>
                <th className="px-4 py-3 font-semibold">Gia sư</th>
                <th className="px-4 py-3 font-semibold">Học sinh</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Ghi chú</th>
                <th className="px-4 py-3 font-semibold text-right">Xóa</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold">{a.date}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.classCode}</td>
                  <td className="px-4 py-3 font-medium">{a.tutorName}</td>
                  <td className="px-4 py-3">{a.studentName}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 w-fit border ${statusColor(a.status)}`}>{statusIcon(a.status)}{a.status}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-500 italic max-w-[200px] truncate">{a.note || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => a.id && window.confirm('Xóa bản ghi này?') && onDeleteRecord(a.id)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer p-1"><XCircle className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-emerald-600" /> Điểm danh buổi học</h3>
            {activeMatches.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">Chưa có lớp nào đang dạy. Hãy ghép lớp trước.</p>
            ) : (
              <form onSubmit={handleCreate} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Lớp đang dạy *</label>
                  <select required value={selMatch} onChange={e => setSelMatch(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm">
                    <option value="">-- Chọn lớp --</option>
                    {activeMatches.map(m => <option key={m.id} value={m.id}>{m.classCode} · {m.tutorName} → {m.studentName || 'N/A'}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Ngày *</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Trạng thái *</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm">
                      <option value="Đã dạy">✅ Đã dạy</option>
                      <option value="Nghỉ GS">📵 Nghỉ GS</option>
                      <option value="Nghỉ HS">🏠 Nghỉ HS</option>
                      <option value="Hủy">❌ Hủy</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Ghi chú</label>
                  <input value={note} onChange={e => setNote(e.target.value)} placeholder="VD: HS vắng do ốm"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer">Hủy</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer">Lưu</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
