import { supabase } from '@/lib/supabase';

/**
 * Xóa tài khoản người dùng qua backend function (delete-account).
 * - Không truyền userId: xóa chính tài khoản đang đăng nhập.
 * - Truyền userId: chỉ admin mới xóa được tài khoản của người khác.
 * Backend tự kiểm tra quyền và dọn dữ liệu liên quan.
 */
export async function deleteAccount(userId?: string): Promise<{ error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('delete-account', {
      body: userId ? { userId } : {},
    });

    if (error) return { error: error as Error };

    const result = data as { deleted?: boolean; error?: string } | null;
    if (result && result.deleted === false) {
      return { error: new Error(result.error || 'delete_failed') };
    }
    return { error: null };
  } catch (err) {
    return { error: err as Error };
  }
}