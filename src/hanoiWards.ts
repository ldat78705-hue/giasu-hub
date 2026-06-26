// Danh sách xã/phường Hà Nội theo đơn vị hành chính mới nhất
// Admin có thể chỉnh sửa, thêm bớt trong phần Cài đặt

export const DEFAULT_HANOI_WARDS: string[] = [
  // TP. Hà Nội - các phường trực thuộc (sau sáp nhập)
  // Khu vực trung tâm (Ba Đình, Hoàn Kiếm, Đống Đa, Hai Bà Trưng)
  'Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc', 'Cống Vị', 'Liễu Giai', 'Nguyễn Trung Trực',
  'Quán Thánh', 'Ngọc Hà', 'Điện Biên', 'Đội Cấn', 'Ngọc Khánh', 'Kim Mã',
  'Giảng Võ', 'Thành Công',
  'Phúc Tân', 'Đồng Xuân', 'Hàng Mã', 'Hàng Buồm', 'Hàng Đào', 'Hàng Bồ',
  'Cửa Đông', 'Hàng Bạc', 'Hàng Gai', 'Chương Dương', 'Hàng Trống',
  'Cửa Nam', 'Hàng Bông', 'Tràng Tiền', 'Trần Hưng Đạo', 'Phan Chu Trinh',
  'Hàng Bài',
  'Cát Linh', 'Văn Miếu', 'Quốc Tử Giám', 'Láng Thượng', 'Ô Chợ Dừa',
  'Văn Chương', 'Hàng Bột', 'Láng Hạ', 'Khâm Thiên', 'Thổ Quan',
  'Nam Đồng', 'Trung Phụng', 'Quang Trung', 'Trung Liệt', 'Phương Liên',
  'Thịnh Quang', 'Trung Tự', 'Kim Liên', 'Phương Mai', 'Ngã Tư Sở',
  'Khương Thượng',
  'Nguyễn Du', 'Bách Khoa', 'Phạm Đình Hổ', 'Lê Đại Hành',
  'Đồng Nhân', 'Phố Huế', 'Đống Mác', 'Thanh Lương', 'Thanh Nhàn',
  'Cầu Dền', 'Bạch Đằng', 'Bạch Mai', 'Trương Định', 'Vĩnh Tuy',
  'Minh Khai', 'Quỳnh Lôi', 'Quỳnh Mai', 'Thanh Trì',
  
  // Tây Hồ
  'Bưởi', 'Yên Phụ', 'Tứ Liên', 'Nhật Tân', 'Quảng An',
  'Xuân La', 'Phú Thượng', 'Thụy Khuê',

  // Cầu Giấy
  'Nghĩa Đô', 'Nghĩa Tân', 'Mai Dịch', 'Dịch Vọng', 'Dịch Vọng Hậu',
  'Quan Hoa', 'Yên Hòa', 'Trung Hòa',

  // Thanh Xuân
  'Hạ Đình', 'Thanh Xuân Bắc', 'Thanh Xuân Nam', 'Thanh Xuân Trung',
  'Phương Liệt', 'Khương Đình', 'Khương Trung', 'Khương Mai',
  'Nhân Chính', 'Kim Giang',

  // Hoàng Mai
  'Hoàng Liệt', 'Hoàng Văn Thụ', 'Giáp Bát', 'Lĩnh Nam',
  'Thịnh Liệt', 'Trần Phú', 'Mai Động', 'Tương Mai',
  'Đại Kim', 'Tân Mai', 'Thanh Trì', 'Yên Sở',
  'Vĩnh Hưng', 'Định Công',

  // Long Biên
  'Thượng Thanh', 'Ngọc Thụy', 'Giang Biên', 'Đức Giang',
  'Việt Hưng', 'Gia Thụy', 'Ngọc Lâm', 'Phúc Lợi',
  'Bồ Đề', 'Sài Đồng', 'Long Biên', 'Thạch Bàn',
  'Phúc Đồng', 'Cự Khối',

  // Nam Từ Liêm
  'Cầu Diễn', 'Xuân Phương', 'Phương Canh', 'Mỹ Đình 1',
  'Mỹ Đình 2', 'Tây Mỗ', 'Mễ Trì', 'Phú Đô',
  'Đại Mỗ', 'Trung Văn',

  // Bắc Từ Liêm
  'Thượng Cát', 'Liên Mạc', 'Đông Ngạc', 'Đức Thắng',
  'Thụy Phương', 'Tây Tựu', 'Xuân Đỉnh', 'Xuân Tảo',
  'Minh Khai', 'Cổ Nhuế 1', 'Cổ Nhuế 2', 'Phú Diễn', 'Phúc Diễn',

  // Hà Đông
  'Nguyễn Trãi', 'Hà Cầu', 'Yên Nghĩa', 'Kiến Hưng',
  'Phú La', 'Phúc La', 'Văn Quán', 'Mộ Lao',
  'Vạn Phúc', 'Yết Kiêu', 'La Khê', 'Quang Trung',
  'Phú Lương', 'Phú Lãm', 'Dương Nội', 'Đồng Mai', 'Biên Giang',

  // Gia Lâm
  'Trâu Quỳ', 'Đa Tốn', 'Kiêu Kỵ', 'Dương Xá', 'Đặng Xá',
  'Phú Thị', 'Yên Viên', 'Yên Thường', 'Ninh Hiệp',
  'Kim Sơn', 'Đình Xuyên', 'Dương Hà', 'Phù Đổng',
  'Trung Mầu', 'Lệ Chi', 'Kim Lan', 'Văn Đức', 'Bát Tràng',
  'Cổ Bi', 'Đông Dư',

  // Đông Anh
  'Đông Anh', 'Uy Nỗ', 'Tiên Dương', 'Vân Nội', 'Nam Hồng',
  'Bắc Hồng', 'Nguyên Khê', 'Xuân Nộn', 'Thụy Lâm',
  'Liên Hà', 'Vân Hà', 'Việt Hùng', 'Kim Nỗ', 'Kim Chung',
  'Đại Mạch', 'Cổ Loa', 'Hải Bối', 'Tàm Xá', 'Vĩnh Ngọc',
  'Mai Lâm', 'Dục Tú', 'Đông Hội', 'Võng La',

  // Thanh Trì
  'Tứ Hiệp', 'Ngũ Hiệp', 'Tân Triều', 'Thanh Liệt',
  'Đại Áng', 'Liên Ninh', 'Ngọc Hồi', 'Hữu Hòa',
  'Tả Thanh Oai', 'Đông Mỹ', 'Duyên Hà', 'Vạn Phúc',
  'Yên Mỹ', 'Tam Hiệp', 'Vĩnh Quỳnh',

  // Sóc Sơn
  'Sóc Sơn', 'Bắc Sơn', 'Minh Trí', 'Hồng Kỳ',
  'Nam Sơn', 'Trung Giã', 'Tân Hưng', 'Minh Phú',
  'Phù Linh', 'Bắc Phú', 'Tân Minh', 'Quang Tiến',
  'Hiền Ninh', 'Phú Cường', 'Mai Đình', 'Đức Hòa',
  'Tiên Dược', 'Thanh Xuân', 'Đông Xuân', 'Kim Lũ',
  'Phú Minh', 'Phù Lỗ', 'Xuân Giang', 'Việt Long', 'Xuân Thu',

  // Hoài Đức, Đan Phượng, Thạch Thất, Mê Linh...
  'An Khánh', 'An Thượng', 'Đức Giang', 'Đức Thượng', 'Di Trạch',
  'Đông La', 'Dương Liễu', 'Kim Chung', 'La Phù', 'Lại Yên',
  'Minh Khai', 'Song Phương', 'Sơn Đồng', 'Tiền Yên', 'Vân Canh',
  'Yên Sở',

  // Mê Linh
  'Mê Linh', 'Đại Thịnh', 'Thanh Lâm', 'Tiền Phong',
  'Tráng Việt', 'Tam Đồng', 'Liên Mạc', 'Vạn Yên',
  'Chu Phan', 'Tiến Thắng', 'Thạch Đà', 'Hoàng Kim',
  'Kim Hoa', 'Tự Lập', 'Văn Khê', 'Quang Minh', 'Tiến Thịnh',

  // Dạy Online
  'Dạy Online',
];
