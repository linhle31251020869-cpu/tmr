import LegalPageLayout from '@/components/feature/LegalPageLayout';
import { refundPolicy } from '@/lib/legalContent';

export default function ChinhSachHoanTienPage() {
  return (
    <LegalPageLayout
      doc={refundPolicy}
      image="https://readdy.ai/api/search-image?query=Mystical%20elegant%20dark%20violet%20room%20with%20a%20golden%20coin%20and%20a%20glowing%20circular%20return%20arrow%20floating%20above%20an%20open%20jewelry%20box%20with%20a%20gemstone%20bracelet%2C%20soft%20candlelight%2C%20dreamy%20premium%20mystical%20digital%20art%2C%20deep%20violet%20and%20warm%20gold%20palette%2C%20calm%20darker%20center%20for%20text%20overlay%2C%20no%20text&width=1600&height=600&seq=legal-refund-hero-v1&orientation=landscape"
      imageAlt="Chính Sách Hoàn Tiền The Mystic Room"
      icons={['ri-refund-2-line', 'ri-money-dollar-circle-line', 'ri-vip-diamond-line', 'ri-hand-coin-line', 'ri-moon-clear-line', 'ri-sparkling-line']}
    />
  );
}