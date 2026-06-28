import React, { useState } from 'react';
import { ClassMatch, ClassItem, TutorItem, InternalNote } from '../types';
import { Plus, CheckCircle2, XCircle, Clock, Trash2, Search, Download, MessageSquare, Pin, DollarSign, Printer } from 'lucide-react';
import { generateConnectionContract } from '../utils';

interface MatchesTabProps {
  matches: ClassMatch[];
  classes: ClassItem[];
  tutors: TutorItem[];
  onAddMatch: (m: ClassMatch) => void;
  onUpdateStatus: (id: string, status: ClassMatch['status']) => void;
  onDeleteMatch: (id: string) => void;
  onAddNote?: (matchId: string, note: InternalNote) => void;
  onCollectFee?: (matchId: string, tutorName: string, classSubject: string, fee: number) => void;
  centerName?: string;
  centerPhone?: string;
  bankInfo?: { bankName?: string; bankAccount?: string; bankAccountName?: string; bankBin?: string };
}

export const MatchesTab: React.FC<MatchesTabProps> = ({ matches, classes, tutors, onAddMatch, onUpdateStatus, onDeleteMatch, onAddNote, onCollectFee, centerName, centerPhone, bankInfo }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'Đang dạy' | 'Hoàn thành' | 'Hủy'>('all');
  const [search, setSearch] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Form
  const [selClass, setSelClass] = useState('');
  const [selTutor, setSelTutor] = useState('');
  const [studentName, setStudentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [fee, setFee] = useState(250000);
  const [sessionsPerMonth, setSessionsPerMonth] = useState(8);
  const [feePercent, setFeePercent] = useState(40);
  const [note, setNote] = useState('');

  const filtered = matches
    .filter(m => filter === 'all' || m.status === filter)
    .filter(m => {
      if (!search) return true;
      const q = search.toLowerCase();
      return m.classSubject.toLowerCase().includes(q) || m.tutorName.toLowerCase().includes(q) || (m.studentName || '').toLowerCase().includes(q);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const activeCount = matches.filter(m => m.status === 'Đang dạy').length;
  const doneCount = matches.filter(m => m.status === 'Hoàn thành').length;

  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find(c => c.code === selClass);
    const tutor = tutors.find(t => t.code === selTutor);
    if (!cls || !tutor) return;
    onAddMatch({
      classCode: cls.code, classSubject: cls.subject,
      tutorCode: tutor.code, tutorName: tutor.name,
      studentName, parentPhone, fee: Number(fee) || 250000,
      sessionsPerMonth: sessionsPerMonth || 8,
      feePercent: feePercent || 40,
      startDate: Date.now(), status: 'Đang dạy', note,
      createdAt: Date.now(),
    });
    setShowAdd(false); setSelClass(''); setSelTutor(''); setStudentName(''); setParentPhone(''); setNote(''); setSessionsPerMonth(8); setFeePercent(40);
  };

  const exportCsv = () => {
    const header = 'Lớp,Môn,Gia sư,Học sinh,SĐT phụ huynh,Phí/buổi,Ngày bắt đầu,Trạng thái,Ghi chú\n';
    const rows = matches.map(m =>
      `${m.classCode},"${m.classSubject}","${m.tutorName}","${m.studentName || ''}","${m.parentPhone || ''}",${m.fee},${fmtDate(m.startDate)},${m.status},"${m.note || ''}"`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `ghep-lop-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP');

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Ghép lớp & Lịch sử</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {matches.length} ghép lớp · <span className="text-emerald-600 font-bold">{activeCount} đang dạy</span> · {doneCount} hoàn thành
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Xuất CSV
          </button>
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-600/20">
            <Plus className="w-4 h-4" /> Ghép lớp mới
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo môn, gia sư, học sinh..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
        </div>
        <div className="flex gap-2">
          {(['all', 'Đang dạy', 'Hoàn thành', 'Hủy'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}>{f === 'all' ? 'Tất cả' : f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="font-semibold text-sm">{matches.length === 0 ? 'Chưa có ghép lớp nào' : 'Không tìm thấy kết quả'}</p>
            <p className="text-xs mt-1">Nhấn "Ghép lớp mới" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-bold">Lớp</th>
                  <th className="px-4 py-3 text-left font-bold">Gia sư</th>
                  <th className="px-4 py-3 text-left font-bold">Học sinh</th>
                  <th className="px-4 py-3 text-left font-bold">Phí/buổi</th>
                  <th className="px-4 py-3 text-left font-bold">Bắt đầu</th>
                  <th className="px-4 py-3 text-left font-bold">Trạng thái</th>
                  <th className="px-4 py-3 text-center font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <React.Fragment key={m.id}>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-blue-600 text-xs">{m.classCode}</span>
                      <p className="text-xs text-slate-600 mt-0.5">{m.classSubject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 text-xs">{m.tutorName}</span>
                      <p className="text-[10px] text-slate-400 font-mono">{m.tutorCode}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {m.studentName || '—'}
                      {m.parentPhone && <p className="text-[10px] text-slate-400">{m.parentPhone}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-blue-600">{fmt(m.fee)}đ</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(m.startDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Đang dạy' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'Hoàn thành' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>{m.status}</span>
                      {m.status === 'Đang dạy' && (
                        m.feePaid
                          ? <span className="ml-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">✓ Đã thu {m.feeAmount ? fmt(m.feeAmount) + 'đ' : ''}</span>
                          : <span className="ml-1 px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded">Chưa thu phí</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {m.status === 'Đang dạy' && (
                          <>
                            <button onClick={() => m.id && onUpdateStatus(m.id, 'Hoàn thành')}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Xong
                            </button>
                            <button onClick={() => m.id && onUpdateStatus(m.id, 'Hủy')}
                              className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 text-[10px] font-bold rounded-lg cursor-pointer">
                              <XCircle className="w-3 h-3" />
                            </button>
                          </>
                        )}
                        {m.status === 'Đang dạy' && !m.feePaid && onCollectFee && (() => {
                          const s = m.sessionsPerMonth || 8;
                          const p = m.feePercent || 40;
                          const calcFee = Math.round(m.fee * s * p / 100);
                          return (
                            <button onClick={() => m.id && onCollectFee(m.id, m.tutorName, m.classSubject, m.fee)}
                              title={`${fmt(m.fee)}đ × ${s} buổi × ${p}% = ${fmt(calcFee)}đ`}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                              <DollarSign className="w-3 h-3" /> {fmt(calcFee)}đ
                            </button>
                          );
                        })()}
                        <button onClick={() => generateConnectionContract(m, centerName || 'Gia Sư Thành Đạt', centerPhone || '', bankInfo)}
                          title="In biên bản kết nối"
                          className="px-2 py-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer">
                          <Printer className="w-3 h-3" />
                        </button>
                        <button onClick={() => m.id && window.confirm(`Xóa ghép lớp ${m.classSubject} - ${m.tutorName}?`) && onDeleteMatch(m.id)}
                          className="px-2 py-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => setExpandedNotes(expandedNotes === m.id ? null : (m.id || null))}
                        className="px-2 py-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer relative">
                        <MessageSquare className="w-3 h-3" />
                        {(m.internalNotes || []).length > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[8px] flex items-center justify-center font-bold">{(m.internalNotes || []).length}</span>
                        )}
                      </button>
                    </td>
                  </tr>
                  {/* Feature 4: Internal Notes row */}
                  {expandedNotes === m.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 bg-slate-50">
                        <div className="space-y-2">
                          {/* F50: Status History Timeline */}
                          {m.statusHistory && m.statusHistory.length > 0 && (
                            <div className="mb-3 pb-3 border-b border-slate-200">
                              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">📋 Lịch sử trạng thái</div>
                              <div className="flex flex-wrap gap-2">
                                {m.statusHistory.map((h, i) => (
                                  <div key={i} className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-lg">
                                    <span className={`font-bold ${h.status === 'Đang dạy' ? 'text-emerald-600' : h.status === 'Hủy' ? 'text-red-600' : 'text-blue-600'}`}>{h.status}</span>
                                    <span className="text-slate-400 ml-1">{new Date(h.date).toLocaleDateString('vi-VN')}</span>
                                    {h.by && <span className="text-slate-400 ml-1">· {h.by}</span>}
                                    {h.reason && <span className="text-slate-500 ml-1 italic">({h.reason})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-xs font-bold text-slate-700">Ghi chú nội bộ</span>
                          </div>
                          {(m.internalNotes || []).length > 0 ? (
                            <div className="space-y-1.5">
                              {(m.internalNotes || []).sort((a, b) => b.createdAt - a.createdAt).map(n => (
                                <div key={n.id} className={`text-xs p-2 rounded-lg ${n.pinned ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-slate-200'}`}>
                                  <div className="flex justify-between">
                                    <span className="font-bold text-slate-700">{n.author}</span>
                                    <span className="text-[9px] text-slate-400">{new Date(n.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-slate-600 mt-0.5">{n.text}</p>
                                </div>
                              ))}
                            </div>
                          ) : <p className="text-xs text-slate-400">Chưa có ghi chú</p>}
                          {onAddNote && (
                            <div className="flex gap-1.5 mt-2">
                              <input value={newNoteText} onChange={e => setNewNoteText(e.target.value)}
                                placeholder="Thêm ghi chú..." className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none" />
                              <button onClick={() => {
                                if (m.id && newNoteText.trim()) {
                                  onAddNote(m.id, { id: `n${Date.now()}`, text: newNoteText.trim(), author: 'Admin', createdAt: Date.now() });
                                  setNewNoteText('');
                                }
                              }} className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer">Gửi</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tổng ghép</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{matches.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Đang dạy</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Hoàn thành</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{doneCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Phí kết nối đã thu</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{fmt(matches.filter(m => m.feePaid && m.feeAmount).reduce((s, m) => s + (m.feeAmount || 0), 0))}đ</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{matches.filter(m => m.feePaid).length}/{matches.filter(m => m.status === 'Đang dạy').length} lớp</div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Ghép lớp mới</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Chọn lớp *</label>
                <select required value={selClass} onChange={e => setSelClass(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm">
                  <option value="">-- Chọn lớp --</option>
                  {pendingClasses.map(c => <option key={c.id || c.code} value={c.code}>{c.code} - {c.subject} ({c.location})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Chọn gia sư *</label>
                <select required value={selTutor} onChange={e => setSelTutor(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm">
                  <option value="">-- Chọn gia sư --</option>
                  {tutors.filter(t => t.verified).map(t => <option key={t.id || t.code} value={t.code}>{t.code} - {t.name} ({t.subjects.join(', ')})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tên học sinh</label>
                  <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">SĐT phụ huynh</label>
                  <input value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="0912345678" type="tel"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phí/buổi (VNĐ)</label>
                <input type="number" value={fee} onChange={e => setFee(Number(e.target.value))} min={50000} step={10000}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Buổi/tháng</label>
                  <input type="number" value={sessionsPerMonth} onChange={e => setSessionsPerMonth(Number(e.target.value))} min={1} max={30}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phí kết nối (%)</label>
                  <input type="number" value={feePercent} onChange={e => setFeePercent(Number(e.target.value))} min={10} max={100} step={5}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>
              {fee > 0 && sessionsPerMonth > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs">
                  <div className="font-bold text-blue-800">Phí kết nối 1 lần: <span className="text-blue-600">{fmt(Math.round(fee * sessionsPerMonth * feePercent / 100))}đ</span></div>
                  <div className="text-blue-600 mt-0.5">= {fmt(fee)}đ × {sessionsPerMonth} buổi × {feePercent}%</div>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Ghi chú</label>
                <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú nội bộ..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Ghép lớp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
