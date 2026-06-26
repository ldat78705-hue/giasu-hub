import React, { useState } from 'react';
import { TutorItem } from '../types';
import { Plus, Star, Trash2, Phone, Search, ShieldCheck, ShieldX, Clock, CheckCircle2, MapPin, ExternalLink, FileText } from 'lucide-react';

interface TutorTabProps {
  tutors: TutorItem[];
  onAddTutor: (newTutor: TutorItem) => void;
  onUpdateStatus: (id: string, st: TutorItem['status']) => void;
  onDeleteTutor: (id: string) => void;
  onVerifyTutor: (id: string, verified: boolean) => void;
}

export const TutorTab: React.FC<TutorTabProps> = ({ tutors, onAddTutor, onUpdateStatus, onDeleteTutor, onVerifyTutor }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState(200000);
  const [phone, setPhone] = useState('');

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];

  const filtered = tutors.filter(t => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) ||
      t.subjects.some(s => s.toLowerCase().includes(q));
    const matchFilter = filter === 'all' ||
      (filter === 'verified' && t.verified) ||
      (filter === 'pending' && !t.verified);
    return matchSearch && matchFilter;
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

  return (
    <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Gia sư</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tutors.length} gia sư • {pendingCount > 0 && <span className="text-amber-600 font-bold">{pendingCount} chờ xác minh</span>}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer">
          <Plus className="w-4 h-4" /><span>Thêm Gia sư</span>
        </button>
      </div>

      {/* Filter & Search */}
      {tutors.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm gia sư..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'Tất cả' },
              { key: 'pending' as const, label: `Chờ duyệt (${pendingCount})` },
              { key: 'verified' as const, label: 'Đã xác minh' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  filter === f.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}>{f.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          <p className="font-semibold text-sm">{tutors.length === 0 ? 'Chưa có gia sư nào' : 'Không tìm thấy kết quả'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id || t.code}
              className={`p-5 rounded-2xl border transition-all ${
                !t.verified ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 hover:border-blue-300 bg-slate-50/40'
              }`}>
              {/* Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className={`w-12 h-12 rounded-xl ${t.avatarColor} flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0`}>{t.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-slate-800 truncate text-sm">{t.name}</h4>
                    {t.verified ? (
                      <span className="verified-badge">✓</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">Chờ duyệt</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{t.code}</p>
                  {t.phone && <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{t.phone}</p>}
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {t.subjects.map((sub, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">{sub}</span>
                ))}
              </div>

              {/* Grade Levels */}
              {t.gradeLevels && t.gradeLevels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {t.gradeLevels.map((g, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-semibold">{g}</span>
                  ))}
                </div>
              )}

              {/* Teaching Areas */}
              {t.teachingAreas && t.teachingAreas.length > 0 && (
                <div className="flex items-start gap-1 mb-2 text-[10px] text-slate-500">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-emerald-500" />
                  <span className="leading-relaxed">{t.teachingAreas.join(', ')}</span>
                </div>
              )}

              {/* Info */}
              <div className="text-xs text-slate-500 space-y-0.5 mb-2">
                <p>{t.qualification}</p>
                <p>{t.experience} • <span className="flex items-center gap-0.5 inline text-amber-500"><Star className="w-3 h-3 fill-current inline" />{t.rating}</span></p>
              </div>

              {/* Documents */}
              {t.documentUrls && (t.documentUrls.cccdUrl || t.documentUrls.degreeUrl) && (
                <div className="flex gap-2 mb-2">
                  {t.documentUrls.cccdUrl && (
                    <a href={t.documentUrls.cccdUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-semibold border border-amber-200 hover:bg-amber-100 transition-colors">
                      <FileText className="w-3 h-3" /><span>CCCD</span><ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {t.documentUrls.degreeUrl && (
                    <a href={t.documentUrls.degreeUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-semibold border border-indigo-200 hover:bg-indigo-100 transition-colors">
                      <FileText className="w-3 h-3" /><span>Bằng cấp</span><ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                <div className="flex gap-1.5">
                  {!t.verified ? (
                    <button onClick={() => t.id && onVerifyTutor(t.id, true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /><span>Xác minh</span>
                    </button>
                  ) : (
                    <button onClick={() => t.id && onVerifyTutor(t.id, false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                      <ShieldX className="w-3 h-3" /><span>Hủy xác minh</span>
                    </button>
                  )}
                  <select value={t.status} onChange={(e) => t.id && onUpdateStatus(t.id, e.target.value as TutorItem['status'])}
                    className="px-2 py-1.5 text-[10px] font-bold rounded-lg border border-slate-200 bg-white cursor-pointer outline-none">
                    <option value="online">🟢 Online</option>
                    <option value="busy">🟡 Bận</option>
                    <option value="offline">⚫ Offline</option>
                  </select>
                </div>
                <button onClick={() => t.id && onDeleteTutor(t.id)}
                  className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Thêm Gia sư mới</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <input type="text" required placeholder="Họ tên *" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              <input type="tel" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              <input type="text" placeholder="Môn dạy (VD: Toán, Lý)" value={subjects} onChange={(e) => setSubjects(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              <input type="text" placeholder="Bằng cấp / Trường" value={qualification} onChange={(e) => setQualification(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              <input type="text" placeholder="Kinh nghiệm" value={experience} onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              <input type="number" placeholder="Phí/giờ (VNĐ)" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                  Thêm (tự động xác minh)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
