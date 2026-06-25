import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

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

// Initial Seed Data
const initialClasses = [
  {
    code: "#CS2301",
    subject: "Tiếng Anh - IELTS 6.5",
    studentInfo: "Học sinh lớp 12",
    location: "Quận 7, HCM",
    fee: 450000,
    status: "ĐANG TÌM",
    createdAt: Date.now() - 3600000 * 2,
    schedule: "Tối thứ 2, 4, 6 (19h30)",
    requirements: "Gia sư chuyên tiếng Anh, có chứng chỉ IELTS >= 8.0, nhiệt tình, đúng giờ."
  },
  {
    code: "#CS2302",
    subject: "Toán cao cấp",
    studentInfo: "Sinh viên năm 1",
    location: "Online - Zoom",
    fee: 300000,
    status: "ĐÃ CÓ GIA SƯ",
    createdAt: Date.now() - 3600000 * 5,
    schedule: "Chiều thứ 3, 5",
    requirements: "Sinh viên xuất sắc Bách Khoa hoặc KHTN."
  },
  {
    code: "#CS2303",
    subject: "Ngữ Văn 9",
    studentInfo: "Ôn thi vào 10",
    location: "Quận 1, HCM",
    fee: 250000,
    status: "KHẨN CẤP",
    createdAt: Date.now() - 3600000 * 12,
    schedule: "Tối thứ 3, 5, 7",
    requirements: "Giáo viên hoặc gia sư kinh nghiệm luyện thi vào lớp 10 chuyên."
  },
  {
    code: "#CS2304",
    subject: "Lập trình Python",
    studentInfo: "Cơ bản cho trẻ em",
    location: "Online - Meet",
    fee: 500000,
    status: "ĐANG TÌM",
    createdAt: Date.now() - 3600000 * 24,
    schedule: "Sáng Chủ Nhật hàng tuần",
    requirements: "Kiên nhẫn, am hiểu sư phạm STEM cho học sinh cấp 2."
  },
  {
    code: "#CS2305",
    subject: "Vật Lý 12 - Luyện thi ĐH",
    studentInfo: "Mục tiêu 8+",
    location: "Quận Bình Thạnh, HCM",
    fee: 350000,
    status: "ĐANG TÌM",
    createdAt: Date.now() - 3600000 * 30,
    schedule: "Tối thứ 4, 7",
    requirements: "Nắm vững cấu trúc đề thi BGD mới nhất."
  }
];

const initialTutors = [
  {
    code: "GS101",
    name: "Nguyễn Anh",
    avatar: "NA",
    avatarColor: "bg-blue-500",
    subjects: ["Tiếng Anh", "IELTS 8.5", "Giao tiếp"],
    qualification: "IELTS 8.5 • Đại học Ngoại Thương",
    experience: "5 năm kinh nghiệm giảng dạy",
    rating: 4.9,
    status: "online",
    hourlyRate: 400000,
    matchScore: 98
  },
  {
    code: "GS102",
    name: "Trần Thu",
    avatar: "TT",
    avatarColor: "bg-purple-500",
    subjects: ["Toán 12", "Luyện thi ĐH", "Toán 10"],
    qualification: "Thạc sĩ Toán KHTN",
    experience: "7 năm kinh nghiệm",
    rating: 4.8,
    status: "online",
    hourlyRate: 350000,
    matchScore: 92
  },
  {
    code: "GS103",
    name: "Lê Minh Tuấn",
    avatar: "LM",
    avatarColor: "bg-emerald-500",
    subjects: ["Python", "C++", "Toán Cao Cấp"],
    qualification: "Kỹ sư Phần mềm Bách Khoa",
    experience: "3 năm kinh nghiệm",
    rating: 4.95,
    status: "busy",
    hourlyRate: 450000,
    matchScore: 89
  },
  {
    code: "GS104",
    name: "Phạm Hoàng Mai",
    avatar: "HM",
    avatarColor: "bg-amber-500",
    subjects: ["Ngữ Văn 9", "Luyện thi 10"],
    qualification: "Tốt nghiệp Sư phạm Ngữ Văn xuất sắc",
    experience: "6 năm ôn thi chuyên",
    rating: 5.0,
    status: "online",
    hourlyRate: 300000,
    matchScore: 85
  }
];

const initialStudents = [
  {
    name: "Hoàng Gia Bảo",
    parentName: "Anh Hoàng Tuấn",
    phone: "0909123456",
    grade: "Lớp 12",
    enrolledClasses: 2,
    status: "Đang học"
  },
  {
    name: "Nguyễn Mai Anh",
    parentName: "Chị Lan Hương",
    phone: "0988765432",
    grade: "Lớp 9",
    enrolledClasses: 1,
    status: "Chờ xếp lớp"
  },
  {
    name: "Trần Thành Đạt",
    parentName: "Anh Đạt",
    phone: "0912345678",
    grade: "Đại học năm 1",
    enrolledClasses: 1,
    status: "Đang học"
  }
];

const initialTransactions = [
  {
    receiptId: "REC-9921",
    type: "Thu phí gia sư",
    amount: 900000,
    targetName: "Gia sư Nguyễn Anh (#CS2301)",
    date: "25/06/2026 14:20",
    status: "Thành công"
  },
  {
    receiptId: "REC-9920",
    type: "Thu phí gia sư",
    amount: 600000,
    targetName: "Gia sư Trần Thu (#CS2302)",
    date: "24/06/2026 10:15",
    status: "Thành công"
  },
  {
    receiptId: "REC-9919",
    type: "Hoàn tiền",
    amount: 300000,
    targetName: "PH Chị Lan Hương",
    date: "23/06/2026 16:45",
    status: "Thành công"
  }
];

export async function seedDatabaseIfEmpty() {
  try {
    const classesSnap = await getDocs(collection(db, "classes"));
    if (classesSnap.empty) {
      console.log("Seeding classes...");
      for (const item of initialClasses) {
        await addDoc(collection(db, "classes"), item);
      }
    }

    const tutorsSnap = await getDocs(collection(db, "tutors"));
    if (tutorsSnap.empty) {
      console.log("Seeding tutors...");
      for (const item of initialTutors) {
        await addDoc(collection(db, "tutors"), item);
      }
    }

    const studentsSnap = await getDocs(collection(db, "students"));
    if (studentsSnap.empty) {
      console.log("Seeding students...");
      for (const item of initialStudents) {
        await addDoc(collection(db, "students"), item);
      }
    }

    const transSnap = await getDocs(collection(db, "transactions"));
    if (transSnap.empty) {
      console.log("Seeding transactions...");
      for (const item of initialTransactions) {
        await addDoc(collection(db, "transactions"), item);
      }
    }
  } catch (err) {
    console.error("Error seeding Firestore:", err);
  }
}
