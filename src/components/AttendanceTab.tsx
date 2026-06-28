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
  const [tutorFeedback, setTutorFeedback] = useState('');

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
    onAddRecord({ matchId: m.id!, classCode: m.classCode, tutorCode: m.tutorCode, tutorName: m.tutorName, studentName: m.studentName || '', date, status, note, tutorFeedback: tutorFeedback || undefined, createdAt: Date.now() });
    setShowAdd(false); setNote(''); setTutorFeedback('');
  };

  const exportCsv = () => {
    const header = 'Mã lớp,Gia sư,Học sinh,Ngày,Trạng thái,Ghi chú,Nhận xét GS\n';
    const rows = attendance.map(a => `"${a.classCode}","${a.tutorName}","${a.studentName}","${a.date}","${a.status}","${a.note || ''}","${a.tutorFeedback || ''}"`).join('\n');
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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-indigo-600" /> Điểm danh buổi học</h2>
          <p className="text-xs text-slate-500 mt-0.5">{attendance.length} buổi · Đã dạy: <span className="font-bold text-emerald-600">{totalTaught}</span> · Vắng: <span className="font-bold text-red-500">{totalMissed}</span></p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Export</button>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-2 shadow-sm transition-colors"><Plus className="w-4 h-4" /> Điểm danh</button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, flex: 1, maxWidth: 320 }} className="focus-within:border-indigo-500 focus-within:bg-white transition-colors">
          <Search style={{ width: 16, height: 16, color: '#94a3b8', flexShrink: 0 }} />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm GS, HS, mã lớp..."
            style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 0', fontSize: 14, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4 }} className="focus-within:border-indigo-500 transition-colors">
          <Calendar style={{ width: 16, height: 16, color: '#94a3b8', flexShrink: 0 }} />
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 4px 8px 0', fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }} />
        </div>
        {dateFilter && <button onClick={() => setDateFilter('')} className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-xs font-bold cursor-pointer transition-colors">Xóa lọc</button>}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-10 text-center text-slate-400 shadow-sm">
          <ClipboardCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-sm">{attendance.length === 0 ? 'Chưa có bản ghi điểm danh' : 'Không tìm thấy'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200/75 shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Ngày</th>
                <th className="px-4 py-3 font-semibold">Mã lớp</th>
                <th className="px-4 py-3 font-semibold">Gia sư</th>
                <th className="px-4 py-3 font-semibold">Học sinh</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Ghi chú</th>
                <th className="px-4 py-3 font-semibold">Nhận xét GS</th>
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
                  <td className="px-4 py-3 text-xs text-purple-600 italic max-w-[200px] truncate">{a.tutorFeedback || '—'}</td>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-200/75 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-indigo-600" /> Điểm danh buổi học</h3>
            {activeMatches.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">Chưa có lớp nào đang dạy. Hãy ghép lớp trước.</p>
            ) : (
              <form onSubmit={handleCreate} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Lớp đang dạy *</label>
                  <select required value={selMatch} onChange={e => setSelMatch(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm transition-colors">
                    <option value="">-- Chọn lớp --</option>
                    {activeMatches.map(m => <option key={m.id} value={m.id}>{m.classCode} · {m.tutorName} → {m.studentName || 'Chưa có'}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Ngày *</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Trạng thái *</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm transition-colors">
                      <option value="Đã dạy">✅ Đã dạy</option>
                      <option value="Nghỉ GS">📵 Nghỉ GS</option>
                      <option value="Nghỉ HS">🏠 Nghỉ HS</option>
                      <option value="Hủy">❌ Hủy</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Ghi chú</label>
                  <input value={note} onChange={e => setNote(e.target.value)} placeholder="Ví dụ: Học sinh vắng do ốm"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-600 mb-1.5">📝 Nhận xét của gia sư (phụ huynh sẽ thấy khi tra cứu)</label>
                  <textarea value={tutorFeedback} onChange={e => setTutorFeedback(e.target.value)}
                    placeholder="Ví dụ: Bé tiếp thu tốt, cần ôn thêm phần phân số..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-lg outline-none focus:border-purple-500 text-sm transition-colors" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">Hủy</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm transition-colors">Lưu</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
