import { useEffect, useMemo, useState } from 'react';
import { UserProfileRow } from '@/lib/tracking';
import { fetchAllUserProfiles } from '@/lib/adminUsers';
import { EMAIL_SEGMENTS, EmailSegmentKey, segmentUsers } from '@/lib/emailMarketing';
import AdminTabs from '@/pages/admin/components/AdminTabs';

export default function AdminEmail() {
  const [profiles, setProfiles] = useState<UserProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<EmailSegmentKey>('new_signup');
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setProfiles(await fetchAllUserProfiles());
    } catch (e) {
      console.error('Lỗi tải dữ liệu email marketing:', e);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const consentedCount = useMemo(
    () => profiles.filter((p) => p.marketing_consent && p.email).length,
    [profiles]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    EMAIL_SEGMENTS.forEach((s) => {
      map[s.key] = segmentUsers(profiles, s.key).length;
    });
    return map;
  }, [profiles]);

  const activeSegment = EMAIL_SEGMENTS.find((s) => s.key === activeKey) || EMAIL_SEGMENTS[0];
  const activeUsers = useMemo(() => segmentUsers(profiles, activeKey), [profiles, activeKey]);

  const handleCopy = async () => {
    const emails = activeUsers.map((u) => u.email).filter(Boolean).join(', ');
    try {
      await navigator.clipboard.writeText(emails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto relative z-10">
        <AdminTabs />

        <div className="mb-8">
          <h1 className="mystic-heading text-3xl md:text-4xl font-bold text-mystic-gold-400">
            Email Marketing
          </h1>
          <p className="mystic-text text-sm opacity-70 mt-2 max-w-2xl">
            Dựa trên hành vi thực tế của từng người dùng, hệ thống tự phân nhóm để bạn chuẩn bị
            chiến dịch email phù hợp. Chỉ những người đã đồng ý nhận email mới xuất hiện trong danh sách.
          </p>
        </div>

        {/* Summary banner */}
        <div className="mystic-card rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-mystic-gold-900/20 border border-mystic-gold-700/30 flex items-center justify-center text-mystic-gold-400 shrink-0">
              <i className="ri-mail-send-line text-xl" />
            </div>
            <div>
              <p className="mystic-heading text-lg font-bold text-mystic-gold-400">
                {consentedCount} người đã đồng ý nhận email
              </p>
              <p className="text-xs text-mystic-purple-300/70 font-inter mt-0.5">
                Email welcome tự động gửi ngay sau khi user đăng ký (khi dịch vụ email đã kết nối).
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-sm text-red-200 flex items-center gap-3 flex-wrap">
            <i className="ri-error-warning-line" />
            <span className="flex-1 min-w-[180px]">{error}</span>
            <button onClick={load} className="mystic-btn-outline !px-3 !py-1.5 text-xs whitespace-nowrap">
              <i className="ri-refresh-line" /> Thử Lại
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">
            <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
            <p className="mystic-text text-sm mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Segments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {EMAIL_SEGMENTS.map((seg) => {
                const active = seg.key === activeKey;
                return (
                  <button
                    key={seg.key}
                    onClick={() => { setActiveKey(seg.key); setCopied(false); }}
                    className={`mystic-card rounded-xl p-5 text-left transition-all cursor-pointer ${
                      active ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10' : 'hover:border-mystic-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-mystic-gold-500/15 text-mystic-gold-400' : 'bg-mystic-purple-900/40 text-mystic-purple-200'}`}>
                        <i className={`${seg.icon} text-lg`} />
                      </span>
                      <span className="text-2xl font-bold text-mystic-gold-400">{counts[seg.key] ?? 0}</span>
                    </div>
                    <p className={`text-sm font-semibold ${active ? 'text-mystic-gold-400' : 'text-white'}`}>{seg.label}</p>
                    <p className="text-[11px] text-mystic-purple-300/70 font-inter mt-1">{seg.subject}</p>
                  </button>
                );
              })}
            </div>

            {/* Selected segment detail */}
            <div className="mystic-card rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 flex items-center justify-center text-mystic-gold-400">
                    <i className={`${activeSegment.icon} text-lg`} />
                  </span>
                  <div>
                    <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400">{activeSegment.label}</h2>
                    <p className="text-xs text-mystic-purple-300/70 font-inter">{activeSegment.description}</p>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  disabled={activeUsers.length === 0}
                  className="mystic-btn-outline !px-4 !py-2 text-xs whitespace-nowrap disabled:opacity-50"
                >
                  <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'} />
                  {copied ? 'Đã Sao Chép' : 'Sao Chép Email'}
                </button>
              </div>

              {activeUsers.length === 0 ? (
                <p className="text-sm text-mystic-purple-300/70 py-6 text-center">
                  Chưa có người dùng nào thuộc nhóm này.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-mystic-purple-700/30 text-left text-[11px] uppercase tracking-wide text-mystic-purple-300/70">
                        <th className="px-3 py-3 font-medium">Tên</th>
                        <th className="px-3 py-3 font-medium">Email</th>
                        <th className="px-3 py-3 font-medium">Đăng ký</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeUsers.map((u) => (
                        <tr key={u.id} className="border-b border-mystic-purple-800/20 last:border-0">
                          <td className="px-3 py-3 text-white truncate max-w-[200px]">{u.full_name || 'Chưa đặt tên'}</td>
                          <td className="px-3 py-3 text-mystic-purple-200 truncate max-w-[240px]">{u.email}</td>
                          <td className="px-3 py-3 text-mystic-purple-200 whitespace-nowrap">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}