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
    documentUrls: {
      cccdFrontUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-front-sample.jpg',
      cccdBackUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-back-sample.jpg',
      degreeUrls: ['https://res.cloudinary.com/demo/image/upload/v1/samples/degree-sample.jpg'],
    },
    emergencyContacts: [
      { name: 'Nguyễn Thị Lan', phone: '0987654321', relation: 'Mẹ' },
    ],
    adminNote: 'Gia sư xuất sắc, phụ huynh đánh giá cao. Ưu tiên giao lớp khó.',
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
    documentUrls: {
      cccdFrontUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-front-sample.jpg',
      cccdBackUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-back-sample.jpg',
      degreeUrls: [
        'https://res.cloudinary.com/demo/image/upload/v1/samples/degree-master-sample.jpg',
        'https://res.cloudinary.com/demo/image/upload/v1/samples/ielts-cert-sample.jpg',
      ],
    },
    emergencyContacts: [
      { name: 'Trần Văn Đức', phone: '0976543210', relation: 'Bố' },
      { name: 'Lê Thị Mai', phone: '0965432109', relation: 'Chị gái' },
    ],
    adminNote: 'Top gia sư IELTS, có chứng chỉ IELTS 8.0. Phí cao nhưng chất lượng.',
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
    documentUrls: {
      cccdFrontUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-front-sample.jpg',
      degreeUrls: ['https://res.cloudinary.com/demo/image/upload/v1/samples/student-card-sample.jpg'],
    },
    emergencyContacts: [
      { name: 'Lê Thị Hoa', phone: '0954321098', relation: 'Mẹ' },
    ],
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
    documentUrls: {
      cccdFrontUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-front-sample.jpg',
      cccdBackUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-back-sample.jpg',
      degreeUrls: ['https://res.cloudinary.com/demo/image/upload/v1/samples/degree-sample.jpg'],
    },
    emergencyContacts: [
      { name: 'Phạm Văn Tùng', phone: '0943210987', relation: 'Bố' },
    ],
    adminNote: 'Chuyên luyện thi vào 10, tỷ lệ đậu cao.',
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
    documentUrls: {
      cccdFrontUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-front-sample.jpg',
      degreeUrls: ['https://res.cloudinary.com/demo/image/upload/v1/samples/degree-it-sample.jpg'],
    },
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
    documentUrls: {
      cccdFrontUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-front-sample.jpg',
      cccdBackUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-back-sample.jpg',
      degreeUrls: [
        'https://res.cloudinary.com/demo/image/upload/v1/samples/jlpt-n2-sample.jpg',
        'https://res.cloudinary.com/demo/image/upload/v1/samples/ielts-cert-sample.jpg',
      ],
    },
    emergencyContacts: [
      { name: 'Vũ Thị Hằng', phone: '0932109876', relation: 'Mẹ' },
    ],
  },
  {
    code: '#GS007', name: 'Hoàng Đức Thắng', avatar: 'HT', avatarColor: 'bg-teal-500',
    subjects: ['Toán', 'Vật Lý'], gradeLevels: ['Lớp 11', 'Lớp 12', 'Luyện thi ĐH/ĐGNL'],
    qualification: 'SV năm 3 ĐH Sư phạm HN', experience: '2 năm dạy kèm',
    rating: 4.5, status: 'online', hourlyRate: 200000,
    phone: '0967890123', email: 'thang.toan@gmail.com',
    verified: false, registeredAt: Date.now() - 86400000 * 3,
    teachingAreas: ['Phường Kim Liên', 'Phường Phương Liên'],
    area: 'Đống Đa',
    documentUrls: {
      cccdFrontUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cccd-front-sample.jpg',
    },
    adminNote: 'Chưa nộp đủ hồ sơ — thiếu CCCD mặt sau và bằng cấp.',
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
    teachMode: 'Tại nhà',
  },
  {
    code: '#LH002', subject: 'Tiếng Anh giao tiếp + IELTS',
    studentInfo: 'Nữ, SV năm 2, target IELTS 6.5',
    location: 'Online', fee: 350000,
    status: 'KHẨN CẤP', createdAt: Date.now() - 86400000,
    schedule: 'Linh hoạt, 3 buổi/tuần',
    requirements: 'GS IELTS 7.0+, có phương pháp rõ ràng',
    teachMode: 'Online',
  },
  {
    code: '#LH003', subject: 'Ngữ Văn lớp 9 - Luyện thi vào 10',
    studentInfo: 'Nữ, lớp 9, văn yếu, cần cải thiện điểm',
    location: 'Phường Thanh Xuân Trung, Thanh Xuân', fee: 250000,
    status: 'ĐANG TÌM', createdAt: Date.now() - 86400000 * 3,
    schedule: 'Thứ 2, 4, 6 - Chiều 14h-16h',
    requirements: 'GS nữ ưu tiên, có kinh nghiệm luyện thi',
    teachMode: 'Tại nhà',
  },
  {
    code: '#LH004', subject: 'Vật Lý + Hóa Học lớp 11',
    studentInfo: 'Nam, lớp 11, chuyên Lý, cần bổ trợ Hóa',
    location: 'Phường Bách Khoa, Hai Bà Trưng', fee: 280000,
    status: 'ĐÃ CÓ GIA SƯ' as any, createdAt: Date.now() - 86400000 * 10,
    schedule: 'Thứ 7, CN - Sáng 8h-10h',
    requirements: 'SV hoặc GV trường top',
    teachMode: 'Cả hai',
  },
  {
    code: '#LH005', subject: 'Toán + Tiếng Việt lớp 3',
    studentInfo: 'Nam, lớp 3, cần luyện tính nhẩm và đọc viết',
    location: 'Phường Mỹ Đình 2, Nam Từ Liêm', fee: 150000,
    status: 'ĐANG TÌM', createdAt: Date.now() - 86400000 * 5,
    schedule: 'Thứ 2-6, chiều 16h-17h30',
    requirements: 'GS kiên nhẫn, có kinh nghiệm dạy tiểu học',
    teachMode: 'Tại nhà',
  },
  {
    code: '#LH006', subject: 'Lập trình Python cơ bản',
    studentInfo: 'Nam, lớp 10, muốn học lập trình từ đầu',
    location: 'Online hoặc Cầu Giấy', fee: 300000,
    status: 'KHẨN CẤP', createdAt: Date.now(),
    schedule: 'Thứ 7, CN - Tối 19h-21h',
    requirements: 'GS có kinh nghiệm dạy lập trình cho trẻ',
    teachMode: 'Cả hai',
  },
];

