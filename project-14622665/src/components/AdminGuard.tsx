import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useAdmin();

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-28 px-6 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
          <p className="mystic-text text-sm mt-4">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-28 px-6 flex items-center justify-center">
        <div className="mystic-card rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-mystic-purple-900/40 border border-mystic-purple-600/30 flex items-center justify-center mb-5">
            <i className="ri-lock-line text-2xl text-mystic-gold-400" />
          </div>
          <h1 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-3">
            Khu Vực Quản Trị
          </h1>
          <p className="mystic-text text-sm opacity-80 mb-6">
            Vui lòng đăng nhập bằng tài khoản quản trị để truy cập bảng điều khiển blog.
          </p>
          <Link to="/auth" className="mystic-btn-primary">
            <i className="ri-login-box-line" /> Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-28 px-6 flex items-center justify-center">
        <div className="mystic-card rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-900/30 border border-red-700/30 flex items-center justify-center mb-5">
            <i className="ri-shield-user-line text-2xl text-red-300" />
          </div>
          <h1 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-3">
            Không Có Quyền Truy Cập
          </h1>
          <p className="mystic-text text-sm opacity-80 mb-6">
            Tài khoản <strong className="text-white">{user.email}</strong> không có quyền quản trị.
            Vui lòng liên hệ chủ sở hữu website.
          </p>
          <Link to="/" className="mystic-btn-outline">
            <i className="ri-home-4-line" /> Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}