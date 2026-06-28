import React, { useState } from 'react';
import { StudentItem, EmergencyContact } from '../types';
import { Plus, Phone, Trash2, X, ChevronDown, ChevronUp, Mail, MapPin, User, Users, Download, StickyNote, Save, Search, ArrowUpDown } from 'lucide-react';

interface StudentTabProps {
  students: StudentItem[];
  onAddStudent: (st: StudentItem) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStatus: (id: string, status: StudentItem['status']) => void;
  onUpdateNote?: (id: string, note: string) => void;
}

export const StudentTab: React.FC<StudentTabProps> = ({ students, onAddStudent, onDeleteStudent, onUpdateStatus, onUpdateNote }) => {
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'grade'>('newest');

  const filtered = students
    .filter(st => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return st.name.toLowerCase().includes(q) || (st.parentName || '').toLowerCase().includes(q) ||
        (st.parentPhone || st.phone || '').includes(q) || st.grade.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'vi');
      if (sortBy === 'grade') return a.grade.localeCompare(b.grade, 'vi');
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

  // Form fields
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Lớp 12');
  const [dob, setDob] = useState('');
  const [school, setSchool] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [parentRelation, setParentRelation] = useState('Mẹ');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [note, setNote] = useState('');

  const addEmergency = () => setEmergencyContacts(prev => [...prev, { name: '', phone: '', relation: '' }]);
  const updateEmergency = (i: number, field: keyof EmergencyContact, val: string) => {
    setEmergencyContacts(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  const resetForm = () => {
    setName(''); setGrade('Lớp 12'); setDob(''); setSchool('');
    setParentName(''); setParentPhone(''); setParentEmail(''); setParentAddress('');
    setParentRelation('Mẹ'); setEmergencyContacts([]); setNote('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !parentPhone) return;
    onAddStudent({
      name, grade, dob, school,
      parentName, parentPhone, phone: parentPhone,
      parentEmail, parentAddress, parentRelation,
      emergencyContacts: emergencyContacts.filter(c => c.name && c.phone),
      enrolledClasses: 0, status: 'Chờ xếp lớp',
      note, createdAt: Date.now(),
    });
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/75 shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Học sinh</h2>
          <p className="text-xs text-slate-500 mt-1">{students.length} học sinh · Thông tin PHHS tích hợp</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            const header = 'H\u1ecdc sinh,L\u1edbp,Ph\u1ee5 huynh,S\u0110T PH,Email PH,\u0110\u1ecba ch\u1ec9,Tr\u1ea1ng th\u00e1i,Ghi ch\u00fa admin\n';
            const rows = students.map(s => `"${s.name}","${s.grade}","${s.parentName}","${s.parentPhone || s.phone}","${s.parentEmail || ''}","${s.parentAddress || ''}","${s.status}","${(s.adminNote || '').replace(/"/g, '""')}"`).join('\n');
            const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `hoc-sinh-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
          }}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/20 cursor-pointer">
            <Plus className="w-4 h-4" /><span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      {students.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm học sinh, phụ huynh, số điện thoại..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
          </div>
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none cursor-pointer">
              <option value="newest">Mới nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="grade">Lớp</option>
            </select>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-sm">{students.length === 0 ? 'Chưa có học sinh nào' : 'Không tìm thấy kết quả'}</p>
          {students.length === 0 && <p className="text-xs mt-1">Nhấn "Thêm học sinh" để bắt đầu quản lý</p>}
        </div>
      ) : (
        <div className="border border-slate-200 overflow-hidden" style={{ borderRadius: 4 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Học sinh</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lớp</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phụ huynh</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Liên hệ</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trạng thái</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: 90 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <React.Fragment key={st.id || st.phone}>
                  <tr
                    onClick={() => setExpandedId(expandedId === st.id ? null : st.id || null)}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{st.name}</div>
                      {st.school && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{st.school}</div>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: 3 }}>{st.grade}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      <div style={{ fontSize: 13 }}>{st.parentRelation || 'PHHS'}: {st.parentName || '—'}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569' }}>
                        <Phone style={{ width: 12, height: 12, color: '#94a3b8' }} />
                        {st.parentPhone || st.phone}
                      </div>
                      {st.parentEmail && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                          <Mail style={{ width: 11, height: 11 }} />
                          {st.parentEmail}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <select value={st.status} onChange={(e) => { e.stopPropagation(); st.id && onUpdateStatus(st.id, e.target.value as any); }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 3, cursor: 'pointer', border: '1px solid',
                          background: st.status === 'Đang học' ? '#ecfdf5' : st.status === 'Chờ xếp lớp' ? '#eef2ff' : '#f8fafc',
                          color: st.status === 'Đang học' ? '#059669' : st.status === 'Chờ xếp lớp' ? '#4f46e5' : '#64748b',
                          borderColor: st.status === 'Đang học' ? '#a7f3d0' : st.status === 'Chờ xếp lớp' ? '#c7d2fe' : '#e2e8f0',
                          outline: 'none',
                        }}>
                        <option value="Đang học">Đang học</option>
                        <option value="Chờ xếp lớp">Chờ xếp lớp</option>
                        <option value="Bảo lưu">Bảo lưu</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        {st.id && (
                          <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Xóa học sinh ${st.name}?`)) onDeleteStudent(st.id!); }}
                            style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        )}
                        {expandedId === st.id ? <ChevronUp style={{ width: 14, height: 14, color: '#94a3b8' }} /> : <ChevronDown style={{ width: 14, height: 14, color: '#94a3b8' }} />}
                      </div>
                    </td>
                  </tr>
                  {/* Expanded detail row */}
                  {expandedId === st.id && (
                    <tr>
                      <td colSpan={6} style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 12, marginBottom: st.adminNote || editingNote === st.id ? 12 : 0 }}>
                          {st.dob && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Ngày sinh</span><span style={{ fontWeight: 600, color: '#334155' }}>{st.dob}</span></div>}
                          {st.school && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Trường</span><span style={{ fontWeight: 600, color: '#334155' }}>{st.school}</span></div>}
                          {st.parentAddress && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Địa chỉ</span><span style={{ fontWeight: 600, color: '#334155' }}>{st.parentAddress}</span></div>}
                          {st.note && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Ghi chú</span><span style={{ color: '#334155' }}>{st.note}</span></div>}
                        </div>
                        {st.emergencyContacts && st.emergencyContacts.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Liên hệ khẩn cấp</span>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                              {st.emergencyContacts.map((c, i) => (
                                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 3, padding: '4px 8px', fontSize: 12 }}>
                                  <Phone style={{ width: 11, height: 11, color: '#4f46e5' }} />
                                  <span style={{ fontWeight: 600, color: '#334155' }}>{c.name}</span>
                                  <span style={{ color: '#94a3b8' }}>({c.relation})</span>
                                  <a href={`tel:${c.phone}`} style={{ color: '#4f46e5', fontFamily: 'monospace' }}>{c.phone}</a>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Admin note */}
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                          <span style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><StickyNote style={{ width: 11, height: 11 }} /> GHI CHÚ ADMIN (NỘI BỘ)</span>
                          {editingNote === st.id ? (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                                placeholder="Ví dụ: Phụ huynh kỹ tính..." autoFocus
                                style={{ flex: 1, padding: '4px 8px', fontSize: 12, border: '1px solid #818cf8', borderRadius: 3, background: '#eef2ff', outline: 'none' }} />
                              <button onClick={() => { if (st.id && onUpdateNote) { onUpdateNote(st.id, noteText); } setEditingNote(null); }}
                                style={{ padding: '4px 10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 3, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Save style={{ width: 11, height: 11 }} /> Lưu
                              </button>
                              <button onClick={() => setEditingNote(null)}
                                style={{ padding: '4px 8px', background: '#e2e8f0', border: 'none', borderRadius: 3, cursor: 'pointer' }}>
                                <X style={{ width: 11, height: 11, color: '#64748b' }} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingNote(st.id || null); setNoteText(st.adminNote || ''); }}
                              style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                              {st.adminNote ? <span style={{ color: '#475569', fontStyle: 'italic' }}>"{st.adminNote}"</span> : '+ Thêm ghi chú'}
                            </button>
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-slate-200/75 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Thêm Học sinh mới</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              {/* Học sinh info */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Thông tin học sinh</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tên học sinh *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn B"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Lớp</label>
                    <select value={grade} onChange={e => setGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors">
                      {['Tiểu học', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học', 'Khác'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Ngày sinh</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Trường</label>
                    <input value={school} onChange={e => setSchool(e.target.value)} placeholder="Ví dụ: THPT Chu Văn An"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* PHHS info */}
              <div className="bg-indigo-50/50 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Thông tin Phụ huynh</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Quan hệ</label>
                    <select value={parentRelation} onChange={e => setParentRelation(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors">
                      {['Bố', 'Mẹ', 'Ông', 'Bà', 'Anh/Chị', 'Khác'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Họ tên PHHS</label>
                    <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Anh/Chị ..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Số điện thoại phụ huynh *</label>
                    <input required type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="0912345678"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                    <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="email@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Địa chỉ</label>
                  <input value={parentAddress} onChange={e => setParentAddress(e.target.value)} placeholder="Số nhà, phường/xã, quận/huyện"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:border-indigo-500 transition-colors" />
                </div>
              </div>

              {/* Emergency contacts */}
              <div className="bg-amber-50/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Liên hệ khẩn cấp</h4>
                  <button type="button" onClick={addEmergency}
                    className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded cursor-pointer flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Thêm
                  </button>
                </div>
                {emergencyContacts.map((c, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_80px_28px] gap-2 items-center">
                    <input value={c.name} onChange={e => updateEmergency(i, 'name', e.target.value)} placeholder="Họ tên"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" />
                    <input value={c.phone} onChange={e => updateEmergency(i, 'phone', e.target.value)} placeholder="Số điện thoại" type="tel"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" />
                    <select value={c.relation} onChange={e => updateEmergency(i, 'relation', e.target.value)}
                      className="px-1.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] outline-none">
                      <option value="">Quan hệ</option>
                      {['Bố', 'Mẹ', 'Anh/Chị', 'Bác', 'Chú', 'Khác'].map(r => <option key={r}>{r}</option>)}
                    </select>
                    <button type="button" onClick={() => setEmergencyContacts(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:bg-red-50 rounded p-1 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Ghi chú</label>
                <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú thêm về học sinh..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm resize-none focus:border-indigo-500 transition-colors" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">Lưu học sinh</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