// Sample financial transactions across multiple months
const now = new Date();
const m2 = String(now.getMonth() - 1).padStart(2, '0'); // 2 months ago
const m1 = String(now.getMonth()).padStart(2, '0');       // last month
const m0 = String(now.getMonth() + 1).padStart(2, '0');   // this month
const yr = now.getFullYear();
const SAMPLE_TRANSACTIONS = [
  // Tháng trước 2
  { receiptId: 'REC-1001', type: 'Thu phí gia sư' as const, amount: 800000, targetName: 'GS Nguyễn Văn Minh - Lớp Toán 12', date: `15/${m2}/${yr} 10:30`, status: 'Thành công' as const },
  { receiptId: 'REC-1002', type: 'Thu phí gia sư' as const, amount: 1200000, targetName: 'GS Trần Thị Hương - Lớp IELTS', date: `18/${m2}/${yr} 14:15`, status: 'Thành công' as const },
  { receiptId: 'REC-1003', type: 'Thanh toán lương' as const, amount: 500000, targetName: `Chi phí quảng cáo Facebook T${now.getMonth() - 1}`, date: `20/${m2}/${yr} 09:00`, status: 'Thành công' as const },
  // Tháng trước
  { receiptId: 'REC-2001', type: 'Thu phí gia sư' as const, amount: 1000000, targetName: 'GS Lê Hoàng Nam - Lớp Hóa 11', date: `05/${m1}/${yr} 11:20`, status: 'Thành công' as const },
  { receiptId: 'REC-2002', type: 'Thu phí gia sư' as const, amount: 800000, targetName: 'GS Phạm Thuỳ Linh - Lớp Văn 9', date: `10/${m1}/${yr} 15:45`, status: 'Thành công' as const },
  { receiptId: 'REC-2003', type: 'Hoàn tiền' as const, amount: 300000, targetName: 'Hoàn phí GS Đỗ Quang Huy - PH hủy lớp', date: `12/${m1}/${yr} 09:30`, status: 'Thành công' as const },
  { receiptId: 'REC-2004', type: 'Thanh toán lương' as const, amount: 200000, targetName: 'Chi phí hosting & domain', date: `15/${m1}/${yr} 08:00`, status: 'Thành công' as const },
  // Tháng này
  { receiptId: 'REC-3001', type: 'Thu phí gia sư' as const, amount: 1500000, targetName: `GS Nguyễn Văn Minh - Lớp Toán 12 (T${now.getMonth() + 1})`, date: `02/${m0}/${yr} 10:00`, status: 'Thành công' as const },
  { receiptId: 'REC-3002', type: 'Thu phí gia sư' as const, amount: 1200000, targetName: `GS Trần Thị Hương - Lớp IELTS (T${now.getMonth() + 1})`, date: `05/${m0}/${yr} 14:30`, status: 'Thành công' as const },
  { receiptId: 'REC-3003', type: 'Hoàn tiền' as const, amount: 200000, targetName: 'Hoàn phí GS Vũ Minh Anh - Lớp hủy sớm', date: `08/${m0}/${yr} 11:15`, status: 'Thành công' as const },
  { receiptId: 'REC-3004', type: 'Thu phí gia sư' as const, amount: 600000, targetName: 'GS Đỗ Quang Huy - Lớp Toán 3', date: `10/${m0}/${yr} 16:00`, status: 'Thành công' as const },
];

