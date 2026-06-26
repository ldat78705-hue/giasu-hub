import React, { useState } from 'react';
import { ContactMessage } from '../types';
import { Send, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  onSubmit: (msg: ContactMessage) => Promise<void>;
  zaloNumber?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmit, zaloNumber }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSending(true);
    try {
      await onSubmit({ name, phone, message, createdAt: Date.now(), isRead: false });
      setSent(true);
      setTimeout(() => { setSent(false); setName(''); setPhone(''); setMessage(''); }, 3000);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  return (
    <section className="bg-white border-t border-slate-200 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left - Info */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Liên hệ tư vấn</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bạn cần tư vấn thêm? Để lại thông tin, trung tâm sẽ gọi lại ngay hoặc nhắn Zalo.
            </p>

            {zaloNumber && (
              <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md">
                <MessageCircle className="w-4 h-4" /><span>Chat Zalo: {zaloNumber}</span>
              </a>
            )}

            <div className="flex flex-col gap-2 text-sm text-slate-600 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" /><span>Tư vấn miễn phí 7:00 - 21:00</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Phản hồi trong 30 phút</span>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            {sent ? (
              <div className="text-center py-6 animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">Đã gửi thành công!</p>
                <p className="text-xs text-slate-500 mt-1">Trung tâm sẽ liên hệ lại sớm nhất.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Họ tên *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ tên"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Số điện thoại *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0912345678"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Nội dung cần tư vấn</label>
                  <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="VD: Tìm gia sư Toán lớp 10 khu Cầu Giấy..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /><span>{sending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}</span>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
