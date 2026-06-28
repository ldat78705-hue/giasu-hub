import React, { useState } from 'react';
import { ClassMatch, AttendanceRecord, ParentRegistration } from '../types';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface CalendarViewProps {
  matches: ClassMatch[];
  attendance: AttendanceRecord[];
  registrations?: ParentRegistration[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ matches, attendance, registrations = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const goMonth = (dir: number) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  // Build days grid
  const days: (number | null)[] = [];
  const startPad = firstDay === 0 ? 6 : firstDay - 1; // Monday first
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Active matches for calendar
  const activeMatches = matches.filter(m => m.status === 'Đang dạy');

  // Get attendance for a specific date
  const getDateAttendance = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendance.filter(a => a.date === dateStr);
  };

  // F21: Get trial bookings for a date
  const getDateTrials = (dateStr: string) => {
    return registrations.filter(r => r.trialDate === dateStr && r.trialStatus === 'Đã đặt');
  };

  const isToday = (day: number) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const monthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  // Week view: show current week
  const getWeekDays = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const result = [];
    for (let i = 0; i < 7; i++) {
      const wd = new Date(d);
      wd.setDate(diff + i);
      result.push(wd);
    }
    return result;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" /> Lịch dạy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{activeMatches.length} lớp đang dạy · {attendance.length} buổi đã ghi nhận</p>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 cursor-pointer">
            {viewMode === 'month' ? 'Xem tuần' : 'Xem tháng'}
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-600">
          <button onClick={() => goMonth(-1)} className="p-1 text-white/80 hover:text-white cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
          <h3 className="text-base font-bold text-white capitalize">{monthName}</h3>
          <button onClick={() => goMonth(1)} className="p-1 text-white/80 hover:text-white cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {viewMode === 'month' ? (
          <>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-slate-50">
              {weekDays.map(wd => (
                <div key={wd} className="text-center py-2 text-[10px] font-bold uppercase text-slate-400">{wd}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 border-t border-slate-100">
              {days.map((day, i) => {
                if (day === null) return <div key={i} className="min-h-[80px] border-r border-b border-slate-100 bg-slate-50/50" />;
                const dayAttendance = getDateAttendance(day);
                const taught = dayAttendance.filter(a => a.status === 'Đã dạy').length;
                const missed = dayAttendance.filter(a => a.status !== 'Đã dạy').length;
                return (
                  <div key={i} className={`min-h-[80px] border-r border-b border-slate-100 p-1.5 ${isToday(day) ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                    <div className={`text-xs font-bold mb-1 ${isToday(day) ? 'text-indigo-600' : 'text-slate-600'}`}>{day}</div>
                    {taught > 0 && <div className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold mb-0.5 flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" />{taught} buổi</div>}
                    {missed > 0 && <div className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold mb-0.5 flex items-center gap-0.5"><XCircle className="w-2.5 h-2.5" />{missed} vắng</div>}
                    {getDateTrials(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).map((t, ti) => (
                      <div key={ti} className="text-[8px] px-1 py-0.5 rounded bg-purple-100 text-purple-700 font-bold mb-0.5 truncate">🎓 HT: {t.studentName}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Week view */
          <div className="divide-y divide-slate-100">
            {getWeekDays().map((wd, i) => {
              const dateStr = wd.toISOString().slice(0, 10);
              const dayAtt = attendance.filter(a => a.date === dateStr);
              const isT = wd.toDateString() === today.toDateString();
              return (
                <div key={i} className={`px-6 py-4 flex items-start gap-4 ${isT ? 'bg-indigo-50' : ''}`}>
                  <div className={`w-14 text-center shrink-0 ${isT ? 'text-indigo-600' : 'text-slate-500'}`}>
                    <div className="text-[10px] font-bold uppercase">{weekDays[i]}</div>
                    <div className="text-xl font-bold">{wd.getDate()}</div>
                  </div>
                  <div className="flex-1">
                    {dayAtt.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Không có buổi học</p>
                    ) : (
                      <div className="space-y-1">
                        {dayAtt.map((a, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs">
                            {a.status === 'Đã dạy' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-500" />}
                            <span className="font-bold text-slate-700">{a.classCode}</span>
                            <span className="text-slate-500">{a.tutorName} → {a.studentName}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${a.status === 'Đã dạy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{a.status}</span>
                          </div>
                        ))}
                        {getDateTrials(dateStr).map((t, ti) => (
                          <div key={`trial-${ti}`} className="flex items-center gap-2 text-xs">
                            <span className="text-purple-500">🎓</span>
                            <span className="font-bold text-purple-700">Học thử</span>
                            <span className="text-purple-600">{t.studentName} ({t.subjects.join(', ')})</span>
                            {t.trialTime && <span className="text-purple-400">{t.trialTime}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend + Active Classes */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Lớp đang dạy ({activeMatches.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {activeMatches.map(m => (
            <div key={m.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
              <span className="font-bold text-slate-700">{m.classCode}</span>
              <span className="text-slate-500">{m.tutorName}</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-500">{m.studentName || 'Chưa có'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