const SAMPLE_REGISTRATIONS = [
  { parentName: 'Nguyễn Thị Hoa', phone: '0911222333', studentName: 'Nguyễn Minh Khôi', grade: 'Lớp 12', subjects: ['Toán', 'Vật Lý'], district: 'Cầu Giấy', ward: 'Phường Dịch Vọng', mode: 'Tại nhà' as const, schedule: 'T3, T5, T7 tối', note: 'Cần GS nam, kinh nghiệm luyện thi', createdAt: Date.now() - 86400000 * 2, status: 'Mới' as const, source: 'Zalo' as const },
  { parentName: 'Trần Văn Bình', phone: '0922333444', studentName: 'Trần Ngọc Ánh', grade: 'Lớp 9', subjects: ['Ngữ Văn'], district: 'Thanh Xuân', ward: 'Phường Thanh Xuân Trung', mode: 'Tại nhà' as const, schedule: 'T2, T4, T6 chiều', note: 'Con gái, ưu tiên GS nữ', createdAt: Date.now() - 86400000, status: 'Đã liên hệ' as const, source: 'Facebook' as const, tags: ['Cần GS nữ'] },
  { parentName: 'Lê Thị Mai', phone: '0933444555', studentName: 'Lê Hải Đăng', grade: 'Lớp 3', subjects: ['Toán', 'Tiếng Việt'], district: 'Nam Từ Liêm', ward: 'Phường Mỹ Đình 2', mode: 'Tại nhà' as const, schedule: 'T2-T6 chiều 16h', note: 'Con hiếu động, cần GS kiên nhẫn', createdAt: Date.now() - 86400000 * 5, status: 'Mới' as const, source: 'Google' as const },
  { parentName: 'Phạm Đức Anh', phone: '0944555666', studentName: 'Phạm Quỳnh Chi', grade: 'SV năm 2', subjects: ['IELTS'], district: 'Đống Đa', mode: 'Online' as const, schedule: 'Linh hoạt', note: 'Target IELTS 6.5, cần GS 7.0+', createdAt: Date.now() - 86400000 * 3, status: 'Đã xếp lớp' as const, source: 'Website' as const },
  { parentName: 'Hoàng Văn Tùng', phone: '0955666777', studentName: 'Hoàng Bảo Nam', grade: 'Lớp 11', subjects: ['Hóa Học', 'Sinh Học'], district: 'Hai Bà Trưng', ward: 'Phường Bách Khoa', mode: 'Cả hai' as const, schedule: 'T7, CN sáng', note: '', createdAt: Date.now() - 86400000 * 7, status: 'Đã liên hệ' as const, source: 'Giới thiệu' as const },
];

