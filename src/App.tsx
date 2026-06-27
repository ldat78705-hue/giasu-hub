import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { db, initSettingsIfEmpty, seedSampleData } from './firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { ClassItem, TutorItem, StudentItem, TransactionItem, ActiveTab, TutorBooking, ClassApplication, AdminSettings, NotificationItem, ParentRegistration, ContactMessage, ClassMatch, TutorReview, AttendanceRecord } from './types';
import { aiSmartSearch, aiMatchTutors, aiOptimizeSeo, aiGenerateClass, testApiKey } from './aiService';
import { DEFAULT_HANOI_WARDS } from './hanoiWards';

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
import { RegistrationsTab } from './components/RegistrationsTab';
import { ContactsTab } from './components/ContactsTab';
import { MatchesTab } from './components/MatchesTab';
import { KPIDashboard } from './components/KPIDashboard';
import { ReviewsTab } from './components/ReviewsTab';
import { AttendanceTab } from './components/AttendanceTab';
import { CalendarView } from './components/CalendarView';
import { ImportTab } from './components/ImportTab';
import { AdvancedToolsTab } from './components/AdvancedToolsTab';
import { BlogTab } from './components/BlogTab';
import { ChatbotWidget } from './components/ChatbotWidget';
import { QuickActions } from './components/QuickActions';
import { ActivityLogTab, ActivityEntry } from './components/ActivityLogTab';
import { TutorPerformanceTab } from './components/TutorPerformanceTab';
import { AutoSuggestPanel } from './components/AutoSuggestPanel';
import { ZaloNotifyTab } from './components/ZaloNotifyTab';

// Public Components
import { PublicNavbar } from './components/PublicNavbar';
import { PublicFooter } from './components/PublicFooter';
import { HomePublic } from './components/HomePublic';
import { FindTutorPublic } from './components/FindTutorPublic';
import { RegisterTutorPublic } from './components/RegisterTutorPublic';
import { ParentRegisterForm } from './components/ParentRegisterForm';
import { FloatingActions } from './components/FloatingActions';
import { StatusLookup } from './components/StatusLookup';
import { TutorPortal } from './components/TutorPortal';

const publicTabs: ActiveTab[] = ['home', 'find-tutors', 'register-tutor', 'parent-register', 'status-lookup', 'tutor-portal'];

