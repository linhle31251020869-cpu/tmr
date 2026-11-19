// Tổng hợp "Tổng quan về bạn" cho trang Hồ Sơ — hợp nhất MBTI + Bản đồ sao + Numerology + nguyên tố
// thành một bức chân dung liền mạch (không liệt kê dữ liệu rời rạc), giữ giọng văn THE MYSTIC ROOM.

import { mbtiInsights } from '@/lib/mbtiInsights';
import { lifeDomainData } from '@/lib/numerologyLife';
import { signData } from '@/lib/astrologyData';

export interface OverviewInput {
  mbtiType?: string;
  traits?: string[];
  lifePath?: string;
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
}

export interface OverviewSection {
  key: string;
  title: string;
  icon: string;
  paragraphs: string[];
}

export interface OverviewNarrative {
  intro: string;
  sections: OverviewSection[];
  closing: string;
  layers: string[];
}

// Năng lượng nguyên tố (suy từ cung Mặt Trời) — giọng mềm, không khẳng định tuyệt đối
const ELEMENT_WHO: Record<string, string> = {
  Lửa: 'Bạn có xu hướng tràn đầy năng lượng và chủ động tạo dấu ấn riêng. Một điểm nổi bật ở bạn là sự dũng cảm: dám khởi đầu, dám theo đuổi điều mình tin mà không cần chờ ai cho phép.',
  Đất: 'Bạn có xu hướng vững chãi và thực tế, tin vào sự nỗ lực từng bước hơn là may mắn chóng tàn. Một điểm nổi bật ở bạn là độ đáng tin cậy: khi đã cam kết điều gì, bạn kiên trì mang nó đến cùng.',
  Khí: 'Bạn có xu hướng tò mò, cởi mở và thích nối kết ý tưởng với con người. Một điểm nổi bật ở bạn là khả năng nhìn vấn đề từ nhiều góc độ, giúp bạn linh hoạt trước mọi thay đổi.',
  Thủy: 'Bạn có xu hướng nhạy cảm và giàu trực giác, cảm nhận thế giới bằng trái tim. Một điểm nổi bật ở bạn là chiều sâu đồng cảm — bạn hiểu được cả những điều chưa được nói thành lời.',
};

const ELEMENT_WORK: Record<string, string> = {
  Lửa: 'Trong công việc, bạn thường được thúc đẩy bởi sự chủ động và khát khao chinh phục. Một môi trường năng động, nhiều thử thách và cho phép bạn dẫn dắt sẽ giúp bạn bùng cháy hơn cả.',
  Đất: 'Trong công việc, bạn là người xây nền tảng đáng tin cậy, biến kế hoạch thành hiện thực bằng sự bền bỉ. Bạn làm việc tốt nhất khi có mục tiêu rõ ràng và được đánh giá đúng bằng kết quả thật.',
  Khí: 'Trong công việc, bạn là người kết nối và tư duy, giỏi trao đổi và tìm ra hướng đi mới. Bạn phát huy tốt trong môi trường cởi mở, nhiều trao đổi, nơi ý tưởng được trân trọng.',
  Thủy: 'Trong công việc, bạn là người thấu cảm, hiểu nhu cầu của con người và tạo ra kết quả chạm đến trái tim. Những việc mang ý nghĩa và gắn với sự phụng sự sẽ khiến bạn tận tâm lâu bền.',
};

const ELEMENT_STUDY: Record<string, string> = {
  Lửa: 'Trong học tập, bạn tiếp thu tốt khi được thực hành và thử thách trực tiếp. Lý thuyết khô khan khó giữ chân bạn; bạn học sâu khi được áp dụng, tranh luận và trải nghiệm.',
  Đất: 'Trong học tập, bạn chăm chỉ, có phương pháp và kiên trì đến cùng. Bạn học vững khi có cấu trúc rõ ràng và gắn với thực tế, tạo nên nền tảng kiến thức rất chắc.',
  Khí: 'Trong học tập, bạn nhanh nhạy và ham hiểu biết, học tốt qua thảo luận và đặt câu hỏi. Việc chọn đúng chủ đề kích thích trí tò mò sẽ giúp trí tuệ của bạn có chiều sâu.',
  Thủy: 'Trong học tập, bạn học sâu những gì chạm đến trái tim và gắn với cảm xúc. Kiến thức có câu chuyện, có hình ảnh và ý nghĩa sẽ được bạn ghi nhớ bền lâu nhất.',
};