const SAMPLE_MATCHES = [
  { classCode: '#LH004', classSubject: 'Vật Lý + Hóa Học lớp 11', tutorCode: '#GS003', tutorName: 'Lê Hoàng Nam', studentName: 'Hoàng Bảo Nam', parentPhone: '0955666777', startDate: Date.now() - 86400000 * 8, status: 'Đang dạy' as const, fee: 280000, createdAt: Date.now() - 86400000 * 8, feePaid: true, feeAmount: 896000, feePercent: 40, sessionsPerMonth: 8 },
  { classCode: '#LH002', classSubject: 'Tiếng Anh giao tiếp + IELTS', tutorCode: '#GS002', tutorName: 'Trần Thị Hương', studentName: 'Phạm Quỳnh Chi', parentPhone: '0944555666', startDate: Date.now() - 86400000 * 35, status: 'Đang dạy' as const, fee: 350000, createdAt: Date.now() - 86400000 * 35, feePaid: true, feeAmount: 1120000, feePercent: 40, sessionsPerMonth: 8 },
];

const SAMPLE_STUDENTS = [
  { name: 'Hoàng Bảo Nam', grade: 'Lớp 11', dob: '15/03/2010', school: 'THPT Bách Khoa', parentName: 'Hoàng Văn Tùng', parentPhone: '0955666777', parentEmail: 'tung.hoang@gmail.com', parentAddress: 'Phường Bách Khoa, Hai Bà Trưng', parentRelation: 'Bố', enrolledClasses: 1, subjects: ['Hóa Học', 'Sinh Học'], tutorCode: '#GS003', tutorName: 'Lê Hoàng Nam', status: 'Đang học' as const, phone: '0955666777', createdAt: Date.now() - 86400000 * 8 },
  { name: 'Phạm Quỳnh Chi', grade: 'SV năm 2', dob: '22/08/2005', school: 'ĐH Kinh tế Quốc dân', parentName: 'Phạm Đức Anh', parentPhone: '0944555666', parentAddress: 'Đống Đa, Hà Nội', parentRelation: 'Bố', enrolledClasses: 1, subjects: ['IELTS'], tutorCode: '#GS002', tutorName: 'Trần Thị Hương', status: 'Đang học' as const, phone: '0944555666', createdAt: Date.now() - 86400000 * 35 },
  { name: 'Nguyễn Minh Khôi', grade: 'Lớp 12', school: 'THPT Cầu Giấy', parentName: 'Nguyễn Thị Hoa', parentPhone: '0911222333', parentAddress: 'Phường Dịch Vọng, Cầu Giấy', parentRelation: 'Mẹ', enrolledClasses: 0, subjects: ['Toán', 'Vật Lý'], status: 'Chờ xếp lớp' as const, phone: '0911222333', createdAt: Date.now() - 86400000 * 2 },
];

