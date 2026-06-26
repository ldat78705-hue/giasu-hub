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
}

export interface TutorItem {
  id?: string;
  code: string;
  name: string;
  avatar: string;
  avatarColor: string;
  subjects: string[];
  gradeLevels?: string[];       // Khối lớp dạy
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
  area?: string;                // Khu vực dạy (text cũ, backward compat)
  teachingAreas?: string[];     // Các xã/phường có thể dạy
  documentUrls?: {              // Hồ sơ đính kèm (CCCD, bằng cấp)
    cccdUrl?: string;
    degreeUrl?: string;
    otherUrl?: string;
  };
}

export interface StudentItem {
  id?: string;
  name: string;
  parentName: string;
  phone: string;
  grade: string;
  enrolledClasses: number;
  status: 'Đang học' | 'Chờ xếp lớp' | 'Bảo lưu';
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
  district: string; // legacy, giữ backward compat
  ward?: string;    // xã/phường mới
  mode: 'Tại nhà' | 'Online' | 'Cả hai';
  schedule: string;
  note: string;
  createdAt: number;
  status: 'Mới' | 'Đã liên hệ' | 'Đã xếp lớp' | 'Hủy';
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
  wards: string[];              // Danh sách xã/phường (admin chỉnh sửa)
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

export type ActiveTab = 'home' | 'find-tutors' | 'register-tutor' | 'parent-register' | 'dashboard' | 'classes' | 'tutors' | 'students' | 'finance' | 'seo' | 'applications' | 'registrations' | 'settings';
