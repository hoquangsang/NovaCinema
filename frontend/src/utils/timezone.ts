/**
 * Utility functions để xử lý timezone giữa UTC+0 (Backend) và UTC+7 (Frontend - Vietnam)
 */

const VIETNAM_TIMEZONE_OFFSET = 7 * 60; // UTC+7 in minutes

/**
 * Convert UTC+0 date từ backend sang UTC+7 để hiển thị
 * @param utcDate - Date string hoặc Date object từ backend (UTC+0)
 * @returns Date object đã chuyển sang UTC+7
 */
export const convertUTC0ToUTC7 = (utcDate: string | Date | null | undefined): Date | null => {
  if (!utcDate) return null;
  
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  
  if (isNaN(date.getTime())) return null;
  
  // Add 7 hours to UTC+0 to get UTC+7
  const utc7Date = new Date(date.getTime() + VIETNAM_TIMEZONE_OFFSET * 60 * 1000);
  return utc7Date;
};

/**
 * Convert UTC+7 date từ frontend sang UTC+0 để gửi lên backend
 * @param localDate - Date string hoặc Date object (UTC+7)
 * @returns ISO string ở UTC+0
 */
export const convertUTC7ToUTC0 = (localDate: string | Date | null | undefined): string | null => {
  if (!localDate) return null;
  
  const date = typeof localDate === 'string' ? new Date(localDate) : localDate;
  
  if (isNaN(date.getTime())) return null;
  
  // Subtract 7 hours from UTC+7 to get UTC+0
  const utc0Date = new Date(date.getTime() - VIETNAM_TIMEZONE_OFFSET * 60 * 1000);
  return utc0Date.toISOString();
};

/**
 * Format date từ backend (UTC+0) sang string hiển thị theo múi giờ VN
 * @param utcDate - Date string từ backend (UTC+0)
 * @param locale - Locale format (mặc định: 'vi-VN')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatUTC0DateToLocal = (
  utcDate: string | Date | null | undefined,
  locale: string = 'vi-VN',
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = convertUTC0ToUTC7(utcDate);
  if (!date) return '';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return date.toLocaleDateString(locale, defaultOptions);
};

/**
 * Format date từ backend (UTC+0) sang YYYY-MM-DD cho input type="date"
 * @param utcDate - Date string từ backend (UTC+0)
 * @returns Date string format YYYY-MM-DD
 */
export const formatUTC0DateForInput = (utcDate: string | Date | null | undefined): string => {
  const date = convertUTC0ToUTC7(utcDate);
  if (!date) return '';
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Convert date input value (YYYY-MM-DD) sang UTC+0 ISO string để gửi backend
 * @param dateInputValue - Value từ input type="date" (YYYY-MM-DD)
 * @returns ISO string ở UTC+0
 */
export const convertDateInputToUTC0 = (dateInputValue: string | null | undefined): string | null => {
  if (!dateInputValue) return null;
  
  // Input type="date" returns YYYY-MM-DD in local timezone
  // Parse as local date then convert to UTC+0
  const [year, month, day] = dateInputValue.split('-').map(Number);
  
  // Create date in UTC+7 (local timezone)
  const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  
  return convertUTC7ToUTC0(localDate);
};

/**
 * Format datetime từ backend (UTC+0) sang string hiển thị đầy đủ
 * @param utcDate - Date string từ backend (UTC+0)
 * @param locale - Locale format (mặc định: 'vi-VN')
 * @returns Formatted datetime string
 */
export const formatUTC0DateTimeToLocal = (
  utcDate: string | Date | null | undefined,
  locale: string = 'vi-VN'
): string => {
  const date = convertUTC0ToUTC7(utcDate);
  if (!date) return '';
  
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
