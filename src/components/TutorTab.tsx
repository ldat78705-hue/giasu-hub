import React, { useState } from 'react';
import { TutorItem } from '../types';
import { Plus, Star, MapPin, Award, CheckCircle, Clock } from 'lucide-react';

interface TutorTabProps {
  tutors: TutorItem[];
  onAddTutor: (newTutor: TutorItem) => void;
  onUpdateStatus: (id: string, st: TutorItem['status']) => void;
}

export const TutorTab: React.FC<TutorTabProps> = ({ tutors, onAddTutor, onUpdateStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [qualification, setQualification] = useState('');
  const [hourlyRate, setHourlyRate] = useState(350000);

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

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
      subjects: subjects ? subjects.split(',').map(s => s.trim()) : ['Toán', 'Luyện thi'],
      qualification: qualification || 'Đại học Sư Phạm',
      experience: '3 năm kinh nghiệm',
      rating: 4.9,
      status: 'online',
      hourlyRate: Number(hourlyRate) || 300000,
    });
    setShowModal(false);
    setName('');
    setSubjects('');
    setQualification('');
  };

  return (
    <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh sách Gia sư trực tuyến & Quản lý</h2>
          <p className="text-xs text-slate-500 mt-1">Đội ngũ giáo viên, sinh viên giỏi đã qua xác thực văn bằng</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Gia sư</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tutors.map((t) => (
          <div key={t.id || t.code} className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/40 transition-all flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-xl ${t.avatarColor} flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0`}>
                {t.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 truncate">{t.name}</h4>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">{t.code}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{t.rating}</span>
                  <span className="text-slate-400 font-normal">• {t.experience}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-600 font-medium line-clamp-1">{t.qualification}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {t.subjects.map((sub, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-semibold">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phí đề xuất</span>
                <span className="font-bold text-blue-600 text-sm">{new Intl.NumberFormat('vi-VN').format(t.hourlyRate)}đ/h</span>
              </div>

              <select
                value={t.status}
                onChange={(e) => t.id && onUpdateStatus(t.id, e.target.value as any)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer border ${
                  t.status === 'online'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : t.status === 'busy'
                    ? 'bg-amber-100 text-amber-700 border-amber-300'
                    : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}
              >
                <option value="online">● ONLINE</option>
                <option value="busy">● ĐANG BẬN</option>
                <option value="offline">○ OFFLINE</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Xác thực hồ sơ Gia sư mới</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Họ tên</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Môn giảng dạy (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Tiếng Anh, IELTS 8.0, Giao tiếp"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Bằng cấp & Nơi công tác</label>
                <input
                  type="text"
                  placeholder="VD: Cử nhân ĐH Sư Phạm TP.HCM"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Học phí yêu cầu / Giờ (VNĐ)</label>
                <input
                  type="number"
                  required
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-blue-600"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
