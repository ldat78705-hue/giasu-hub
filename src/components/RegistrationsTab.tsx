import React, { useState } from 'react';
import { ParentRegistration, TutorItem, REGISTRATION_TAGS, ContactLogEntry } from '../types';
import { UserPlus, Phone, MapPin, Clock, CheckCircle2, XCircle, Download, Search, ArrowUpDown, AlertTriangle, Sparkles, Calendar, Share2, Megaphone, Tag, MessageSquare, PhoneCall, LayoutGrid, List, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { getOverdueRegistrations } from '../utils';

interface RegistrationsTabProps {
  registrations: ParentRegistration[];
  tutors?: TutorItem[];
  onUpdateStatus: (id: string, status: ParentRegistration['status']) => void;
  onUpdateNote?: (id: string, note: string) => void;
  onSuggestTutor?: (reg: ParentRegistration) => void;
  onUpdateTrial?: (id: string, data: { trialDate: string; trialTime: string; trialTutorCode?: string; trialStatus: string }) => void;
  onUpdateTags?: (id: string, tags: string[]) => void;
  onAddContactLog?: (id: string, log: ContactLogEntry) => void;
}

export const RegistrationsTab: React.FC<RegistrationsTabProps> = ({ registrations, tutors = [], onUpdateStatus, onUpdateNote, onSuggestTutor, onUpdateTrial, onUpdateTags, onAddContactLog }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'status'>('newest');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Feature 1: Trial booking
  const [trialModal, setTrialModal] = useState<string | null>(null);
  const [trialDate, setTrialDate] = useState('');
  const [trialTime, setTrialTime] = useState('18:00');
  const [trialTutorCode, setTrialTutorCode] = useState('');
  // Feature 9: Kanban view
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  // Feature 13: Tags
  const [tagModal, setTagModal] = useState<string | null>(null);
  const [tagSelection, setTagSelection] = useState<string[]>([]);
  // Feature 14: Contact log
  const [logModal, setLogModal] = useState<string | null>(null);
  const [logAction, setLogAction] = useState<ContactLogEntry['action']>('Gọi điện');
  const [logNote, setLogNote] = useState('');
  const [logResult, setLogResult] = useState<ContactLogEntry['result']>('Thành công');
  // Feature 14: Expanded contact log
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  // Feature 13: Tag filter
  const [tagFilter, setTagFilter] = useState<string>('');
  // F36: Advanced filters
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

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
  const fmtShort = (ts: number) => new Date(ts).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

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
    .filter(r => !tagFilter || (r.tags || []).includes(tagFilter))
    .filter(r => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return r.parentName.toLowerCase().includes(q) || r.phone.includes(q) ||
        (r.studentName || '').toLowerCase().includes(q) || r.subjects.some(s => s.toLowerCase().includes(q)) ||
        (r.district || '').toLowerCase().includes(q);
    })
    .filter(r => !districtFilter || r.district === districtFilter)
    .filter(r => {
      if (dateFilter === 'all') return true;
      const now = Date.now();
      if (dateFilter === 'today') return (now - r.createdAt) < 86400000;
      if (dateFilter === 'week') return (now - r.createdAt) < 7 * 86400000;
      return (now - r.createdAt) < 30 * 86400000;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'name') return a.parentName.localeCompare(b.parentName, 'vi');
      return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
    });

  const exportCsv = () => {
    const header = 'Phụ huynh,SĐT,Học sinh,Lớp,Môn học,Quận,Hình thức,Lịch học,Nguồn,Mã GT,Tags,Ghi chú,Ghi chú admin,Ngày đăng ký,Trạng thái,Học thử\n';
    const rows = registrations.map(r =>
      `"${r.parentName}","${r.phone}","${r.studentName}","${r.grade}","${r.subjects.join(', ')}","${r.district}","${r.mode}","${r.schedule}","${r.source || ''}","${r.referralCode || ''}","${(r.tags || []).join(', ')}","${r.note}","${(r.adminNote || '').replace(/"/g, '""')}","${fmt(r.createdAt)}","${r.status}","${r.trialDate ? r.trialDate + ' ' + (r.trialTime || '') : ''}"`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `dang-ky-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // Feature 13: Tag colors
  const tagColors: Record<string, string> = {
    'VIP': 'bg-amber-100 text-amber-800 border-amber-200',
    'Gấp': 'bg-red-100 text-red-800 border-red-200',
    'Cần gia sư nữ': 'bg-pink-100 text-pink-800 border-pink-200',
    'Học online': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Chờ phụ huynh xác nhận': 'bg-orange-100 text-orange-800 border-orange-200',
    'Khó tìm gia sư': 'bg-slate-100 text-slate-800 border-slate-200',
    'Học thử OK': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Đã gọi 2 lần': 'bg-violet-100 text-violet-800 border-violet-200',
  };

  // Render a single registration card (reused in list + kanban)
  const renderCard = (reg: ParentRegistration, compact = false) => (
    <div key={reg.id} className={`bg-white rounded-2xl border p-4 transition-all ${reg.status === 'Mới' ? 'border-blue-300 shadow-sm' : selectedIds.has(reg.id || '') ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'} ${compact ? '' : ''}`}>
      <div className="flex items-start gap-2">
        {!compact && reg.id && <input type="checkbox" checked={selectedIds.has(reg.id)} onChange={() => toggleSelect(reg.id!)}
          className="w-4 h-4 mt-1 rounded cursor-pointer shrink-0" />}
        <div className="flex-1 space-y-1.5 min-w-0">
          {/* Parent info */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-slate-800 ${compact ? 'text-sm' : ''}`}>{reg.parentName}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[reg.status] || 'bg-slate-100 text-slate-600'}`}>
              {reg.status}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <a href={`tel:${reg.phone}`} className="flex items-center gap-1 hover:text-blue-600" onClick={e => e.stopPropagation()}><Phone className="w-3 h-3 text-blue-500" />{reg.phone}</a>
            {reg.studentName && <span>HS: {reg.studentName}</span>}
            <span>{reg.grade}</span>
            {reg.district && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{reg.district}</span>}
          </div>

          {/* Tags (F13) + Subjects + Source + Referral */}
          <div className="flex flex-wrap gap-1">
            {(reg.tags || []).map(tag => (
              <span key={tag} className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${tagColors[tag] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {tag}
              </span>
            ))}
            {reg.subjects.map((sub, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-semibold">{sub}</span>
            ))}
            {reg.source && (
              <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-semibold flex items-center gap-0.5">
                <Megaphone className="w-2.5 h-2.5" />{reg.source}
              </span>
            )}
            {reg.referralCode && (
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-semibold flex items-center gap-0.5">
                <Share2 className="w-2.5 h-2.5" />GT: {reg.referralCode}
              </span>
            )}
          </div>

          {!compact && reg.schedule && <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{reg.schedule}</p>}
          {!compact && reg.note && <p className="text-xs text-slate-500 italic">"{reg.note}"</p>}

          {/* Trial booking info */}
          {reg.trialDate && (
            <div className={`text-[9px] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded-lg ${
              reg.trialStatus === 'Đã học thử' ? 'bg-emerald-50 text-emerald-700' :
              reg.trialStatus === 'Hủy thử' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-700'
            }`}>
              <Calendar className="w-3 h-3" />
              HT: {reg.trialDate} {reg.trialTime || ''} {reg.trialStatus && `· ${reg.trialStatus}`}
            </div>
          )}

          {/* Contact logs count (F14) */}
          {(reg.contactLogs || []).length > 0 && (
            <button onClick={() => setExpandedLog(expandedLog === reg.id ? null : reg.id!)}
              className="text-[10px] text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 font-bold">
              <PhoneCall className="w-3 h-3" />
              {reg.contactLogs!.length} lần liên hệ
              {expandedLog === reg.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}

          {/* Expanded contact log timeline (F14) */}
          {expandedLog === reg.id && (reg.contactLogs || []).length > 0 && (
            <div className="ml-2 pl-3 border-l-2 border-blue-200 space-y-1.5 mt-1">
              {[...(reg.contactLogs || [])].sort((a, b) => b.timestamp - a.timestamp).map(log => (
                <div key={log.id} className="text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">{log.action}</span>
                    <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                      log.result === 'Thành công' ? 'bg-emerald-100 text-emerald-700' :
                      log.result === 'Không nghe' ? 'bg-red-100 text-red-700' :
                      log.result === 'Hẹn gọi lại' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>{log.result}</span>
                    <span className="text-slate-400">{fmtShort(log.timestamp)}</span>
                  </div>
                  {log.note && <p className="text-slate-500 italic mt-0.5">{log.note}</p>}
                  <p className="text-slate-400">— {log.author}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-slate-400">{fmt(reg.createdAt)}</p>

          {/* Admin Note */}
          {!compact && (
            <div className="pt-1 mt-1 border-t border-slate-100">
              {editingNote === reg.id ? (
                <div className="flex gap-1">
                  <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                    placeholder="Ví dụ: Cần gia sư nữ, kiên nhẫn..." autoFocus
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
          )}
        </div>

        {/* Actions */}
        {!compact && (
          <div className="flex sm:flex-col gap-1.5 shrink-0">
            {/* F13: Tag button */}
            {onUpdateTags && (
              <button onClick={() => { setTagModal(reg.id || null); setTagSelection(reg.tags || []); }}
                className="px-2 py-1.5 bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1" title="Gắn tag">
                <Tag className="w-3 h-3" />{(reg.tags || []).length > 0 ? (reg.tags || []).length : ''}
              </button>
            )}
            {/* F14: Contact log button */}
            {onAddContactLog && (
              <button onClick={() => { setLogModal(reg.id || null); setLogNote(''); setLogAction('Gọi điện'); setLogResult('Thành công'); }}
                className="px-2 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1" title="Ghi liên hệ">
                <PhoneCall className="w-3 h-3" />
              </button>
            )}
            {onSuggestTutor && (reg.status === 'Mới' || reg.status === 'Đã liên hệ') && (
              <button onClick={() => onSuggestTutor(reg)}
                className="px-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                <Sparkles className="w-3 h-3" /><span>AI</span>
              </button>
            )}
            {onUpdateTrial && (reg.status === 'Mới' || reg.status === 'Đã liên hệ') && !reg.trialDate && (
              <button onClick={() => { setTrialModal(reg.id || null); setTrialDate(''); setTrialTime('18:00'); setTrialTutorCode(''); }}
                className="px-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                <Calendar className="w-3 h-3" />
              </button>
            )}
            {reg.status === 'Mới' && (
              <button onClick={() => reg.id && onUpdateStatus(reg.id, 'Đã liên hệ')}
                className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                <Phone className="w-3 h-3" /><span>LH</span>
              </button>
            )}
            {(reg.status === 'Mới' || reg.status === 'Đã liên hệ') && (
              <button onClick={() => reg.id && onUpdateStatus(reg.id, 'Đã xếp lớp')}
                className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
              </button>
            )}
            {reg.status !== 'Hủy' && (
              <button onClick={() => reg.id && onUpdateStatus(reg.id, 'Hủy')}
                className="px-2 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 text-[10px] font-bold rounded-lg cursor-pointer">
                <XCircle className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Feature 9: Kanban columns
  const kanbanColumns: { status: ParentRegistration['status']; label: string; color: string; borderColor: string }[] = [
    { status: 'Mới', label: '📥 Mới', color: 'bg-blue-50', borderColor: 'border-blue-300' },
    { status: 'Đã liên hệ', label: '📞 Đã liên hệ', color: 'bg-amber-50', borderColor: 'border-amber-300' },
    { status: 'Đã xếp lớp', label: '✅ Đã xếp lớp', color: 'bg-emerald-50', borderColor: 'border-emerald-300' },
    { status: 'Hủy', label: '❌ Hủy', color: 'bg-red-50', borderColor: 'border-red-300' },
  ];

  return (
    <div className="col-span-12 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Đăng ký tìm gia sư</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {registrations.length} đăng ký • {newCount > 0 && <span className="text-blue-600 font-bold">{newCount} mới</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {/* F9: View toggle */}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('list')} className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold cursor-pointer flex items-center gap-1 ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
              <List className="w-3 h-3" /> List
            </button>
            <button onClick={() => setViewMode('kanban')} className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold cursor-pointer flex items-center gap-1 ${viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
              <LayoutGrid className="w-3 h-3" /> Kanban
            </button>
          </div>
          <button onClick={exportCsv}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
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
              { val: 'Đã liên hệ', label: 'Đã LH', color: 'text-amber-600' },
              { val: 'Đã xếp lớp', label: 'Xếp lớp', color: 'text-emerald-600' },
              { val: 'Hủy', label: 'Hủy', color: 'text-red-600' },
            ].map(f => (
              <button key={f.val} onClick={() => setStatusFilter(f.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  statusFilter === f.val ? 'bg-blue-600 text-white border-blue-600' : `bg-white ${f.color || 'text-slate-600'} border-slate-200 hover:border-blue-300`
                }`}>{f.label}</button>
            ))}
          </div>
          {/* F13: Tag filter */}
          <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none cursor-pointer">
            <option value="">🏷️ Tất cả tags</option>
            {REGISTRATION_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none cursor-pointer">
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="status">Trạng thái</option>
          </select>
          {/* F36: District filter */}
          <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none cursor-pointer">
            <option value="">📍 Tất cả quận</option>
            {[...new Set(registrations.map(r => r.district).filter(Boolean))].sort().map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {/* F36: Date filter */}
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none cursor-pointer">
            <option value="all">📅 Mọi lúc</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
          </select>
        </div>
      )}

      {/* Overdue Alert */}
      {overdueRegs.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">⏰ {overdueRegs.length} đơn quá hạn chưa liên hệ!</p>
            <p className="text-[10px] text-red-500 mt-0.5">{overdueRegs.map(r => r.parentName).join(', ')}</p>
          </div>
          <button onClick={() => { setStatusFilter('Mới'); setSortBy('oldest'); }}
            className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg cursor-pointer shrink-0">Xem ngay</button>
        </div>
      )}

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-blue-800">Đã chọn {selectedIds.size}</span>
          <div className="flex gap-2">
            <button onClick={() => batchUpdateStatus('Đã liên hệ')} className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg cursor-pointer">Đã LH</button>
            <button onClick={() => batchUpdateStatus('Đã xếp lớp')} className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg cursor-pointer">Xếp lớp</button>
            <button onClick={() => batchUpdateStatus('Hủy')} className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg cursor-pointer">Hủy</button>
            <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer">Bỏ chọn</button>
          </div>
        </div>
      )}

      {/* ===== LIST VIEW ===== */}
      {viewMode === 'list' && (
        <>
          {filtered.length > 0 && (
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded cursor-pointer" />
              <span className="text-[10px] text-slate-500">Chọn tất cả ({filtered.length})</span>
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">{registrations.length === 0 ? 'Chưa có đăng ký nào' : 'Không tìm thấy'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(reg => renderCard(reg))}
            </div>
          )}
        </>
      )}

      {/* ===== KANBAN VIEW (F9) ===== */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ minHeight: 400 }}>
          {kanbanColumns.map(col => {
            const colRegs = registrations
              .filter(r => r.status === col.status)
              .filter(r => !tagFilter || (r.tags || []).includes(tagFilter))
              .filter(r => {
                if (!searchTerm) return true;
                const q = searchTerm.toLowerCase();
                return r.parentName.toLowerCase().includes(q) || r.phone.includes(q) ||
                  (r.studentName || '').toLowerCase().includes(q);
              })
              .sort((a, b) => b.createdAt - a.createdAt);
            return (
              <div key={col.status} className={`${col.color} rounded-2xl border-2 ${col.borderColor} p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700">{col.label}</h3>
                  <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full text-slate-600 shadow-sm">{colRegs.length}</span>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {colRegs.map(reg => renderCard(reg, true))}
                  {colRegs.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400">Trống</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== MODALS ===== */}

      {/* Feature 1: Trial Booking Modal */}
      {trialModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setTrialModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 400, width: '100%', padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Đặt lịch học thử
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Ngày *</label>
                <input type="date" value={trialDate} onChange={e => setTrialDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Giờ</label>
                <input type="time" value={trialTime} onChange={e => setTrialTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Gia sư</label>
                <select value={trialTutorCode} onChange={e => setTrialTutorCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                  <option value="">-- Chọn GS --</option>
                  {tutors.filter(t => t.verified).map(t => <option key={t.code} value={t.code}>{t.name} ({t.code})</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => {
                  if (trialModal && trialDate && onUpdateTrial) {
                    onUpdateTrial(trialModal, { trialDate, trialTime, trialTutorCode: trialTutorCode || undefined, trialStatus: 'Đã đặt' });
                    setTrialModal(null);
                  }
                }} disabled={!trialDate}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl cursor-pointer disabled:opacity-50">Xác nhận</button>
                <button onClick={() => setTrialModal(null)} className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl cursor-pointer">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 13: Tag Modal */}
      {tagModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setTagModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 400, width: '100%', padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-600" /> Gắn nhãn đơn đăng ký
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {REGISTRATION_TAGS.map(tag => (
                <button key={tag} onClick={() => {
                  setTagSelection(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                    tagSelection.includes(tag) ? `${tagColors[tag] || 'bg-blue-100 text-blue-700 border-blue-200'} ring-2 ring-blue-300` : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>{tag}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => {
                if (tagModal && onUpdateTags) { onUpdateTags(tagModal, tagSelection); }
                setTagModal(null);
              }} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl cursor-pointer">Lưu tags ({tagSelection.length})</button>
              <button onClick={() => setTagModal(null)} className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl cursor-pointer">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 14: Contact Log Modal */}
      {logModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setLogModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 400, width: '100%', padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-blue-600" /> Ghi nhận liên hệ
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Hình thức *</label>
                <select value={logAction} onChange={e => setLogAction(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                  <option value="Gọi điện">📞 Gọi điện</option>
                  <option value="Nhắn Zalo">💬 Nhắn Zalo</option>
                  <option value="Gửi SMS">📱 Gửi SMS</option>
                  <option value="Email">📧 Email</option>
                  <option value="Gặp trực tiếp">🤝 Gặp trực tiếp</option>
                  <option value="Khác">📋 Khác</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kết quả *</label>
                <select value={logResult} onChange={e => setLogResult(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                  <option value="Thành công">✅ Thành công</option>
                  <option value="Không nghe">❌ Không nghe máy</option>
                  <option value="Hẹn gọi lại">⏰ Hẹn gọi lại</option>
                  <option value="Từ chối">🚫 Từ chối</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Ghi chú</label>
                <textarea value={logNote} onChange={e => setLogNote(e.target.value)}
                  placeholder="Ví dụ: Phụ huynh đồng ý học thử, hẹn thứ 3 tuần sau..."
                  rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => {
                  if (logModal && onAddContactLog) {
                    onAddContactLog(logModal, {
                      id: `cl${Date.now()}`, action: logAction, note: logNote, result: logResult,
                      author: 'Admin', timestamp: Date.now(),
                    });
                    setLogModal(null); setLogNote('');
                  }
                }} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl cursor-pointer">Lưu</button>
                <button onClick={() => setLogModal(null)} className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl cursor-pointer">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
