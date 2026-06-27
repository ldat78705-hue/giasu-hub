export interface ClassItem {
  id?: string;
  code: string;
  subject: string;
  studentInfo: string;
  location: string;
  fee: number;
  status: 'ĐANG TÌM' | 'ĐÃ CÓ GIA SƯ' | 'KHẨN CẤP';
  createdAt: number;
  schedule?: string;
  requirements?: string;
  teachMode?: 'Tại nhà' | 'Online' | 'Cả hai';
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string; // "Mẹ", "Bố", "Bác", "Chú", etc.
}

export interface TutorItem {
  id?: string;
  code: string;
  name: string;
  avatar: string;
  avatarColor: string;
  subjects: string[];
  gradeLevels?: string[];
  qualification: string;
  experience: string;
  rating: number;
  status: 'online' | 'busy' | 'offline';
  hourlyRate: number;
  matchScore?: number;
  phone?: string;
  email?: string;
  verified: boolean;
  verifiedAt?: number;
  registeredAt?: number;
  area?: string;
  teachingAreas?: string[];
  emergencyContacts?: EmergencyContact[]; // SĐT người thân
  documentUrls?: {
    cccdFrontUrl?: string;   // CCCD mặt trước
    cccdBackUrl?: string;    // CCCD mặt sau
    degreeUrls?: string[];   // Nhiều bằng cấp
    otherUrls?: string[];    // File khác
    // backward compat
    cccdUrl?: string;
    degreeUrl?: string;
    otherUrl?: string;
  };
  adminNote?: string;
}

export interface StudentItem {
  id?: string;
  name: string;
  grade: string;
  dob?: string;
  school?: string;
  // Thông tin PHHS tích hợp
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentAddress?: string;
  parentRelation?: string; // "Bố", "Mẹ", "Ông", "Bà"
  emergencyContacts?: EmergencyContact[]; // SĐT khẩn cấp
  // Quản lý
  enrolledClasses: number;
  subjects?: string[];
  tutorCode?: string;
  tutorName?: string;
  note?: string;
  status: 'Đang học' | 'Chờ xếp lớp' | 'Bảo lưu';
  createdAt?: number;
  adminNote?: string;
  // Legacy compat
  phone: string;
}

export interface TransactionItem {
  id?: string;
  receiptId: string;
  type: 'Thu phí gia sư' | 'Hoàn tiền' | 'Thanh toán lương';
  amount: number;
  targetName: string;
  date: string;
  status: 'Thành công' | 'Đang xử lý';
}

export interface ParentRegistration {
  id?: string;
  parentName: string;
  phone: string;
  studentName: string;
  grade: string;
  subjects: string[];
  district: string;
  ward?: string;
  mode: 'Tại nhà' | 'Online' | 'Cả hai';
  schedule: string;
  note: string;
  createdAt: number;
  status: 'Mới' | 'Đã liên hệ' | 'Đã xếp lớp' | 'Hủy';
  adminNote?: string;
  statusHistory?: { status: string; timestamp: number; }[];
}

export interface ContactMessage {
  id?: string;
  name: string;
  phone: string;
  message: string;
  createdAt: number;
  isRead: boolean;
}

export type PortalRole = 'public' | 'tutor' | 'admin';

export interface ClassApplication {
  id?: string;
  classCode: string;
  classSubject: string;
  tutorName: string;
  tutorPhone: string;
  tutorNote?: string;
  appliedAt: string;
  status: 'Chờ duyệt' | 'Đã chấp nhận' | 'Từ chối';
}

export interface TutorBooking {
  id?: string;
  tutorCode: string;
  tutorName: string;
  parentName: string;
  parentPhone: string;
  studentGrade: string;
  address: string;
  note?: string;
  createdAt: string;
  status: 'Chờ liên hệ' | 'Đã xếp lớp' | 'Hủy';
}

export interface AdminSettings {
  id?: string;
  centerName: string;
  centerPhone: string;
  centerEmail: string;
  centerAddress: string;
  geminiApiKey: string;
  zaloNumber: string;
  facebookUrl: string;
  cloudinaryCloudName: string;
  cloudinaryPreset: string;
  wards: string[];
  updatedAt: number;
}

export interface NotificationItem {
  id?: string;
  type: 'application' | 'booking' | 'class' | 'system' | 'registration' | 'contact';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
  relatedId?: string;
}

export interface ClassMatch {
  id?: string;
  classCode: string;
  classSubject: string;
  tutorCode: string;
  tutorName: string;
  studentName?: string;
  parentPhone?: string;
  startDate: number;
  endDate?: number;
  status: 'Đang dạy' | 'Hoàn thành' | 'Hủy';
  fee: number;
  note?: string;
  createdAt: number;
}

export interface TutorReview {
  id?: string;
  tutorCode: string;
  tutorName: string;
  parentName: string;
  parentPhone: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface AttendanceRecord {
  id?: string;
  matchId: string;
  classCode: string;
  tutorCode: string;
  tutorName: string;
  studentName: string;
  date: string;
  status: 'Đã dạy' | 'Nghỉ GS' | 'Nghỉ HS' | 'Hủy';
  note?: string;
  createdAt: number;
}

export type ActiveTab = 'home' | 'find-tutors' | 'register-tutor' | 'parent-register' | 'status-lookup' | 'dashboard' | 'classes' | 'tutors' | 'students' | 'finance' | 'seo' | 'applications' | 'registrations' | 'contacts' | 'matches' | 'settings' | 'reviews' | 'attendance' | 'templates' | 'calendar' | 'kpi' | 'import' | 'advanced' | 'blog' | 'performance' | 'activity' | 'zalonotify';
