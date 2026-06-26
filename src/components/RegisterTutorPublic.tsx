import React, { useState, useRef } from 'react';
import { ClassItem, TutorItem } from '../types';
import { GraduationCap, MapPin, CheckCircle2, Send, ShieldCheck, BookOpen, AlertCircle, UserCheck, Upload, FileText, X, Camera, User } from 'lucide-react';

interface RegisterTutorPublicProps {
  classes: ClassItem[];
  onApplyClass: (cls: ClassItem, tutorName: string, phone: string, intro: string) => Promise<void>;
  onRegisterProfile: (tutor: TutorItem) => Promise<void>;
  initialClass?: ClassItem | null;
  cloudinaryCloudName: string;
  cloudinaryPreset: string;
  wards: string[];
}

const SUBJECTS = [
  'Toán', 'Ngữ Văn', 'Tiếng Anh', 'Vật Lý', 'Hóa Học', 'Sinh Học',
  'Lịch Sử', 'Địa Lý', 'GDCD', 'Tin Học',
  'IELTS', 'TOEIC', 'Tiếng Nhật', 'Tiếng Trung', 'Tiếng Hàn',
  'Piano', 'Guitar', 'Vẽ', 'Tiếng Việt (cho người nước ngoài)',
];

const GRADE_LEVELS = [
  'Tiểu học (1-5)', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
  'Lớp 10', 'Lớp 11', 'Lớp 12',
  'Luyện thi vào 10', 'Luyện thi ĐH/ĐGNL',
  'Đại học', 'Người đi làm',
];


const SCHEDULES = ['Sáng (7h-12h)', 'Chiều (13h-17h)', 'Tối (18h-21h)', 'Cả ngày'];

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'];

