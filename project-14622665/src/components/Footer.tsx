import { memo } from 'react';
import { Link } from 'react-router-dom';

type FooterLink = {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerLinks: FooterColumn[] = [
  {
    title: 'Trải Nghiệm',
    links: [
      { label: 'Mystic Mirror', path: '/explore/mystic-mirror' },
      { label: 'Tarot Table', path: '/explore/tarot-table' },
      { label: 'Moon Window', path: '/explore/moon-window' },
      { label: 'Numerology', path: '/explore/numerology' },
    ],
  },
  {
    title: 'Hồ Sơ',
    links: [
      { label: 'Hồ Sơ Mật', path: '/my-profile' },
    ],
  },
  {
    title: 'Danh Mục',
    links: [
      { label: 'Lời Mở Đầu', path: '/about' },
      {
        label: 'Tín Vật',
        path: '/thiet-ke-vong',
        children: [
          { label: 'Mystic Card', path: '/mystic-card' },
          { label: 'Chế Tác', path: '/thiet-ke-vong' },
        ],
      },
      { label: 'Thư Quyển', path: '/blog' },
    ],
  },
  {
    title: 'Hỗ Trợ',
    links: [
      { label: 'Chính Sách Bảo Mật', path: '/chinh-sach-bao-mat' },
      { label: 'Điều Khoản Dịch Vụ', path: '/dieu-khoan-dich-vu' },
      { label: 'Chính Sách Hoàn Tiền', path: '/chinh-sach-hoan-tien' },
    ],
  },
];

const logoUrl = 'https://storage.helloreaddy.io/project_files/9ee9d502-da9b-4e4f-98fb-ae3a26790b85/104d3695-f95f-4d84-843e-05f6e93e44fd_compressed_Screenshot-2026-08-29-082332.webp';

function Footer() {
  return (
    <footer className="relative border-t border-mystic-purple-800/20 bg-[#060310]">
      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-mystic-gold-600/40 to-transparent" />

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] gap-8 md:gap-10">
          {/* Brand: centered on mobile, left-aligned on desktop */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center text-center lg:items-start lg:text-left">
            <img
              src={logoUrl}
              alt="The Mystic Room"
              loading="lazy"
              decoding="async"
              className="h-32 md:h-40 w-auto rounded-xl bg-white px-2 py-1.5 mb-6"
            />

            <div className="flex items-center justify-center lg:justify-start gap-3">
              <a
                href="https://www.instagram.com/themystic.room?stkn=anhmcGw2dHBxa3Np&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 flex items-center justify-center hover:border-mystic-purple-500/50 hover:scale-105 transition-all cursor-pointer"
              >
                <i className="ri-instagram-line text-lg" style={{ color: '#E1306C' }} />
              </a>
              <a
                href="https://www.facebook.com/share/1Ec9uVSwCN/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 flex items-center justify-center hover:border-mystic-purple-500/50 hover:scale-105 transition-all cursor-pointer"
              >
                <i className="ri-facebook-circle-fill text-lg" style={{ color: '#1877F2' }} />
              </a>
              <a
                href="https://www.tiktok.com/@themystic.room?_r=1&_t=ZS-99eG2WGeojY"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 flex items-center justify-center hover:border-mystic-purple-500/50 hover:scale-105 transition-all cursor-pointer"
              >
                <i className="ri-tiktok-fill text-lg" style={{ color: '#25F4EE' }} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="mystic-heading text-xs font-semibold tracking-[0.2em] text-mystic-gold-500 mb-4 uppercase">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-mystic-purple-200 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <ul className="flex flex-col gap-2 mt-2 pl-3 border-l border-mystic-purple-800/30">
                        {link.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className="text-sm text-mystic-purple-300/80 hover:text-white transition-colors duration-300"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Horizontal contact strip */}
        <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 border-t border-mystic-purple-800/20 pt-6 md:pt-8">
          <a href="mailto:tmysticroom@gmail.com" className="flex items-center gap-2 text-sm text-mystic-purple-200 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 flex items-center justify-center shrink-0">
              <i className="ri-mail-line text-mystic-gold-400 text-xs" />
            </div>
            <span className="break-all">tmysticroom@gmail.com</span>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-mystic-purple-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mystic-purple-300/60">
            &copy; 2026 The Mystic Room. Bảo lưu mọi quyền.
          </p>

          {/* Fictitious business project notice */}
          <div className="flex items-center gap-2 rounded-full border border-mystic-gold-500/40 bg-gradient-to-r from-[#1b1036]/80 via-[#2b1655]/80 to-[#1b1036]/80 px-4 py-1.5">
            <i className="ri-shield-star-line text-mystic-gold-400 text-sm" aria-hidden="true" />
            <span className="text-[11px] md:text-xs font-medium tracking-[0.16em] uppercase text-mystic-gold-200 whitespace-nowrap">
              Dự án Doanh nghiệp giả định
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/chinh-sach-bao-mat" className="text-xs text-mystic-purple-300/60 hover:text-mystic-purple-200 transition-colors">
              Chính Sách Bảo Mật
            </Link>
            <Link to="/dieu-khoan-dich-vu" className="text-xs text-mystic-purple-300/60 hover:text-mystic-purple-200 transition-colors">
              Điều Khoản Dịch Vụ
            </Link>
            <Link to="/chinh-sach-hoan-tien" className="text-xs text-mystic-purple-300/60 hover:text-mystic-purple-200 transition-colors">
              Chính Sách Hoàn Tiền
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);