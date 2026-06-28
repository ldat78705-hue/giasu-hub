import React, { useState } from 'react';
import { Send, Bell, FileText, Shield, Copy, Check, Smartphone } from 'lucide-react';

// #19 Contract, #25 Role Config, #16 PWA
export const AdvancedToolsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contract' | 'roles' | 'pwa'>('contract');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const contractTemplate = `HỢP ĐỒNG GIA SƯ
Số: HD-{contractNo}

I. BÊN CUNG CẤP DỊCH VỤ (Trung tâm):
Tên: Gia Sư Thành Đạt
Đại diện: ________________
SĐT: 0822448444

II. BÊN SỬ DỤNG DỊCH VỤ (Phụ huynh):
Họ tên: {parentName}
Số điện thoại: {parentPhone}
Địa chỉ: {address}

III. GIA SƯ PHỤ TRÁCH:
Họ tên: {tutorName}
Mã gia sư: {tutorCode}

IV. NỘI DUNG:
- Học sinh: {studentName}
- Môn: {subject}
- Lớp: {grade}
- Lịch học: {schedule}
- Hình thức: {mode}
- Học phí: {fee}/buổi
- Thời hạn: {duration}

V. ĐIỀU KHOẢN:
1. Gia sư đảm bảo giảng dạy đầy đủ theo lịch.
2. Phụ huynh thanh toán học phí đúng hạn.
3. Đổi gia sư miễn phí nếu không hài lòng.
4. Báo trước 24h nếu hủy/dời buổi.

Ngày ký: ________________

BÊN A _____________ BÊN B _____________`;

  const roles = [
    { id: 'admin', name: 'Quản trị viên', desc: 'Toàn quyền quản lý', perms: ['Tất cả tính năng'] },
    { id: 'staff', name: 'Nhân viên tư vấn', desc: 'Liên hệ PH, xử lý đơn', perms: ['Xem đăng ký', 'Cập nhật trạng thái', 'Liên hệ', 'Xem GS'] },
    { id: 'accountant', name: 'Kế toán', desc: 'Quản lý tài chính', perms: ['Tài chính', 'Xuất báo cáo', 'In phiếu'] },
    { id: 'viewer', name: 'Xem báo cáo', desc: 'Chỉ xem, không sửa', perms: ['Dashboard', 'KPI', 'Thống kê'] },
  ];

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); });
  };

  const sections = [
    { id: 'contract' as const, label: 'Hợp đồng', icon: <FileText className="w-4 h-4" /> },
    { id: 'roles' as const, label: 'Phân quyền', icon: <Shield className="w-4 h-4" /> },
    { id: 'pwa' as const, label: 'App & Push', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <div className="col-span-12 space-y-5">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Bell className="w-5 h-5 text-purple-600" /> Công cụ nâng cao
      </h2>

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 border transition-all ${
              activeSection === s.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
            }`}>{s.icon}{s.label}</button>
        ))}
      </div>

      {/* #19 Contract Template */}
      {activeSection === 'contract' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> Mẫu hợp đồng gia sư</h3>
            <div className="flex gap-2">
              <button onClick={() => copy('contract', contractTemplate)}
                className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 ${
                  copiedId === 'contract' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'
                }`}>{copiedId === 'contract' ? <><Check className="w-3 h-3" /> Đã copy</> : <><Copy className="w-3 h-3" /> Copy</>}</button>
              <button onClick={() => { const w = window.open('', '_blank'); if(w){w.document.write(`<pre style="font-family:sans-serif;white-space:pre-wrap;padding:40px;max-width:700px;margin:auto">${contractTemplate}</pre>`);w.document.close();w.print();} }}
                className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"><Send className="w-3 h-3" /> In hợp đồng</button>
            </div>
          </div>
          <pre className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-wrap font-sans">{contractTemplate}</pre>
          <p className="text-[10px] text-slate-400 mt-3">💡 Thay thế các biến {'{...}'} bằng thông tin thực tế trước khi in.</p>
        </div>
      )}

      {/* #25 Role-based Access */}
      {activeSection === 'roles' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">Cấu hình vai trò cho nhân viên trung tâm. Mở rộng khi có thêm nhân viên.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map(role => (
              <div key={role.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className={`w-4 h-4 ${role.id === 'admin' ? 'text-red-500' : role.id === 'staff' ? 'text-blue-500' : role.id === 'accountant' ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className="text-sm font-bold text-slate-800">{role.name}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{role.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.perms.map((p, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Hệ thống phân quyền sẵn sàng tích hợp. Khi thêm nhân viên, mỗi người sẽ đăng nhập với vai trò riêng.</span>
          </div>
        </div>
      )}

      {/* #16 PWA & Push */}
      {activeSection === 'pwa' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4 text-blue-500" /> Cài App trên điện thoại</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-700 mb-2">📱 iPhone / iPad</h4>
                <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4">
                  <li>Mở Safari → giasu-dusky.vercel.app</li>
                  <li>Nhấn nút <strong>Chia sẻ</strong> (📤)</li>
                  <li>Chọn <strong>"Thêm vào MH chính"</strong></li>
                  <li>Nhấn <strong>Thêm</strong></li>
                </ol>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-700 mb-2">🤖 Android</h4>
                <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4">
                  <li>Mở Chrome → giasu-dusky.vercel.app</li>
                  <li>Nhấn menu <strong>⋮</strong></li>
                  <li>Chọn <strong>"Thêm vào MH chính"</strong></li>
                  <li>Nhấn <strong>Thêm</strong></li>
                </ol>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sau khi cài, ứng dụng sẽ hoạt động như app native. Dữ liệu real-time qua Firestore.</span>
          </div>
        </div>
      )}
    </div>
  );
};
