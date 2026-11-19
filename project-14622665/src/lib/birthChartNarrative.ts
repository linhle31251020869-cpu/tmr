// Sinh nội dung "Bức tranh về bạn" (FREE) cho Moon Window
// Dựa trên Sun (bản sắc), Moon (cảm xúc), Rising (thể hiện) và nguyên tố.

interface NarrativeInput {
  sunSign: string;
  sunElement: string;
  sunKeywords: string[];
  moonSign: string;
  moonText: string;
  risingSign: string;
  risingText: string;
  sunText: string;
}

export interface PortraitNarrative {
  overview: string;
  emotion: string;
  expression: string;
  work: string;
  study: string;
  love: string;
  friendship: string;
  strengths: string[];
  balance: string[];
}

const ELEMENT_OVERVIEW: Record<string, (kw: string[]) => string> = {
  Lửa: () =>
    'Bạn mang trong mình ngọn lửa nhiệt thành: sống trực diện, lạc quan và luôn sẵn sàng khởi xướng. Bạn không chờ đợi điều tốt đến với mình, mà chủ động tạo ra nó. Năng lượng của bạn có sức lan tỏa, khiến người xung quanh được nạp thêm động lực.',
  Đất: () =>
    'Bạn là một người vững như mặt đất: thực tế, kiên định và đáng tin cậy. Bạn xây dựng mọi thứ một cách bền vững, trân trọng giá trị bên trong và không bị cuốn theo những điều phù phiếm. Sự ổn định bạn tạo ra là chỗ dựa cho nhiều người.',
  Khí: () =>
    'Bạn sống bằng tư duy và kết nối: tò mò, cởi mở và luôn muốn hiểu thế giới qua ý tưởng, lời nói và con người. Bạn thích trao đổi, học hỏi và nhìn vấn đề từ nhiều góc độ. Sự linh hoạt về trí tuệ là điểm nổi bật của bạn.',
  Thủy: () =>
    'Bạn là một tâm hồn giàu cảm xúc và trực giác: nhạy cảm, sâu sắc và thấu cảm mạnh mẽ. Bạn cảm nhận thế giới bằng trái tim, đọc được cả những điều chưa được nói thành lời. Chiều sâu nội tâm là nơi bạn tìm thấy chính mình.',
};

const ELEMENT_WORK: Record<string, string> = {
  Lửa: 'Trong công việc, bạn là người mở đường — nơi cần sự tiên phong, năng lượng và lòng dũng cảm thì bạn đều có mặt. Bạn thăng hoa khi được chủ động, được khởi xướng và nhìn thấy kết quả từ hành động của mình. Những vai trò thụ động, lặp đi lặp lại dễ làm cạn nguồn lửa bên trong bạn.',
  Đất: 'Trong công việc, bạn là người xây nền tảng — đáng tin, kiên trì và biến kế hoạch thành hiện thực. Bạn làm việc tốt nhất khi có mục tiêu rõ ràng, quy trình vững chắc và được đánh giá đúng bằng kết quả thật. Sự bền bỉ của bạn chính là sức mạnh để hoàn thành những việc lớn lao.',
  Khí: 'Trong công việc, bạn là người kết nối và tư duy — giỏi trao đổi, lên ý tưởng và giải quyết vấn đề bằng trí tuệ. Bạn phát huy tốt trong môi trường cởi mở, nhiều trao đổi và cho phép sáng tạo. Sự đa tài giúp bạn thích nghi nhanh, nhưng hãy nhớ đi sâu vào một vài lĩnh vực để tạo giá trị bền.',
  Thủy: 'Trong công việc, bạn là người thấu cảm — hiểu người, hiểu nhu cầu và tạo ra những kết quả chạm đến con người. Bạn làm việc tốt trong môi trường có ý nghĩa, gắn với cảm xúc và sự phụng sự. Hãy bảo vệ không gian riêng để không bị kiệt sức bởi nguồn năng lượng của môi trường.',
};

const ELEMENT_STUDY: Record<string, string> = {
  Lửa: 'Trong học tập, bạn tiếp thu tốt khi được thực hành và thử thách trực tiếp. Lý thuyết khô khan chỉ giữ chân bạn lúc đầu, còn bạn thực sự học sâu khi được áp dụng, tranh luận và trải nghiệm. Hãy biến việc học thành một hành trình chủ động, không phải nghĩa vụ bị áp đặt.',
  Đất: 'Trong học tập, bạn chăm chỉ, có phương pháp và kiên trì đến cùng. Bạn học vững khi có cấu trúc rõ ràng, từng bước một và gắn với thực tế. Bạn có nền tảng kiến thức rất chắc, đừng ngại mở rộng sang những chủ đề mới để tăng sự linh hoạt.',
  Khí: 'Trong học tập, bạn nhanh nhạy, ham hiểu biết và giỏi nắm bắt khái niệm. Bạn học tốt qua thảo luận, đọc và đặt câu hỏi. Hãy chọn những lĩnh vực kích thích trí tò mò của bạn và đào sâu thay vì chỉ lướt qua nhiều thứ, để trí tuệ của bạn có chiều sâu.',
  Thủy: 'Trong học tập, bạn học sâu những gì chạm đến trái tim và gắn với cảm xúc của mình. Bạn dễ nhớ khi kiến thức có câu chuyện, có hình ảnh và ý nghĩa. Hãy học theo trực giác, nhưng kèm theo việc hệ thống hóa để biến cảm nhận thành kiến thức bền vững.',
};

