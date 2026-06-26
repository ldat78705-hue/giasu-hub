import React, { useState, useEffect } from 'react';
import { db, initSettingsIfEmpty } from './firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { ClassItem, TutorItem, StudentItem, TransactionItem, ActiveTab, TutorBooking, ClassApplication, AdminSettings, NotificationItem, ParentRegistration, ContactMessage } from './types';
import { aiSmartSearch, aiMatchTutors, aiOptimizeSeo, aiGenerateClass, testApiKey } from './aiService';

// Admin Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { ClassTable } from './components/ClassTable';
import { SideWidgets } from './components/SideWidgets';
import { TutorTab } from './components/TutorTab';
import { StudentTab } from './components/StudentTab';
import { FinanceTab } from './components/FinanceTab';
import { SettingsTab } from './components/SettingsTab';
import { ApplicationsTab } from './components/ApplicationsTab';
import { SeoConfigTab } from './components/SeoConfigTab';
import { RegistrationsTab } from './components/RegistrationsTab';

// Public Components
import { PublicNavbar } from './components/PublicNavbar';
import { PublicFooter } from './components/PublicFooter';
import { HomePublic } from './components/HomePublic';
import { FindTutorPublic } from './components/FindTutorPublic';
import { RegisterTutorPublic } from './components/RegisterTutorPublic';
import { ParentRegisterForm } from './components/ParentRegisterForm';
import { ContactSection } from './components/ContactSection';

const publicTabs: ActiveTab[] = ['home', 'find-tutors', 'register-tutor', 'parent-register'];

