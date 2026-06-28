import React, { useState } from 'react';
import { TutorItem } from '../types';
import { Plus, Star, Trash2, Phone, Search, ShieldCheck, ShieldX, FileText, X, Eye, Download, StickyNote, Save, ArrowUpDown, Pencil } from 'lucide-react';

interface TutorTabProps {
  tutors: TutorItem[];
  onAddTutor: (newTutor: TutorItem) => void;
  onUpdateStatus: (id: string, st: TutorItem['status']) => void;
  onDeleteTutor: (id: string) => void;
  onVerifyTutor: (id: string, verified: boolean) => void;
  onUpdateNote?: (id: string, note: string) => void;
  onUpdateTutor?: (id: string, data: Partial<TutorItem>) => void;
}

export const TutorTab: React.FC<TutorTabProps> = ({ tutors, onAddTutor, onUpdateStatus, onDeleteTutor, onVerifyTutor, onUpdateNote, onUpdateTutor }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState(200000);
  const [phone, setPhone] = useState('');
  const [previewTutor, setPreviewTutor] = useState<TutorItem | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'rating' | 'verified'>('newest');
  // Edit tutor state
  const [editingTutor, setEditingTutor] = useState<TutorItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editSubjects, setEditSubjects] = useState('');
  const [editQualification, setEditQualification] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editHourlyRate, setEditHourlyRate] = useState(200000);
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editArea, setEditArea] = useState('');

  const openEditModal = (t: TutorItem) => {
    setEditingTutor(t);
    setEditName(t.name);
    setEditSubjects(t.subjects.join(', '));
    setEditQualification(t.qualification);
    setEditExperience(t.experience);
    setEditHourlyRate(t.hourlyRate);
    setEditPhone(t.phone || '');
    setEditEmail(t.email || '');
    setEditArea(t.area || '');
  };

  const handleEditSave = () => {
    if (!editingTutor?.id || !onUpdateTutor) return;
    onUpdateTutor(editingTutor.id, {
      name: editName,
      subjects: editSubjects.split(',').map(s => s.trim()).filter(Boolean),
      qualification: editQualification,
      experience: editExperience,
      hourlyRate: Number(editHourlyRate) || 200000,
      phone: editPhone,
      email: editEmail,
      area: editArea,
    });
    setEditingTutor(null);
  };

  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];

  const filtered = tutors.filter(t => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) ||
      t.subjects.some(s => s.toLowerCase().includes(q));
    const matchFilter = filter === 'all' ||
      (filter === 'verified' && t.verified) ||
      (filter === 'pending' && !t.verified);
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.registeredAt || 0) - (a.registeredAt || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'vi');
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
  });

  const pendingCount = tutors.filter(t => !t.verified).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const parts = name.trim().split(' ');
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
    onAddTutor({
      code: `GS${Math.floor(100 + Math.random() * 900)}`,
      name, avatar: initials.toUpperCase(),
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      subjects: subjects ? subjects.split(',').map(s => s.trim()).filter(Boolean) : [],
      qualification: qualification || '', experience: experience || '',
      rating: 5.0, status: 'online', hourlyRate: Number(hourlyRate) || 200000,
      phone: phone || '', verified: true, verifiedAt: Date.now(),
    });
    setShowModal(false);
    setName(''); setSubjects(''); setQualification(''); setExperience(''); setPhone('');
  };

  const docCount = (t: TutorItem) => {
    if (!t.documentUrls) return 0;
    let c = 0;
    if (t.documentUrls.cccdFrontUrl) c++;
    if (t.documentUrls.cccdBackUrl) c++;
    if (t.documentUrls.degreeUrls) c += t.documentUrls.degreeUrls.length;
    if (t.documentUrls.otherUrls) c += t.documentUrls.otherUrls.length;
    // Legacy
    if ((t.documentUrls as any).cccdUrl) c++;
    if ((t.documentUrls as any).degreeUrl) c++;
    return c;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/75 shadow-sm p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Gia sư</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tutors.length} gia sư • {pendingCount > 0 && <span className="text-amber-600 font-bold">{pendingCount} chờ xác minh</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            const header = 'M\u00e3,H\u1ecd t\u00ean,S\u0110T,Email,M\u00f4n d\u1ea1y,B\u1eb1ng c\u1ea5p,Kinh nghi\u1ec7m,X\u00e1c minh,Ghi ch\u00fa admin\n';
            const rows = tutors.map(t => `${t.code},"${t.name}","${t.phone || ''}","${t.email || ''}","${t.subjects.join(', ')}","${t.qualification}","${t.experience}",${t.verified ? 'C\u00f3' : 'Ch\u01b0a'},"${(t.adminNote || '').replace(/"/g, '""')}"`).join('\n');
            const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `gia-su-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
          }}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/20 cursor-pointer">
            <Plus className="w-4 h-4" /><span>Thêm Gia sư</span>
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      {tutors.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm gia sư..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'Tất cả' },
              { key: 'pending' as const, label: `Chờ duyệt (${pendingCount})` },
              { key: 'verified' as const, label: 'Đã xác minh' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                  filter === f.key ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}>{f.label}</button>
            ))}
          </div>
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-colors">
              <option value="newest">Mới nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="rating">Rating cao</option>
              <option value="verified">Đã xác minh</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
          <p style={{ fontWeight: 600, fontSize: 14 }}>{tutors.length === 0 ? 'Chưa có gia sư nào' : 'Không tìm thấy kết quả'}</p>
        </div>
      ) : (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gia sư</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Môn dạy</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bằng cấp · Kinh nghiệm</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: 90 }}>Trạng thái</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: 100 }}>Xác minh</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: 70 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const isExpanded = editingNote === (t.id || t.code) + '_expand';
                const toggleExpand = () => {
                  if (isExpanded) setEditingNote(null);
                  else setEditingNote((t.id || t.code) + '_expand');
                };
                return (
                  <React.Fragment key={t.id || t.code}>
                    <tr
                      onClick={toggleExpand}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                        background: !t.verified ? 'rgba(245,158,11,0.04)' : 'transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = !t.verified ? 'rgba(245,158,11,0.08)' : '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = !t.verified ? 'rgba(245,158,11,0.04)' : 'transparent')}
                    >
                      {/* Gia sư */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className={`${t.avatarColor}`} style={{ width: 36, height: 36, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{t.avatar}</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{t.name}</span>
                              {t.verified && <span style={{ background: '#4f46e5', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>✓</span>}
                              {!t.verified && <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>Chờ duyệt</span>}
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{t.code}</div>
                          </div>
                        </div>
                      </td>
                      {/* Môn dạy */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {t.subjects.slice(0, 3).map((sub, i) => (
                            <span key={i} style={{ background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{sub}</span>
                          ))}
                          {t.subjects.length > 3 && <span style={{ color: '#94a3b8', fontSize: 11 }}>+{t.subjects.length - 3}</span>}
                        </div>
                      </td>
                      {/* Bằng cấp / KN */}
                      <td style={{ padding: '12px 16px', color: '#475569', fontSize: 12 }}>
                        <div>{t.qualification || '—'}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontSize: 11, color: '#94a3b8' }}>
                          {t.experience}
                          {t.rating && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#f59e0b' }}>
                            <Star style={{ width: 11, height: 11, fill: '#f59e0b' }} />{t.rating}
                          </span>}
                        </div>
                      </td>
                      {/* Trạng thái */}
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <select value={t.status} onClick={e => e.stopPropagation()}
                          onChange={(e) => { e.stopPropagation(); t.id && onUpdateStatus(t.id, e.target.value as TutorItem['status']); }}
                          style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 3, cursor: 'pointer', border: '1px solid',
                            outline: 'none',
                            background: t.status === 'online' ? '#ecfdf5' : t.status === 'busy' ? '#fefce8' : '#f8fafc',
                            color: t.status === 'online' ? '#059669' : t.status === 'busy' ? '#ca8a04' : '#64748b',
                            borderColor: t.status === 'online' ? '#a7f3d0' : t.status === 'busy' ? '#fde68a' : '#e2e8f0',
                          }}>
                          <option value="online">🟢 Online</option>
                          <option value="busy">🟡 Bận</option>
                          <option value="offline">⚫ Offline</option>
                        </select>
                      </td>
                      {/* Xác minh */}
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        {!t.verified ? (
                          <button onClick={(e) => { e.stopPropagation(); t.id && onVerifyTutor(t.id, true); }}
                            style={{ padding: '4px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: 3, fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <ShieldCheck style={{ width: 12, height: 12 }} /> Xác minh
                          </button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); t.id && onVerifyTutor(t.id, false); }}
                            style={{ padding: '4px 10px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 3, fontSize: 10, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <ShieldX style={{ width: 12, height: 12 }} /> Hủy
                          </button>
                        )}
                      </td>
                      {/* Thao tác */}
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                          {docCount(t) > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); setPreviewTutor(t); }}
                              style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#f59e0b' }}
                              title={`Xem hồ sơ (${docCount(t)} file)`}>
                              <Eye style={{ width: 14, height: 14 }} />
                            </button>
                          )}
                          {onUpdateTutor && (
                            <button onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                              style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#3b82f6')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                              title="Sửa thông tin">
                              <Pencil style={{ width: 14, height: 14 }} />
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); t.id && window.confirm(`Xóa gia sư ${t.name}?`) && onDeleteTutor(t.id); }}
                            style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded detail */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, fontSize: 12, marginBottom: 12 }}>
                            {t.phone && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Điện thoại</span><a href={`tel:${t.phone}`} style={{ fontWeight: 600, color: '#4f46e5', textDecoration: 'none' }}>{t.phone}</a></div>}
                            {t.email && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Email</span><span style={{ fontWeight: 600, color: '#334155' }}>{t.email}</span></div>}
                            {t.teachingAreas && t.teachingAreas.length > 0 && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Khu vực dạy</span><span style={{ fontWeight: 600, color: '#334155' }}>{t.teachingAreas.join(', ')}</span></div>}
                            {t.gradeLevels && t.gradeLevels.length > 0 && <div><span style={{ display: 'block', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Lớp dạy</span><span style={{ fontWeight: 600, color: '#334155' }}>{t.gradeLevels.join(', ')}</span></div>}
                          </div>
                          {t.emergencyContacts && t.emergencyContacts.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Liên hệ khẩn cấp</span>
                              <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                                {t.emergencyContacts.map((c, i) => (
                                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 3, padding: '3px 8px', fontSize: 12 }}>
                                    <Phone style={{ width: 11, height: 11, color: '#4f46e5' }} />
                                    <span style={{ fontWeight: 600, color: '#334155' }}>{c.name}</span>
                                    <span style={{ color: '#94a3b8' }}>({c.relation})</span>
                                    <a href={`tel:${c.phone}`} style={{ color: '#4f46e5', fontFamily: 'monospace', textDecoration: 'none' }}>{c.phone}</a>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Onboarding for unverified */}
                          {!t.verified && (() => {
                            const checks = [
                              { label: 'CCCD', done: !!(t.documentUrls?.cccdFrontUrl || (t.documentUrls as any)?.cccdUrl) },
                              { label: 'Bằng cấp', done: !!((t.documentUrls?.degreeUrls?.length || 0) > 0 || (t.documentUrls as any)?.degreeUrl) },
                              { label: 'SĐT', done: !!t.phone },
                              { label: 'Xác minh', done: t.verified },
                            ];
                            const done = checks.filter(c => c.done).length;
                            return (
                              <div style={{ marginBottom: 12, padding: '8px 12px', background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>Onboarding {done}/{checks.length}</span>
                                <div style={{ flex: 1, height: 4, background: 'rgba(79,70,229,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                                  <div style={{ height: 4, background: '#4f46e5', borderRadius: 2, width: `${Math.round(done / checks.length * 100)}%` }} />
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                  {checks.map((c, i) => (
                                    <span key={i} style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 2, background: c.done ? 'rgba(16,185,129,0.15)' : '#f1f5f9', color: c.done ? '#059669' : '#94a3b8' }}>
                                      {c.done ? '✓' : '○'} {c.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                          {/* Admin note */}
                          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <StickyNote style={{ width: 12, height: 12, color: '#94a3b8' }} />
                            <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>Ghi chú admin:</span>
                            {t.adminNote ? (
                              <span style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>"{t.adminNote}"</span>
                            ) : (
                              <button onClick={(e) => { e.stopPropagation(); setEditingNote(t.id || t.code); setNoteText(t.adminNote || ''); }}
                                style={{ fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                + Thêm ghi chú
                              </button>
                            )}
                            {t.adminNote && (
                              <button onClick={(e) => { e.stopPropagation(); setEditingNote(t.id || t.code); setNoteText(t.adminNote || ''); }}
                                style={{ fontSize: 10, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                Sửa
                              </button>
                            )}
                          </div>
                          {editingNote === (t.id || t.code) && (
                            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                              <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                                placeholder="Ghi chú nội bộ..." autoFocus
                                style={{ flex: 1, padding: '4px 8px', fontSize: 12, border: '1px solid #818cf8', borderRadius: 3, background: '#eef2ff', outline: 'none' }} />
                              <button onClick={(e) => { e.stopPropagation(); if (t.id && onUpdateNote) { onUpdateNote(t.id, noteText); } setEditingNote((t.id || t.code) + '_expand'); }}
                                style={{ padding: '4px 10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 3, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                                <Save style={{ width: 11, height: 11 }} /> Lưu
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setEditingNote((t.id || t.code) + '_expand'); }}
                                style={{ padding: '4px 8px', background: '#e2e8f0', border: 'none', borderRadius: 3, cursor: 'pointer' }}>
                                <X style={{ width: 11, height: 11, color: '#64748b' }} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== DOCUMENT PREVIEW MODAL ===== */}
      {previewTutor && previewTutor.documentUrls && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewTutor(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200/75"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Hồ sơ: {previewTutor.name}</h3>
                <p className="text-xs text-slate-500">{previewTutor.code} · {previewTutor.phone}</p>
              </div>
              <button onClick={() => setPreviewTutor(null)} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {/* CCCD */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-amber-600" /> CCCD / CMND</h4>
              <div className="grid grid-cols-2 gap-4">
                {previewTutor.documentUrls.cccdFrontUrl ? (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 mb-1">Mặt trước</p>
                    <a href={previewTutor.documentUrls.cccdFrontUrl} target="_blank" rel="noopener noreferrer">
                      <img src={previewTutor.documentUrls.cccdFrontUrl} alt="CCCD trước" className="w-full h-48 object-cover rounded-lg border border-slate-200 hover:border-indigo-400 transition-colors cursor-pointer" />
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">Chưa có mặt trước</div>
                )}
                {previewTutor.documentUrls.cccdBackUrl ? (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 mb-1">Mặt sau</p>
                    <a href={previewTutor.documentUrls.cccdBackUrl} target="_blank" rel="noopener noreferrer">
                      <img src={previewTutor.documentUrls.cccdBackUrl} alt="CCCD sau" className="w-full h-48 object-cover rounded-lg border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer" />
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">Chưa có mặt sau</div>
                )}
                {/* Legacy single cccdUrl */}
                {(previewTutor.documentUrls as any).cccdUrl && !previewTutor.documentUrls.cccdFrontUrl && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-semibold text-slate-500 mb-1">CCCD (ảnh cũ)</p>
                    <a href={(previewTutor.documentUrls as any).cccdUrl} target="_blank" rel="noopener noreferrer">
                      <img src={(previewTutor.documentUrls as any).cccdUrl} alt="CCCD" className="w-full max-h-64 object-contain rounded-lg border border-slate-200 cursor-pointer" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bằng cấp */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-600" /> Bằng cấp / Chứng chỉ</h4>
              {previewTutor.documentUrls.degreeUrls && previewTutor.documentUrls.degreeUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {previewTutor.documentUrls.degreeUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt={`Bằng cấp ${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-slate-200 hover:border-indigo-400 transition-colors cursor-pointer" />
                    </a>
                  ))}
                </div>
              ) : (previewTutor.documentUrls as any).degreeUrl ? (
                <a href={(previewTutor.documentUrls as any).degreeUrl} target="_blank" rel="noopener noreferrer">
                  <img src={(previewTutor.documentUrls as any).degreeUrl} alt="Bằng cấp" className="max-h-48 object-contain rounded-lg border border-slate-200 cursor-pointer" />
                </a>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">Chưa tải lên bằng cấp</div>
              )}
            </div>

            {/* File khác */}
            {previewTutor.documentUrls.otherUrls && previewTutor.documentUrls.otherUrls.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-600" /> Tài liệu khác</h4>
                <div className="grid grid-cols-3 gap-3">
                  {previewTutor.documentUrls.otherUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt={`File ${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-200/75 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Thêm Gia sư mới</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <input type="text" required placeholder="Họ tên *" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
              <input type="tel" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
              <input type="text" placeholder="Môn dạy (VD: Toán, Lý)" value={subjects} onChange={(e) => setSubjects(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
              <input type="text" placeholder="Bằng cấp / Trường" value={qualification} onChange={(e) => setQualification(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
              <input type="text" placeholder="Kinh nghiệm" value={experience} onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
              <input type="number" placeholder="Phí/giờ (VNĐ)" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 transition-colors" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                  Thêm (tự động xác minh)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tutor Modal */}
      {editingTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingTutor(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>✏️ Sửa thông tin gia sư — {editingTutor.code}</h3>
              <button onClick={() => setEditingTutor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Họ tên</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Môn dạy (cách nhau bởi dấu phẩy)</label>
                <input value={editSubjects} onChange={e => setEditSubjects(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Bằng cấp</label>
                  <input value={editQualification} onChange={e => setEditQualification(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Kinh nghiệm</label>
                  <input value={editExperience} onChange={e => setEditExperience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Học phí / buổi (VNĐ)</label>
                  <input type="number" value={editHourlyRate} onChange={e => setEditHourlyRate(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Khu vực dạy</label>
                  <input value={editArea} onChange={e => setEditArea(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Số điện thoại</label>
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Email</label>
                  <input value={editEmail} onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                <button onClick={() => setEditingTutor(null)}
                  style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#fff', color: '#475569' }}>
                  Hủy
                </button>
                <button onClick={handleEditSave}
                  style={{ padding: '8px 20px', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#4f46e5', color: '#fff' }}>
                  💾 Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
