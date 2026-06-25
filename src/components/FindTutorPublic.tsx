import React, { useState } from 'react';
import { TutorItem, ClassItem } from '../types';
import { Search, Star, MapPin, GraduationCap, BookOpen, CheckCircle2, Filter, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';

interface FindTutorPublicProps {
  tutors: TutorItem[];
  onBookTutor: (tutor: TutorItem, studentName: string, phone: string, notes: string) => Promise<void>;
  onPostRequest: (cls: ClassItem) => Promise<void>;
}

export const FindTutorPublic: React.FC<FindTutorPublicProps> = ({ tutors, onBookTutor, onPostRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedTutor, setSelectedTutor] = useState<TutorItem | null>(null);

  // Booking Form State
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Quick Request Form Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqSubject, setReqSubject] = useState('');
  const [reqGrade, setReqGrade] = useState('');
  const [reqLocation, setReqLocation] = useState('');
  const [reqFee, setReqFee] = useState(300000);
  const [reqNotes, setReqNotes] = useState('');

  const subjectsList = ['ALL', 'Tiếng Anh', 'Toán', 'IELTS', 'Luyện thi ĐH', 'Python', 'Ngữ Văn'];

  const filteredTutors = tutors.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSub = selectedSubject === 'ALL' || t.subjects.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase()));
    return matchSearch && matchSub;
  });

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor || !studentName || !phone) return;
    await onBookTutor(selectedTutor, studentName, phone, notes);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedTutor(null);
      setStudentName('');
      setPhone('');
      setNotes('');
    }, 2500);
  };

  const handleQuickRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject || !reqLocation) return;
    await onPostRequest({
      code: `#CS${Math.floor(2300 + Math.random() * 100)}`,
      subject: `${reqSubject} (${reqGrade || 'Phổ thông'})`,
      studentInfo: reqGrade || 'Học sinh',
      location: reqLocation,
      fee: Number(reqFee) || 300000,
      status: 'ĐANG TÌM',
      createdAt: Date.now(),
      requirements: reqNotes || 'Tìm gia sư dạy kèm tại nhà uy tín.',
    });
    setShowRequestModal(false);
    setReqSubject('');
    setReqLocation('');
    setReqNotes('');
    setRequestSuccess(true);
    setTimeout(() => setRequestSuccess(false), 3000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  return (
    <div className="col-span-12 space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Success Toast */}
      {requestSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Đăng yêu cầu thành công! Trung tâm sẽ liên hệ sớm nhất.</span>
        </div>
      )}
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Lựa Chọn Gia Sư Giỏi Dạy Kèm</h1>
          <p className="text-slate-500 text-sm mt-1">Khám phá hồ sơ, văn bằng và đánh giá thực tế của đội ngũ gia sư hàng đầu</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/20 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Đăng Yêu Cầu Gia Sư Nhanh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên gia sư, môn học hoặc trường ĐH..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          {subjectsList.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {sub === 'ALL' ? 'Tất cả môn' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTutors.map((tutor) => (
          <div key={tutor.id || tutor.code} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 relative">
            <div>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl ${tutor.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-xl shadow-md shrink-0`}>
                  {tutor.avatar || 'GS'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-slate-800 text-base truncate">{tutor.name}</h3>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold">{tutor.code}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{tutor.rating}</span>
                    <span className="text-slate-400 font-normal">• {tutor.experience}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="line-clamp-1">{tutor.qualification}</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tutor.subjects.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Học phí</span>
                <span className="text-base font-bold text-blue-600">{formatCurrency(tutor.hourlyRate)}/h</span>
              </div>
              <button
                onClick={() => setSelectedTutor(tutor)}
                className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Chọn Gia Sư
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Tutor Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {bookingSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Đăng Ký Thuê Gia Sư Thành Công!</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto">
                  Yêu cầu thuê gia sư <b>{selectedTutor.name}</b> đã được gửi tới bộ phận xếp lớp. Gia sư sẽ gọi điện xác nhận trong vòng 15 phút.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Đặt Lịch Thuê Gia Sư</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Gia sư: <b className="text-blue-600">{selectedTutor.name}</b> ({selectedTutor.code})</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Học phí</span>
                    <span className="font-bold text-blue-600">{formatCurrency(selectedTutor.hourlyRate)}/h</span>
                  </div>
                </div>

                <form onSubmit={handleBookSubmit} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Họ tên Phụ Huynh / Học Sinh</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="VD: Anh Hoàng Long hoặc em Gia Bảo"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Số điện thoại liên hệ nhanh</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0909123456"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Thời gian học & Yêu cầu chi tiết</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="VD: Muốn học tối thứ 2, 4, 6 từ 19h30, cần gia sư kèm sát bài trên lớp..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                    ></textarea>
                  </div>

                  <div className="bg-blue-50/60 p-4 rounded-xl text-xs text-blue-800 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Cam Kết Học Thử 2 Buổi Miễn Phí</span>
                    </div>
                    <p className="text-blue-600">Nếu sau 2 buổi không hài lòng về phương pháp truyền đạt, phụ huynh được đổi gia sư khác hoàn toàn miễn phí.</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedTutor(null)}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      Xác nhận thuê gia sư
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post Quick Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Đăng Yêu Cầu Tìm Gia Sư Kèm Riêng</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">Đăng yêu cầu lớp học hoàn toàn miễn phí. Hàng trăm gia sư phù hợp sẽ liên hệ bạn ngay.</p>
            
            <form onSubmit={handleQuickRequest} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Môn học</label>
                  <input
                    type="text"
                    required
                    value={reqSubject}
                    onChange={(e) => setReqSubject(e.target.value)}
                    placeholder="VD: Toán, Tiếng Anh"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Lớp / Khối</label>
                  <input
                    type="text"
                    value={reqGrade}
                    onChange={(e) => setReqGrade(e.target.value)}
                    placeholder="VD: Lớp 11"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Quận / Huyện</label>
                  <input
                    type="text"
                    required
                    value={reqLocation}
                    onChange={(e) => setReqLocation(e.target.value)}
                    placeholder="VD: Cầu Giấy, Hà Nội"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Học phí dự kiến / Buổi</label>
                  <input
                    type="number"
                    required
                    value={reqFee}
                    onChange={(e) => setReqFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Yêu cầu thêm về gia sư</label>
                <textarea
                  rows={2}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="VD: Gia sư nữ kinh nghiệm ôn thi đại học, nhẹ nhàng kiên nhẫn..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Đăng Yêu Cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
