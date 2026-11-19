import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';

type NavLink = {
  path: string;
  label: string;
  scrollTo?: string;
  children?: { path: string; label: string }[];
};

const navLinks: NavLink[] = [
  { path: '/about', label: 'Lời Mở Đầu' },
  { path: '/', label: 'Vùng Giải Mã', scrollTo: 'discovery' },
  {
    path: '/thiet-ke-vong',
    label: 'Tín Vật',
    children: [
      { path: '/mystic-card', label: 'Mystic Card' },
      { path: '/thiet-ke-vong', label: 'Chế Tác' },
    ],
  },
  { path: '/my-profile', label: 'Hồ Sơ Mật' },
  { path: '/blog', label: 'Thư Quyển' },
];

const logoUrl = 'https://storage.helloreaddy.io/project_files/9ee9d502-da9b-4e4f-98fb-ae3a26790b85/104d3695-f95f-4d84-843e-05f6e93e44fd_compressed_Screenshot-2026-08-29-082332.webp';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [discoveryActive, setDiscoveryActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight "Khám Phá" khi section discovery trên homepage nằm trong vùng view
  useEffect(() => {
    if (!onHome) {
      setDiscoveryActive(false);
      return;
    }
    const onSpy = () => {
      const el = document.getElementById('discovery');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // active khi section che phủ vùng phía trên 1/2 màn hình
      setDiscoveryActive(rect.top <= window.innerHeight * 0.55 && rect.bottom > 120);
    };
    onSpy();
    window.addEventListener('scroll', onSpy, { passive: true });
    window.addEventListener('resize', onSpy);
    return () => {
      window.removeEventListener('scroll', onSpy);
      window.removeEventListener('resize', onSpy);
    };
  }, [onHome]);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  // Cuộn tới section discovery trên homepage khi bấm "Khám Phá"
  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    setMenuOpen(false);
    if (onHome) {
      const el = document.getElementById('discovery');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate('/', { state: { scrollTo: 'discovery' } });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 mystic-navbar ${
        scrolled ? 'mystic-navbar-scrolled' : ''
      }`}
    >
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logoUrl}
              alt="The Mystic Room"
              className="h-10 w-auto rounded-md bg-white px-1 py-0.5"
            />
            <div className="flex flex-col leading-none">
              <span className="mystic-brand text-sm md:text-base font-bold tracking-[0.15em] text-mystic-gold-400 whitespace-nowrap">
                THE MYSTIC ROOM
              </span>
              <span className="mystic-subheading text-[10px] md:text-xs italic tagline-glow whitespace-nowrap mt-0.5">
                Nơi phép màu thuộc về bạn
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isExplore = link.scrollTo === 'discovery';
              const isActive = isExplore
                ? onHome && discoveryActive
                : link.children
                  ? link.children.some((c) => location.pathname === c.path) || location.pathname === link.path
                  : location.pathname === link.path;

              if (link.children) {
                return (
                  <div key={link.path} className="relative group">
                    <Link
                      to={link.path}
                      className={`relative flex items-center gap-1 text-sm font-inter tracking-wide whitespace-nowrap transition-colors duration-300 ${
                        isActive
                          ? 'text-mystic-gold-400'
                          : 'text-mystic-purple-200 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <i className="ri-arrow-down-s-line text-xs" />
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mystic-gold-400 to-transparent" />
                      )}
                    </Link>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="bg-[#130e26] border border-mystic-purple-700/30 rounded-xl overflow-hidden shadow-xl py-2 min-w-[180px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-inter whitespace-nowrap transition-colors ${
                              location.pathname === child.path
                                ? 'text-mystic-gold-400'
                                : 'text-mystic-purple-200 hover:bg-mystic-purple-900/30 hover:text-white'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={isExplore ? handleExploreClick : undefined}
                  className={`relative text-sm font-inter tracking-wide whitespace-nowrap transition-colors duration-300 ${
                    isActive
                      ? 'text-mystic-gold-400'
                      : 'text-mystic-purple-200 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mystic-gold-400 to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 hover:border-mystic-purple-500/50 transition-all cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 border border-mystic-purple-500/30 flex items-center justify-center text-white">
                    <i className="ri-user-3-line text-sm" />
                  </span>
                  <span className="text-sm text-mystic-purple-200 font-inter max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <i className={`ri-arrow-down-s-line text-sm text-mystic-purple-300 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#130e26] border border-mystic-purple-700/30 rounded-xl overflow-hidden shadow-xl">
                    <div className="px-4 py-3 border-b border-mystic-purple-800/30">
                      <p className="text-sm text-white font-inter truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-mystic-purple-200 hover:bg-mystic-purple-900/30 hover:text-white transition-colors font-inter"
                    >
                      <i className="ri-profile-line" />
                      Hồ sơ của tôi
                    </Link>
                    <Link
                      to="/thiet-ke-vong"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-mystic-purple-200 hover:bg-mystic-purple-900/30 hover:text-white transition-colors font-inter"
                    >
                      <i className="ri-vip-crown-line" />
                      Giỏ hàng của tôi
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-mystic-gold-400 hover:bg-mystic-gold-900/20 hover:text-mystic-gold-300 transition-colors font-inter"
                      >
                        <i className="ri-dashboard-line" />
                        Bảng Quản Trị
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition-colors font-inter cursor-pointer"
                    >
                      <i className="ri-logout-box-r-line" />
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="mystic-btn-primary !py-2 !px-5 text-sm"
              >
                <i className="ri-user-3-line text-sm" />
                Đăng Nhập
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-mystic-purple-200 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className={mobileOpen ? 'ri-close-line text-xl' : 'ri-menu-4-line text-xl'} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0a0618]/98 backdrop-blur-xl border-b border-mystic-purple-800/30 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isExplore = link.scrollTo === 'discovery';
            const isActive = isExplore
              ? onHome && discoveryActive
              : link.children
                ? link.children.some((c) => location.pathname === c.path) || location.pathname === link.path
                : location.pathname === link.path;

            if (link.children) {
              return (
                <div key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm font-inter tracking-wide py-2 transition-colors ${
                      isActive ? 'text-mystic-gold-400' : 'text-mystic-purple-200 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                  <div className="flex flex-col pl-4 mt-1 border-l border-mystic-purple-800/30">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`text-sm font-inter tracking-wide py-2 transition-colors ${
                          location.pathname === child.path
                            ? 'text-mystic-gold-400'
                            : 'text-mystic-purple-200 hover:text-white'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={isExplore ? handleExploreClick : undefined}
                className={`text-sm font-inter tracking-wide py-2 transition-colors ${
                  isActive ? 'text-mystic-gold-400' : 'text-mystic-purple-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-4 pt-4 border-t border-mystic-purple-800/30">
            {user ? (
              <div className="flex flex-col gap-3 w-full">
                <Link
                  to="/my-profile"
                  className="mystic-btn-primary justify-center"
                >
                  <i className="ri-profile-line" />
                  Hồ Sơ Của Tôi
                </Link>
                <button
                  onClick={handleSignOut}
                  className="mystic-btn-outline justify-center"
                >
                  <i className="ri-logout-box-r-line" />
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="mystic-btn-primary justify-center flex-1"
              >
                <i className="ri-user-3-line text-sm" />
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}