const SAMPLE_REVIEWS = [
  { tutorCode: '#GS001', tutorName: 'Nguyễn Văn Minh', parentName: 'Trần Thị Thu', parentPhone: '0988111222', rating: 5, comment: 'Thầy Minh dạy rất tận tâm, con tôi tiến bộ rõ rệt sau 1 tháng. Toán từ 6 lên 8 điểm.', createdAt: Date.now() - 86400000 * 20 },
  { tutorCode: '#GS002', tutorName: 'Trần Thị Hương', parentName: 'Phạm Đức Anh', parentPhone: '0944555666', rating: 5, comment: 'Cô Hương rất chuyên nghiệp, phương pháp rõ ràng. Con gái tôi tự tin hơn nhiều khi nói tiếng Anh.', createdAt: Date.now() - 86400000 * 10 },
  { tutorCode: '#GS004', tutorName: 'Phạm Thuỳ Linh', parentName: 'Nguyễn Văn Sơn', parentPhone: '0977222333', rating: 4, comment: 'Cô Linh dạy Văn hay, con tôi bắt đầu thích môn Văn hơn. Chỉ hơi muộn giờ 1 lần.', createdAt: Date.now() - 86400000 * 5 },
  { tutorCode: '#GS003', tutorName: 'Lê Hoàng Nam', parentName: 'Hoàng Văn Tùng', parentPhone: '0955666777', rating: 5, comment: 'Thầy Nam giải thích dễ hiểu, kiến thức vững. Con tôi từ sợ Hóa giờ đã thích học.', createdAt: Date.now() - 86400000 * 2 },
];

