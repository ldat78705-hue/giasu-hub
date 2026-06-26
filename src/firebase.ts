import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, addDoc } from 'firebase/firestore';
import { AdminSettings, TutorItem, ClassItem } from './types';
import { DEFAULT_HANOI_WARDS } from './hanoiWards';

const firebaseConfig = {
  apiKey: "AIzaSyBKR-3QcLsHIp0qUcA7UJsPeJE8KeR0jtg",
  authDomain: "gen-lang-client-0743353563.firebaseapp.com",
  projectId: "gen-lang-client-0743353563",
  storageBucket: "gen-lang-client-0743353563.firebasestorage.app",
  messagingSenderId: "901357414458",
  appId: "1:901357414458:web:6bb523529a75299a9ced03"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-67742997-e604-4965-bd7c-2e8a9cef16d2");

// Default admin settings - initialized once if not existing
const DEFAULT_SETTINGS: Omit<AdminSettings, 'id'> = {
  centerName: 'Gia Sư Thành Đạt',
  centerPhone: '0822448444',
  centerEmail: 'giasuthanhdat@gmail.com',
  centerAddress: 'Hà Nội',
  geminiApiKey: 'AIzaSyBDe-VKVWhxJoL5d0_tVs26l8MF1GSz6QY',
  zaloNumber: '0822448444',
  facebookUrl: '',
  cloudinaryCloudName: '',
  cloudinaryPreset: '',
  wards: DEFAULT_HANOI_WARDS,
  updatedAt: Date.now(),
};

export async function initSettingsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'settings'));
    if (snap.empty) {
      await setDoc(doc(db, 'settings', 'admin'), DEFAULT_SETTINGS);
    }
  } catch (err) {
    console.error('Error initializing settings:', err);
  }
}

// ============ SEED SAMPLE DATA ============
const SAMPLE_TUTORS: Omit<TutorItem, 'id'>[] = [
  {
    code: '#GS001', name: 'Nguyễn Văn Minh', avatar: 'NM', avatarColor: 'bg-blue-500',
    subjects: ['Toán', 'Vật Lý'], gradeLevels: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    qualification: 'Cử nhân ĐHSP Hà Nội', experience: '5 năm kinh nghiệm',
    rating: 4.9, status: 'online', hourlyRate: 250000,
    phone: '0901234567', email: 'minh.gs@gmail.com',
    verified: true, verifiedAt: Date.now(), registeredAt: Date.now() - 86400000 * 30,
    teachingAreas: ['Phường Dịch Vọng', 'Phường Dịch Vọng Hậu', 'Phường Quan Hoa'],
    area: 'Cầu Giấy',
  },
  {
    code: '#GS002', name: 'Trần Thị Hương', avatar: 'TH', avatarColor: 'bg-purple-500',
    subjects: ['Tiếng Anh', 'IELTS'], gradeLevels: ['Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học'],
    qualification: 'Thạc sĩ ĐH Ngoại ngữ', experience: '8 năm, IELTS 8.0',
    rating: 5.0, status: 'online', hourlyRate: 350000,
    phone: '0912345678', email: 'huong.ielts@gmail.com',
    verified: true, verifiedAt: Date.now(), registeredAt: Date.now() - 86400000 * 60,
    teachingAreas: ['Phường Trung Hoà', 'Phường Yên Hoà', 'Phường Nhân Chính'],
    area: 'Cầu Giấy, Thanh Xuân',
  },
  {
    code: '#GS003', name: 'Lê Hoàng Nam', avatar: 'LN', avatarColor: 'bg-emerald-500',
    subjects: ['Hóa Học', 'Sinh Học'], gradeLevels: ['Lớp 10', 'Lớp 11', 'Lớp 12', 'Luyện thi ĐH/ĐGNL'],
    qualification: 'SV năm 4 ĐH Bách Khoa', experience: '3 năm dạy kèm',
    rating: 4.7, status: 'online', hourlyRate: 200000,
    phone: '0923456789', email: 'nam.hoa@gmail.com',
    verified: true, verifiedAt: Date.now(), registeredAt: Date.now() - 86400000 * 15,
    teachingAreas: ['Phường Bách Khoa', 'Phường Phương Mai', 'Phường Trương Định'],
    area: 'Hai Bà Trưng',
  },
  {
    code: '#GS004', name: 'Phạm Thuỳ Linh', avatar: 'PL', avatarColor: 'bg-rose-500',
    subjects: ['Ngữ Văn', 'Lịch Sử'], gradeLevels: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Luyện thi vào 10'],
    qualification: 'Cử nhân ĐHSP Hà Nội', experience: '4 năm kinh nghiệm',
    rating: 4.8, status: 'online', hourlyRate: 220000,
    phone: '0934567890', email: 'linh.van@gmail.com',
    verified: true, verifiedAt: Date.now(), registeredAt: Date.now() - 86400000 * 45,
    teachingAreas: ['Phường Thanh Xuân Trung', 'Phường Thanh Xuân Bắc', 'Phường Khương Mai'],
    area: 'Thanh Xuân',
  },
  {
    code: '#GS005', name: 'Đỗ Quang Huy', avatar: 'QH', avatarColor: 'bg-amber-500',
    subjects: ['Toán', 'Tin Học'], gradeLevels: ['Tiểu học (1-5)', 'Lớp 6', 'Lớp 7', 'Lớp 8'],
    qualification: 'Kỹ sư CNTT - ĐH Bách Khoa', experience: '2 năm, dạy online & offline',
    rating: 4.6, status: 'online', hourlyRate: 180000,
    phone: '0945678901', email: 'huy.tin@gmail.com',
    verified: true, verifiedAt: Date.now(), registeredAt: Date.now() - 86400000 * 10,
    teachingAreas: ['Phường Mỹ Đình 1', 'Phường Mỹ Đình 2', 'Phường Cầu Diễn'],
    area: 'Nam Từ Liêm',
  },
  {
    code: '#GS006', name: 'Vũ Minh Anh', avatar: 'MA', avatarColor: 'bg-indigo-500',
    subjects: ['Tiếng Anh', 'Tiếng Nhật'], gradeLevels: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Người đi làm'],
    qualification: 'N2 Tiếng Nhật, IELTS 7.5', experience: '3 năm dạy ngoại ngữ',
    rating: 4.8, status: 'busy', hourlyRate: 280000,
    phone: '0956789012', email: 'anh.nn@gmail.com',
    verified: true, verifiedAt: Date.now(), registeredAt: Date.now() - 86400000 * 20,
    teachingAreas: ['Phường Đống Đa', 'Phường Láng Thượng', 'Phường Ô Chợ Dừa'],
    area: 'Đống Đa',
  },
];

