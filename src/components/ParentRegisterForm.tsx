import React, { useState } from 'react';
import { ParentRegistration } from '../types';
import { UserPlus, CheckCircle2, Phone, MapPin, BookOpen, Clock, Send } from 'lucide-react';

interface ParentRegisterFormProps {
  onSubmit: (reg: ParentRegistration) => Promise<void>;
  zaloNumber?: string;
  wards: string[];
}


const SUBJECTS = ['Toán', 'Tiếng Anh', 'Ngữ Văn', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'IELTS', 'Tin Học', 'Luyện thi vào 10', 'Luyện thi ĐH'];
const GRADES = ['Lớp 1-5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học', 'Người đi làm'];

export const ParentRegisterForm: React.FC<ParentRegisterFormProps> = ({ onSubmit, zaloNumber, wards }) => {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('Lớp 12');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [mode, setMode] = useState<'Tại nhà' | 'Online' | 'Cả hai'>('Tại nhà');
  const [schedule, setSchedule] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSubject = (sub: string) => {
    setSelectedSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !phone || selectedSubjects.length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        parentName, phone, studentName, grade,
        subjects: selectedSubjects, district, mode, schedule, note,
        createdAt: Date.now(), status: 'Mới',
      });
      setSuccess(true);
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  if (success) {
    return (
      <div className="pb-24 lg:pb-8">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-emerald-200 p-8 sm:p-10 text-center animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Trung tâm Gia Sư Thành Đạt sẽ liên hệ tư vấn cho bạn trong vòng <b>30 phút</b> (giờ hành chính).
          </p>
          {zaloNumber && (
            <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors">
              <Phone className="w-4 h-4" /><span>Nhắn Zalo để được tư vấn nhanh</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-3 border border-blue-200">
          <UserPlus className="w-3.5 h-3.5" /><span>Miễn phí 100% • Không ràng buộc</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Đăng ký tìm gia sư</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Điền thông tin bên dưới, trung tâm sẽ tư vấn và tìm gia sư phù hợp nhất cho con bạn.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
        {/* Thông tin PH */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" /><span>Thông tin liên hệ</span>
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Họ tên phụ huynh *</label>
            <input type="text" required value={parentName} onChange={(e) => setParentName(e.target.value)}
              placeholder="VD: Chị Hương"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Số điện thoại *</label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0912345678"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors" />
          </div>
        </div>

        {/* Thông tin HS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" /><span>Thông tin học sinh</span>
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Tên con</label>
            <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)}
              placeholder="VD: Minh Anh"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Lớp / Trình độ</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors">
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Môn cần học * <span className="font-normal text-slate-400">(chọn 1 hoặc nhiều)</span></label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(sub => (
                <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedSubjects.includes(sub)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}>
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Yêu cầu */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /><span>Yêu cầu dạy</span>
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Xã/phường</label>
            <input type="text" list="ward-list" value={district} onChange={(e) => setDistrict(e.target.value)}
              placeholder="Gõ tên xã/phường..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors" />
            <datalist id="ward-list">
              {wards.map(w => <option key={w} value={w} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Hình thức học</label>
            <div className="flex gap-2">
              {(['Tại nhà', 'Online', 'Cả hai'] as const).map(m => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    mode === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Lịch mong muốn</label>
            <input type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)}
              placeholder="VD: Tối T3, T5, T7 (19h-21h)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Ghi chú thêm</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Yêu cầu đặc biệt, mong muốn về gia sư..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-colors resize-none" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting || !parentName || !phone || selectedSubjects.length === 0}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký miễn phí'}</span>
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Thông tin của bạn được bảo mật. Trung tâm sẽ liên hệ trong 30 phút.
        </p>
      </form>
    </div>
  );
};
