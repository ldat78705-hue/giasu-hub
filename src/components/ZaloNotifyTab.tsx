import React, { useState } from 'react';
import { MessageCircle, Send, Copy, Check, Phone, Bell, Users, Clock } from 'lucide-react';
import { ParentRegistration, ClassMatch, TutorItem } from '../types';

interface ZaloNotifyTabProps {
  registrations: ParentRegistration[];
  matches: ClassMatch[];
  tutors: TutorItem[];
}

interface NotifyTemplate {
  id: string;
  title: string;
  trigger: string;
  template: string;
  icon: string;
}

export const ZaloNotifyTab: React.FC<ZaloNotifyTabProps> = ({ registrations, matches, tutors }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<ParentRegistration | null>(null);

  const templates: NotifyTemplate[] = [
    { id: 'new_reg', title: 'Xác nhận đơn mới', trigger: 'Khi PH vừa đăng ký', icon: '📋',
      template: 'Chào anh/chị {parentName}, Trung tâm Gia Sư Thành Đạt đã nhận đơn đăng ký tìm gia sư {subjects} cho bé {studentName} ({grade}). Chúng tôi sẽ liên hệ trong vòng 30 phút. Hotline: 0822448444' },
    { id: 'contacted', title: 'Đã liên hệ thành công', trigger: 'Sau khi gọi PH', icon: '📞',
      template: 'Chào anh/chị {parentName}, Cảm ơn anh/chị đã trao đổi. Trung tâm đang tìm gia sư phù hợp nhất cho bé {studentName}. Dự kiến phản hồi trong 24-48h. Mọi thắc mắc liên hệ 0822448444.' },
    { id: 'matched', title: 'Đã ghép gia sư', trigger: 'Khi ghép xong GS', icon: '✅',
      template: 'Chào anh/chị {parentName}, Trung tâm đã tìm được gia sư phù hợp cho bé {studentName}! GS {tutorName} sẽ liên hệ anh/chị để sắp xếp buổi học thử MIỄN PHÍ. Chúc bé học tốt!' },
    { id: 'trial', title: 'Nhắc buổi học thử', trigger: '1 ngày trước buổi thử', icon: '🎓',
      template: 'Nhắc nhở: Ngày mai bé {studentName} có buổi học thử môn {subjects} với GS {tutorName}. Thời gian: {schedule}. Anh/chị chuẩn bị sách vở cho bé nhé! Liên hệ: 0822448444' },
    { id: 'payment', title: 'Nhắc học phí', trigger: 'Cuối tháng', icon: '💰',
      template: 'Chào anh/chị {parentName}, Nhắc nhẹ về học phí tháng này cho bé {studentName}: {amount}đ. Hạn thanh toán: {deadline}. CK: [STK] - [NH]. Nội dung: HP {studentName}. Cảm ơn anh/chị!' },
    { id: 'feedback', title: 'Xin đánh giá sau 1 tháng', trigger: 'Sau 30 ngày học', icon: '⭐',
      template: 'Chào anh/chị {parentName}, Bé {studentName} đã học với GS {tutorName} được 1 tháng. Anh/chị đánh giá chất lượng giảng dạy thế nào ạ? (Trả lời 1-5 sao). Ý kiến của anh/chị giúp chúng tôi phục vụ tốt hơn!' },
    { id: 'cancel', title: 'Xác nhận hủy', trigger: 'Khi PH hủy đơn', icon: '❌',
      template: 'Chào anh/chị {parentName}, Trung tâm đã ghi nhận việc hủy đăng ký cho bé {studentName}. Nếu tương lai cần tìm gia sư, đừng ngần ngại liên hệ 0822448444. Chúc gia đình khỏe mạnh!' },
    { id: 'tutor_welcome', title: 'Chào GS mới', trigger: 'Khi duyệt GS', icon: '🎉',
      template: 'Chào {tutorName}! Hồ sơ gia sư của bạn đã được xác minh ✅. Mã GS: {tutorCode}. Từ bây giờ bạn có thể nhận lớp mới. Truy cập giasu-dusky.vercel.app để xem lớp đang tuyển. Chúc bạn dạy tốt!' },
  ];

  const newRegs = registrations.filter(r => r.status === 'Mới');
  const contactedRegs = registrations.filter(r => r.status === 'Đã liên hệ');
  const activeMatches = matches.filter(m => m.status === 'Đang dạy');

  const fillTemplate = (tmpl: string, reg?: ParentRegistration | null) => {
    if (!reg) return tmpl;
    let filled = tmpl;
    filled = filled.split('{parentName}').join(reg.parentName);
    filled = filled.split('{studentName}').join(reg.studentName || 'học sinh');
    filled = filled.split('{subjects}').join(reg.subjects.join(', '));
    filled = filled.split('{grade}').join(reg.grade);
    filled = filled.split('{schedule}').join(reg.schedule || 'N/A');
    return filled;
  };

  const copyMsg = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" /> Thông báo Zalo/SMS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{templates.length} mẫu · Chọn PH → Copy → Gửi Zalo</p>
        </div>
      </div>

      {/* Quick pick PH */}
      {newRegs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="text-xs font-bold uppercase text-blue-600 mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" /> PH mới cần liên hệ ({newRegs.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            {newRegs.slice(0, 8).map(r => (
              <button key={r.id} onClick={() => setSelectedReg(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                  selectedReg?.id === r.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}>
                {r.parentName} · {r.phone}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedReg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đang soạn cho: <strong>{selectedReg.parentName}</strong> ({selectedReg.phone}) · {selectedReg.subjects.join(', ')} · {selectedReg.district}</span>
          <button onClick={() => setSelectedReg(null)} className="ml-auto text-emerald-600 font-bold cursor-pointer hover:underline">Bỏ chọn</button>
        </div>
      )}

      {/* Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map(tmpl => {
          const filled = fillTemplate(tmpl.template, selectedReg);
          return (
            <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-green-200 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{tmpl.icon}</span>
                    <h3 className="text-sm font-bold text-slate-800">{tmpl.title}</h3>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {tmpl.trigger}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{filled}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 justify-end">
                <button onClick={() => copyMsg(tmpl.id, filled)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                    copiedId === tmpl.id ? 'bg-emerald-100 text-emerald-700' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}>
                  {copiedId === tmpl.id ? <><Check className="w-3 h-3" /> Đã copy</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
                <a href={`https://zalo.me/${selectedReg?.phone || '0822448444'}`} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <Send className="w-3 h-3" /> Gửi Zalo
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
