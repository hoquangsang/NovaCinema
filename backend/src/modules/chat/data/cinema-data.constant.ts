/**
 * Thông tin cứng về rạp Nova Cinema
 * Dùng làm fallback khi không lấy được dữ liệu từ database
 */
export const CINEMA_INFO = {
  WEBSITE: 'https://nova-cinema.io.vn',
  EMAIL: 'support@nova-cinema.io.vn',
  HOTLINE: '1900-0000',
  SUPPORT_HOURS: '8:00 - 22:00 hàng ngày',

  // Fallback theaters khi database trống
  THEATERS: [
    {
      name: 'Nova Cinema Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      hotline: '028-1234-5678',
    },
    {
      name: 'Nova Cinema Quận 7',
      address: '456 Nguyễn Văn Linh, Quận 7, TP.HCM',
      hotline: '028-8765-4321',
    },
  ],

  // Fallback prices khi database trống
  DEFAULT_PRICES: {
    STANDARD: 75000,
    VIP: 95000,
    COUPLE: 180000,
  },
} as const;

/**
 * Keywords cho rule-based matching
 * Tổ chức theo nhóm chức năng
 */
export const RULE_BASED_KEYWORDS = {
  // Giá vé
  PRICE: ['giá', 'vé', 'price', 'bao nhiêu tiền', 'giá tiền', 'ticket'] as const,

  // Địa chỉ rạp
  ADDRESS: ['địa chỉ', 'ở đâu', 'location', 'rạp ở', 'chỗ nào', 'đường nào'] as const,

  // Lịch chiếu (hướng dẫn truy cập website)
  SHOWTIME: ['giờ chiếu', 'lịch chiếu', 'suất chiếu', 'chiếu lúc', 'mấy giờ', 'showtime', 'hôm nay'] as const,

  // Phim đang chiếu
  MOVIES: ['phim gì', 'phim nào', 'đang chiếu', 'phim mới', 'phim hay', 'danh sách phim', 'movies'] as const,

  // Liên hệ
  CONTACT: ['liên hệ', 'hotline', 'hỗ trợ', 'contact', 'support', 'email', 'điện thoại'] as const,

  // Lời chào
  GREETING: ['xin chào', 'hello', 'hi', 'chào', 'hey', 'alo'] as const,
} as const;