const ELEMENT_LOVE: Record<string, string> = {
  Lửa: 'Trong tình cảm, bạn yêu một cách nồng nhiệt và chân thật. Bạn dám bày tỏ, dám theo đuổi và đặt nhiều tâm huyết vào mối quan hệ. Bạn cần một người cùng sức sống, hiểu rằng cách bạn yêu đôi khi mạnh mẽ nhưng luôn thành thật với trái tim mình.',
  Đất: 'Trong tình cảm, bạn yêu bằng sự cam kết và chung thủy lâu dài. Bạn thể hiện tình yêu qua những hành động cụ thể, sự ổn định và trách nhiệm hơn là lời hoa mỹ. Một mối quan hệ vững bền, đáng tin cậy là điều bạn trân quý nhất.',
  Khí: 'Trong tình cảm, bạn cần một người bạn tâm giao thú vị, có thể cùng trò chuyện, chia sẻ ý tưởng và tôn trọng sự tự do của nhau. Tình yêu của bạn lớn dần qua sự kết nối trí tuệ và tinh thần. Đừng quên lắng nghe cảm xúc, không chỉ lời nói.',
  Thủy: 'Trong tình cảm, bạn khao khát sự gắn kết sâu sắc về cảm xúc và tâm hồn. Bạn yêu nhạy cảm, sâu đậm và đặt nhiều kỳ vọng về sự thấu hiểu. Hãy tìm một người đủ chín chắn để nâng đỡ thế giới cảm xúc của bạn, và nhớ chia sẻ thay vì chỉ lắng nghe.',
};

const ELEMENT_FRIENDSHIP: Record<string, string> = {
  Lửa: 'Trong tình bạn, bạn là nguồn năng lượng của nhóm — nhiệt tình, trung thành và luôn đứng ra bảo vệ bạn bè. Bạn dễ kết bạn vì sự chân thành và sôi nổi. Hãy học cách lắng nghe và cho bạn bè không gian, không phải lúc nào cũng cần dẫn dắt.',
  Đất: 'Trong tình bạn, bạn là người bạn đáng tin cậy — ít lời nhưng luôn có mặt khi cần, và sẵn sàng giúp đỡ một cách thực tế. Tình bạn của bạn được xây bằng sự chân thật và bền bỉ. Một vài người bạn sâu sắc còn quý hơn nhiều mối quan hệ hời hợt.',
  Khí: 'Trong tình bạn, bạn là người dễ gần, thú vị và cởi mở. Bạn thích những cuộc trò chuyện kích thích tư duy và kết nối được nhiều người. Hãy giữ những tình bạn có chiều sâu, nơi bạn không chỉ chia sẻ ý tưởng mà còn chia sẻ cảm xúc thật.',
  Thủy: 'Trong tình bạn, bạn là người bạn thấu hiểu — luôn sẵn sàng lắng nghe và đồng hành qua những lúc khó khăn. Bạn kết bạn dựa trên sự tin tưởng và thấu cảm sâu sắc. Hãy chọn những người bạn tôn trọng ranh giới của bạn, để sự nhạy cảm được nâng đỡ, không bị lợi dụng.',
};

function strengthsFromElement(element: string): string[] {
  if (element === 'Lửa') return ['Nhiệt huyết và dũng cảm', 'Chủ động, quyết đoán', 'Lạc quan, lan tỏa năng lượng', 'Khả năng lãnh đạo tự nhiên'];
  if (element === 'Đất') return ['Kiên định và đáng tin cậy', 'Thực tế, giải quyết vấn đề tốt', 'Bền bỉ, có kỷ luật', 'Xây dựng nền tảng vững chắc'];
  if (element === 'Khí') return ['Tư duy nhanh nhạy', 'Giao tiếp và kết nối tốt', 'Cởi mở, thích nghi cao', 'Khách quan, tầm nhìn xa'];
  return ['Đồng cảm sâu sắc', 'Trực giác nhạy bén', 'Giàu trí tưởng tượng', 'Khả năng chữa lành và nâng đỡ'];
}

function balanceFromElement(element: string): string[] {
  if (element === 'Lửa') return ['Học cách kiên nhẫn với nhịp độ chậm hơn', 'Cân bằng giữa đam mê và lý trí', 'Không tự đốt cháy bản thân vì người khác'];
  if (element === 'Đất') return ['Mở lòng với sự thay đổi và điều mới mẻ', 'Linh hoạt hơn trong cách làm', 'Cân bằng giữa công việc và cảm xúc'];
  if (element === 'Khí') return ['Đi sâu thay vì chỉ lan rộng', 'Lắng nghe cảm xúc, không chỉ lý luận', 'Giữ sự kết nối cảm xúc chân thật'];
  return ['Đặt ranh giới để không bị cảm xúc chi phối', 'Cân bằng giữa lý trí và cảm xúc', 'Bảo vệ năng lượng của bản thân'];
}

export function buildPortraitNarrative(input: NarrativeInput): PortraitNarrative {
  const kw = input.sunKeywords?.length ? input.sunKeywords.slice(0, 3) : ['sâu sắc'];
  return {
    overview: `${ELEMENT_OVERVIEW[input.sunElement]?.(kw) ?? ''} Với bản sắc ${input.sunSign} (${kw.join(', ').toLowerCase()}), ${input.sunText.slice(0, 1).toLowerCase()}${input.sunText.slice(1)}`,
    emotion: input.moonText,
    expression: input.risingText,
    work: ELEMENT_WORK[input.sunElement] ?? '',
    study: ELEMENT_STUDY[input.sunElement] ?? '',
    love: ELEMENT_LOVE[input.sunElement] ?? '',
    friendship: ELEMENT_FRIENDSHIP[input.sunElement] ?? '',
    strengths: strengthsFromElement(input.sunElement),
    balance: balanceFromElement(input.sunElement),
  };
}