const ELEMENT_RELATE: Record<string, string> = {
  Lửa: 'Trong các mối quan hệ, bạn thẳng thắn, chân thành và dễ truyền nhiệt. Bạn cần một người vừa tôn trọng sự độc lập của bạn, vừa đủ sức đồng hành với bước đi nhanh của bạn.',
  Đất: 'Trong các mối quan hệ, bạn yêu bằng sự cam kết và chung thủy lâu dài, thể hiện qua hành động hơn là lời hoa mỹ. Sự bền vững và đáng tin cậy là điều bạn trân quý nhất.',
  Khí: 'Trong các mối quan hệ, bạn cần một người bạn tâm giao thú vị, cùng trò chuyện, cùng sẻ chia ý tưởng và tôn trọng sự tự do của nhau. Sự kết nối trí tuệ nuôi dưỡng tình cảm của bạn.',
  Thủy: 'Trong các mối quan hệ, bạn khao khát sự gắn kết sâu sắc về cảm xúc và tâm hồn. Bạn cần một người đủ tinh tế để nâng đỡ thế giới nội tâm và thấu hiểu những gì bạn không nói thành lời.',
};

const ELEMENT_SOLVE: Record<string, string> = {
  Lửa: 'Trước một vấn đề, bạn hành động nhanh, trực diện và tin vào trực giác của mình. Điểm cần cân bằng là học cách dừng lại, kiên nhẫn nhìn đủ các góc trước khi lao tới.',
  Đất: 'Trước một vấn đề, bạn bình tĩnh, phân tích và giải quyết từng bước một. Điểm cần cân bằng là mở lòng với những cách làm mới, đừng quá bám vào quy trình đã quen.',
  Khí: 'Trước một vấn đề, bạn thích tháo gỡ bằng lý luận, cân nhắc nhiều phương án và tìm lời giải thanh thoát. Điểm cần cân bằng là lắng nghe cảm xúc và dứt khoát khi đã đủ dữ kiện.',
  Thủy: 'Trước một vấn đề, bạn quyết định nhiều bằng cảm nhận và sự thấu cảm hoàn cảnh. Điểm cần cân bằng là giữ khoảng cách để nhìn vấn đề khách quan hơn khi cảm xúc dâng cao.',
};

function strip(text: string): string {
  return (text || '').trim();
}

function cleanLead(text: string): string {
  // Bỏ mở đầu kiểu "Trong công việc, / Trong học tập, / Trong tình cảm," khi đoạn văn đã có sẵn tiêu đề phần.
  return strip(text).replace(
    /^Trong (công việc|học tập|tình cảm|tình bạn|tình yêu|học),?\s*/i,
    (m, p) => (p ? '' : ''),
  );
}

