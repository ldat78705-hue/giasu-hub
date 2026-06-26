import React, { useState } from 'react';
import { TutorItem, ClassItem } from '../types';
import { Search, Star, MapPin, GraduationCap, BookOpen, CheckCircle2, ShieldCheck, Phone, Send, X, UserPlus } from 'lucide-react';

interface FindTutorPublicProps {
  tutors: TutorItem[];
  onBookTutor: (tutor: TutorItem, studentName: string, phone: string, notes: string) => Promise<void>;
  onPostRequest: (cls: ClassItem) => Promise<void>;
}

export const FindTutorPublic: React.FC<FindTutorPublicProps> = ({ tutors, onBookTutor, onPostRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedTutor, setSelectedTutor] = useState<TutorItem | null>(null);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqSubject, setReqSubject] = useState('');
  const [reqGrade, setReqGrade] = useState('');
  const [reqLocation, setReqLocation] = useState('');
  const [reqFee, setReqFee] = useState(300000);
  const [reqNotes, setReqNotes] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  const subjects = ['ALL', 'Toán', 'Tiếng Anh', 'IELTS', 'Vật Lý', 'Hóa Học', 'Ngữ Văn', 'Tin Học', 'Luyện thi'];

  // Only show verified tutors to public
  const verifiedTutors = tutors.filter(t => t.verified);

  const filtered = verifiedTutors.filter(t => {
    const matchSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSub = selectedSubject === 'ALL' || t.subjects.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase()));
    return matchSearch && matchSub;
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor || !studentName || !phone) return;
    await onBookTutor(selectedTutor, studentName, phone, notes);
    setBookingSuccess(true);
    setTimeout(() => { setBookingSuccess(false); setSelectedTutor(null); setStudentName(''); setPhone(''); setNotes(''); }, 2500);
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject || !reqLocation) return;
    await onPostRequest({
      code: `#YC${Math.floor(1000 + Math.random() * 9000)}`,
      subject: `${reqSubject} (${reqGrade || 'Phổ thông'})`,
      studentInfo: reqGrade, location: reqLocation, fee: reqFee,
      status: 'ĐANG TÌM', createdAt: Date.now(), requirements: reqNotes,
    });
    setRequestSuccess(true);
    setTimeout(() => { setRequestSuccess(false); setShowRequestModal(false); }, 2500);
  };

  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  return (
    <div className="space-y-6 pb-24 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tìm gia sư</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{filtered.length} gia sư đã xác minh sẵn sàng</p>
        </div>
        <button onClick={() => setShowRequestModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-sm self-start sm:self-auto">
          <UserPlus className="w-4 h-4" /><span>Gửi yêu cầu tìm GS</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên, môn dạy..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" />
      </div>

      {/* Subject Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {subjects.map(sub => (
          <button key={sub} onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border whitespace-nowrap cursor-pointer transition-all shrink-0 ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}>
            {sub === 'ALL' ? 'Tất cả' : sub}
          </button>
        ))}
      </div>

      {/* Tutor Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Chưa có gia sư phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Hãy gửi yêu cầu, trung tâm sẽ tìm GS cho bạn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id || t.code}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedTutor(t)}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl ${t.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 truncate">{t.name}</h3>
                    {t.verified && <span className="verified-badge">✓ Xác minh</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current" />{t.rating}
                    </span>
                    <span>•</span>
                    <span>{t.experience}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {t.subjects.slice(0, 4).map((sub, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-semibold">{sub}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[60%]">{t.qualification}</span>
                    <span className="font-bold text-blue-600 shrink-0">{fmt(t.hourlyRate)}đ/h</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== BOOKING BOTTOM SHEET ===== */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 modal-backdrop" onClick={() => !bookingSuccess && setSelectedTutor(null)}>
          <div className="bottom-sheet bg-white p-6 shadow-2xl max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
            {/* Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

            {bookingSuccess ? (
              <div className="text-center py-4 animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-bold text-lg text-slate-800">Đã gửi yêu cầu!</p>
                <p className="text-sm text-slate-500 mt-1">Trung tâm sẽ liên hệ xác nhận sớm nhất.</p>
              </div>
            ) : (
              <>
                {/* Tutor Info */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-xl ${selectedTutor.avatarColor} flex items-center justify-center font-bold text-white text-lg shrink-0`}>
                    {selectedTutor.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedTutor.name}</h3>
                    <p className="text-xs text-slate-500">{selectedTutor.subjects.join(' • ')} • {fmt(selectedTutor.hourlyRate)}đ/h</p>
                  </div>
                  <button onClick={() => setSelectedTutor(null)}
                    className="ml-auto p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleBook} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Họ tên phụ huynh *</label>
                    <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)}
                      placeholder="VD: Chị Lan"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Số điện thoại *</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912345678"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Ghi chú</label>
                    <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="Lớp, khu vực, yêu cầu..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /><span>Đặt lịch thuê gia sư</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== REQUEST MODAL ===== */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center" onClick={() => !requestSuccess && setShowRequestModal(false)}>
          <div className="bottom-sheet sm:rounded-2xl bg-white p-6 shadow-2xl max-w-md w-full sm:mb-0" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

            {requestSuccess ? (
              <div className="text-center py-6 animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-bold text-lg text-slate-800">Đã gửi yêu cầu!</p>
                <p className="text-sm text-slate-500 mt-1">Trung tâm sẽ tìm gia sư phù hợp cho bạn.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Gửi yêu cầu tìm gia sư</h3>
                  <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <form onSubmit={handleRequest} className="space-y-3">
                  <input type="text" required value={reqSubject} onChange={(e) => setReqSubject(e.target.value)}
                    placeholder="Môn học cần tìm GS *" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                  <input type="text" value={reqGrade} onChange={(e) => setReqGrade(e.target.value)}
                    placeholder="Lớp / Trình độ" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                  <input type="text" required value={reqLocation} onChange={(e) => setReqLocation(e.target.value)}
                    placeholder="Khu vực (VD: Cầu Giấy) *" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                  <textarea rows={2} value={reqNotes} onChange={(e) => setReqNotes(e.target.value)}
                    placeholder="Yêu cầu thêm..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
                  <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl cursor-pointer">
                    Gửi yêu cầu
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
