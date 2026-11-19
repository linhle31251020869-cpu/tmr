import { Link, useLocation } from 'react-router-dom';

interface TabDef {
  to: string;
  label: string;
  icon: string;
  match: (path: string) => boolean;
}

const tabs: TabDef[] = [
  {
    to: '/admin',
    label: 'Blog',
    icon: 'ri-article-line',
    match: (p) => p === '/admin' || p.startsWith('/admin/editor'),
  },
  {
    to: '/admin/users',
    label: 'Người Dùng',
    icon: 'ri-group-line',
    match: (p) => p.startsWith('/admin/users'),
  },
  {
    to: '/admin/vouchers',
    label: 'Voucher',
    icon: 'ri-coupon-3-line',
    match: (p) => p.startsWith('/admin/vouchers'),
  },
  {
    to: '/admin/orders',
    label: 'Đơn Hàng',
    icon: 'ri-shopping-bag-3-line',
    match: (p) => p.startsWith('/admin/orders'),
  },
  {
    to: '/admin/email',
    label: 'Email',
    icon: 'ri-mail-send-line',
    match: (p) => p.startsWith('/admin/email'),
  },
];

export default function AdminTabs() {
  const { pathname } = useLocation();

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 w-fit mb-6 overflow-x-auto max-w-full">
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all cursor-pointer ${
              active
                ? 'bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 text-white'
                : 'text-mystic-purple-200 hover:text-white'
            }`}
          >
            <i className={tab.icon} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}