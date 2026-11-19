export function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }
          // Giữ PNG cho ảnh có nền trong suốt, còn lại dùng JPEG nén
          const isPng = file.type === 'image/png';
          if (!isPng) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = isPng
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => reject(new Error('Không thể đọc ảnh'));
      img.src = src;
    };
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Mã hoá lại một ảnh đang ở dạng data URL (base64) sang bản nhẹ hơn,
 * GIỮ NGUYÊN định dạng gốc (PNG vẫn PNG, còn lại là JPEG) — hình ảnh nhìn
 * giống hệt nhưng dung lượng nhỏ hơn nhiều. Nếu bản mới không nhẹ hơn thì
 * giữ nguyên ảnh cũ để tránh làm xấu ảnh.
 */
export function recompressDataUrl(
  dataUrl: string,
  maxWidth = 1000,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.width);
        // Ảnh đã nhỏ và nhẹ sẵn thì không cần xử lý lại
        if (scale >= 1 && dataUrl.length < 90000) {
          resolve(dataUrl);
          return;
        }
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        const isPng = dataUrl.startsWith('data:image/png');
        if (!isPng) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);
        const out = isPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', quality);
        resolve(out.length < dataUrl.length ? out : dataUrl);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return compressImage(file);
}