const SAMPLE_CONTACTS = [
  { name: 'Nguyễn Hải Yến', phone: '0988999000', message: 'Tôi muốn tìm gia sư Toán cho con lớp 8, khu vực Cầu Giấy. Liên hệ lại giúp tôi nhé.', createdAt: Date.now() - 3600000, isRead: false },
  { name: 'Trần Minh Đức', phone: '0977888111', message: 'Cho tôi hỏi phí kết nối gia sư là bao nhiêu? Con tôi cần học IELTS.', createdAt: Date.now() - 86400000, isRead: false },
  { name: 'Lê Thanh Hà', phone: '0966777222', message: 'Tôi là sinh viên Sư phạm, muốn đăng ký làm gia sư dạy Văn. Xin hướng dẫn thủ tục.', createdAt: Date.now() - 86400000 * 2, isRead: true },
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

    // Seed transactions
    const txSnap = await getDocs(collection(db, 'transactions'));
    if (txSnap.size < 3) {
      for (const tx of SAMPLE_TRANSACTIONS) {
        await addDoc(collection(db, 'transactions'), tx);
      }
    }

    // Seed registrations
    const regSnap = await getDocs(collection(db, 'registrations'));
    if (regSnap.size < 3) {
      for (const r of SAMPLE_REGISTRATIONS) {
        await addDoc(collection(db, 'registrations'), r);
      }
    }

    // Seed matches
    const matchSnap = await getDocs(collection(db, 'matches'));
    if (matchSnap.size < 1) {
      for (const m of SAMPLE_MATCHES) {
        await addDoc(collection(db, 'matches'), m);
      }
    }

    // Seed students
    const studentSnap = await getDocs(collection(db, 'students'));
    if (studentSnap.size < 1) {
      for (const s of SAMPLE_STUDENTS) {
        await addDoc(collection(db, 'students'), s);
      }
    }

    // Seed reviews
    const reviewSnap = await getDocs(collection(db, 'reviews'));
    if (reviewSnap.size < 1) {
      for (const rv of SAMPLE_REVIEWS) {
        await addDoc(collection(db, 'reviews'), rv);
      }
    }

    // Seed contacts
    const contactSnap = await getDocs(collection(db, 'contacts'));
    if (contactSnap.size < 1) {
      for (const ct of SAMPLE_CONTACTS) {
        await addDoc(collection(db, 'contacts'), ct);
      }
    }

    // Update settings with phone/zalo/apikey
    await setDoc(doc(db, 'settings', 'admin'), {
      centerName: 'Gia Sư Thành Đạt',
      centerPhone: '0822448444',
      centerEmail: 'giasuthanhdat@gmail.com',
      centerAddress: 'Hà Nội',
      zaloNumber: '0822448444',
      geminiApiKey: 'AIzaSyBDe-VKVWhxJoL5d0_tVs26l8MF1GSz6QY',
      bankName: 'Techcombank',
      bankAccount: '19035678901234',
      bankAccountName: 'NGUYEN VAN A',
      bankBin: '970407',
      updatedAt: Date.now(),
    }, { merge: true });

    console.log('✅ Sample data seeded successfully (tutors, classes, transactions, registrations, matches, students, reviews, contacts)');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Force seed additional data (transactions, registrations, matches etc.)
// Call this from AdvancedToolsTab to add demo data even when tutors already exist
export async function forceSeedAdditionalData(): Promise<string> {
  try {
    let seeded = [];
    
    const txSnap = await getDocs(collection(db, 'transactions'));
    if (txSnap.size < 5) {
      for (const tx of SAMPLE_TRANSACTIONS) { await addDoc(collection(db, 'transactions'), tx); }
      seeded.push(`${SAMPLE_TRANSACTIONS.length} giao dịch`);
    }
    
    const regSnap = await getDocs(collection(db, 'registrations'));
    if (regSnap.size < 3) {
      for (const r of SAMPLE_REGISTRATIONS) { await addDoc(collection(db, 'registrations'), r); }
      seeded.push(`${SAMPLE_REGISTRATIONS.length} đăng ký`);
    }
    
    const matchSnap = await getDocs(collection(db, 'matches'));
    if (matchSnap.size < 1) {
      for (const m of SAMPLE_MATCHES) { await addDoc(collection(db, 'matches'), m); }
      seeded.push(`${SAMPLE_MATCHES.length} ghép lớp`);
    }
    
    const studentSnap = await getDocs(collection(db, 'students'));
    if (studentSnap.size < 1) {
      for (const s of SAMPLE_STUDENTS) { await addDoc(collection(db, 'students'), s); }
      seeded.push(`${SAMPLE_STUDENTS.length} học sinh`);
    }
    
    const reviewSnap = await getDocs(collection(db, 'reviews'));
    if (reviewSnap.size < 1) {
      for (const rv of SAMPLE_REVIEWS) { await addDoc(collection(db, 'reviews'), rv); }
      seeded.push(`${SAMPLE_REVIEWS.length} đánh giá`);
    }
    
    const contactSnap = await getDocs(collection(db, 'contacts'));
    if (contactSnap.size < 1) {
      for (const ct of SAMPLE_CONTACTS) { await addDoc(collection(db, 'contacts'), ct); }
      seeded.push(`${SAMPLE_CONTACTS.length} liên hệ`);
    }
    
    // Update tutor documentUrls for existing tutors
    const tutorSnap = await getDocs(collection(db, 'tutors'));
    let updatedTutors = 0;
    for (const docSnap of tutorSnap.docs) {
      const data = docSnap.data();
      if (!data.documentUrls || !data.documentUrls.cccdFrontUrl) {
        const matchingTutor = SAMPLE_TUTORS.find(t => t.code === data.code);
        if (matchingTutor && matchingTutor.documentUrls) {
          await setDoc(doc(db, 'tutors', docSnap.id), {
            documentUrls: matchingTutor.documentUrls,
            emergencyContacts: matchingTutor.emergencyContacts || [],
            adminNote: matchingTutor.adminNote || '',
          }, { merge: true });
          updatedTutors++;
        }
      }
    }
    if (updatedTutors > 0) seeded.push(`${updatedTutors} gia sư (cập nhật CCCD)`);
    
    if (seeded.length === 0) return 'Dữ liệu đã đầy đủ, không cần thêm.';
    return `✅ Đã thêm: ${seeded.join(', ')}`;
  } catch (err) {
    console.error('Force seed error:', err);
    return '❌ Lỗi: ' + String(err);
  }
}
