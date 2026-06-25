import React, { useState, useEffect } from 'react';
import { db, seedDatabaseIfEmpty } from './firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ClassItem, TutorItem, StudentItem, TransactionItem, ActiveTab, TutorBooking, ClassApplication } from './types';

// Admin Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { ClassTable } from './components/ClassTable';
import { SideWidgets } from './components/SideWidgets';
import { TutorTab } from './components/TutorTab';
import { StudentTab } from './components/StudentTab';
import { FinanceTab } from './components/FinanceTab';
import { SeoConfigTab } from './components/SeoConfigTab';

// Public Components
import { PublicNavbar } from './components/PublicNavbar';
import { PublicFooter } from './components/PublicFooter';
import { HomePublic } from './components/HomePublic';
import { FindTutorPublic } from './components/FindTutorPublic';
import { RegisterTutorPublic } from './components/RegisterTutorPublic';

// Define which tabs are public vs admin
const publicTabs: ActiveTab[] = ['home', 'find-tutors', 'register-tutor'];
const adminTabs: ActiveTab[] = ['dashboard', 'classes', 'tutors', 'students', 'finance', 'seo', 'applications'];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Real-time Data States
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [tutors, setTutors] = useState<TutorItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // AI Matching & Selection States
  const [selectedClass, setSelectedClass] = useState<ClassItem | undefined>(undefined);
  const [aiMatches, setAiMatches] = useState<{ tutorCode: string; matchPercentage: number; aiRationale: string }[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string>('');

  // AI Generator Modal State
  const [showAiGenModal, setShowAiGenModal] = useState(false);
  const [rawNotes, setRawNotes] = useState('');
  const [genLoading, setGenLoading] = useState(false);

  // Public page states
  const [selectedClassForApply, setSelectedClassForApply] = useState<ClassItem | null>(null);
  const [selectedTutorForBook, setSelectedTutorForBook] = useState<TutorItem | null>(null);

  const isPublicView = publicTabs.includes(activeTab);
  const isAdminView = adminTabs.includes(activeTab);

  // 1. Seed & Subscribe Realtime
  useEffect(() => {
    seedDatabaseIfEmpty();

    const unsubClasses = onSnapshot(collection(db, 'classes'), (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassItem));
      setClasses(arr);
      if (arr.length > 0 && !selectedClass) {
        setSelectedClass(arr[0]);
      }
    });

    const unsubTutors = onSnapshot(collection(db, 'tutors'), (snap) => {
      setTutors(snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorItem)));
    });

    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentItem)));
    });

    const unsubTrans = onSnapshot(collection(db, 'transactions'), (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as TransactionItem)));
    });

    return () => {
      unsubClasses();
      unsubTutors();
      unsubStudents();
      unsubTrans();
    };
  }, []);

  // When selectedClass changes, automatically match if tutors available
  useEffect(() => {
    if (selectedClass && tutors.length > 0 && activeTab === 'dashboard') {
      runAiMatch(selectedClass);
    }
  }, [selectedClass?.code]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // AI Match API Handler
  const runAiMatch = async (clsToMatch?: ClassItem) => {
    const target = clsToMatch || selectedClass;
    if (!target || tutors.length === 0) return;
    setIsMatchingLoading(true);
    try {
      const res = await fetch('/api/ai/match-tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classRequest: target, tutors }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.matches) {
          setAiMatches(data.matches);
        }
      }
    } catch (err) {
      console.error("AI Match failed:", err);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  // AI Smart Search Handler
  const handleAiSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSearchSummary(`🤖 AI phân tích nhu cầu: "${data.intentSummary || query}". Tìm thấy các lớp phù hợp nhất.`);
        if (data.extractedSubject) {
          const found = classes.find(c => c.subject.toLowerCase().includes(data.extractedSubject.toLowerCase()));
          if (found) setSelectedClass(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // AI SEO Generator
  const runAiSeo = async (topic: string) => {
    const res = await fetch('/api/ai/optimize-seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) throw new Error("Failed SEO generation");
    return await res.json();
  };

  // AI Class Generator from notes
  const handleGenerateClassFromNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawNotes.trim()) return;
    setGenLoading(true);
    try {
      const res = await fetch('/api/ai/generate-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        await addDoc(collection(db, 'classes'), {
          code: `#CS${Math.floor(2300 + Math.random() * 100)}`,
          subject: data.subject || 'Lớp học AI soạn thảo',
          studentInfo: data.studentInfo || 'Học sinh',
          location: data.location || 'TP.HCM',
          fee: Number(data.fee) || 300000,
          status: 'ĐANG TÌM',
          createdAt: Date.now(),
          requirements: data.requirements || rawNotes,
        });
        setShowAiGenModal(false);
        setRawNotes('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenLoading(false);
    }
  };

  // CRUD Handlers
  const handleAddClass = async (newCls: ClassItem) => {
    await addDoc(collection(db, 'classes'), newCls);
  };

  const handleUpdateClassStatus = async (id: string, st: ClassItem['status']) => {
    await updateDoc(doc(db, 'classes', id), { status: st });
  };

  const handleDeleteClass = async (id: string) => {
    await deleteDoc(doc(db, 'classes', id));
  };

  const handleAddTutor = async (newTutor: TutorItem) => {
    await addDoc(collection(db, 'tutors'), newTutor);
  };

  const handleUpdateTutorStatus = async (id: string, st: TutorItem['status']) => {
    await updateDoc(doc(db, 'tutors', id), { status: st });
  };

  const handleAddStudent = async (st: StudentItem) => {
    await addDoc(collection(db, 'students'), st);
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteDoc(doc(db, 'students', id));
  };

  const handleAddTransaction = async (tr: TransactionItem) => {
    await addDoc(collection(db, 'transactions'), tr);
  };

  // Public-facing handlers
  const handleBookTutor = async (tutor: TutorItem, studentName: string, phone: string, notes: string) => {
    await addDoc(collection(db, 'bookings'), {
      tutorCode: tutor.code,
      tutorName: tutor.name,
      parentName: studentName,
      parentPhone: phone,
      studentGrade: '',
      address: '',
      note: notes,
      createdAt: new Date().toISOString(),
      status: 'Chờ liên hệ',
    } as Omit<TutorBooking, 'id'>);
  };

  const handlePostRequest = async (cls: ClassItem) => {
    await addDoc(collection(db, 'classes'), cls);
  };

  const handleApplyClass = async (cls: ClassItem, tutorName: string, phone: string, intro: string) => {
    await addDoc(collection(db, 'applications'), {
      classCode: cls.code,
      classSubject: cls.subject,
      tutorName,
      tutorPhone: phone,
      tutorNote: intro,
      appliedAt: new Date().toISOString(),
      status: 'Chờ duyệt',
    } as Omit<ClassApplication, 'id'>);
  };

  const handleRegisterTutorProfile = async (tutor: TutorItem) => {
    await addDoc(collection(db, 'tutors'), tutor);
  };

  const pendingClassesCount = classes.filter(c => c.status === 'ĐANG TÌM').length;

  // =============================================
  // RENDER: PUBLIC VIEW
  // =============================================
  if (isPublicView) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 select-text">
        {/* Public Navbar */}
        <PublicNavbar activeTab={activeTab} onNavigate={setActiveTab} />

        {/* Main Content with top padding for fixed navbar */}
        <main className="flex-1 pt-[72px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-6">
              {activeTab === 'home' && (
                <HomePublic
                  classes={classes}
                  tutors={tutors}
                  onNavigate={setActiveTab}
                  onSelectClassForApply={(cls) => {
                    setSelectedClassForApply(cls);
                  }}
                  onSelectTutorForBook={(tutor) => {
                    setSelectedTutorForBook(tutor);
                  }}
                  onAiSearch={handleAiSearch}
                  isSearching={isSearching}
                />
              )}

              {activeTab === 'find-tutors' && (
                <FindTutorPublic
                  tutors={tutors}
                  onBookTutor={handleBookTutor}
                  onPostRequest={handlePostRequest}
                />
              )}

              {activeTab === 'register-tutor' && (
                <RegisterTutorPublic
                  classes={classes}
                  onApplyClass={handleApplyClass}
                  onRegisterProfile={handleRegisterTutorProfile}
                  initialClass={selectedClassForApply}
                />
              )}
            </div>
          </div>
        </main>

        {/* Public Footer */}
        <PublicFooter onNavigate={setActiveTab} />
      </div>
    );
  }

  // =============================================
  // RENDER: ADMIN VIEW
  // =============================================
  return (
    <div className="w-full h-screen bg-[#F1F5F9] flex font-sans overflow-hidden text-slate-800 select-text">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingClassesCount={pendingClassesCount}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Header
          onAiSearch={handleAiSearch}
          isSearching={isSearching}
          onQuickRefresh={() => seedDatabaseIfEmpty()}
        />

        {aiSearchSummary && (
          <div className="bg-blue-600 text-white px-8 py-2 text-xs font-medium flex items-center justify-between animate-fade-in shrink-0">
            <span>{aiSearchSummary}</span>
            <button onClick={() => setAiSearchSummary('')} className="underline font-bold hover:opacity-80 cursor-pointer">Đóng</button>
          </div>
        )}

        {/* Dynamic Section Layout */}
        <section className="flex-1 p-8 grid grid-cols-12 gap-6 content-start overflow-y-auto">
          {activeTab === 'dashboard' && (
            <>
              <StatsCards
                totalClasses={classes.length}
                pendingClasses={pendingClassesCount}
                totalTutors={tutors.length}
                totalStudents={students.length}
              />

              <ClassTable
                classes={classes}
                onSelectClassForMatch={(cls) => setSelectedClass(cls)}
                selectedClassCode={selectedClass?.code}
                onAddClass={handleAddClass}
                onUpdateStatus={handleUpdateClassStatus}
                onDeleteClass={handleDeleteClass}
                onOpenAiGenerator={() => setShowAiGenModal(true)}
              />

              <SideWidgets
                selectedClass={selectedClass}
                tutors={tutors}
                aiMatches={aiMatches}
                isMatchingLoading={isMatchingLoading}
                onRunMatch={() => runAiMatch()}
                onOpenSeoOptimizer={() => setActiveTab('seo')}
              />
            </>
          )}

          {activeTab === 'classes' && (
            <div className="col-span-12">
              <ClassTable
                classes={classes}
                onSelectClassForMatch={(cls) => { setSelectedClass(cls); setActiveTab('dashboard'); }}
                selectedClassCode={selectedClass?.code}
                onAddClass={handleAddClass}
                onUpdateStatus={handleUpdateClassStatus}
                onDeleteClass={handleDeleteClass}
                onOpenAiGenerator={() => setShowAiGenModal(true)}
              />
            </div>
          )}

          {activeTab === 'tutors' && (
            <TutorTab
              tutors={tutors}
              onAddTutor={handleAddTutor}
              onUpdateStatus={handleUpdateTutorStatus}
            />
          )}

          {activeTab === 'students' && (
            <StudentTab
              students={students}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceTab
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'seo' && (
            <SeoConfigTab
              onRunAiSeo={runAiSeo}
            />
          )}
        </section>
      </main>

      {/* AI Class Generator Modal */}
      {showAiGenModal && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">✨</span>
              <span>AI Soạn thảo yêu cầu tìm gia sư</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Chỉ cần gõ nhanh ghi chú thô (VD: "chị Hương tìm gia sư toán 11 ở q7 tuần 3 buổi lương 300k"), Gemini AI sẽ tự động phân tích và chuẩn hóa.
            </p>
            <form onSubmit={handleGenerateClassFromNotes} className="space-y-4 text-sm">
              <textarea
                rows={4}
                required
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Nhập ghi chú nhanh của khách hàng/phụ huynh tại đây..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 text-sm"
              ></textarea>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiGenModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={genLoading}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 cursor-pointer"
                >
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