const SAMPLE_CLASSES: Omit<ClassItem, 'id'>[] = [
  {
    code: '#LH001', subject: 'Toán lớp 12 - Luyện thi ĐH',
    studentInfo: 'Nam, lớp 12, mức khá, cần nâng cao',
    location: 'Phường Dịch Vọng, Cầu Giấy', fee: 300000,
    status: 'ĐANG TÌM', createdAt: Date.now() - 86400000 * 2,
    schedule: 'Thứ 3, 5, 7 - Tối 19h-21h',
    requirements: 'GS có kinh nghiệm luyện thi, kiên nhẫn',
  },
  {
    code: '#LH002', subject: 'Tiếng Anh giao tiếp + IELTS',
    studentInfo: 'Nữ, SV năm 2, target IELTS 6.5',
    location: 'Online', fee: 350000,
    status: 'KHẨN CẤP', createdAt: Date.now() - 86400000,
    schedule: 'Linh hoạt, 3 buổi/tuần',
    requirements: 'GS IELTS 7.0+, có phương pháp rõ ràng',
  },
  {
    code: '#LH003', subject: 'Ngữ Văn lớp 9 - Luyện thi vào 10',
    studentInfo: 'Nữ, lớp 9, văn yếu, cần cải thiện điểm',
    location: 'Phường Thanh Xuân Trung, Thanh Xuân', fee: 250000,
    status: 'ĐANG TÌM', createdAt: Date.now() - 86400000 * 3,
    schedule: 'Thứ 2, 4, 6 - Chiều 14h-16h',
    requirements: 'GS nữ ưu tiên, có kinh nghiệm luyện thi',
  },
  {
    code: '#LH004', subject: 'Vật Lý + Hóa Học lớp 11',
    studentInfo: 'Nam, lớp 11, chuyên Lý, cần bổ trợ Hóa',
    location: 'Phường Bách Khoa, Hai Bà Trưng', fee: 280000,
    status: 'ĐANG TÌM', createdAt: Date.now() - 86400000 * 4,
    schedule: 'Thứ 7, CN - Sáng 8h-10h',
    requirements: 'SV hoặc GV trường top',
  },
  {
    code: '#LH005', subject: 'Toán + Tiếng Việt lớp 3',
    studentInfo: 'Nam, lớp 3, cần luyện tính nhẩm và đọc viết',
    location: 'Phường Mỹ Đình 2, Nam Từ Liêm', fee: 150000,
    status: 'ĐANG TÌM', createdAt: Date.now() - 86400000 * 5,
    schedule: 'Thứ 2-6, chiều 16h-17h30',
    requirements: 'GS kiên nhẫn, có kinh nghiệm dạy tiểu học',
  },
  {
    code: '#LH006', subject: 'Lập trình Python cơ bản',
    studentInfo: 'Nam, lớp 10, muốn học lập trình từ đầu',
    location: 'Online hoặc Cầu Giấy', fee: 300000,
    status: 'KHẨN CẤP', createdAt: Date.now(),
    schedule: 'Thứ 7, CN - Tối 19h-21h',
    requirements: 'GS có kinh nghiệm dạy lập trình cho trẻ',
  },
];

export async function seedSampleData(): Promise<void> {
  try {
    // Check if tutors already seeded
    const tutorSnap = await getDocs(collection(db, 'tutors'));
    if (tutorSnap.size >= 3) return; // Already has data

    // Seed tutors
    for (const t of SAMPLE_TUTORS) {
      await addDoc(collection(db, 'tutors'), t);
    }

    // Seed classes
    const classSnap = await getDocs(collection(db, 'classes'));
    if (classSnap.size < 3) {
      for (const c of SAMPLE_CLASSES) {
        await addDoc(collection(db, 'classes'), c);
      }
    }

    // Update settings with phone/zalo/apikey
    await setDoc(doc(db, 'settings', 'admin'), {
      centerPhone: '0822448444',
      zaloNumber: '0822448444',
      geminiApiKey: 'AIzaSyBDe-VKVWhxJoL5d0_tVs26l8MF1GSz6QY',
      updatedAt: Date.now(),
    }, { merge: true });

    console.log('✅ Sample data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}
