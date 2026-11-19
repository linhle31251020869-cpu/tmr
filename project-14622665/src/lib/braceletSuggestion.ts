// Gợi ý đá & charm từ kho sản phẩm (braceletMainStones / braceletCharms) dựa trên
// nguyên tố & bản đồ sao của người dùng. Được dùng ở trang "Thiết Kế Vòng" và "Hồ Sơ".

import { braceletMainStones, braceletCharms } from '@/mocks/mysticData';

export interface BraceletSuggestion {
  stoneId: string;
  stoneName: string;
  charmId: string;
  charmName: string;
}

// Ánh xạ nguyên tố -> đá chủ & charm chính.
const ELEMENT_STONE: Record<string, { stoneId: string; charmId: string }> = {
  Lửa: { stoneId: 'citrine', charmId: 'sun' },
  Đất: { stoneId: 'aventurine', charmId: 'star' },
  Khí: { stoneId: 'clear-quartz', charmId: 'star' },
  Thủy: { stoneId: 'moonstone', charmId: 'moon' },
};

const FALLBACK = { stoneId: 'amethyst', charmId: 'moon' };

function normalizeElement(element?: string): string {
  const e = (element || '').trim().toLowerCase();
  if (e.includes('lửa') || e.includes('hỏa')) return 'Lửa';
  if (e.includes('đất') || e.includes('thổ')) return 'Đất';
  if (e.includes('khí') || e.includes('gió')) return 'Khí';
  if (e.includes('thủy') || e.includes('nước')) return 'Thủy';
  return '';
}

export function getBraceletSuggestion(element?: string, sunSign?: string): BraceletSuggestion {
  const key = normalizeElement(element);
  const mapping = (key && ELEMENT_STONE[key]) || FALLBACK;

  const stone = braceletMainStones.find((s) => s.id === mapping.stoneId) || braceletMainStones[0];
  const charm = braceletCharms.find((c) => c.id === mapping.charmId) || braceletCharms[0];

  return {
    stoneId: stone.id,
    stoneName: stone.name,
    charmId: charm.id,
    charmName: charm.name,
  };
}