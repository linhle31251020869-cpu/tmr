import LegalPageLayout from '@/components/feature/LegalPageLayout';
import { termsOfService } from '@/lib/legalContent';

export default function DieuKhoanDichVuPage() {
  return (
    <LegalPageLayout
      doc={termsOfService}
      image="https://readdy.ai/api/search-image?query=Mystical%20elegant%20dark%20violet%20hall%20with%20a%20large%20open%20ancient%20golden%20law%20scroll%20on%20a%20marble%20pedestal%2C%20glowing%20balance%20scales%20and%20constellation%20lines%20in%20warm%20gold%2C%20soft%20candlelight%2C%20dreamy%20premium%20mystical%20digital%20art%2C%20deep%20violet%20and%20warm%20gold%20palette%2C%20calm%20darker%20center%20for%20text%20overlay%2C%20no%20text&width=1600&height=600&seq=legal-terms-hero-v1&orientation=landscape"
      imageAlt="Điều Khoản Dịch Vụ The Mystic Room"
      icons={['ri-scales-3-line', 'ri-file-paper-2-line', 'ri-quill-pen-line', 'ri-book-2-line', 'ri-moon-clear-line', 'ri-sparkling-line']}
    />
  );
}