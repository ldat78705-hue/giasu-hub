import React, { useState } from 'react';
import { StudentItem } from '../types';
import { Plus, Phone, Trash2 } from 'lucide-react';

interface StudentTabProps {
  students: StudentItem[];
  onAddStudent: (st: StudentItem) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStatus: (id: string, status: StudentItem['status']) => void;
}

export const StudentTab: React.FC<StudentTabProps> = ({ students, onAddStudent, onDeleteStudent, onUpdateStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('Lớp 12');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onAddStudent({
      name, parentName: parentName || '', phone, grade, enrolledClasses: 0, status: 'Chờ xếp lớp',
    });
    setShowModal(false);
    setName(''); setParentName(''); setPhone('');
  };

  return (
    <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Học viên</h2>
          <p className="text-xs text-slate-500 mt-1">{students.length} học viên trong hệ thống</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer">
          <Plus className="w-4 h-4" /><span>Thêm học viên</span>
        </button>
      </div>

      {students.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="font-semibold text-sm">Chưa có học viên nào</p>
          <p className="text-xs mt-1">Nhấn "Thêm học viên" hoặc chờ phụ huynh đăng ký trên trang công khai</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Học sinh</th>
                <th className="px-6 py-3.5 font-semibold">Phụ huynh</th>
                <th className="px-6 py-3.5 font-semibold">Liên hệ</th>
                <th className="px-6 py-3.5 font-semibold">Trình độ</th>
                <th className="px-6 py-3.5 font-semibold">Trạng thái</th>
                <th className="px-6 py-3.5 font-semibold text-right">Xóa</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {students.map((st) => (
                <tr key={st.id || st.phone} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{st.name}</td>
                  <td className="px-6 py-4 text-slate-600">{st.parentName || '—'}</td>
                  <td className="px-6 py-4">
                    <a href={`tel:${st.phone}`} className="font-mono text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />{st.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-700">{st.grade}</span></td>
                  <td className="px-6 py-4">
                    <select value={st.status} onChange={(e) => st.id && onUpdateStatus(st.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer border outline-none ${
                        st.status === 'Đang học' ? 'bg-green-100 text-green-700 border-green-300' :
                        st.status === 'Chờ xếp lớp' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                        'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                      <option value="Đang học">Đang học</option>
                      <option value="Chờ xếp lớp">Chờ xếp lớp</option>
                      <option value="Bảo lưu">Bảo lưu</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {st.id && (
                      <button onClick={() => onDeleteStudent(st.id!)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Thêm Học viên mới</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tên học sinh *</label>
                <input type="text" required placeholder="Nguyễn Văn B" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tên phụ huynh</label>
                <input type="text" placeholder="Anh/Chị ..." value={parentName} onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Số điện thoại *</label>
                <input type="text" required placeholder="0912345678" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Lớp / Trình độ</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm">
                  <option>Tiểu học</option><option>Lớp 6</option><option>Lớp 7</option><option>Lớp 8</option>
                  <option>Lớp 9</option><option>Lớp 10</option><option>Lớp 11</option><option>Lớp 12</option>
                  <option>Đại học</option><option>Ngoại ngữ</option><option>Khác</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer">Lưu học viên</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
