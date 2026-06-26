import React, { useState } from 'react';
import { ClassItem, TutorItem } from '../types';
import { GraduationCap, MapPin, DollarSign, CheckCircle2, Send, ShieldCheck, BookOpen, AlertCircle, UserCheck, ArrowRight } from 'lucide-react';

interface RegisterTutorPublicProps {
  classes: ClassItem[];
  onApplyClass: (cls: ClassItem, tutorName: string, phone: string, intro: string) => Promise<void>;
  onRegisterProfile: (tutor: TutorItem) => Promise<void>;
  initialClass?: ClassItem | null;
}

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-teal-500'];

export const RegisterTutorPublic: React.FC<RegisterTutorPublicProps> = ({
  classes, onApplyClass, onRegisterProfile, initialClass,
}) => {
  const [tab, setTab] = useState<'browse' | 'register'>('register');
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(initialClass || null);
  const [applyName, setApplyName] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyIntro, setApplyIntro] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regQual, setRegQual] = useState('');
  const [regExp, setRegExp] = useState('');
  const [regSubjects, setRegSubjects] = useState('');
  const [regRate, setRegRate] = useState(200000);
  const [regArea, setRegArea] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const openClasses = classes.filter(c => c.status !== 'ĐÃ CÓ GIA SƯ');
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !applyName || !applyPhone) return;
    await onApplyClass(selectedClass, applyName, applyPhone, applyIntro);
    setApplySuccess(true);
    setTimeout(() => { setApplySuccess(false); setSelectedClass(null); setApplyName(''); setApplyPhone(''); setApplyIntro(''); }, 2500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regSubjects) return;
    const parts = regName.trim().split(' ');
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);

    await onRegisterProfile({
      code: `GS${Math.floor(100 + Math.random() * 900)}`,
      name: regName,
      subjects: regSubjects.split(',').map(s => s.trim()).filter(Boolean),
      qualification: regQual || '',
      experience: regExp || '',
      hourlyRate: Number(regRate) || 200000,
      rating: 5.0,
      status: 'offline',        // Chưa active
      verified: false,           // Chờ admin xác minh
      registeredAt: Date.now(),
      avatar: initials.toUpperCase(),
      avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      phone: regPhone,
      email: regEmail,
      area: regArea,
    });
    setRegSuccess(true);
  };

  if (regSuccess) {
    return (
      <div className="col-span-12 pb-24 md:pb-16">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-emerald-200 p-8 sm:p-10 text-center animate-scale-in">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h2>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Hồ sơ của bạn đang được trung tâm <b>xem xét và xác minh</b>. Bạn sẽ được thông báo khi hồ sơ được duyệt.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
            <div className="flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Thời gian xác minh: <b>trong vòng 24 giờ</b> (ngày làm việc)</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-amber-800">
              <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Hồ sơ đã xác minh sẽ được hiển thị công khai cho phụ huynh tìm kiếm</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 space-y-6 pb-24 md:pb-16">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold mb-3 border border-indigo-200">
          <GraduationCap className="w-3.5 h-3.5" /><span>Cổng đăng ký dành cho gia sư</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Đăng ký làm gia sư</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">Thu nhập cao, lịch linh hoạt. Hồ sơ được xác minh bởi trung tâm.</p>
      </div>

      {/* Tab switch */}
      <div className="flex gap-2 bg-white rounded-xl border border-slate-200 p-1.5 max-w-sm mx-auto">
        <button onClick={() => setTab('register')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            tab === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>Đăng ký hồ sơ</button>
        <button onClick={() => setTab('browse')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            tab === 'browse' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>Ứng tuyển lớp ({openClasses.length})</button>
      </div>

      {/* === TAB: REGISTER === */}
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="max-w-lg mx-auto space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Thông tin cá nhân</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Họ tên *</label>
              <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                placeholder="Nguyễn Văn A" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Số điện thoại *</label>
                <input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0912345678" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Email</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Chuyên môn</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Môn dạy * <span className="font-normal text-slate-400">(phẩy ngăn cách)</span></label>
              <input type="text" required value={regSubjects} onChange={(e) => setRegSubjects(e.target.value)}
                placeholder="Toán, Lý, Hóa" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Bằng cấp / Trường</label>
              <input type="text" value={regQual} onChange={(e) => setRegQual(e.target.value)}
                placeholder="VD: SV ĐH Bách Khoa HN" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kinh nghiệm</label>
                <input type="text" value={regExp} onChange={(e) => setRegExp(e.target.value)}
                  placeholder="VD: 2 năm" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Phí / giờ (VNĐ)</label>
                <input type="number" value={regRate} onChange={(e) => setRegRate(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-bold text-blue-600" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Khu vực dạy</label>
              <input type="text" value={regArea} onChange={(e) => setRegArea(e.target.value)}
                placeholder="VD: Cầu Giấy, Nam Từ Liêm, Online" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
            </div>
          </div>

          <button type="submit" disabled={!regName || !regPhone || !regSubjects}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Gửi đăng ký (chờ xác minh)</span>
          </button>
        </form>
      )}

      {/* === TAB: BROWSE CLASSES === */}
      {tab === 'browse' && (
        <div className="space-y-3 max-w-lg mx-auto">
          {openClasses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">Chưa có lớp nào đang tuyển</p>
              <p className="text-xs text-slate-400 mt-1">Hãy đăng ký hồ sơ để nhận thông báo khi có lớp mới</p>
            </div>
          ) : (
            openClasses.map((cls) => (
              <div key={cls.id || cls.code}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => setSelectedClass(cls)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{cls.code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>{cls.status}</span>
                </div>
                <h4 className="font-bold text-slate-800">{cls.subject}</h4>
                <p className="text-xs text-slate-500 mt-1">{cls.studentInfo}</p>
                <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cls.location}</span>
                  <span className="font-bold text-blue-600">{fmt(cls.fee)}/buổi</span>
                </div>
              </div>
            ))
          )}

          {/* Apply modal */}
          {selectedClass && (
            <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center" onClick={() => !applySuccess && setSelectedClass(null)}>
              <div className="bottom-sheet sm:rounded-2xl bg-white p-6 shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />
                {applySuccess ? (
                  <div className="text-center py-6 animate-scale-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="font-bold text-lg text-slate-800">Ứng tuyển thành công!</p>
                    <p className="text-sm text-slate-500 mt-1">Trung tâm sẽ xem xét và liên hệ bạn.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-slate-800 mb-1">Ứng tuyển lớp {selectedClass.code}</h3>
                    <p className="text-xs text-slate-500 mb-4">{selectedClass.subject} • {selectedClass.location} • {fmt(selectedClass.fee)}/buổi</p>
                    <form onSubmit={handleApply} className="space-y-3">
                      <input type="text" required value={applyName} onChange={(e) => setApplyName(e.target.value)}
                        placeholder="Họ tên gia sư *" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                      <input type="tel" required value={applyPhone} onChange={(e) => setApplyPhone(e.target.value)}
                        placeholder="Số điện thoại *" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                      <textarea rows={2} value={applyIntro} onChange={(e) => setApplyIntro(e.target.value)}
                        placeholder="Giới thiệu bản thân, kinh nghiệm..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
                      <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl cursor-pointer">
                        Gửi ứng tuyển
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
