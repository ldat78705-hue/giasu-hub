import React, { useState } from 'react';
import { MESSAGE_TEMPLATES } from '../utils';
import { MessageSquare, Copy, Check, Edit3, Phone } from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [vars, setVars] = useState<Record<string, string>>({
    parentName: '', studentName: '', subject: '', tutorName: '', phone: '0822448444',
    amount: '', deadline: '', classCode: '',
  });

  const fillTemplate = (tmpl: string) => {
    let filled = tmpl;
    Object.entries(vars).forEach(([key, val]) => {
      filled = filled.split(`{${key}}`).join(String(val) || `{${key}}`);
    });
    return filled;
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Mẫu tin nhắn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{MESSAGE_TEMPLATES.length} mẫu tin · Copy nhanh gửi Zalo/SMS</p>
        </div>
      </div>

      {/* Variables */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-1">
          <Edit3 className="w-3 h-3" /> Điền biến (tự động thay thế)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'parentName', label: 'Tên PH' },
            { key: 'studentName', label: 'Tên HS' },
            { key: 'subject', label: 'Môn' },
            { key: 'tutorName', label: 'Tên GS' },
            { key: 'phone', label: 'SĐT TT' },
            { key: 'amount', label: 'Số tiền' },
            { key: 'deadline', label: 'Hạn TT' },
            { key: 'classCode', label: 'Mã lớp' },
          ].map(v => (
            <div key={v.key}>
              <label className="text-[10px] font-bold text-slate-500 uppercase">{v.label}</label>
              <input value={vars[v.key] || ''} onChange={e => setVars(p => ({ ...p, [v.key]: e.target.value }))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        {MESSAGE_TEMPLATES.map(tmpl => {
          const filled = fillTemplate(tmpl.template);
          return (
            <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">{tmpl.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {filled}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => copyToClipboard(tmpl.id, filled)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 transition-all ${
                      copiedId === tmpl.id ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                    {copiedId === tmpl.id ? <><Check className="w-3 h-3" /> Đã copy</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                  <a href={`https://zalo.me/0822448444`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Zalo
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
