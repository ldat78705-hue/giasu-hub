import React, { useState } from 'react';
import { StudentItem, EmergencyContact } from '../types';
import { Plus, Phone, Trash2, X, ChevronDown, ChevronUp, Mail, MapPin, User, Users } from 'lucide-react';

interface StudentTabProps {
  students: StudentItem[];
  onAddStudent: (st: StudentItem) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStatus: (id: string, status: StudentItem['status']) => void;
}

export const StudentTab: React.FC<StudentTabProps> = ({ students, onAddStudent, onDeleteStudent, onUpdateStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Lớp 12');
  const [dob, setDob] = useState('');
  const [school, setSchool] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [parentRelation, setParentRelation] = useState('Mẹ');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [note, setNote] = useState('');

  const addEmergency = () => setEmergencyContacts(prev => [...prev, { name: '', phone: '', relation: '' }]);
  const updateEmergency = (i: number, field: keyof EmergencyContact, val: string) => {
    setEmergencyContacts(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  const resetForm = () => {
    setName(''); setGrade('Lớp 12'); setDob(''); setSchool('');
    setParentName(''); setParentPhone(''); setParentEmail(''); setParentAddress('');
    setParentRelation('Mẹ'); setEmergencyContacts([]); setNote('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !parentPhone) return;
    onAddStudent({
      name, grade, dob, school,
      parentName, parentPhone, phone: parentPhone,
      parentEmail, parentAddress, parentRelation,
      emergencyContacts: emergencyContacts.filter(c => c.name && c.phone),
      enrolledClasses: 0, status: 'Chờ xếp lớp',
      note, createdAt: Date.now(),
    });
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Học sinh</h2>
          <p className="text-xs text-slate-500 mt-1">{students.length} học sinh · Thông tin PHHS tích hợp</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer">
          <Plus className="w-4 h-4" /><span>Thêm học sinh</span>
        </button>
      </div>

      {students.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-sm">Chưa có học sinh nào</p>
          <p className="text-xs mt-1">Nhấn "Thêm học sinh" để bắt đầu quản lý</p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((st) => (
            <div key={st.id || st.phone} className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Main row */}
              <div className="flex items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === st.id ? null : st.id || null)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-800">{st.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">{st.grade}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {st.parentRelation || 'PHHS'}: {st.parentName || '—'}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {st.parentPhone || st.phone}</span>
                  </div>
                </div>
                <select value={st.status} onChange={(e) => { e.stopPropagation(); st.id && onUpdateStatus(st.id, e.target.value as any); }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer border outline-none mr-3 ${
                    st.status === 'Đang học' ? 'bg-green-100 text-green-700 border-green-300' :
                    st.status === 'Chờ xếp lớp' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                  <option value="Đang học">Đang học</option>
                  <option value="Chờ xếp lớp">Chờ xếp lớp</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                </select>
                <div className="flex items-center gap-2">
                  {st.id && (
                    <button onClick={(e) => { e.stopPropagation(); onDeleteStudent(st.id!); }}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {expandedId === st.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded detail */}
              {expandedId === st.id && (
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 text-xs space-y-3">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {st.dob && <div><span className="text-slate-400 block">Ngày sinh</span><span className="font-semibold text-slate-700">{st.dob}</span></div>}
                    {st.school && <div><span className="text-slate-400 block">Trường</span><span className="font-semibold text-slate-700">{st.school}</span></div>}
                    {st.parentEmail && <div><span className="text-slate-400 block">Email PHHS</span><a href={`mailto:${st.parentEmail}`} className="font-semibold text-blue-600">{st.parentEmail}</a></div>}
                    {st.parentAddress && <div><span className="text-slate-400 block">Địa chỉ</span><span className="font-semibold text-slate-700">{st.parentAddress}</span></div>}
                  </div>
                  {st.emergencyContacts && st.emergencyContacts.length > 0 && (
                    <div>
                      <span className="text-slate-400 block mb-1">Liên hệ khẩn cấp</span>
                      <div className="flex flex-wrap gap-2">
                        {st.emergencyContacts.map((c, i) => (
                          <span key={i} className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                            <Phone className="w-3 h-3 text-blue-600" />
                            <span className="font-semibold text-slate-700">{c.name}</span>
                            <span className="text-slate-400">({c.relation})</span>
                            <a href={`tel:${c.phone}`} className="text-blue-600 font-mono">{c.phone}</a>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {st.note && <div><span className="text-slate-400 block">Ghi chú</span><span className="text-slate-700">{st.note}</span></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Thêm Học sinh mới</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              {/* Học sinh info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Thông tin học sinh</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tên học sinh *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn B"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Lớp</label>
                    <select value={grade} onChange={e => setGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm">
                      {['Tiểu học', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học', 'Khác'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Ngày sinh</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Trường</label>
                    <input value={school} onChange={e => setSchool(e.target.value)} placeholder="VD: THPT Chu Văn An"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm" />
                  </div>
                </div>
              </div>

              {/* PHHS info */}
              <div className="bg-blue-50/50 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase text-blue-600 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Thông tin Phụ huynh</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Quan hệ</label>
                    <select value={parentRelation} onChange={e => setParentRelation(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm">
                      {['Bố', 'Mẹ', 'Ông', 'Bà', 'Anh/Chị', 'Khác'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Họ tên PHHS</label>
                    <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Anh/Chị ..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">SĐT PHHS *</label>
                    <input required type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="0912345678"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                    <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="email@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Địa chỉ</label>
                  <input value={parentAddress} onChange={e => setParentAddress(e.target.value)} placeholder="Số nhà, phường/xã, quận/huyện"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm" />
                </div>
              </div>

              {/* Emergency contacts */}
              <div className="bg-amber-50/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Liên hệ khẩn cấp</h4>
                  <button type="button" onClick={addEmergency}
                    className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded cursor-pointer flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Thêm
                  </button>
                </div>
                {emergencyContacts.map((c, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_80px_28px] gap-2 items-center">
                    <input value={c.name} onChange={e => updateEmergency(i, 'name', e.target.value)} placeholder="Họ tên"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" />
                    <input value={c.phone} onChange={e => updateEmergency(i, 'phone', e.target.value)} placeholder="SĐT" type="tel"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" />
                    <select value={c.relation} onChange={e => updateEmergency(i, 'relation', e.target.value)}
                      className="px-1.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] outline-none">
                      <option value="">Quan hệ</option>
                      {['Bố', 'Mẹ', 'Anh/Chị', 'Bác', 'Chú', 'Khác'].map(r => <option key={r}>{r}</option>)}
                    </select>
                    <button type="button" onClick={() => setEmergencyContacts(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:bg-red-50 rounded p-1 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Ghi chú</label>
                <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú thêm về học sinh..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer">Lưu học sinh</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
