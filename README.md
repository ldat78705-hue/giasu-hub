# 📚 Gia Sư Hub - Trung Tâm Gia Sư Thông Minh AI

Nền tảng kết nối gia sư dạy kèm chất lượng cao, sử dụng trí tuệ nhân tạo Gemini AI để ghép nối học sinh - gia sư chính xác nhất.

## ✨ Tính năng chính

### 🌐 Trang công khai (Phụ huynh & Gia sư)
- **Trang chủ** - Giới thiệu dịch vụ, tìm kiếm AI, lớp học cần gia sư
- **Tìm Gia Sư** - Duyệt danh sách gia sư, lọc theo môn, đặt lịch thuê
- **Đăng Ký Dạy** - Gia sư đăng ký hồ sơ, nhận lớp dạy kèm

### 🔒 Admin Dashboard (Quản trị viên)
- **Bảng điều khiển** - Thống kê tổng quan, AI Smart Matching
- **Quản lý lớp** - CRUD lớp học, AI soạn thảo yêu cầu
- **Quản lý gia sư** - Duyệt hồ sơ, cập nhật trạng thái
- **Quản lý học sinh** - Danh sách học viên & phụ huynh
- **Tài chính** - Biên lai, giao dịch, doanh thu
- **SEO AI** - Tối ưu SEO tự động bằng Gemini

### 🤖 Tích hợp AI (Gemini 2.5 Flash)
- Smart Search - Tìm kiếm thông minh bằng ngôn ngữ tự nhiên
- Smart Matching - Ghép nối gia sư với lớp tự động
- AI Class Generator - Tạo lớp từ ghi chú nhanh
- SEO Optimizer - Tạo cấu trúc SEO chuẩn Google

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore (Real-time)
- **AI**: Google Gemini 2.5 Flash
- **Deployment**: Vercel (SPA + Serverless Functions)
- **Icons**: Lucide React

## 🚀 Chạy locally

```bash
# Cài đặt
npm install

# Chạy dev server
npm run dev

# Build production
npm run build
```

## 🌍 Deploy lên Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm biến môi trường `GEMINI_API_KEY` trong Vercel Dashboard
4. Deploy!

## 📁 Cấu trúc dự án

```
giasu/
├── api/                    # Vercel Serverless Functions
│   └── ai/
│       ├── smart-search.ts
│       ├── match-tutors.ts
│       ├── optimize-seo.ts
│       └── generate-class.ts
├── src/
│   ├── components/         # React Components
│   │   ├── PublicNavbar.tsx
│   │   ├── PublicFooter.tsx
│   │   ├── HomePublic.tsx
│   │   ├── FindTutorPublic.tsx
│   │   ├── RegisterTutorPublic.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCards.tsx
│   │   ├── ClassTable.tsx
│   │   ├── SideWidgets.tsx
│   │   ├── TutorTab.tsx
│   │   ├── StudentTab.tsx
│   │   ├── FinanceTab.tsx
│   │   └── SeoConfigTab.tsx
│   ├── App.tsx             # Main App (Public + Admin routing)
│   ├── firebase.ts         # Firebase configuration
│   ├── types.ts            # TypeScript interfaces
│   ├── index.css           # Global styles
│   └── main.tsx            # Entry point
├── index.html              # HTML with SEO meta tags
├── package.json
├── vite.config.ts
├── vercel.json
└── tsconfig.json
```

## 📄 License

MIT © Gia Sư Hub 2026
