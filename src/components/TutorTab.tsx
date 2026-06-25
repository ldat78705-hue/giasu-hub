import React, { useState } from 'react';
import { TutorItem } from '../types';
import { Plus, Star, Trash2, Phone } from 'lucide-react';

interface TutorTabProps {
  tutors: TutorItem[];
  onAddTutor: (newTutor: TutorItem) => void;
  onUpdateStatus: (id: string, st: TutorItem['status']) => void;
  onDeleteTutor: (id: string) => void;
}

export const TutorTab: React.FC<TutorTabProps> = ({ tutors, onAddTutor, onUpdateStatus, onDeleteTutor }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState(200000);
  const [phone, setPhone] = useState('');

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-teal-500'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const parts = name.trim().split(' ');
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);

    onAddTutor({
      code: `GS${Math.floor(100 + Math.random() * 900)}`,
      name,
      avatar: initials.toUpperCase(),
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      subjects: subjects ? subjects.split(',').map(s => s.trim()).filter(Boolean) : [],
      qualification: qualification || '',
      experience: experience || '',
      rating: 5.0,
      status: 'online',
      hourlyRate: Number(hourlyRate) || 200000,
      phone: phone || '',
    });
    setShowModal(false);
    setName(''); setSubjects(''); setQualification(''); setExperience(''); setPhone('');
  };

  return (
    <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Gia sư</h2>
          <p className="text-xs text-slate-500 mt-1">{tutors.length} gia sư trong hệ thống</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer">
          <Plus className="w-4 h-4" /><span>Thêm Gia sư</span>
        </button>
      </div>

      {tutors.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="font-semibold text-sm">Chưa có gia sư nào</p>
          <p className="text-xs mt-1">Nhấn "Thêm Gia sư" để bắt đầu xây dựng đội ngũ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tutors.map((t) => (
            <div key={t.id || t.code} className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/40 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-12 rounded-xl ${t.avatarColor} flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0`}>{t.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 truncate">{t.name}</h4>
                    <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">{t.code}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" /><span>{t.rating}</span>
                    {t.experience && <span className="text-slate-400 font-normal">• {t.experience}</span>}
                  </div>
                  {t.phone && (
                    <a href={`tel:${t.phone}`} className="text-xs text-blue-600 font-mono mt-0.5 flex items-center gap-1 hover:underline">
                      <Phone className="w-3 h-3" />{t.phone}
                    </a>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-600 font-medium line-clamp-1">{t.qualification}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.subjects.map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-semibold">{sub}</span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phí</span>
                  <span className="font-bold text-blue-600 text-sm">{new Intl.NumberFormat('vi-VN').format(t.hourlyRate)}đ/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <select value={t.status} onChange={(e) => t.id && onUpdateStatus(t.id, e.target.value as any)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer border ${
                      t.status === 'online' ? 'bg-green-100 text-green-700 border-green-300' :
                      t.status === 'busy' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                      'bg-slate-200 text-slate-600 border-slate-300'
                    }`}>
                    <option value="online">● ONLINE</option>
                    <option value="busy">● BẬN</option>
                    <option value="offline">○ OFFLINE</option>
                  </select>
                  {t.id && (
                    <button onClick={() => onDeleteTutor(t.id!)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Thêm Gia sư mới</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Họ tên *</label>
                <input type="text" required placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">SĐT</label>
                <input type="text" placeholder="0912345678" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Môn dạy (phẩy ngăn cách)</label>
                <input type="text" required placeholder="Toán, Lý, Hóa" value={subjects} onChange={(e) => setSubjects(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Bằng cấp / Trường</label>
                <input type="text" placeholder="Cử nhân ĐH Sư Phạm HN" value={qualification} onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Kinh nghiệm</label>
                <input type="text" placeholder="3 năm dạy kèm" value={experience} onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Học phí / giờ (VNĐ)</label>
                <input type="number" required value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-blue-600" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Lưu gia sư</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
