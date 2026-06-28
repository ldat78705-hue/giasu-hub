import React, { useState } from 'react';
import { ClassItem } from '../types';
import { Plus, Sparkles, Filter, Trash2, CheckCircle2, Download, Search, ArrowUpDown, Pencil, X } from 'lucide-react';

interface ClassTableProps {
  classes: ClassItem[];
  onSelectClassForMatch: (cls: ClassItem) => void;
  selectedClassCode?: string;
  onAddClass: (newCls: ClassItem) => void;
  onUpdateStatus: (id: string, newStatus: ClassItem['status']) => void;
  onDeleteClass: (id: string) => void;
  onOpenAiGenerator: () => void;
  onUpdateClass?: (id: string, data: Partial<ClassItem>) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  onSelectClassForMatch,
  selectedClassCode,
  onAddClass,
  onUpdateStatus,
  onDeleteClass,
  onOpenAiGenerator,
  onUpdateClass,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'fee-high' | 'fee-low' | 'subject'>('newest');
  
  // New Class Form State
  const [code, setCode] = useState(`#CS${Math.floor(2300 + Math.random() * 100)}`);
  const [subject, setSubject] = useState('');
  const [studentInfo, setStudentInfo] = useState('');
  const [location, setLocation] = useState('');
  const [fee, setFee] = useState<number>(300000);
  const [requirements, setRequirements] = useState('');
  const [teachMode, setTeachMode] = useState<ClassItem['teachMode']>('Tại nhà');
  // Edit class state
  const [editCls, setEditCls] = useState<ClassItem | null>(null);
  const [ecSubject, setEcSubject] = useState('');
  const [ecStudentInfo, setEcStudentInfo] = useState('');
  const [ecLocation, setEcLocation] = useState('');
  const [ecFee, setEcFee] = useState(0);
  const [ecSchedule, setEcSchedule] = useState('');
  const [ecRequirements, setEcRequirements] = useState('');
  const [ecTeachMode, setEcTeachMode] = useState<ClassItem['teachMode']>('Tại nhà');

  const openEditClass = (c: ClassItem) => {
    setEditCls(c);
    setEcSubject(c.subject);
    setEcStudentInfo(c.studentInfo);
    setEcLocation(c.location);
    setEcFee(c.fee);
    setEcSchedule(c.schedule || '');
    setEcRequirements(c.requirements || '');
    setEcTeachMode(c.teachMode || 'Tại nhà');
  };
  const handleEditClassSave = () => {
    if (!editCls?.id || !onUpdateClass) return;
    onUpdateClass(editCls.id, { subject: ecSubject, studentInfo: ecStudentInfo, location: ecLocation, fee: ecFee, schedule: ecSchedule, requirements: ecRequirements, teachMode: ecTeachMode });
    setEditCls(null);
  };

