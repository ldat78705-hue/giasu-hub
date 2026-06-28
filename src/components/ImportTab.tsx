import React, { useState, useRef } from 'react';
import { TutorItem, StudentItem, ClassItem } from '../types';
import { Upload, FileText, AlertTriangle, CheckCircle2, Users, GraduationCap, BookOpen, Search, Download } from 'lucide-react';
import { parseCSVImport, findDuplicates } from '../utils';

interface ImportTabProps {
  tutors: TutorItem[];
  students: StudentItem[];
  onImportTutors: (tutors: Partial<TutorItem>[]) => void;
  onImportStudents: (students: Partial<StudentItem>[]) => void;
}

export const ImportTab: React.FC<ImportTabProps> = ({ tutors, students, onImportTutors, onImportStudents }) => {
  const [importType, setImportType] = useState<'tutors' | 'students'>('tutors');
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [duplicates, setDuplicates] = useState<Record<string, string>[]>([]);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Duplicate detection
  const [dupSearch, setDupSearch] = useState('');
  const [dupResults, setDupResults] = useState<{ type: string; items: any[] }[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const data = parseCSVImport(text);
      // Check for duplicates
      const dups = data.filter(row => {
        const phone = (row['Số điện thoại'] || row['SĐT'] || row['Phone'] || '').trim();
        if (!phone) return false;
        if (importType === 'tutors') return findDuplicates(tutors, phone).length > 0;
        return findDuplicates(students, phone).length > 0;
      });
      setDuplicates(dups);
      setPreview(data);
      setImported(false);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleImport = () => {
    const nonDup = preview.filter(row => {
      const phone = (row['Số điện thoại'] || row['SĐT'] || row['Phone'] || '').trim();
      return !duplicates.some(d => (d['Số điện thoại'] || d['SĐT'] || d['Phone'] || '') === phone);
    });

    if (importType === 'tutors') {
      const items = nonDup.map(row => ({
        name: row['Tên'] || row['Họ tên'] || row['Name'] || '',
        phone: row['Số điện thoại'] || row['SĐT'] || row['Phone'] || '',
        subjects: (row['Môn'] || row['Subjects'] || '').split(',').map(s => s.trim()).filter(Boolean),
        qualification: row['Bằng cấp'] || row['Qualification'] || '',
        experience: row['Kinh nghiệm'] || row['Experience'] || '',
        area: row['Khu vực'] || row['Area'] || '',
        email: row['Email'] || '',
      }));
      onImportTutors(items);
    } else {
      const items = nonDup.map(row => ({
        name: row['Tên học sinh'] || row['Tên HS'] || row['Họ tên'] || row['Name'] || '',
        grade: row['Lớp'] || row['Grade'] || '',
        parentName: row['Phụ huynh'] || row['PH'] || row['Tên PH'] || '',
        parentPhone: row['Số điện thoại phụ huynh'] || row['SĐT PH'] || row['SĐT'] || row['Phone'] || '',
        school: row['Trường'] || row['School'] || '',
      }));
      onImportStudents(items);
    }
    setImported(true);
  };

  const handleDuplicateSearch = () => {
    if (!dupSearch) return;
    const tutorDups = findDuplicates(tutors, dupSearch);
    const studentDups = findDuplicates(students, dupSearch);
    setDupResults([
      ...(tutorDups.length > 0 ? [{ type: 'Gia sư', items: tutorDups }] : []),
      ...(studentDups.length > 0 ? [{ type: 'Học sinh', items: studentDups }] : []),
    ]);
  };

  const downloadTemplate = (type: string) => {
    let csv = '';
    if (type === 'tutors') csv = '\uFEFFTên,Số điện thoại,Môn,Bằng cấp,Kinh nghiệm,Khu vực,Email\nNguyễn Văn A,0901234567,"Toán, Lý",Cử nhân,2 năm,Cầu Giấy,a@gmail.com';
    else csv = '\uFEFFTên học sinh,Lớp,Phụ huynh,Số điện thoại phụ huynh,Trường\nNguyễn Thị B,Lớp 8,Nguyễn Văn C,0901234567,THCS ABC';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mau-${type}.csv`; a.click();
  };

  return (
    <div className="col-span-12 space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Upload className="w-5 h-5 text-blue-600" /> Import & Kiểm tra trùng
      </h2>

      {/* Duplicate Detection - #27 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Kiểm tra trùng lặp (#27)
        </h3>
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={dupSearch} onChange={e => setDupSearch(e.target.value)} placeholder="Nhập số điện thoại hoặc tên để kiểm tra..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
              onKeyDown={e => e.key === 'Enter' && handleDuplicateSearch()} />
          </div>
          <button onClick={handleDuplicateSearch}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer">Kiểm tra</button>
        </div>
        {dupResults.length > 0 && (
          <div className="space-y-2">
            {dupResults.map((group, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-800 mb-1">⚠️ Tìm thấy {group.items.length} trùng trong {group.type}:</p>
                {group.items.map((item: any, j: number) => (
                  <p key={j} className="text-xs text-amber-700">• {item.name || item.parentName} — {item.phone || item.parentPhone}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        {dupSearch && dupResults.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">Không tìm thấy trùng lặp!</span>
          </div>
        )}
      </div>

      {/* Import Excel/CSV - #26 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" /> Import dữ liệu từ CSV/Excel (#26)
        </h3>

        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="flex gap-2">
            <button onClick={() => { setImportType('tutors'); setPreview([]); setDuplicates([]); setImported(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 border ${importType === 'tutors' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}>
              <GraduationCap className="w-3.5 h-3.5" /> Gia sư
            </button>
            <button onClick={() => { setImportType('students'); setPreview([]); setDuplicates([]); setImported(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 border ${importType === 'students' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}>
              <Users className="w-3.5 h-3.5" /> Học sinh
            </button>
          </div>
          <button onClick={() => downloadTemplate(importType)}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Tải mẫu CSV
          </button>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors mb-4">
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer">Chọn file CSV</button>
          <p className="text-[10px] text-slate-400 mt-2">Hỗ trợ .csv · UTF-8 · Tối đa 500 dòng</p>
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{preview.length} dòng · {duplicates.length} trùng lặp</span>
              {!imported && (
                <button onClick={handleImport}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Import {preview.length - duplicates.length} dòng mới
                </button>
              )}
              {imported && (
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Đã import thành công!
                </span>
              )}
            </div>
            {duplicates.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <p className="font-bold">⚠️ {duplicates.length} dòng trùng số điện thoại đã bỏ qua</p>
              </div>
            )}
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>{Object.keys(preview[0]).map(k => <th key={k} className="px-3 py-2 text-left font-bold text-slate-500 whitespace-nowrap">{k}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {preview.slice(0, 20).map((row, i) => {
                    const isDup = duplicates.includes(row);
                    return (
                      <tr key={i} className={isDup ? 'bg-red-50 text-red-400 line-through' : 'hover:bg-slate-50'}>
                        {Object.values(row).map((v, j) => <td key={j} className="px-3 py-2 whitespace-nowrap">{v}</td>)}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