export function buildOverview(input: OverviewInput): OverviewNarrative {
  const mbtiKey = (input.mbtiType || '').trim().toUpperCase();
  const mbti = mbtiInsights[mbtiKey];
  const life = input.lifePath && lifeDomainData[String(input.lifePath).trim()];
  const sunInfo = input.sunSign ? signData.find((s) => s.name === input.sunSign) : undefined;
  const element = sunInfo?.element || '';

  const whoBase = element ? ELEMENT_WHO[element] : 'Bạn là một người nhiều tầng cảm xúc và suy nghĩ, với cách nhìn cuộc sống rất riêng. Mỗi mảnh ghép về bạn đều góp phần tạo nên một con người không ngừng lớn lên.';
  const workBase = element ? ELEMENT_WORK[element] : 'Trong công việc, bạn có một phong cách riêng, phát huy tốt nhất khi công việc phản ánh đúng năng lực và giá trị của mình.';
  const studyBase = element ? ELEMENT_STUDY[element] : 'Trong học tập, bạn có cách tiếp thu riêng, học hiệu quả nhất khi nội dung gắn với điều bạn thực sự quan tâm.';
  const relateBase = element ? ELEMENT_RELATE[element] : 'Trong các mối quan hệ, bạn chân thành và có chiều sâu, kết nối tốt nhất với những ai hiểu và tôn trọng con người thật của bạn.';
  const solveBase = element ? ELEMENT_SOLVE[element] : 'Trước một vấn đề, bạn có cách xử lý riêng, cân bằng giữa lý trí và cảm nhận để tìm lối đi phù hợp nhất với mình.';

  // Mô tả theo từng hệ thống (MBTI / Numerology), đã bỏ mở đầu trùng với tiêu đề.
  const mbtiNotes: Record<string, string> = {
    who: mbti ? strip(mbti.portrait) : '',
    work: mbti ? cleanLead(mbti.work) : '',
    study: mbti ? cleanLead(mbti.study) : '',
    relate: mbti ? `${cleanLead(mbti.love)} ${cleanLead(mbti.friendship)}` : '',
  };
  const lifeNotes: Record<string, string> = {
    who: life ? strip(life.portrait) : '',
    work: life ? cleanLead(life.work) : '',
    study: life ? cleanLead(life.study) : '',
    relate: life ? `${cleanLead(life.love)} ${cleanLead(life.friendship)}` : '',
  };

  const traitNote = input.traits && input.traits.length
    ? `Qua hành trình khám phá, bạn được mô tả với những nét như ${input.traits.slice(0, 4).join(', ').toLowerCase()} — những mảnh ghép bổ trợ cho bức chân dung bên dưới.`
    : '';

  const buildParas = (base: string, which: 'who' | 'work' | 'study' | 'relate') => {
    const out = [strip(base)];
    if (mbtiNotes[which]) out.push(mbtiNotes[which]);
    if (lifeNotes[which]) out.push(lifeNotes[which]);
    return out.filter(Boolean);
  };

  const whoParas = buildParas(whoBase, 'who');
  if (traitNote) whoParas.push(traitNote);

  const layers = [
    'Tính cách · MBTI',
    'Bản đồ sao',
    'Con số Đường Đời',
  ];
  if (sunInfo) layers.push(`Nguyên tố ${sunInfo.element}`);

  const intro = strip(
    `Bức chân dung dưới đây được nối lại từ những mảnh ghép bạn đã gửi gắm trong hành trình: ${input.sunSign ? `${input.sunSign} trong bản đồ sao, ` : ''}${mbti ? `tính cách ${mbtiKey}, ` : ''}${life ? `con số đường đời ${String(input.lifePath).trim()}` : ''} cùng năng lượng nguyên tố của bạn. Đây không phải danh sách dữ liệu, mà một cách nhìn tổng thể — được viết để bạn thấu hiểu chính mình, chứ không gò bạn vào bất kỳ khuôn nào.`,
  ) || 'Một bức chân dung tổng thể về bạn, được nối từ những điều bạn đã khám phá về chính mình trong hành trình huyền bí vừa qua.';

  const closing = strip(
    `Tất cả những điều trên chỉ là những gam màu gợi mở. Bạn có xu hướng như vậy ở nhiều thời điểm, nhưng bạn vẫn luôn là người viết nên chính mình mỗi ngày. Hãy đón nhận những điểm mạnh, dịu dàng với những điểm cần cân bằng, và tiếp tục khám phá để bức chân dung này ngày càng rõ nét hơn theo hành trình của riêng bạn.`,
  ) || 'Bạn vẫn luôn là người viết nên câu chuyện của chính mình.';

  return {
    intro,
    sections: [
      { key: 'who', title: 'Bạn là người như thế nào', icon: 'ri-user-smile-line', paragraphs: whoParas },
      { key: 'work', title: 'Bạn trong công việc', icon: 'ri-briefcase-line', paragraphs: buildParas(workBase, 'work') },
      { key: 'study', title: 'Bạn trong học tập', icon: 'ri-book-open-line', paragraphs: buildParas(studyBase, 'study') },
      { key: 'relate', title: 'Bạn trong các mối quan hệ', icon: 'ri-heart-3-line', paragraphs: buildParas(relateBase, 'relate') },
      {
        key: 'solve',
        title: 'Cách bạn giải quyết vấn đề',
        icon: 'ri-focus-3-line',
        paragraphs: [strip(solveBase)],
      },
    ],
    closing,
    layers,
  };
}