import React, { useState } from 'react';
import { ClassItem, TutorItem } from '../types';
import { GraduationCap, MapPin, Clock, DollarSign, CheckCircle2, Send, ShieldCheck, Sparkles, BookOpen, AlertCircle, UserCheck } from 'lucide-react';

interface RegisterTutorPublicProps {
  classes: ClassItem[];
  onApplyClass: (cls: ClassItem, tutorName: string, phone: string, intro: string) => Promise<void>;
  onRegisterProfile: (tutor: TutorItem) => Promise<void>;
  initialClass?: ClassItem | null;
}

export const RegisterTutorPublic: React.FC<RegisterTutorPublicProps> = ({
  classes,
  onApplyClass,
  onRegisterProfile,
  initialClass,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'register'>('browse');

  // Apply Modal State
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(initialClass || null);
  const [applyName, setApplyName] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyIntro, setApplyIntro] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Register Tutor Profile State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regQual, setRegQual] = useState('Sinh viên ĐH Bách Khoa');
  const [regExp, setRegExp] = useState('2 năm kinh nghiệm');
  const [regSubjects, setRegSubjects] = useState('Toán, Lý');
  const [regRate, setRegRate] = useState(180000);
  const [regSuccess, setRegSuccess] = useState(false);

  const openClasses = classes.filter(c => c.status !== 'ĐÃ GIAO');

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !applyName || !applyPhone) return;
    await onApplyClass(selectedClass, applyName, applyPhone, applyIntro);
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedClass(null);
      setApplyName('');
      setApplyPhone('');
      setApplyIntro('');
    }, 2500);
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;
    await onRegisterProfile({
      code: `#GS${Math.floor(1000 + Math.random() * 9000)}`,
      name: regName,
      subjects: regSubjects.split(',').map(s => s.trim()).filter(Boolean),
      qualification: regQual,
      experience: regExp,
      hourlyRate: Number(regRate) || 150000,
      rating: 5.0,
      status: 'online',
      avatar: regName.slice(0, 2).toUpperCase(),
      avatarColor: 'bg-indigo-600',
    });
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setRegName('');
      setRegPhone('');
      setRegEmail('');
      setActiveSubTab('browse');
    }, 2500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  return (
    <div className="col-span-12 space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Cổng Gia Sư & Giáo Viên Nhận Lớp • Phí Thấp Nhất</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Đăng Ký Nhận Lớp Dạy Kèm <span className="text-indigo-400">Thu Nhập Cao</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Hàng trăm phụ huynh đang tìm kiếm gia sư giỏi mỗi ngày. Kiểm duyệt hồ sơ nhanh chóng, hỗ trợ nhận lớp 24/7 với hợp đồng minh bạch.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setActiveSubTab('browse')}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'browse'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Danh sách lớp mới ({openClasses.length})
            </button>
            <button
              onClick={() => setActiveSubTab('register')}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'register'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Đăng ký làm Gia Sư
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab 1: Browse Available Classes */}
      {activeSubTab === 'browse' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Các Lớp Dạy Kèm Đang Cần Gia Sư</h2>
              <p className="text-slate-500 text-sm mt-0.5">Chọn lớp phù hợp với chuyên môn và khu vực của bạn rồi nhấn Nhận Lớp</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openClasses.map((cls) => (
              <div key={cls.id || cls.code} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                      {cls.code}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {cls.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg leading-snug">{cls.subject}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{cls.studentInfo}</p>

                  <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{cls.location}</span>
                    </div>
                    {cls.schedule && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">{cls.schedule}</span>
                      </div>
                    )}
                    {cls.requirements && (
                      <div className="flex items-start gap-2 text-slate-500 italic mt-2 bg-slate-50 p-2 rounded-lg">
                        <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cls.requirements}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Học phí / Buổi</span>
                    <span className="text-base font-bold text-indigo-600">{formatCurrency(cls.fee)}</span>
                  </div>
                  <button
                    onClick={() => setSelectedClass(cls)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-600/20 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Đăng ký nhận lớp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Register Tutor Profile */}
      {activeSubTab === 'register' && (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          {regSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <UserCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Đăng Ký Hồ Sơ Gia Sư Thành Công!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Hồ sơ của bạn đã được lưu vào hệ thống. Trung tâm sẽ liên hệ xác minh bằng cấp qua Zalo/Điện thoại trước khi kích hoạt hiển thị công khai.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800">Tạo Hồ Sơ Gia Sư / Giáo Viên Mới</h2>
                <p className="text-slate-500 text-sm mt-1">Thông tin chi tiết giúp phụ huynh tin tưởng và lựa chọn bạn nhanh hơn</p>
              </div>

              <form onSubmit={handleRegSubmit} className="space-y-6 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Họ và tên thật (*)</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="VD: Nguyễn Văn Trung"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Số điện thoại / Zalo (*)</label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="VD: 0988777666"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Trường / Chức danh hiện tại</label>
                    <input
                      type="text"
                      value={regQual}
                      onChange={(e) => setRegQual(e.target.value)}
                      placeholder="VD: GV THPT Nguyễn Thị Minh Khai"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Kinh nghiệm giảng dạy</label>
                    <input
                      type="text"
                      value={regExp}
                      onChange={(e) => setRegExp(e.target.value)}
                      placeholder="VD: 4 năm kèm luyện thi ĐH"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Các môn có thể nhận dạy</label>
                    <input
                      type="text"
                      required
                      value={regSubjects}
                      onChange={(e) => setRegSubjects(e.target.value)}
                      placeholder="VD: Toán, Tiếng Anh, Lý"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Mức học phí mong muốn / Giờ</label>
                    <input
                      type="number"
                      required
                      value={regRate}
                      onChange={(e) => setRegRate(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-bold text-indigo-600"
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-2xl flex items-start gap-3 text-xs text-indigo-900">
                  <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <p>
                    Cam kết bảo mật thông tin liên hệ. Số điện thoại sẽ không công khai trực tiếp để tránh tin nhắn rác. Trung tâm chỉ kết nối khi có phụ huynh chọn bạn.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    Gửi Đăng Ký Hồ Sơ
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Apply Class Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {applySuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Gửi Yêu Cầu Nhận Lớp Thành Công!</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto">
                  Bộ phận giao lớp đã ghi nhận yêu cầu cho mã lớp <b>{selectedClass.code}</b>. Nhân viên sẽ liên hệ bạn qua Zalo để kiểm tra thẻ sinh viên/bằng cấp.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Đăng Ký Nhận Lớp</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Mã lớp: <b className="text-indigo-600">{selectedClass.code}</b> - {selectedClass.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Học phí</span>
                    <span className="font-bold text-indigo-600">{formatCurrency(selectedClass.fee)}/buổi</span>
                  </div>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Họ tên gia sư / giáo viên</label>
                    <input
                      type="text"
                      required
                      value={applyName}
                      onChange={(e) => setApplyName(e.target.value)}
                      placeholder="VD: Thầy Minh Tuấn"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Số điện thoại / Zalo liên hệ</label>
                    <input
                      type="text"
                      required
                      value={applyPhone}
                      onChange={(e) => setApplyPhone(e.target.value)}
                      placeholder="VD: 0912345678"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Giới thiệu ngắn về năng lực phù hợp</label>
                    <textarea
                      rows={3}
                      value={applyIntro}
                      onChange={(e) => setApplyIntro(e.target.value)}
                      placeholder="VD: Sinh viên năm cuối ĐH Bách Khoa điểm thi ĐH môn Toán 9.4, đã có kinh nghiệm dạy lớp 11 tiến bộ..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 text-sm"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedClass(null)}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
                    >
                      Xác Nhận Nhận Lớp
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
