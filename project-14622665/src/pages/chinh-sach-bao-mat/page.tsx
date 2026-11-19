import LegalPageLayout from '@/components/feature/LegalPageLayout';
import { privacyPolicy } from '@/lib/legalContent';

export default function ChinhSachBaoMatPage() {
  return (
    <LegalPageLayout
      doc={privacyPolicy}
      image="https://readdy.ai/api/search-image?query=Mystical%20elegant%20dark%20violet%20room%20with%20a%20glowing%20antique%20desk%2C%20a%20golden%20quill%20and%20floating%20translucent%20sealed%20letters%2C%20soft%20candlelight%2C%20protective%20shield%20motifs%20woven%20in%20gold%20light%2C%20dreamy%20premium%20mystical%20digital%20art%2C%20deep%20violet%20and%20warm%20gold%20palette%2C%20calm%20darker%20center%20for%20text%20overlay%2C%20no%20text&width=1600&height=600&seq=legal-privacy-hero-v1&orientation=landscape"
      imageAlt="Chính Sách Bảo Mật The Mystic Room"
      icons={['ri-lock-2-line', 'ri-shield-keyhole-line', 'ri-file-shield-2-line', 'ri-eye-off-line', 'ri-sparkling-line', 'ri-moon-clear-line']}
    />
  );
}