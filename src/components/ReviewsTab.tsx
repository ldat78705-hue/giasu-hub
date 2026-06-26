import React, { useState } from 'react';
import { TutorReview, TutorItem } from '../types';
import { Star, Plus, X, Search, Download } from 'lucide-react';

interface ReviewsTabProps {
  reviews: TutorReview[];
  tutors: TutorItem[];
  onAddReview: (r: TutorReview) => void;
  onDeleteReview: (id: string) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews, tutors, onAddReview, onDeleteReview }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selTutor, setSelTutor] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const filtered = reviews
    .filter(r => !searchTerm || r.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) || r.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.createdAt - a.createdAt);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const tutor = tutors.find(t => t.code === selTutor);
    if (!tutor || !parentName) return;
    onAddReview({ tutorCode: tutor.code, tutorName: tutor.name, parentName, parentPhone, rating, comment, createdAt: Date.now() });
    setShowAdd(false); setParentName(''); setParentPhone(''); setComment(''); setRating(5);
  };

  const exportCsv = () => {
    const header = 'Gia sư,Mã GS,PH đánh giá,SĐT PH,Sao,Nhận xét,Ngày\n';
    const rows = reviews.map(r => `"${r.tutorName}","${r.tutorCode}","${r.parentName}","${r.parentPhone}",${r.rating},"${r.comment}","${new Date(r.createdAt).toLocaleDateString('vi-VN')}"`).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `danh-gia-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> Đánh giá gia sư</h2>
          <p className="text-xs text-slate-500 mt-0.5">{reviews.length} đánh giá · TB: <span className="font-bold text-amber-600">{avgRating}</span>/5 ⭐</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export</button>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md shadow-amber-500/20"><Plus className="w-4 h-4" /> Thêm đánh giá</button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm theo GS hoặc PH..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
          <Star className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-sm">{reviews.length === 0 ? 'Chưa có đánh giá nào' : 'Không tìm thấy'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-800">{r.tutorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{r.tutorCode}</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}</div>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">{r.comment || 'Không có nhận xét'}</p>
                  <p className="text-[10px] text-slate-400">PH: {r.parentName} · {new Date(r.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <button onClick={() => r.id && window.confirm('Xóa đánh giá này?') && onDeleteReview(r.id)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer p-1"><X className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Thêm đánh giá</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Gia sư *</label>
                <select required value={selTutor} onChange={e => setSelTutor(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm">
                  <option value="">-- Chọn GS --</option>
                  {tutors.filter(t => t.verified).map(t => <option key={t.code} value={t.code}>{t.code} - {t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tên PH *</label>
                  <input required value={parentName} onChange={e => setParentName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">SĐT PH</label>
                  <input value={parentPhone} onChange={e => setParentPhone(e.target.value)} type="tel"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Đánh giá</label>
                <div className="flex gap-1">{[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)} className="cursor-pointer p-1">
                    <Star className={`w-6 h-6 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}</div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nhận xét</label>
                <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer">Lưu đánh giá</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