const DEFAULT_SETTINGS: AdminSettings = {
  centerName: 'Gia Sư Thành Đạt',
  centerPhone: '',
  centerEmail: '',
  centerAddress: 'Hà Nội',
  geminiApiKey: '',
  zaloNumber: '',
  facebookUrl: '',
  cloudinaryCloudName: '',
  cloudinaryPreset: '',
  wards: DEFAULT_HANOI_WARDS,
  updatedAt: Date.now(),
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Route <-> Tab mapping
  const routeToTab: Record<string, ActiveTab> = {
    '/': 'home',
    '/tim-gia-su': 'find-tutors',
    '/dang-ky-hoc': 'parent-register',
    '/dang-ky-day': 'register-tutor',
    '/tra-cuu': 'status-lookup',
    '/gia-su-portal': 'tutor-portal',
    '/dashboard': 'dashboard',
  };

  const tabToRoute: Record<string, string> = {
    'home': '/',
    'find-tutors': '/tim-gia-su',
    'parent-register': '/dang-ky-hoc',
    'register-tutor': '/dang-ky-day',
    'status-lookup': '/tra-cuu',
    'tutor-portal': '/gia-su-portal',
    'dashboard': '/dashboard',
  };

  const pageTitles: Record<string, string> = {
    '/': 'Gia Sư Thành Đạt - Trung Tâm Gia Sư Uy Tín Hàng Đầu Hà Nội',
    '/tim-gia-su': 'Tìm Gia Sư Giỏi Tại Hà Nội | Gia Sư Thành Đạt',
    '/dang-ky-hoc': 'Đăng Ký Tìm Gia Sư - Phụ Huynh | Gia Sư Thành Đạt',
    '/dang-ky-day': 'Đăng Ký Làm Gia Sư | Gia Sư Thành Đạt',
    '/tra-cuu': 'Tra Cứu Trạng Thái Đăng Ký | Gia Sư Thành Đạt',
    '/gia-su-portal': 'Cổng Gia Sư | Gia Sư Thành Đạt',
    '/dashboard': 'Quản Trị | Gia Sư Thành Đạt',
  };

  // Derive activeTab from URL
  const currentPath = location.pathname;
  const activeTab: ActiveTab = routeToTab[currentPath] || 'home';

  // Navigate function that updates URL
  const setActiveTab = (tab: ActiveTab) => {
    const route = tabToRoute[tab];
    if (route) {
      navigate(route);
    }
    // Admin sub-tabs keep same URL
  };

  // Admin sub-tab
  const [adminTab, setAdminTab] = useState<ActiveTab>('dashboard');

  // Data States
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [tutors, setTutors] = useState<TutorItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [applications, setApplications] = useState<ClassApplication[]>([]);
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [registrations, setRegistrations] = useState<ParentRegistration[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [matches, setMatches] = useState<ClassMatch[]>([]);
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [suggestReg, setSuggestReg] = useState<ParentRegistration | null>(null);

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

  const isPublicView = publicTabs.includes(activeTab);
  const apiKey = settings.geminiApiKey || '';
  const zaloNumber = settings.zaloNumber || '';

  // Update document title on route change
  useEffect(() => {
    document.title = pageTitles[currentPath] || 'Gia Sư Thành Đạt';
  }, [currentPath]);

  // Initialize & Subscribe
  useEffect(() => {
    initSettingsIfEmpty();
    seedSampleData();

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
      onSnapshot(collection(db, 'contacts'), (snap) => {
        const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
        msgs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setContacts(msgs);
      }),
      onSnapshot(collection(db, 'matches'), (snap) => {
        const m = snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassMatch));
        m.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setMatches(m);
      }),
      onSnapshot(collection(db, 'reviews'), (snap) => {
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorReview)));
      }),
      onSnapshot(collection(db, 'attendance'), (snap) => {
        setAttendance(snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord)));
      }),
      onSnapshot(doc(db, 'settings', 'admin'), (snap) => {
        if (snap.exists()) {
          setSettings({ id: snap.id, ...snap.data() } as AdminSettings);
        }
      }),
    ];

    return () => unsubs.forEach(u => u());
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  // Feature 10: Push notifications — request permission + fire on new unread
  useEffect(() => {
    if (!isPublicView && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isPublicView]);

  const prevNotifCountRef = React.useRef(0);
  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    if (unread > prevNotifCountRef.current && prevNotifCountRef.current > 0 && !isPublicView) {
      const newest = notifications.find(n => !n.isRead);
      if (newest && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(newest.title, { body: newest.message, icon: '/icon-192.png' });
      }
    }
    prevNotifCountRef.current = unread;
  }, [notifications, isPublicView]);

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

  // ======= ACTIVITY LOGGING =======
  const logActivity = (action: string, target: string, detail: string, category: ActivityEntry['category']) => {
    setActivities(prev => [{ id: `act-${Date.now()}`, action, target, detail, timestamp: Date.now(), category }, ...prev].slice(0, 500));
  };

  // ======= CRUD HANDLERS =======
  const handleAddClass = async (c: ClassItem) => {
    await addDoc(collection(db, 'classes'), c);
    await addDoc(collection(db, 'notifications'), {
      type: 'class', title: 'Lớp mới được tạo', message: `${c.subject} - ${c.location}`,
      isRead: false, createdAt: Date.now(),
    });
    logActivity('Tạo lớp mới', c.code, `${c.subject} - ${c.location}`, 'class');
  };
  const handleUpdateClassStatus = async (id: string, st: ClassItem['status']) => {
    await updateDoc(doc(db, 'classes', id), { status: st });
    logActivity('Đổi trạng thái lớp', id, `→ ${st}`, 'class');
  };
  const handleDeleteClass = async (id: string) => {
    await deleteDoc(doc(db, 'classes', id));
    logActivity('Xóa lớp', id, '', 'class');
  };

  const handleAddTutor = async (t: TutorItem) => {
    await addDoc(collection(db, 'tutors'), t);
    logActivity('Thêm gia sư', t.code, t.name, 'tutor');
  };
  const handleUpdateTutorStatus = async (id: string, st: TutorItem['status']) => {
    await updateDoc(doc(db, 'tutors', id), { status: st });
    logActivity('Đổi TT gia sư', id, `→ ${st}`, 'tutor');
  };
  const handleDeleteTutor = async (id: string) => {
    await deleteDoc(doc(db, 'tutors', id));
    logActivity('Xóa gia sư', id, '', 'tutor');
  };
  const handleVerifyTutor = async (id: string, verified: boolean) => {
    await updateDoc(doc(db, 'tutors', id), { verified, verifiedAt: verified ? Date.now() : null });
    logActivity(verified ? 'Xác minh GS' : 'Hủy xác minh GS', id, '', 'tutor');
  };

  const handleAddStudent = async (st: StudentItem) => {
    await addDoc(collection(db, 'students'), st);
    logActivity('Thêm học sinh', st.name, st.parentName, 'student');
  };
  const handleDeleteStudent = async (id: string) => {
    await deleteDoc(doc(db, 'students', id));
    logActivity('Xóa học sinh', id, '', 'student');
  };
  const handleUpdateStudentStatus = async (id: string, st: StudentItem['status']) => {
    await updateDoc(doc(db, 'students', id), { status: st });
    logActivity('Đổi TT học sinh', id, `→ ${st}`, 'student');
  };

  const handleAddTransaction = async (tr: TransactionItem) => {
    await addDoc(collection(db, 'transactions'), tr);
    logActivity('Thêm giao dịch', tr.receiptId, `${tr.type} - ${tr.amount.toLocaleString()}đ`, 'finance');
  };
  const handleDeleteTransaction = async (id: string) => {
    await deleteDoc(doc(db, 'transactions', id));
    logActivity('Xóa giao dịch', id, '', 'finance');
  };

  const handleUpdateApplicationStatus = async (id: string, st: ClassApplication['status']) => {
    await updateDoc(doc(db, 'applications', id), { status: st });
    logActivity('Đổi TT đơn ứng tuyển', id, `→ ${st}`, 'tutor');
  };
  const handleUpdateBookingStatus = async (id: string, st: TutorBooking['status']) => {
    await updateDoc(doc(db, 'bookings', id), { status: st });
    logActivity('Đổi TT booking', id, `→ ${st}`, 'registration');
  };
  const handleUpdateRegistrationStatus = async (id: string, st: ParentRegistration['status']) => {
    await updateDoc(doc(db, 'registrations', id), {
      status: st,
      statusHistory: arrayUnion({ status: st, timestamp: Date.now() }),
    });
    logActivity('Đổi TT đăng ký', id, `→ ${st}`, 'registration');

    // F33: Auto-create class when registration is confirmed
    if (st === 'Đã xếp lớp') {
      const reg = registrations.find(r => r.id === id);
      if (reg) {
        const subjectList = reg.subjects.join(', ');
        const classCode = `LOP-${Math.floor(1000 + Math.random() * 9000)}`;
        const existingClass = classes.find(c =>
          c.subject.includes(subjectList) && c.studentInfo?.includes(reg.studentName)
        );
        if (!existingClass) {
          const newClass: ClassItem = {
            code: classCode,
            subject: subjectList,
            studentInfo: `${reg.studentName} — ${reg.grade}`,
            location: `${reg.district}${reg.ward ? ', ' + reg.ward : ''}`,
            fee: 250000,
            status: 'ĐANG TÌM',
            createdAt: Date.now(),
            schedule: reg.schedule,
            teachMode: reg.mode,
          };
          await addDoc(collection(db, 'classes'), newClass);
          logActivity('Tạo lớp tự động từ đơn PH', classCode, `${subjectList} — ${reg.studentName}`, 'class');
        }
      }
    }
  };
  const handleUpdateRegistrationNote = async (id: string, note: string) => {
    await updateDoc(doc(db, 'registrations', id), { adminNote: note });
  };

  // Feature 1: Trial booking handler
  const handleUpdateTrial = async (id: string, data: { trialDate: string; trialTime: string; trialTutorCode?: string; trialStatus: string }) => {
    await updateDoc(doc(db, 'registrations', id), data);
  };

  // Feature 13: Tags handler
  const handleUpdateRegistrationTags = async (id: string, tags: string[]) => {
    await updateDoc(doc(db, 'registrations', id), { tags });
  };

  // Feature 14: Contact log handler
  const handleAddContactLog = async (id: string, log: { id: string; action: string; note: string; result: string; author: string; timestamp: number }) => {
    await updateDoc(doc(db, 'registrations', id), { contactLogs: arrayUnion(log) });
    logActivity('Ghi liên hệ', id, `${log.action} → ${log.result}`, 'registration');
  };

  // Reviews
  const handleAddReview = async (r: TutorReview) => { await addDoc(collection(db, 'reviews'), r); };
  const handleDeleteReview = async (id: string) => { await deleteDoc(doc(db, 'reviews', id)); };

  // Attendance
  const handleAddAttendance = async (r: AttendanceRecord) => { await addDoc(collection(db, 'attendance'), r); };
  const handleDeleteAttendance = async (id: string) => { await deleteDoc(doc(db, 'attendance', id)); };

  // Import
  const handleImportTutors = async (items: Partial<TutorItem>[]) => {
    for (const item of items) {
      if (!item.name) continue;
      const tutor: TutorItem = {
        code: `#GS${Math.floor(1000 + Math.random() * 9000)}`,
        name: item.name,
        avatar: item.name.charAt(0).toUpperCase(),
        avatarColor: '#3b82f6',
        subjects: item.subjects || [],
        qualification: item.qualification || '',
        experience: item.experience || '',
        rating: 0,
        status: 'offline',
        hourlyRate: 200000,
        phone: item.phone || '',
        email: item.email || '',
        verified: false,
        registeredAt: Date.now(),
        area: item.area || '',
      };
      await addDoc(collection(db, 'tutors'), tutor);
    }
  };
  const handleImportStudents = async (items: Partial<StudentItem>[]) => {
    for (const item of items) {
      if (!item.name) continue;
      const student: StudentItem = {
        name: item.name,
        grade: item.grade || '',
        parentName: item.parentName || '',
        parentPhone: item.parentPhone || '',
        school: item.school || '',
        enrolledClasses: 0,
        status: 'Chờ xếp lớp',
        phone: item.parentPhone || '',
        createdAt: Date.now(),
      };
      await addDoc(collection(db, 'students'), student);
    }
  };

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
  const unreadContactsCount = contacts.filter(c => !c.isRead).length;

  const handleMarkContactRead = async (id: string) => {
    await updateDoc(doc(db, 'contacts', id), { isRead: true });
  };
  const handleDeleteContact = async (id: string) => {
    await deleteDoc(doc(db, 'contacts', id));
  };

  // Match handlers
  const handleAddMatch = async (m: ClassMatch) => {
    await addDoc(collection(db, 'matches'), m);
    const cls = classes.find(c => c.code === m.classCode);
    if (cls?.id) await updateDoc(doc(db, 'classes', cls.id), { status: 'ĐÃ CÓ GIA SƯ' });
    await addDoc(collection(db, 'notifications'), {
      type: 'class', title: 'Đã ghép lớp thành công',
      message: `${m.classSubject} → GS ${m.tutorName}`,
      isRead: false, createdAt: Date.now(),
    });
    logActivity('Ghép lớp', m.classCode, `${m.classSubject} → GS ${m.tutorName}`, 'match');
  };
  const handleUpdateMatchStatus = async (id: string, st: ClassMatch['status']) => {
    await updateDoc(doc(db, 'matches', id), { status: st, ...(st === 'Hoàn thành' ? { endDate: Date.now() } : {}) });
    logActivity('Đổi TT ghép lớp', id, `→ ${st}`, 'match');
  };
  const handleDeleteMatch = async (id: string) => {
    await deleteDoc(doc(db, 'matches', id));
    logActivity('Xóa ghép lớp', id, '', 'match');
  };

  // Feature 4: Internal notes for matches
  const handleAddMatchNote = async (matchId: string, note: { id: string; text: string; author: string; createdAt: number }) => {
    await updateDoc(doc(db, 'matches', matchId), { internalNotes: arrayUnion(note) });
  };

  // F34: Collect 1-time connection fee from GS
  const handleCollectFee = async (matchId: string, tutorName: string, classSubject: string, classFee: number) => {
    const feeAmount = Math.round(classFee * 4); // 4 buổi phí kết nối (quy định TT)
    if (!window.confirm(`Thu phí kết nối ${new Intl.NumberFormat('vi-VN').format(feeAmount)}đ từ ${tutorName} cho lớp ${classSubject}?`)) return;
    // Mark match as paid
    await updateDoc(doc(db, 'matches', matchId), { feePaid: true, feeAmount });
    // Create transaction
    const tr = {
      receiptId: `PHI-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Thu phí gia sư' as const,
      amount: feeAmount,
      targetName: `${tutorName} — ${classSubject}`,
      date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Thành công' as const,
      matchId,
    };
    await addDoc(collection(db, 'transactions'), tr);
    logActivity('Thu phí kết nối', matchId, `${new Intl.NumberFormat('vi-VN').format(feeAmount)}đ — ${tutorName} — ${classSubject}`, 'finance');
  };

  // Admin note handlers
  const handleUpdateTutorNote = async (id: string, note: string) => {
    await updateDoc(doc(db, 'tutors', id), { adminNote: note });
  };
  const handleUpdateStudentNote = async (id: string, note: string) => {
    await updateDoc(doc(db, 'students', id), { adminNote: note });
  };

  // ===================== PUBLIC VIEW =====================
  if (isPublicView) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', -apple-system, sans-serif", color: '#1e293b' }}>
        <PublicNavbar activeTab={activeTab} onNavigate={setActiveTab} zaloNumber={zaloNumber} />
        <main style={{ flex: 1, paddingTop: 56 }}>
          <Routes>
            <Route path="/" element={
              <HomePublic classes={classes} tutors={tutors} reviews={reviews} onNavigate={setActiveTab}
                onAiSearch={handleAiSearch} isSearching={isSearching}
                zaloNumber={zaloNumber} onContactSubmit={handleContactSubmit} />
            } />
            <Route path="/tim-gia-su" element={
              <div style={{ maxWidth: 1024, margin: '0 auto', padding: '32px 20px' }}>
                <FindTutorPublic tutors={tutors} onBookTutor={handleBookTutor} onNavigate={(tab) => setActiveTab(tab)} />
              </div>
            } />
            <Route path="/dang-ky-day" element={
              <div style={{ maxWidth: 768, margin: '0 auto', padding: '32px 20px' }}>
                <RegisterTutorPublic
                  onRegisterProfile={handleRegisterTutorProfile}
                  cloudinaryCloudName={settings.cloudinaryCloudName || ''} cloudinaryPreset={settings.cloudinaryPreset || ''}
                  wards={settings.wards || DEFAULT_HANOI_WARDS} />
              </div>
            } />
            <Route path="/dang-ky-hoc" element={
              <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 20px' }}>
                <ParentRegisterForm onSubmit={handleParentRegister} zaloNumber={zaloNumber}
                  wards={settings.wards || DEFAULT_HANOI_WARDS} />
              </div>
            } />
            <Route path="/tra-cuu" element={
              <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 20px' }}>
                <StatusLookup tutors={tutors} registrations={registrations} matches={matches} attendance={attendance} zaloNumber={zaloNumber}
                  onSubmitReview={async (review) => { await addDoc(collection(db, 'reviews'), review); logActivity('PH đánh giá GS', review.tutorCode, `${review.rating}⭐ — ${review.tutorName}`, 'system'); }} />
              </div>
            } />
            <Route path="/gia-su-portal" element={
              <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
                <TutorPortal tutors={tutors} matches={matches} attendance={attendance} reviews={reviews} classes={classes}
                  onLogout={() => setActiveTab('home')}
                  onReportAbsence={async (record) => {
                    await addDoc(collection(db, 'attendance'), record);
                    await addDoc(collection(db, 'notifications'), { type: 'system', title: 'GS báo nghỉ', message: `${record.tutorName} báo nghỉ lớp ${record.classCode} ngày ${record.date}`, isRead: false, createdAt: Date.now() });
                    logActivity('GS báo nghỉ (Portal)', record.classCode, `${record.tutorName} — ${record.date}`, 'tutor');
                  }} />
              </div>
            } />
            <Route path="*" element={
              <HomePublic classes={classes} tutors={tutors} reviews={reviews} onNavigate={setActiveTab}
                onAiSearch={handleAiSearch} isSearching={isSearching}
                zaloNumber={zaloNumber} onContactSubmit={handleContactSubmit} />
            } />
          </Routes>
        </main>
        <PublicFooter onNavigate={setActiveTab} zaloNumber={zaloNumber} />

        {/* Floating Action Buttons */}
        <FloatingActions
          zaloNumber={zaloNumber}
          phoneNumber={settings.centerPhone || zaloNumber}
          onNavigateRegister={() => setActiveTab('parent-register')}
          onContactSubmit={handleContactSubmit}
        />
        <ChatbotWidget apiKey={settings.geminiApiKey} centerName={settings.centerName || 'Gia Sư Thành Đạt'} />
      </div>
    );
  }

  // ===================== ADMIN VIEW =====================
  return (
    <div className="w-full h-screen bg-[#F1F5F9] flex font-sans overflow-hidden text-slate-800 select-text">
      <Sidebar activeTab={adminTab} setActiveTab={(tab) => { setAdminTab(tab); }}
        pendingClassesCount={pendingClassesCount}
        pendingApplicationsCount={pendingApplicationsCount + pendingTutorVerify}
        unreadContactsCount={unreadContactsCount}
        pendingRegistrationsCount={pendingRegistrations}
        activeMatchesCount={matches.filter(m => m.status === 'Đang dạy').length}
        adminRole={settings.adminRole} />


      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onAiSearch={handleAiSearch} isSearching={isSearching} hasApiKey={!!apiKey}
          notifications={notifications} onMarkNotifRead={handleMarkNotifRead}
          onMarkAllNotifsRead={handleMarkAllNotifsRead} onNavigate={setAdminTab} />

        {aiSearchSummary && (
          <div className="bg-blue-600 text-white px-8 py-2 text-xs font-medium flex items-center justify-between shrink-0">
            <span>{aiSearchSummary}</span>
            <button onClick={() => setAiSearchSummary('')} className="underline font-bold hover:opacity-80 cursor-pointer">Đóng</button>
          </div>
        )}

        <section className="flex-1 p-6 lg:p-8 grid grid-cols-12 gap-6 content-start overflow-y-auto">
          {adminTab === 'dashboard' && (
            <>
              <QuickActions tutors={tutors} registrations={registrations} matches={matches}
                attendance={attendance} reviews={reviews} transactions={transactions} onNavigate={setAdminTab} />
              <StatsCards totalClasses={classes.length} pendingClasses={pendingClassesCount}
                totalTutors={tutors.length} totalStudents={students.length}
                pendingApplications={pendingApplicationsCount} totalRevenue={totalRevenue}
                unreadContacts={unreadContactsCount} totalRegistrations={registrations.length}
                pendingRegistrations={registrations.filter(r => r.status === 'Mới').length}
                matches={matches} registrations={registrations} />
              <ClassTable classes={classes} onSelectClassForMatch={setSelectedClass}
                selectedClassCode={selectedClass?.code} onAddClass={handleAddClass}
                onUpdateStatus={handleUpdateClassStatus} onDeleteClass={handleDeleteClass}
                onOpenAiGenerator={() => setShowAiGenModal(true)} />
              <SideWidgets selectedClass={selectedClass} tutors={tutors} aiMatches={aiMatches}
                isMatchingLoading={isMatchingLoading} onRunMatch={() => runAiMatch()} hasApiKey={!!apiKey}
                matches={matches} reviews={reviews} attendance={attendance} />
            </>
          )}

          {adminTab === 'classes' && (
            <div className="col-span-12">
              <ClassTable classes={classes} onSelectClassForMatch={(cls) => { setSelectedClass(cls); setAdminTab('dashboard'); }}
                selectedClassCode={selectedClass?.code} onAddClass={handleAddClass}
                onUpdateStatus={handleUpdateClassStatus} onDeleteClass={handleDeleteClass}
                onOpenAiGenerator={() => setShowAiGenModal(true)} />
            </div>
          )}

          {adminTab === 'tutors' && (
            <TutorTab tutors={tutors} onAddTutor={handleAddTutor}
              onUpdateStatus={handleUpdateTutorStatus} onDeleteTutor={handleDeleteTutor}
              onVerifyTutor={handleVerifyTutor} onUpdateNote={handleUpdateTutorNote} />
          )}

          {adminTab === 'matches' && (
            <MatchesTab matches={matches} classes={classes} tutors={tutors}
              onAddMatch={handleAddMatch} onUpdateStatus={handleUpdateMatchStatus}
              onDeleteMatch={handleDeleteMatch} onAddNote={handleAddMatchNote}
              onCollectFee={handleCollectFee} />
          )}

          {adminTab === 'students' && (
            <StudentTab students={students} onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent} onUpdateStatus={handleUpdateStudentStatus}
              onUpdateNote={handleUpdateStudentNote} />
          )}

          {adminTab === 'applications' && (
            <ApplicationsTab applications={applications} bookings={bookings}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
              onUpdateBookingStatus={handleUpdateBookingStatus} />
          )}

          {adminTab === 'registrations' && (
            <RegistrationsTab registrations={registrations} tutors={tutors} onUpdateStatus={handleUpdateRegistrationStatus}
              onUpdateNote={handleUpdateRegistrationNote} onSuggestTutor={setSuggestReg} onUpdateTrial={handleUpdateTrial}
              onUpdateTags={handleUpdateRegistrationTags} onAddContactLog={handleAddContactLog} />
          )}

          {adminTab === 'contacts' && (
            <ContactsTab contacts={contacts} onMarkRead={handleMarkContactRead} onDelete={handleDeleteContact} />
          )}

          {adminTab === 'finance' && (
            <FinanceTab transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />
          )}


          {adminTab === 'reviews' && (
            <ReviewsTab reviews={reviews} tutors={tutors} onAddReview={handleAddReview} onDeleteReview={handleDeleteReview} />
          )}

          {adminTab === 'attendance' && (
            <AttendanceTab attendance={attendance} matches={matches} onAddRecord={handleAddAttendance} onDeleteRecord={handleDeleteAttendance} />
          )}

          {adminTab === 'calendar' && (
            <CalendarView matches={matches} attendance={attendance} registrations={registrations} />
          )}


          {(adminTab as string) === 'import' && (
            <ImportTab tutors={tutors} students={students} onImportTutors={handleImportTutors} onImportStudents={handleImportStudents} />
          )}

          {(adminTab as string) === 'kpi' && (
            <KPIDashboard matches={matches} registrations={registrations} tutors={tutors} transactions={transactions} attendance={attendance} />
          )}

          {adminTab === 'settings' && (
            <SettingsTab settings={settings} onSaveSettings={handleSaveSettings} onTestApiKey={handleTestApiKey} />
          )}

          {adminTab === 'blog' && (
            <BlogTab onRunAiSeo={runAiSeo} />
          )}

          {adminTab === 'advanced' && (
            <AdvancedToolsTab />
          )}

          {adminTab === 'performance' && (
            <TutorPerformanceTab tutors={tutors} matches={matches} attendance={attendance} reviews={reviews} />
          )}

          {adminTab === 'activity' && (
            <ActivityLogTab activities={activities} />
          )}

          {adminTab === 'zalonotify' && (
            <ZaloNotifyTab registrations={registrations} matches={matches} tutors={tutors} />
          )}
        </section>
      </main>

      {/* Auto-suggest modal */}
      {suggestReg && (
        <AutoSuggestPanel registration={suggestReg} tutors={tutors} matches={matches} onClose={() => setSuggestReg(null)} />
      )}

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