// Upload ảnh lên Cloudinary (unsigned upload)
async function uploadToCloudinary(file: File, cloudName: string, preset: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  formData.append('folder', 'giasu-thanhdat/tutors');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

export const RegisterTutorPublic: React.FC<RegisterTutorPublicProps> = ({
  classes, onApplyClass, onRegisterProfile, initialClass,
  cloudinaryCloudName, cloudinaryPreset, wards,
}) => {
  const [tab, setTab] = useState<'register' | 'browse'>('register');
  const [step, setStep] = useState(1);

  // Step 1: Thông tin cá nhân
  const [regName, setRegName] = useState('');
  const [regGender, setRegGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [regDob, setRegDob] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regQual, setRegQual] = useState('');
  const [regExp, setRegExp] = useState('');

  // Step 2: Chuyên môn
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [wardSearch, setWardSearch] = useState('');
  const [regRate, setRegRate] = useState(200000);
  const [regIntro, setRegIntro] = useState('');

  // Step 3: Hồ sơ đính kèm
  const [cccdFile, setCccdFile] = useState<File | null>(null);
  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [cccdPreview, setCccdPreview] = useState('');
  const [degreePreview, setDegreePreview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Apply class
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(initialClass || null);
  const [applyName, setApplyName] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyIntro, setApplyIntro] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const cccdRef = useRef<HTMLInputElement>(null);
  const degreeRef = useRef<HTMLInputElement>(null);

  const openClasses = classes.filter(c => c.status !== 'ĐÃ CÓ GIA SƯ');
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
  const hasCloudinary = !!cloudinaryCloudName && !!cloudinaryPreset;

  const toggle = (list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const handleFile = (file: File | null, type: 'cccd' | 'degree') => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File quá lớn (tối đa 10MB)'); return; }
    const url = URL.createObjectURL(file);
    if (type === 'cccd') { setCccdFile(file); setCccdPreview(url); }
    else { setDegreeFile(file); setDegreePreview(url); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || selectedSubjects.length === 0 || selectedAreas.length === 0) return;
    setIsSubmitting(true);

    try {
      const tutorCode = `GS${Math.floor(100 + Math.random() * 900)}`;
      const documentUrls: TutorItem['documentUrls'] = {};

      // Upload files to Cloudinary
      if (hasCloudinary) {
        if (cccdFile) {
          setUploadProgress('Đang tải ảnh CCCD...');
          documentUrls.cccdUrl = await uploadToCloudinary(cccdFile, cloudinaryCloudName, cloudinaryPreset);
        }
        if (degreeFile) {
          setUploadProgress('Đang tải ảnh bằng cấp...');
          documentUrls.degreeUrl = await uploadToCloudinary(degreeFile, cloudinaryCloudName, cloudinaryPreset);
        }
      }
      setUploadProgress('Đang gửi hồ sơ...');

      const parts = regName.trim().split(' ');
      const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);

      await onRegisterProfile({
        code: tutorCode,
        name: regName,
        subjects: selectedSubjects,
        gradeLevels: selectedGrades,
        qualification: regQual || '',
        experience: regExp || '',
        hourlyRate: Number(regRate) || 200000,
        rating: 5.0,
        status: 'offline',
        verified: false,
        registeredAt: Date.now(),
        avatar: initials.toUpperCase(),
        avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        phone: regPhone,
        email: regEmail,
        area: regAddress,
        teachingAreas: selectedAreas,
        documentUrls: Object.keys(documentUrls).length > 0 ? documentUrls : undefined,
      });
      setRegSuccess(true);
    } catch (err) {
      console.error('Register failed:', err);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !applyName || !applyPhone) return;
    await onApplyClass(selectedClass, applyName, applyPhone, applyIntro);
    setApplySuccess(true);
    setTimeout(() => { setApplySuccess(false); setSelectedClass(null); setApplyName(''); setApplyPhone(''); setApplyIntro(''); }, 2500);
  };

  const isStep1Valid = !!regName && !!regPhone;
  const isStep2Valid = selectedSubjects.length > 0 && selectedAreas.length > 0;

  // ===== SUCCESS =====
  if (regSuccess) {
    return (
      <div className="pb-24 lg:pb-8">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-emerald-200 p-8 sm:p-10 text-center animate-scale-in">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h2>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Hồ sơ của bạn đang được trung tâm <b>xem xét và xác minh</b>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2.5">
            <div className="flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Thời gian xác minh: <b>trong vòng 24 giờ</b></span>
            </div>
            <div className="flex items-start gap-2 text-xs text-amber-800">
              <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Hồ sơ sẽ <b>hiển thị công khai</b> sau khi xác minh</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-amber-800">
              <FileText className="w-4 h-4 shrink-0 mt-0.5" />
              <span>CCCD & bằng cấp được bảo mật, chỉ admin xem</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold mb-3 border border-indigo-200">
          <GraduationCap className="w-3.5 h-3.5" /><span>Cổng đăng ký dành cho gia sư</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Đăng ký làm gia sư</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">Thu nhập cao, lịch linh hoạt. Hồ sơ xác minh bởi trung tâm.</p>
      </div>

      {/* Tab switch */}
      <div className="flex gap-2 bg-white rounded-xl border border-slate-200 p-1.5 max-w-sm mx-auto">
        <button onClick={() => setTab('register')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
          Đăng ký hồ sơ
        </button>
        <button onClick={() => setTab('browse')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'browse' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
          Ứng tuyển lớp ({openClasses.length})
        </button>
      </div>

      {/* ========== REGISTER ========== */}
      {tab === 'register' && (
        <div className="max-w-lg mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[{ n: 1, l: 'Thông tin' }, { n: 2, l: 'Chuyên môn' }, { n: 3, l: 'Hồ sơ' }].map((s, i) => (
              <React.Fragment key={s.n}>
                {i > 0 && <div className={`w-8 h-0.5 rounded-full ${step >= s.n ? 'bg-blue-500' : 'bg-slate-200'}`} />}
                <button onClick={() => { if (s.n <= step || (s.n === 2 && isStep1Valid) || (s.n === 3 && isStep1Valid && isStep2Valid)) setStep(s.n); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    step === s.n ? 'bg-blue-600 text-white' : step > s.n ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">
                    {step > s.n ? '✓' : s.n}
                  </span>
                  <span className="hidden sm:inline">{s.l}</span>
                </button>
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleRegister}>
            {/* ===== STEP 1 ===== */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" /><span>Thông tin cá nhân</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Họ và tên đầy đủ *</label>
                    <input type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                      placeholder="Nguyễn Văn A" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Giới tính</label>
                      <div className="flex gap-2">
                        {(['Nam', 'Nữ'] as const).map(g => (
                          <button key={g} type="button" onClick={() => setRegGender(g)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                              regGender === g ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                            }`}>{g}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Năm sinh</label>
                      <input type="number" value={regDob} onChange={e => setRegDob(e.target.value)}
                        placeholder="VD: 2001" min="1970" max="2010"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Số điện thoại *</label>
                      <input type="tel" required value={regPhone} onChange={e => setRegPhone(e.target.value)}
                        placeholder="0912345678" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Email</label>
                      <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        placeholder="email@gmail.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Nơi ở hiện tại</label>
                    <input type="text" value={regAddress} onChange={e => setRegAddress(e.target.value)}
                      placeholder="VD: Số 5 ngõ 120 Trần Cung, Cầu Giấy, Hà Nội" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Trường / Bằng cấp / Trình độ</label>
                    <input type="text" value={regQual} onChange={e => setRegQual(e.target.value)}
                      placeholder="VD: Cử nhân ĐHSP Hà Nội / SV năm 4 ĐH Bách Khoa" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Kinh nghiệm giảng dạy</label>
                    <input type="text" value={regExp} onChange={e => setRegExp(e.target.value)}
                      placeholder="VD: 3 năm dạy kèm Toán cấp 3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                  </div>
                </div>
                <button type="button" disabled={!isStep1Valid} onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 cursor-pointer">
                  Tiếp theo: Chuyên môn →
                </button>
              </div>
            )}

            {/* ===== STEP 2 ===== */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">📚 Môn đăng ký dạy * <span className="text-[10px] font-normal text-slate-400">(chọn nhiều)</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(sub => (
                      <button key={sub} type="button" onClick={() => toggle(selectedSubjects, setSelectedSubjects, sub)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedSubjects.includes(sub) ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}>{sub}</button>
                    ))}
                  </div>
                  {selectedSubjects.length > 0 && <p className="text-[11px] text-blue-600 font-semibold">✓ {selectedSubjects.join(', ')}</p>}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">🎓 Khối lớp dạy <span className="text-[10px] font-normal text-slate-400">(chọn nhiều)</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {GRADE_LEVELS.map(g => (
                      <button key={g} type="button" onClick={() => toggle(selectedGrades, setSelectedGrades, g)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedGrades.includes(g) ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                        }`}>{g}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />Khu vực có thể đi dạy * <span className="text-[10px] font-normal text-slate-400">(chọn xã/phường)</span>
                  </h3>
                  <input type="text" placeholder="🔍 Gõ tên xã/phường để tìm nhanh..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-sm"
                    onChange={e => setWardSearch(e.target.value)} value={wardSearch} />
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {wards.filter(w => !wardSearch || w.toLowerCase().includes(wardSearch.toLowerCase())).map(d => (
                      <button key={d} type="button" onClick={() => toggle(selectedAreas, setSelectedAreas, d)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedAreas.includes(d) ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                        }`}>{d}</button>
                    ))}
                  </div>
                  {selectedAreas.length > 0 && <p className="text-[11px] text-emerald-600 font-semibold">✓ Đã chọn {selectedAreas.length}: {selectedAreas.join(', ')}</p>}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">⏰ Thời gian có thể dạy</h3>
                  <div className="flex flex-wrap gap-2">
                    {SCHEDULES.map(s => (
                      <button key={s} type="button" onClick={() => toggle(selectedSchedules, setSelectedSchedules, s)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedSchedules.includes(s) ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
                        }`}>{s}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">💰 Mức lương mong muốn (VNĐ/buổi 2h)</label>
                    <input type="number" value={regRate} onChange={e => setRegRate(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-bold text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Giới thiệu bản thân / Kinh nghiệm nổi bật</label>
                    <textarea rows={3} value={regIntro} onChange={e => setRegIntro(e.target.value)}
                      placeholder="VD: Tốt nghiệp loại Giỏi ĐHSP, 5 năm kinh nghiệm dạy Toán 11-12, nhiều HS đạt 9+ thi ĐH..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 resize-none" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl cursor-pointer hover:bg-slate-50">← Quay lại</button>
                  <button type="button" disabled={!isStep2Valid} onClick={() => setStep(3)}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm rounded-2xl shadow-lg cursor-pointer">Tiếp: Hồ sơ →</button>
                </div>
              </div>
            )}

            {/* ===== STEP 3 ===== */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" /><span>Hồ sơ đính kèm (ảnh chụp)</span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Gửi ảnh chụp <b>CCCD</b> và <b>bằng cấp</b> để trung tâm xác minh năng lực. Thông tin được bảo mật tuyệt đối.
                  </p>

                  {!hasCloudinary && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-semibold">
                      ⚠️ Hệ thống lưu trữ ảnh chưa được cấu hình. Bạn vẫn có thể đăng ký và gửi ảnh sau.
                    </div>
                  )}

                  {/* CCCD */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">📋 Ảnh chụp CCCD / CMND (2 mặt)</label>
                    <input type="file" ref={cccdRef} accept="image/*" className="hidden"
                      onChange={e => handleFile(e.target.files?.[0] || null, 'cccd')} />
                    {cccdPreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={cccdPreview} alt="CCCD" className="w-full h-44 object-cover" />
                        <button type="button" onClick={() => { setCccdFile(null); setCccdPreview(''); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"><X className="w-4 h-4" /></button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /><span>{cccdFile?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => cccdRef.current?.click()}
                        className="w-full py-10 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center gap-2 text-slate-400">
                        <Camera className="w-8 h-8" />
                        <span className="text-xs font-semibold">Nhấn để chụp hoặc chọn ảnh CCCD</span>
                        <span className="text-[10px]">JPG, PNG — Tối đa 10MB</span>
                      </button>
                    )}
                  </div>

                  {/* Bằng cấp */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">🎓 Ảnh bằng cấp / Thẻ sinh viên / Chứng chỉ</label>
                    <input type="file" ref={degreeRef} accept="image/*" className="hidden"
                      onChange={e => handleFile(e.target.files?.[0] || null, 'degree')} />
                    {degreePreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={degreePreview} alt="Bằng cấp" className="w-full h-44 object-cover" />
                        <button type="button" onClick={() => { setDegreeFile(null); setDegreePreview(''); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"><X className="w-4 h-4" /></button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /><span>{degreeFile?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => degreeRef.current?.click()}
                        className="w-full py-10 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center gap-2 text-slate-400">
                        <Upload className="w-8 h-8" />
                        <span className="text-xs font-semibold">Nhấn để chọn ảnh bằng cấp</span>
                        <span className="text-[10px]">Bằng tốt nghiệp, thẻ SV, IELTS...</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-1.5 text-xs text-blue-700">
                  <h4 className="font-bold text-blue-800 text-sm mb-2">📋 Tóm tắt hồ sơ</h4>
                  <p>👤 <b>{regName}</b> ({regGender}{regDob ? `, SN ${regDob}` : ''}) — ☎ {regPhone}</p>
                  {regAddress && <p>🏠 {regAddress}</p>}
                  {regQual && <p>🎓 {regQual}</p>}
                  <p>📚 Môn: <b>{selectedSubjects.join(', ')}</b></p>
                  {selectedGrades.length > 0 && <p>📖 Khối: {selectedGrades.join(', ')}</p>}
                  <p>📍 Khu vực: <b>{selectedAreas.join(', ')}</b></p>
                  {selectedSchedules.length > 0 && <p>⏰ Buổi: {selectedSchedules.join(', ')}</p>}
                  <p>💰 Phí: <b>{fmt(regRate)}/buổi</b></p>
                  <p>📋 CCCD: {cccdFile ? <span className="text-emerald-700 font-bold">✓ Đã chọn</span> : <span className="text-amber-600">Chưa gửi</span>}</p>
                  <p>🎓 Bằng cấp: {degreeFile ? <span className="text-emerald-700 font-bold">✓ Đã chọn</span> : <span className="text-slate-500">Chưa gửi</span>}</p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)}
                    className="py-3.5 px-6 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl cursor-pointer hover:bg-slate-50">← Quay lại</button>
                  <button type="submit" disabled={isSubmitting || !isStep1Valid || !isStep2Valid}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? (uploadProgress || 'Đang xử lý...') : 'Gửi đăng ký'}</span>
                  </button>
                </div>
                <p className="text-center text-[11px] text-slate-400">Hồ sơ được xác minh trong 24h. Thông tin bảo mật.</p>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ========== BROWSE CLASSES ========== */}
      {tab === 'browse' && (
        <div className="space-y-3 max-w-lg mx-auto">
          {openClasses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">Chưa có lớp nào đang tuyển</p>
            </div>
          ) : openClasses.map(cls => (
            <div key={cls.id || cls.code} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 transition-all cursor-pointer"
              onClick={() => setSelectedClass(cls)}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{cls.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{cls.status}</span>
              </div>
              <h4 className="font-bold text-slate-800">{cls.subject}</h4>
              <p className="text-xs text-slate-500 mt-1">{cls.studentInfo}</p>
              <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cls.location}</span>
                <span className="font-bold text-blue-600">{fmt(cls.fee)}/buổi</span>
              </div>
            </div>
          ))}

          {selectedClass && (
            <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center" onClick={() => !applySuccess && setSelectedClass(null)}>
              <div className="bottom-sheet sm:rounded-2xl bg-white p-6 shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />
                {applySuccess ? (
                  <div className="text-center py-6 animate-scale-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="font-bold text-lg text-slate-800">Ứng tuyển thành công!</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-slate-800 mb-1">Ứng tuyển {selectedClass.code}</h3>
                    <p className="text-xs text-slate-500 mb-4">{selectedClass.subject} • {selectedClass.location} • {fmt(selectedClass.fee)}/buổi</p>
                    <form onSubmit={handleApply} className="space-y-3">
                      <input type="text" required value={applyName} onChange={e => setApplyName(e.target.value)} placeholder="Họ tên *" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                      <input type="tel" required value={applyPhone} onChange={e => setApplyPhone(e.target.value)} placeholder="SĐT *" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                      <textarea rows={2} value={applyIntro} onChange={e => setApplyIntro(e.target.value)} placeholder="Giới thiệu..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
                      <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl cursor-pointer">Gửi ứng tuyển</button>
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