const DEFAULT_SETTINGS: AdminSettings = {
  centerName: 'Gia Sư Thành Đạt',
  centerPhone: '',
  centerEmail: '',
  centerAddress: 'Hà Nội',
  geminiApiKey: '',
  zaloNumber: '',
  facebookUrl: '',
  updatedAt: Date.now(),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Data States
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [tutors, setTutors] = useState<TutorItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [applications, setApplications] = useState<ClassApplication[]>([]);
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [registrations, setRegistrations] = useState<ParentRegistration[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);

  // AI States
  const [selectedClass, setSelectedClass] = useState<ClassItem | undefined>(undefined);
  const [aiMatches, setAiMatches] = useState<{ tutorCode: string; matchPercentage: number; aiRationale: string }[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState('');

  // AI Generator Modal
  const [showAiGenModal, setShowAiGenModal] = useState(false);
  const [rawNotes, setRawNotes] = useState('');
  const [genLoading, setGenLoading] = useState(false);

  // Public page states
  const [selectedClassForApply, setSelectedClassForApply] = useState<ClassItem | null>(null);

  const isPublicView = publicTabs.includes(activeTab);
  const apiKey = settings.geminiApiKey || '';
  const zaloNumber = settings.zaloNumber || '';

  // Initialize & Subscribe
  useEffect(() => {
    initSettingsIfEmpty();

    const unsubs = [
      onSnapshot(collection(db, 'classes'), (snap) => {
        setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassItem)));
      }),
      onSnapshot(collection(db, 'tutors'), (snap) => {
        setTutors(snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorItem)));
      }),
      onSnapshot(collection(db, 'students'), (snap) => {
        setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentItem)));
      }),
      onSnapshot(collection(db, 'transactions'), (snap) => {
        setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as TransactionItem)));
      }),
      onSnapshot(collection(db, 'applications'), (snap) => {
        setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassApplication)));
      }),
      onSnapshot(collection(db, 'bookings'), (snap) => {
        setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorBooking)));
      }),
      onSnapshot(collection(db, 'notifications'), (snap) => {
        const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationItem));
        notifs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setNotifications(notifs);
      }),
      onSnapshot(collection(db, 'registrations'), (snap) => {
        const regs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ParentRegistration));
        regs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setRegistrations(regs);
      }),
      onSnapshot(doc(db, 'settings', 'admin'), (snap) => {
        if (snap.exists()) {
          setSettings({ id: snap.id, ...snap.data() } as AdminSettings);
        }
      }),
    ];

    return () => unsubs.forEach(u => u());
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // ======= AI HANDLERS (client-side) =======
  const runAiMatch = async (clsToMatch?: ClassItem) => {
    const target = clsToMatch || selectedClass;
    if (!target || tutors.length === 0 || !apiKey) return;
    setIsMatchingLoading(true);
    try {
      const matches = await aiMatchTutors(apiKey, target, tutors);
      if (Array.isArray(matches)) setAiMatches(matches);
    } catch (err) { console.error('AI Match failed:', err); }
    finally { setIsMatchingLoading(false); }
  };

  const handleAiSearch = async (query: string) => {
    if (!apiKey) { setAiSearchSummary('⚠️ Chưa cấu hình API Key AI. Vào Cài đặt để thiết lập.'); return; }
    setIsSearching(true);
    try {
      const data = await aiSmartSearch(apiKey, query);
      setAiSearchSummary(`🤖 AI: "${data.intentSummary || query}"`);
      if (data.extractedSubject) {
        const found = classes.find(c => c.subject.toLowerCase().includes(data.extractedSubject.toLowerCase()));
        if (found) setSelectedClass(found);
      }
    } catch (err) { console.error(err); }
    finally { setIsSearching(false); }
  };

  const runAiSeo = async (topic: string) => {
    if (!apiKey) throw new Error('Chưa cấu hình API Key');
    return await aiOptimizeSeo(apiKey, topic);
  };

  const handleGenerateClassFromNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawNotes.trim() || !apiKey) return;
    setGenLoading(true);
    try {
      const data = await aiGenerateClass(apiKey, rawNotes);
      await addDoc(collection(db, 'classes'), {
        code: `#LH${Math.floor(1000 + Math.random() * 9000)}`,
        subject: data.subject || rawNotes.slice(0, 50),
        studentInfo: data.studentInfo || '',
        location: data.location || 'Hà Nội',
        fee: Number(data.fee) || 200000,
        status: 'ĐANG TÌM',
        createdAt: Date.now(),
        schedule: data.schedule || '',
        requirements: data.requirements || rawNotes,
      });
      setShowAiGenModal(false);
      setRawNotes('');
    } catch (err) { console.error(err); }
    finally { setGenLoading(false); }
  };

  // ======= CRUD HANDLERS =======
  const handleAddClass = async (c: ClassItem) => {
    await addDoc(collection(db, 'classes'), c);
    await addDoc(collection(db, 'notifications'), {
      type: 'class', title: 'Lớp mới được tạo', message: `${c.subject} - ${c.location}`,
      isRead: false, createdAt: Date.now(),
    });
  };
  const handleUpdateClassStatus = async (id: string, st: ClassItem['status']) => { await updateDoc(doc(db, 'classes', id), { status: st }); };
  const handleDeleteClass = async (id: string) => { await deleteDoc(doc(db, 'classes', id)); };

  const handleAddTutor = async (t: TutorItem) => { await addDoc(collection(db, 'tutors'), t); };
  const handleUpdateTutorStatus = async (id: string, st: TutorItem['status']) => { await updateDoc(doc(db, 'tutors', id), { status: st }); };
  const handleDeleteTutor = async (id: string) => { await deleteDoc(doc(db, 'tutors', id)); };
  const handleVerifyTutor = async (id: string, verified: boolean) => {
    await updateDoc(doc(db, 'tutors', id), { verified, verifiedAt: verified ? Date.now() : null });
  };

  const handleAddStudent = async (st: StudentItem) => { await addDoc(collection(db, 'students'), st); };
  const handleDeleteStudent = async (id: string) => { await deleteDoc(doc(db, 'students', id)); };
  const handleUpdateStudentStatus = async (id: string, st: StudentItem['status']) => { await updateDoc(doc(db, 'students', id), { status: st }); };

  const handleAddTransaction = async (tr: TransactionItem) => { await addDoc(collection(db, 'transactions'), tr); };
  const handleDeleteTransaction = async (id: string) => { await deleteDoc(doc(db, 'transactions', id)); };

  const handleUpdateApplicationStatus = async (id: string, st: ClassApplication['status']) => { await updateDoc(doc(db, 'applications', id), { status: st }); };
  const handleUpdateBookingStatus = async (id: string, st: TutorBooking['status']) => { await updateDoc(doc(db, 'bookings', id), { status: st }); };
  const handleUpdateRegistrationStatus = async (id: string, st: ParentRegistration['status']) => { await updateDoc(doc(db, 'registrations', id), { status: st }); };

  const handleSaveSettings = async (partial: Partial<AdminSettings>) => {
    await setDoc(doc(db, 'settings', 'admin'), { ...settings, ...partial, updatedAt: Date.now() }, { merge: true });
  };
  const handleTestApiKey = async (key: string) => testApiKey(key);

  const handleMarkNotifRead = async (id: string) => { await updateDoc(doc(db, 'notifications', id), { isRead: true }); };
  const handleMarkAllNotifsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) { if (n.id) await updateDoc(doc(db, 'notifications', n.id), { isRead: true }); }
  };

  // Public handlers
  const handleBookTutor = async (tutor: TutorItem, parentName: string, phone: string, notes: string) => {
    await addDoc(collection(db, 'bookings'), {
      tutorCode: tutor.code, tutorName: tutor.name, parentName, parentPhone: phone,
      studentGrade: '', address: '', note: notes, createdAt: new Date().toISOString(), status: 'Chờ liên hệ',
    });
    await addDoc(collection(db, 'notifications'), {
      type: 'booking', title: 'Yêu cầu thuê gia sư mới',
      message: `${parentName} muốn thuê GS ${tutor.name} (${phone})`,
      isRead: false, createdAt: Date.now(),
    });
  };

  const handlePostRequest = async (cls: ClassItem) => { await addDoc(collection(db, 'classes'), cls); };

  const handleApplyClass = async (cls: ClassItem, tutorName: string, phone: string, intro: string) => {
    await addDoc(collection(db, 'applications'), {
      classCode: cls.code, classSubject: cls.subject, tutorName, tutorPhone: phone,
      tutorNote: intro, appliedAt: new Date().toISOString(), status: 'Chờ duyệt',
    });
    await addDoc(collection(db, 'notifications'), {
      type: 'application', title: 'Gia sư ứng tuyển nhận lớp',
      message: `${tutorName} ứng tuyển lớp ${cls.code} - ${cls.subject}`,
      isRead: false, createdAt: Date.now(),
    });
  };

  const handleRegisterTutorProfile = async (tutor: TutorItem) => {
    await addDoc(collection(db, 'tutors'), tutor);
    await addDoc(collection(db, 'notifications'), {
      type: 'application', title: 'Gia sư mới đăng ký (chờ xác minh)',
      message: `${tutor.name} - ${tutor.subjects.join(', ')}`,
      isRead: false, createdAt: Date.now(),
    });
  };

  const handleParentRegister = async (reg: ParentRegistration) => {
    await addDoc(collection(db, 'registrations'), reg);
    await addDoc(collection(db, 'notifications'), {
      type: 'registration', title: 'Phụ huynh đăng ký tìm gia sư',
      message: `${reg.parentName} (${reg.phone}) - ${reg.subjects.join(', ')} - ${reg.district || 'Hà Nội'}`,
      isRead: false, createdAt: Date.now(),
    });
  };

  const handleContactSubmit = async (msg: ContactMessage) => {
    await addDoc(collection(db, 'contacts'), msg);
    await addDoc(collection(db, 'notifications'), {
      type: 'contact', title: 'Liên hệ tư vấn mới',
      message: `${msg.name} (${msg.phone}): ${msg.message || 'Cần tư vấn'}`,
      isRead: false, createdAt: Date.now(),
    });
  };

  const pendingClassesCount = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP').length;
  const pendingApplicationsCount = applications.filter(a => a.status === 'Chờ duyệt').length + bookings.filter(b => b.status === 'Chờ liên hệ').length;
  const pendingRegistrations = registrations.filter(r => r.status === 'Mới').length;
  const pendingTutorVerify = tutors.filter(t => !t.verified).length;
  const totalRevenue = transactions.filter(t => t.type === 'Thu phí gia sư' && t.status === 'Thành công').reduce((s, t) => s + t.amount, 0);

  // ===================== PUBLIC VIEW =====================
  if (isPublicView) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 select-text">
        <PublicNavbar activeTab={activeTab} onNavigate={setActiveTab} zaloNumber={zaloNumber} />
        <main className="flex-1 pt-14 sm:pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-12 gap-6">
              {activeTab === 'home' && (
                <HomePublic classes={classes} tutors={tutors} onNavigate={setActiveTab}
                  onSelectClassForApply={setSelectedClassForApply}
                  onSelectTutorForBook={() => {}}
                  onAiSearch={handleAiSearch} isSearching={isSearching}
                  zaloNumber={zaloNumber} />
              )}
              {activeTab === 'find-tutors' && (
                <FindTutorPublic tutors={tutors} onBookTutor={handleBookTutor} onPostRequest={handlePostRequest} />
              )}
              {activeTab === 'register-tutor' && (
                <RegisterTutorPublic classes={classes} onApplyClass={handleApplyClass}
                  onRegisterProfile={handleRegisterTutorProfile} initialClass={selectedClassForApply} />
              )}
              {activeTab === 'parent-register' && (
                <ParentRegisterForm onSubmit={handleParentRegister} zaloNumber={zaloNumber} />
              )}
            </div>
          </div>
          <ContactSection onSubmit={handleContactSubmit} zaloNumber={zaloNumber} />
        </main>
        <PublicFooter onNavigate={setActiveTab} zaloNumber={zaloNumber} />

        {/* Floating Zalo CTA (mobile only) */}
        {zaloNumber && (
          <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
            className="floating-cta w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center animate-pulse-glow">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 2C6.48 2 2 6.03 2 10.93c0 2.75 1.44 5.19 3.67 6.77l-.02 2.25c0 .44.52.68.87.4l2.47-1.97c.93.26 1.93.4 2.99.4 5.52 0 10-4.03 10-8.93S17.52 2 12 2z"/></svg>
          </a>
        )}
      </div>
    );
  }

  // ===================== ADMIN VIEW =====================
  return (
    <div className="w-full h-screen bg-[#F1F5F9] flex font-sans overflow-hidden text-slate-800 select-text">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}
        pendingClassesCount={pendingClassesCount}
        pendingApplicationsCount={pendingApplicationsCount + pendingRegistrations + pendingTutorVerify} />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onAiSearch={handleAiSearch} isSearching={isSearching} hasApiKey={!!apiKey}
          notifications={notifications} onMarkNotifRead={handleMarkNotifRead}
          onMarkAllNotifsRead={handleMarkAllNotifsRead} onNavigate={setActiveTab} />

        {aiSearchSummary && (
          <div className="bg-blue-600 text-white px-8 py-2 text-xs font-medium flex items-center justify-between shrink-0">
            <span>{aiSearchSummary}</span>
            <button onClick={() => setAiSearchSummary('')} className="underline font-bold hover:opacity-80 cursor-pointer">Đóng</button>
          </div>
        )}

        <section className="flex-1 p-6 lg:p-8 grid grid-cols-12 gap-6 content-start overflow-y-auto">
          {activeTab === 'dashboard' && (
            <>
              <StatsCards totalClasses={classes.length} pendingClasses={pendingClassesCount}
                totalTutors={tutors.length} totalStudents={students.length}
                pendingApplications={pendingApplicationsCount} totalRevenue={totalRevenue} />
              <ClassTable classes={classes} onSelectClassForMatch={setSelectedClass}
                selectedClassCode={selectedClass?.code} onAddClass={handleAddClass}
                onUpdateStatus={handleUpdateClassStatus} onDeleteClass={handleDeleteClass}
                onOpenAiGenerator={() => setShowAiGenModal(true)} />
              <SideWidgets selectedClass={selectedClass} tutors={tutors} aiMatches={aiMatches}
                isMatchingLoading={isMatchingLoading} onRunMatch={() => runAiMatch()} hasApiKey={!!apiKey} />
            </>
          )}

          {activeTab === 'classes' && (
            <div className="col-span-12">
              <ClassTable classes={classes} onSelectClassForMatch={(cls) => { setSelectedClass(cls); setActiveTab('dashboard'); }}
                selectedClassCode={selectedClass?.code} onAddClass={handleAddClass}
                onUpdateStatus={handleUpdateClassStatus} onDeleteClass={handleDeleteClass}
                onOpenAiGenerator={() => setShowAiGenModal(true)} />
            </div>
          )}

          {activeTab === 'tutors' && (
            <TutorTab tutors={tutors} onAddTutor={handleAddTutor}
              onUpdateStatus={handleUpdateTutorStatus} onDeleteTutor={handleDeleteTutor}
              onVerifyTutor={handleVerifyTutor} />
          )}

          {activeTab === 'students' && (
            <StudentTab students={students} onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent} onUpdateStatus={handleUpdateStudentStatus} />
          )}

          {activeTab === 'applications' && (
            <ApplicationsTab applications={applications} bookings={bookings}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
              onUpdateBookingStatus={handleUpdateBookingStatus} />
          )}

          {activeTab === 'registrations' && (
            <RegistrationsTab registrations={registrations} onUpdateStatus={handleUpdateRegistrationStatus} />
          )}

          {activeTab === 'finance' && (
            <FinanceTab transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />
          )}

          {activeTab === 'seo' && (
            <SeoConfigTab onRunAiSeo={runAiSeo} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab settings={settings} onSaveSettings={handleSaveSettings} onTestApiKey={handleTestApiKey} />
          )}
        </section>
      </main>

      {/* AI Generator Modal */}
      {showAiGenModal && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">✨</span>
              <span>AI Soạn thảo lớp học</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Gõ ghi chú nhanh (VD: "chị Hương tìm gia sư toán 11 ở Cầu Giấy tuần 3 buổi"), AI sẽ tự động chuẩn hóa.
            </p>
            {!apiKey && (
              <div className="bg-amber-50 text-amber-800 text-xs font-semibold p-3 rounded-xl border border-amber-200 mb-4">
                ⚠️ Cần cấu hình Gemini API Key trong Cài đặt trước khi sử dụng AI.
              </div>
            )}
            <form onSubmit={handleGenerateClassFromNotes} className="space-y-4 text-sm">
              <textarea rows={4} required value={rawNotes} onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Nhập ghi chú nhanh..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 text-sm" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAiGenModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" disabled={genLoading || !apiKey}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50">
                  {genLoading ? 'AI đang phân tích...' : '✨ Phân tích & Đăng lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
