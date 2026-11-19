import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Chặn các trang trải nghiệm: bắt buộc đăng nhập/đăng ký mới xem được.
 * Khi chưa đăng nhập sẽ hiển thị màn hình mời đăng nhập và giữ lại đường dẫn để quay về sau.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen star-bg pt-28 px-6 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
          <p className="mystic-text text-sm mt-4">Đang kiểm tra tài khoản...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen star-bg flex items-center justify-center px-4 py-16 pt-28">
        <div className="mystic-card rounded-2xl p-8 md:p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-900 border border-mystic-purple-500/40 flex items-center justify-center glow-purple">
            <i className="ri-lock-line text-2xl text-mystic-gold-300" />
          </div>
          <h1 className="mystic-heading text-2xl font-bold text-mystic-gold-400 mb-3">
            Cần Đăng Nhập Để Trải Nghiệm
          </h1>
          <p className="mystic-text text-sm opacity-80 mb-7">
            Hãy đăng nhập hoặc tạo tài khoản để bắt đầu hành trình. Kết quả của bạn sẽ được
            lưu lại và cá nhân hoá dành riêng cho bạn.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/auth"
              state={{ redirect: pathname, mode: 'signin' }}
              className="mystic-btn-primary justify-center"
            >
              <i className="ri-login-box-line" /> Đăng Nhập
            </Link>
            <Link
              to="/auth"
              state={{ redirect: pathname, mode: 'signup' }}
              className="mystic-btn-gold justify-center"
            >
              <i className="ri-sparkling-2-line" /> Tạo Tài Khoản Mới
            </Link>
          </div>
          <Link
            to="/"
            className="inline-block mt-6 text-xs text-mystic-purple-400 hover:text-mystic-purple-200 transition-colors font-inter"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}