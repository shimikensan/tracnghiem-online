/**
 * Quản lý xác thực và mật khẩu quản trị viên
 */

const STORAGE_KEY_ADMIN_PASS = 'uav_admin_custom_password';
const SESSION_KEY_ADMIN_AUTH = 'uav_admin_session_authenticated';

// Mật khẩu mặc định của hệ thống
export const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

/**
 * Lấy mật khẩu quản trị hiện tại (từ cấu hình đã đổi hoặc mặc định)
 */
export function getAdminPassword(): string {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_ADMIN_PASS);
    if (custom && custom.trim().length > 0) {
      return custom;
    }
  } catch {
    // fallback
  }
  return DEFAULT_ADMIN_PASSWORD;
}

/**
 * Đổi mật khẩu quản trị mới
 */
export function setAdminPassword(newPassword: string): boolean {
  try {
    if (newPassword && newPassword.trim().length >= 4) {
      localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPassword.trim());
      return true;
    }
  } catch (err) {
    console.warn('Lỗi lưu mật khẩu:', err);
  }
  return false;
}

/**
 * Đặt lại mật khẩu về mặc định
 */
export function resetAdminPassword(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_ADMIN_PASS);
  } catch (err) {
    console.warn(err);
  }
}

/**
 * Kiểm tra xem phiên làm việc hiện tại đã xác thực quản trị chưa
 */
export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY_ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
}

/**
 * Xác thực mật khẩu
 */
export function verifyAdminPassword(inputPassword: string): boolean {
  const current = getAdminPassword();
  const isValid = inputPassword.trim() === current;
  if (isValid) {
    try {
      sessionStorage.setItem(SESSION_KEY_ADMIN_AUTH, 'true');
    } catch {
      // ignore
    }
  }
  return isValid;
}

/**
 * Đăng xuất khỏi quyền quản trị
 */
export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY_ADMIN_AUTH);
  } catch {
    // ignore
  }
}