  const filteredClasses = classes.filter((c) => {
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    if (!matchStatus) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || (c.studentInfo || '').toLowerCase().includes(q);
  }).sort((a, b) => {
    if (sortBy === 'fee-high') return b.fee - a.fee;
    if (sortBy === 'fee-low') return a.fee - b.fee;
    if (sortBy === 'subject') return a.subject.localeCompare(b.subject, 'vi');
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !location) return;
    onAddClass({
      code,
      subject,
      studentInfo: studentInfo || 'Học sinh phổ thông',
      location,
      fee: Number(fee) || 250000,
      status: 'ĐANG TÌM',
      createdAt: Date.now(),
      requirements: requirements || 'Gia sư tận tâm, đúng giờ.',
      teachMode,
    });
    setShowAddModal(false);
    setSubject('');
    setLocation('');
    setRequirements('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  return (
    <div id="realtime-classes-panel" className="bg-white rounded-lg border border-slate-200/75 shadow-sm flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-lg text-slate-800">Lớp học yêu cầu cập nhật (Real-time)</h2>
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-full border border-indigo-100">
            {classes.length} lớp
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ĐANG TÌM">Đang tìm gia sư</option>
              <option value="ĐÃ CÓ GIA SƯ">Đã có gia sư</option>
              <option value="KHẨN CẤP">Khẩn cấp</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm mã, môn, khu vực..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-400 w-56 transition-colors" />
          </div>
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 outline-none cursor-pointer">
              <option value="newest">Mới nhất</option>
              <option value="fee-high">Phí cao → thấp</option>
              <option value="fee-low">Phí thấp → cao</option>
              <option value="subject">Môn A-Z</option>
            </select>
          </div>
          <button onClick={() => {
            const header = 'M\u00e3,M\u00f4n,H\u1ecdc sinh,\u0110\u1ecba \u0111i\u1ec3m,Ph\u00ed,H\u00ecnh th\u1ee9c,Y\u00eau c\u1ea7u,Tr\u1ea1ng th\u00e1i\n';
            const rows = classes.map(c => `${c.code},"${c.subject}","${c.studentInfo}","${c.location}",${c.fee},"${c.teachMode || ''}","${(c.requirements || '').replace(/"/g, '""')}","${c.status}"`).join('\n');
            const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `lop-hoc-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
          }}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Xuất CSV
          </button>

          <button
            onClick={onOpenAiGenerator}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5"
            title="D\u00f9ng AI so\u1ea1n nhanh y\u00eau c\u1ea7u l\u1edbp h\u1ecdc"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Soạn thảo</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo lớp</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky-header">
            <tr className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 font-semibold">Mã lớp</th>
              <th className="px-6 py-3 font-semibold">Môn học</th>
              <th className="px-6 py-3 font-semibold">Địa điểm</th>
              <th className="px-6 py-3 font-semibold">Phí / Buổi</th>
              <th className="px-6 py-3 font-semibold">Trạng thái</th>
              <th className="px-6 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs">
                  Không tìm thấy yêu cầu lớp học phù hợp.
                </td>
              </tr>
            ) : (
              filteredClasses.map((cls) => {
                const isSelected = selectedClassCode === cls.code;
                return (
                  <tr
                    key={cls.id || cls.code}
                    onClick={() => onSelectClassForMatch(cls)}
                    className={`transition-all cursor-pointer border-b border-slate-50 last:border-0 ${
                      isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-500">{cls.code}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800 text-[13px] flex items-center gap-1.5">
                        <span>{cls.subject}</span>
                        {isSelected && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {cls.studentInfo}
                        {cls.teachMode && <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${cls.teachMode === 'Online' ? 'bg-indigo-50 text-indigo-600' : cls.teachMode === 'Tại nhà' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{cls.teachMode === 'Online' ? '💻 Online' : cls.teachMode === 'Tại nhà' ? '🏠 Trực tiếp' : '🔄 Cả hai'}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 text-[12px]">{cls.location}</td>
                    <td className="px-6 py-3.5 font-bold text-indigo-600 text-[13px] tabular-nums">{formatCurrency(cls.fee)}</td>
                    <td className="px-6 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={cls.status}
                        onChange={(e) => cls.id && onUpdateStatus(cls.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold outline-none cursor-pointer border ${
                          cls.status === 'ĐANG TÌM'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : cls.status === 'ĐÃ CÓ GIA SƯ'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200 animate-pulse'
                        }`}
                      >
                        <option value="ĐANG TÌM">ĐANG TÌM</option>
                        <option value="ĐÃ CÓ GIA SƯ">ĐÃ CÓ GIA SƯ</option>
                        <option value="KHẨN CẤP">KHẨN CẤP</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectClassForMatch(cls)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 group"
                          title="Tìm gia sư ghép nối bằng AI"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-500 group-hover:text-white" />
                          <span>Ghép AI</span>
                        </button>
                        {cls.id && onUpdateClass && (
                          <button
                            onClick={() => openEditClass(cls)}
                            className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                            title="Sửa lớp"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {cls.id && (
                          <button
                            onClick={() => { if (window.confirm(`Xóa lớp ${cls.code} - ${cls.subject}?`)) onDeleteClass(cls.id!); }}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                            title="Xóa lớp"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>Đăng ký Lớp học mới</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">{code}</span>
            </h3>
            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Môn học & Trình độ</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tiếng Anh - IELTS 6.5, Toán Lớp 10..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Thông tin học sinh</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Học sinh lớp 12"
                    value={studentInfo}
                    onChange={(e) => setStudentInfo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Học phí / Buổi (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm font-bold text-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Địa điểm / Hình thức học</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cầu Giấy, Hà Nội hoặc Online - Zoom"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Hình thức học</label>
                <div className="flex gap-2">
                  {([['Tại nhà', '🏠 Trực tiếp'], ['Online', '💻 Trực tuyến'], ['Cả hai', '🔄 Cả hai']] as const).map(([val, label]) => (
                    <button key={val} type="button" onClick={() => setTeachMode(val)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${teachMode === val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Yêu cầu gia sư</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Sinh viên giỏi Bách Khoa, nhiệt tình..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm transition-colors"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
                >
                  Đăng lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {editCls && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditCls(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>✏️ Sửa lớp — {editCls.code}</h3>
              <button onClick={() => setEditCls(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X style={{ width: 18, height: 18 }} /></button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Môn / Tên lớp</label>
                <input value={ecSubject} onChange={e => setEcSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Thông tin học sinh</label>
                <input value={ecStudentInfo} onChange={e => setEcStudentInfo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Khu vực</label>
                  <input value={ecLocation} onChange={e => setEcLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Học phí / buổi (VNĐ)</label>
                  <input type="number" value={ecFee} onChange={e => setEcFee(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Lịch học</label>
                  <input value={ecSchedule} onChange={e => setEcSchedule(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Hình thức</label>
                  <select value={ecTeachMode} onChange={e => setEcTeachMode(e.target.value as ClassItem['teachMode'])}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm">
                    <option value="Tại nhà">Tại nhà</option>
                    <option value="Online">Online</option>
                    <option value="Cả hai">Cả hai</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Yêu cầu</label>
                <textarea value={ecRequirements} onChange={e => setEcRequirements(e.target.value)} rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm resize-none" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                <button onClick={() => setEditCls(null)} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#fff', color: '#475569' }}>Hủy</button>
                <button onClick={handleEditClassSave} style={{ padding: '8px 20px', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#4f46e5', color: '#fff' }}>💾 Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
