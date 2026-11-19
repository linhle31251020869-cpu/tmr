// Dữ liệu diễn giải chiêm tinh + danh sách thành phố (tọa độ địa lý)

export interface City {
  name: string;
  lat: number;
  lon: number;
  tz: number;
}

export const cityList: City[] = [
  // === Việt Nam: 5 thành phố trực thuộc Trung ương ===
  { name: 'Hà Nội', lat: 21.0278, lon: 105.8342, tz: 7 },
  { name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297, tz: 7 },
  { name: 'Hải Phòng', lat: 20.8449, lon: 106.6881, tz: 7 },
  { name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022, tz: 7 },
  { name: 'Cần Thơ', lat: 10.0452, lon: 105.7469, tz: 7 },
  // === Việt Nam: các tỉnh (từ Bắc vào Nam) ===
  { name: 'Điện Biên', lat: 21.3862, lon: 103.0179, tz: 7 },
  { name: 'Lai Châu', lat: 22.3964, lon: 103.4572, tz: 7 },
  { name: 'Sơn La', lat: 21.3271, lon: 103.9166, tz: 7 },
  { name: 'Lào Cai', lat: 22.4809, lon: 103.9755, tz: 7 },
  { name: 'Yên Bái', lat: 21.7032, lon: 104.8748, tz: 7 },
  { name: 'Hòa Bình', lat: 20.8176, lon: 105.3380, tz: 7 },
  { name: 'Hà Giang', lat: 22.8232, lon: 104.9820, tz: 7 },
  { name: 'Tuyên Quang', lat: 21.8241, lon: 105.2183, tz: 7 },
  { name: 'Cao Bằng', lat: 22.6664, lon: 106.2550, tz: 7 },
  { name: 'Lạng Sơn', lat: 21.8533, lon: 106.7618, tz: 7 },
  { name: 'Bắc Kạn', lat: 22.1471, lon: 105.8345, tz: 7 },
  { name: 'Thái Nguyên', lat: 21.5928, lon: 105.8402, tz: 7 },
  { name: 'Phú Thọ', lat: 21.4020, lon: 105.2244, tz: 7 },
  { name: 'Vĩnh Phúc', lat: 21.3609, lon: 105.6013, tz: 7 },
  { name: 'Bắc Ninh', lat: 21.1835, lon: 106.0763, tz: 7 },
  { name: 'Bắc Giang', lat: 21.2753, lon: 106.1960, tz: 7 },
  { name: 'Quảng Ninh', lat: 20.9664, lon: 107.0640, tz: 7 },
  { name: 'Hưng Yên', lat: 20.6490, lon: 106.0610, tz: 7 },
  { name: 'Hải Dương', lat: 20.9408, lon: 106.3331, tz: 7 },
  { name: 'Hà Nam', lat: 20.5455, lon: 105.9800, tz: 7 },
  { name: 'Nam Định', lat: 20.4246, lon: 106.1683, tz: 7 },
  { name: 'Thái Bình', lat: 20.4560, lon: 106.3400, tz: 7 },
  { name: 'Ninh Bình', lat: 20.2506, lon: 105.9744, tz: 7 },
  { name: 'Thanh Hóa', lat: 19.8072, lon: 105.7770, tz: 7 },
  { name: 'Nghệ An', lat: 18.6737, lon: 105.6842, tz: 7 },
  { name: 'Hà Tĩnh', lat: 18.3415, lon: 105.9036, tz: 7 },
  { name: 'Quảng Bình', lat: 17.4848, lon: 106.4211, tz: 7 },
  { name: 'Quảng Trị', lat: 16.7416, lon: 107.1904, tz: 7 },
  { name: 'Thừa Thiên Huế', lat: 16.4637, lon: 107.5909, tz: 7 },
  { name: 'Quảng Nam', lat: 15.8801, lon: 108.3292, tz: 7 },
  { name: 'Quảng Ngãi', lat: 15.1208, lon: 108.7923, tz: 7 },
  { name: 'Bình Định', lat: 13.7822, lon: 109.2234, tz: 7 },
  { name: 'Phú Yên', lat: 13.0810, lon: 109.1577, tz: 7 },
  { name: 'Khánh Hòa', lat: 12.2388, lon: 109.1967, tz: 7 },
  { name: 'Ninh Thuận', lat: 11.5633, lon: 108.9881, tz: 7 },
  { name: 'Bình Thuận', lat: 10.9333, lon: 108.1000, tz: 7 },
  { name: 'Gia Lai', lat: 13.9833, lon: 108.0044, tz: 7 },
  { name: 'Kon Tum', lat: 14.3456, lon: 108.0069, tz: 7 },
  { name: 'Đắk Lắk', lat: 12.6662, lon: 108.0382, tz: 7 },
  { name: 'Đắk Nông', lat: 12.0100, lon: 107.6900, tz: 7 },
  { name: 'Lâm Đồng', lat: 11.9404, lon: 108.4583, tz: 7 },
  { name: 'Bình Phước', lat: 11.7467, lon: 106.7616, tz: 7 },
  { name: 'Bình Dương', lat: 10.9800, lon: 106.6520, tz: 7 },
  { name: 'Đồng Nai', lat: 10.9574, lon: 106.8240, tz: 7 },
  { name: 'Bà Rịa - Vũng Tàu', lat: 10.4114, lon: 107.1362, tz: 7 },
  { name: 'Tây Ninh', lat: 11.3092, lon: 106.0983, tz: 7 },
  { name: 'Long An', lat: 10.5394, lon: 106.4157, tz: 7 },
  { name: 'Đồng Tháp', lat: 10.4700, lon: 105.6200, tz: 7 },
  { name: 'Tiền Giang', lat: 10.3645, lon: 106.3690, tz: 7 },
  { name: 'Bến Tre', lat: 10.2330, lon: 106.3780, tz: 7 },
  { name: 'Vĩnh Long', lat: 10.2540, lon: 105.9630, tz: 7 },
  { name: 'Trà Vinh', lat: 9.9470, lon: 106.3430, tz: 7 },
  { name: 'An Giang', lat: 10.3860, lon: 105.4360, tz: 7 },
  { name: 'Kiên Giang', lat: 10.0120, lon: 105.0800, tz: 7 },
  { name: 'Hậu Giang', lat: 9.7830, lon: 105.6090, tz: 7 },
  { name: 'Sóc Trăng', lat: 9.6020, lon: 105.9720, tz: 7 },
  { name: 'Bạc Liêu', lat: 9.2900, lon: 105.7240, tz: 7 },
  { name: 'Cà Mau', lat: 9.1750, lon: 105.1520, tz: 7 },
  // === Một số thành phố quốc tế phổ biến ===
  { name: 'Bangkok, Thái Lan', lat: 13.7563, lon: 100.5018, tz: 7 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: 'Seoul, Hàn Quốc', lat: 37.5665, lon: 126.978, tz: 9 },
  { name: 'Tokyo, Nhật Bản', lat: 35.6762, lon: 139.6503, tz: 9 },
  { name: 'Sydney, Úc', lat: -33.8688, lon: 151.2093, tz: 10 },
  { name: 'Paris, Pháp', lat: 48.8566, lon: 2.3522, tz: 1 },
  { name: 'London, Anh', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'New York, Mỹ', lat: 40.7128, lon: -74.006, tz: -5 },
  { name: 'Los Angeles, Mỹ', lat: 34.0522, lon: -118.2437, tz: -8 },
];

export const signData: Array<{
  name: string;
  symbol: string;
  element: string;
  keywords: string[];
  description: string;
  rulingPlanet: string;
}> = [
  { name: 'Bạch Dương', symbol: '♈', element: 'Lửa', keywords: ['Dũng cảm', 'Năng động', 'Tiên phong'], description: 'Bản sắc mạnh mẽ, trực diện và tràn đầy khởi đầu. Bạn hành động trước, suy nghĩ sau, luôn khao khát dẫn đầu và chinh phục thử thách.', rulingPlanet: 'Hỏa Tinh' },
  { name: 'Kim Ngưu', symbol: '♉', element: 'Đất', keywords: ['Kiên định', 'Thực tế', 'Trân trọng'], description: 'Bản sắc vững vàng, trân quý sự ổn định, cái đẹp và giá trị vật chất. Bạn bền bỉ, đáng tin và xây dựng cuộc sống một cách chậm mà chắc.', rulingPlanet: 'Kim Tinh' },
  { name: 'Song Tử', symbol: '♊', element: 'Khí', keywords: ['Linh hoạt', 'Tò mò', 'Giao tiếp'], description: 'Bản sắc thông minh, cởi mở và ham học hỏi. Tâm trí bạn luôn vận động, kết nối ý tưởng và con người một cách nhanh nhạy.', rulingPlanet: 'Thủy Tinh' },
  { name: 'Cự Giải', symbol: '♋', element: 'Thủy', keywords: ['Nhạy cảm', 'Bảo vệ', 'Nuôi dưỡng'], description: 'Bản sắc giàu cảm xúc, gắn bó sâu với gia đình và tổ ấm. Bạn che chở người mình yêu và dẫn dắt bằng trực giác cùng sự tinh tế.', rulingPlanet: 'Mặt Trăng' },
  { name: 'Sư Tử', symbol: '♌', element: 'Lửa', keywords: ['Tự tin', 'Sáng tạo', 'Hào phóng'], description: 'Bản sắc rực rỡ, ấm áp và cuốn hút. Bạn sinh ra để tỏa sáng, truyền cảm hứng và trao đi sự hào phóng từ trái tim rộng lớn.', rulingPlanet: 'Mặt Trời' },
  { name: 'Xử Nữ', symbol: '♍', element: 'Đất', keywords: ['Tỉ mỉ', 'Phân tích', 'Phụng sự'], description: 'Bản sắc cẩn trọng, tinh tế và luôn hướng tới sự hoàn thiện. Bạn phục vụ người khác bằng sự chính xác và tận tâm hiếm có.', rulingPlanet: 'Thủy Tinh' },
  { name: 'Thiên Bình', symbol: '♎', element: 'Khí', keywords: ['Hài hòa', 'Công bằng', 'Ngoại giao'], description: 'Bản sắc duyên dáng, yêu cái đẹp và luôn tìm kiếm sự cân bằng. Bạn kết nối, hòa giải và tạo nên những mối quan hệ êm đẹp.', rulingPlanet: 'Kim Tinh' },
  { name: 'Bọ Cạp', symbol: '♏', element: 'Thủy', keywords: ['Mãnh liệt', 'Sâu sắc', 'Chuyển hóa'], description: 'Bản sắc mãnh liệt, bí ẩn và đầy chiều sâu. Bạn dám nhìn vào bóng tối để tái sinh, sở hữu ý chí và sức mạnh cảm xúc khó ai sánh bằng.', rulingPlanet: 'Diêm Vương' },
  { name: 'Nhân Mã', symbol: '♐', element: 'Lửa', keywords: ['Lạc quan', 'Tự do', 'Triết lý'], description: 'Bản sắc phóng khoáng, lạc quan và khao khát chân lý. Bạn tìm kiếm ý nghĩa qua những hành trình và lan tỏa niềm tin vào cuộc sống.', rulingPlanet: 'Mộc Tinh' },
  { name: 'Ma Kết', symbol: '♑', element: 'Đất', keywords: ['Kỷ luật', 'Tham vọng', 'Trách nhiệm'], description: 'Bản sắc kiên cường, nghiêm túc và đầy tham vọng. Bạn leo núi từng bước, xây dựng thành tựu bằng kỷ luật và tầm nhìn dài hạn.', rulingPlanet: 'Thổ Tinh' },
  { name: 'Bảo Bình', symbol: '♒', element: 'Khí', keywords: ['Độc lập', 'Sáng tạo', 'Nhân đạo'], description: 'Bản sắc tiên phong, khác biệt và vị nhân sinh. Bạn nghĩ vượt khuôn khổ, đón nhận cái mới và mơ về một thế giới tốt đẹp hơn.', rulingPlanet: 'Thổ Tinh' },
  { name: 'Song Ngư', symbol: '♓', element: 'Thủy', keywords: ['Đồng cảm', 'Mơ mộng', 'Nghệ thuật'], description: 'Bản sắc dịu dàng, trực giác và giàu lòng trắc ẩn. Bạn cảm nhận thế giới bằng trái tim, hòa mình vào nghệ thuật và cõi tâm linh.', rulingPlanet: 'Hải Vương' },
];

export const houseMeanings: Array<{ name: string; theme: string; meaning: string; significance: string }> = [
  { name: 'Nhà 1', theme: 'Bản ngã & ngoại hình', meaning: 'cách bạn thể hiện bản thân với thế giới, vẻ ngoài và ấn tượng đầu tiên bạn tạo ra', significance: 'Cung Mọc đặt tại đây — đây là chiếc mặt nạ bạn đeo khi bước vào phòng, là điểm khởi đầu của toàn bộ bản đồ sao.' },
  { name: 'Nhà 2', theme: 'Giá trị & tài chính', meaning: 'tiền bạc, tài sản, giá trị cá nhân và lòng tự trọng của bạn', significance: 'Không chỉ về tiền, mà còn là những gì bạn cho là đáng giá — kỹ năng, tài năng và lòng tự trọng nội tại.' },
  { name: 'Nhà 3', theme: 'Giao tiếp & học tập', meaning: 'cách bạn giao tiếp, suy nghĩ, học hỏi và kết nối với anh chị em, hàng xóm', significance: 'Cầu nối giữa tâm trí và thế giới bên ngoài — ngôn ngữ, viết lách, học vấn cơ bản và mối quan hệ hàng ngày.' },
  { name: 'Nhà 4', theme: 'Gia đình & cội rễ', meaning: 'tổ ấm, gia đình, nền tảng cảm xúc và đời sống nội tâm sâu kín của bạn', significance: 'Điểm IC — đáy của bản đồ, nơi bạn thu mình. Phản ánh tuổi thơ, cha mẹ, và nơi bạn tìm thấy sự an toàn thực sự.' },
  { name: 'Nhà 5', theme: 'Sáng tạo & tình yêu', meaning: 'tình yêu lãng mạn, sáng tạo, niềm vui và cách bạn thể hiện bản thân', significance: 'Nhà của trẻ em, nghệ thuật, cờ bạc và tình yêu đích thực — nơi trái tim bạn hát ca và bạn dám làm những điều táo bạo.' },
  { name: 'Nhà 6', theme: 'Công việc & sức khỏe', meaning: 'công việc hằng ngày, thói quen, sức khỏe và sự phụng sự của bạn', significance: 'Vùng đất của sự tự hoàn thiện — chế độ dinh dưỡng, tập luyện, công việc phục vụ và cách bạn chăm sóc bản thân.' },
  { name: 'Nhà 7', theme: 'Quan hệ & đối tác', meaning: 'hôn nhân, đối tác, các mối quan hệ một-một và sự cam kết của bạn', significance: 'Điểm DC — đối diện Cung Mọc. Phản ánh những gì bạn tìm kiếm ở người khác, cách bạn hợp tác và kết nối sâu sắc.' },
  { name: 'Nhà 8', theme: 'Chuyển hóa & chia sẻ', meaning: 'sự tái sinh, tài chính chung, thân mật và những thay đổi sâu sắc của bạn', significance: 'Nhà của bóng tối và ánh sáng — tài sản chung, di sản, tình dục, và khả năng chết đi để tái sinh mạnh mẽ hơn.' },
  { name: 'Nhà 9', theme: 'Triết lý & du hành', meaning: 'niềm tin, triết lý sống, giáo dục bậc cao và những hành trình mở mang tầm mắt của bạn', significance: 'Vùng đất của ý nghĩa — đại học, du lịch nước ngoài, tôn giáo, triết học và những chân trời rộng mở.' },
  { name: 'Nhà 10', theme: 'Sự nghiệp & danh vọng', meaning: 'sự nghiệp, địa vị xã hội, tham vọng và dấu ấn công khai của bạn', significance: 'Điểm MC — đỉnh của bản đồ, nơi bạn được nhìn thấy bởi thế giới. Sự nghiệp, danh tiếng, và di sản công khai.' },
  { name: 'Nhà 11', theme: 'Bạn bè & cộng đồng', meaning: 'tình bạn, mạng lưới xã hội, lý tưởng và khát vọng tập thể của bạn', significance: 'Nhà của tương lai — bạn bè, nhóm, tổ chức, và những ước mơ lớn lao vượt ra ngoài bản thân.' },
  { name: 'Nhà 12', theme: 'Tiềm thức & tâm linh', meaning: 'thế giới tiềm thức, sự cô tịch, tâm linh và những gì ẩn giấu của bạn', significance: 'Vùng biển vô tận — nơi tiềm thức gặp gỡ vũ trụ. Cô đơn, tâm linh, nghệ thuật bí ẩn, và những bí mật sâu thẳm nhất.' },
];

export const planetThemes: Record<string, string> = {
  sun: 'bản sắc cốt lõi, cái tôi và sinh lực',
  moon: 'cảm xúc, bản năng và nhu cầu nội tâm',
  Mercury: 'tư duy, giao tiếp và cách học hỏi',
  Venus: 'tình yêu, vẻ đẹp và giá trị thẩm mỹ',
  Mars: 'động lực, ham muốn và cách bạn hành động',
  Jupiter: 'sự phát triển, may mắn và triết lý sống',
  Saturn: 'kỷ luật, trách nhiệm và bài học trưởng thành',
};

// Hành tinh chủ quản của mỗi cung (để diễn giải liên kết)
export const signRulers: Record<string, string> = {
  'Bạch Dương': 'Hỏa Tinh',
  'Kim Ngưu': 'Kim Tinh',
  'Song Tử': 'Thủy Tinh',
  'Cự Giải': 'Mặt Trăng',
  'Sư Tử': 'Mặt Trời',
  'Xử Nữ': 'Thủy Tinh',
  'Thiên Bình': 'Kim Tinh',
  'Bọ Cạp': 'Diêm Vương',
  'Nhân Mã': 'Mộc Tinh',
  'Ma Kết': 'Thổ Tinh',
  'Bảo Bình': 'Thổ Tinh',
  'Song Ngư': 'Hải Vương',
};

// Diễn giải chi tiết: Mặt Trời tại mỗi cung
export const sunSignDescriptions: Record<string, string> = {
  'Bạch Dương': 'Bạn là người tiên phong bẩm sinh. Mặt Trời ở Bạch Dương ban cho bạn năng lượng hỏa nguyên thủy, khả năng khởi xướng và lòng can đảm đi trước đám đông. Bạn không chờ đợi, bạn tạo ra cơ hội.',
  'Kim Ngưu': 'Bạn sở hữu sự bền bỉ và sức sống của đất. Mặt Trời ở Kim Ngưu mang đến khả năng tạo ra giá trị vật chất, sự kiên nhẫn hiếm có, và một tâm hồn biết trân quý cái đẹp.',
  'Song Tử': 'Bạn là kẻ tò mò vũ trụ. Mặt Trời ở Song Tử ban cho bạn khả năng giao tiếp xuất sắc, tư duy linh hoạt, và sự đa tài khiến bạn không bao giờ đứng yên.',
  'Cự Giải': 'Bạn là người nuôi dưỡng bằng trái tim. Mặt Trời ở Cự Giải ban cho bạn trực giác sắc bén, lòng bảo vệ mãnh liệt, và khả năng cảm nhận cảm xúc của người khác.',
  'Sư Tử': 'Bạn sinh ra để tỏa sáng. Mặt Trời ở Sư Tử — ngôi nhà của Mặt Trời — ban cho bạn sự tự tin tự nhiên, lòng hào phóng rộng lớn, và khả năng truyền cảm hứng đám đông.',
  'Xử Nữ': 'Bạn là người hoàn thiện. Mặt Trời ở Xử Nữ ban cho bạn khả năng phân tích tinh tế, sự tỉ mỉ trong mọi việc, và lòng muốn phục vụ người khác bằng sự chính xác.',
  'Thiên Bình': 'Bạn là người tạo ra hài hòa. Mặt Trời ở Thiên Bình ban cho bạn sự duyên dáng tự nhiên, khả năng ngoại giao và nhu cầu sâu sắc về sự cân bằng trong mọi mối quan hệ.',
  'Bọ Cạp': 'Bạn là người chuyển hóa. Mặt Trời ở Bọ Cạp ban cho bạn sức mạnh nhìn thẳng vào sự thật, khả năng tái sinh từ đống tro tàn, và một trái tim dám yêu sâu đậm.',
  'Nhân Mã': 'Bạn là người tìm kiếm chân lý. Mặt Trời ở Nhân Mã ban cho bạn tinh thần phiêu lưu, lạc quan bất diệt, và khát vọng mở rộng tầm nhìn qua những hành trình.',
  'Ma Kết': 'Bạn là người xây dựng đế chế. Mặt Trời ở Ma Kết ban cho bạn kỷ luật sắt đá, tầm nhìn dài hạn, và khả năng biến tham vọng thành hiện thực bằng từng bước nhỏ.',
  'Bảo Bình': 'Bạn là người tiên phong. Mặt Trời ở Bảo Bình ban cho bạn tư duy độc lập, khả năng nhìn thấy tương lai, và lòng nhân đạo muốn thay đổi thế giới tốt đẹp hơn.',
  'Song Ngư': 'Bạn là người mơ mộng. Mặt Trời ở Song Ngư ban cho bạn trực giác sâu thẳm, lòng đồng cảm vô biên, và khả năng hòa mình vào nghệ thuật và tâm linh.',
};

// Diễn giải chi tiết: Mặt Trăng tại mỗi cung
export const moonSignDescriptions: Record<string, string> = {
  'Bạch Dương': 'Cảm xúc của bạn dữ dội và trực tiếp. Mặt Trăng ở Bạch Dương khiến bạn cần sự tự do cảm xúc, phản ứng nhanh và cần được động viên để cảm thấy an toàn.',
  'Kim Ngưu': 'Cảm xúc của bạn ổn định và sâu sắc. Mặt Trăng ở Kim Ngưu cần sự vật chất an toàn, môi trường đẹp đẽ, và các mối quan hệ bền vững để thực sự thư giãn.',
  'Song Tử': 'Cảm xúc của bạn thay đổi như gió. Mặt Trăng ở Song Tử cần giao tiếp, sự kích thích trí tuệ, và không gian để suy nghĩ và bày tỏ cảm xúc qua lời nói.',
  'Cự Giải': 'Cảm xúc của bạn là vùng biển sâu. Mặt Trăng ở Cự Giải — ngôi nhà của Mặt Trăng — cho bạn khả năng cảm nhận sâu sắc, nhu cầu chăm sóc và được chăm sóc.',
  'Sư Tử': 'Cảm xúc của bạn rực rỡ và chân thành. Mặt Trăng ở Sư Tử cần sự công nhận, tình yêu chân thành, và không gian để thể hiện cảm xúc một cách nghệ thuật.',
  'Xử Nữ': 'Cảm xúc của bạn tinh tế và thực tế. Mặt Trăng ở Xử Nữ cần sự có ích, trật tự, và thể hiện tình cảm qua hành động chăm sóc cụ thể hơn lời nói.',
  'Thiên Bình': 'Cảm xúc của bạn cần hài hòa. Mặt Trăng ở Thiên Bình cần sự cân bằng trong quan hệ, bầu không khí yên bình, và đối tác để cảm thấy trọn vẹn.',
  'Bọ Cạp': 'Cảm xúc của bạn mãnh liệt và bí ẩn. Mặt Trăng ở Bọ Cạp cần sự thân mật sâu sắc, không sợ hãi trước cảm xúc tối tăm, và khả năng chuyển hóa nỗi đau.',
  'Nhân Mã': 'Cảm xúc của bạn tự do và lạc quan. Mặt Trăng ở Nhân Mã cần không gian, phiêu lưu, và tin vào điều tốt đẹp để cảm thấy an lành.',
  'Ma Kết': 'Cảm xúc của bạn kỷ luật và có trách nhiệm. Mặt Trăng ở Ma Kết cần sự ổn định, cấu trúc, và có thể kìm nén cảm xúc để hoàn thành nhiệm vụ.',
  'Bảo Bình': 'Cảm xúc của bạn độc lập và khách quan. Mặt Trăng ở Bảo Bình cần tự do cảm xúc, tình bạn, và không bị ràng buộc bởi kỳ vọng truyền thống.',
  'Song Ngư': 'Cảm xúc của bạn là đại dương vô tận. Mặt Trăng ở Song Ngư ban cho bạn trực giác tâm linh, khả năng hòa nhập cảm xúc với người khác, và nhu cầu sáng tạo.',
};

// Diễn giải chi tiết: Cung Mọc tại mỗi cung
export const risingSignDescriptions: Record<string, string> = {
  'Bạch Dương': 'Bạn để lại ấn tượng đầu tiên đầy năng lượng và trực tiếp. Cung Mọc Bạch Dương khiến người khác thấy bạn táo bạo, tự tin, và luôn sẵn sàng hành động.',
  'Kim Ngưu': 'Bạn để lại ấn tượng đầu tiên bình tĩnh và đáng tin. Cung Mọc Kim Ngưu khiến người khác thấy bạn chậm rãi, chắc chắn, và có gu thẩm mỹ tinh tế.',
  'Song Tử': 'Bạn để lại ấn tượng đầu tiên thông minh và nhanh nhẹn. Cung Mọc Song Tử khiến người khác thấy bạn hoạt bát, đa năng, và dễ trò chuyện.',
  'Cự Giải': 'Bạn để lại ấn tượng đầu tiên nhạy cảm và ấm áp. Cung Mọc Cự Giải khiến người khác thấy bạn dịu dàng, bảo vệ, và có vẻ ngoài dễ gần.',
  'Sư Tử': 'Bạn để lại ấn tượng đầu tiên rực rỡ và tự tin. Cung Mọc Sư Tử khiến người khác thấy bạn có khí chất lãnh đạo, hào phóng, và thu hút ánh nhìn.',
  'Xử Nữ': 'Bạn để lại ấn tượng đầu tiên cẩn trọng và tinh tế. Cung Mọc Xử Nữ khiến người khác thấy bạn khiêm tốn, có tổ chức, và chú ý đến chi tiết.',
  'Thiên Bình': 'Bạn để lại ấn tượng đầu tiên duyên dáng và hòa nhã. Cung Mọc Thiên Bình khiến người khác thấy bạn lịch sự, công bằng, và có vẻ ngoài hài hòa.',
  'Bọ Cạp': 'Bạn để lại ấn tượng đầu tiên bí ẩn và sâu sắc. Cung Mọc Bọ Cạp khiến người khác thấy bạn có sức hút mãnh liệt, khó đoán, và đầy sự tự chủ.',
  'Nhân Mã': 'Bạn để lại ấn tượng đầu tiên phóng khoáng và lạc quan. Cung Mọc Nhân Mã khiến người khác thấy bạn vui vẻ, cởi mở, và có tầm nhìn rộng lớn.',
  'Ma Kết': 'Bạn để lại ấn tượng đầu tiên nghiêm túc và đáng tin cậy. Cung Mọc Ma Kết khiến người khác thấy bạn chín chắn, có trách nhiệm, và đầy tham vọng.',
  'Bảo Bình': 'Bạn để lại ấn tượng đầu tiên độc đáo và khách quan. Cung Mọc Bảo Bình khiến người khác thấy bạn khác biệt, thân thiện nhưng có phần xa cách, và tiên tiến.',
  'Song Ngư': 'Bạn để lại ấn tượng đầu tiên mơ mộng và dễ gần. Cung Mọc Song Ngư khiến người khác thấy bạn mềm mại, có chút huyền bí, và dễ đồng cảm.',
};

// Diễn giải chi tiết: hành tinh trong nhà (tổng quát, có thể kết hợp với cung)
export function getPlanetHouseDescription(planetName: string, houseNumber: number): string {
  const houseThemes = [
    'bản ngã và cách bạn thể hiện mình',
    'giá trị cá nhân và tài chính',
    'giao tiếp và môi trường xung quanh',
    'gia đình và nền tảng cảm xúc',
    'sáng tạo và tình yêu',
    'công việc và sức khỏe',
    'quan hệ đối tác và hợp tác',
    'chuyển hóa và tài nguyên chung',
    'triết lý và tầm nhìn xa',
    'sự nghiệp và danh tiếng',
    'cộng đồng và khát vọng',
    'tiềm thức và tâm linh',
  ];
  const theme = houseThemes[houseNumber - 1] || 'cuộc sống';

  const planetDescriptions: Record<string, string> = {
    'Mặt Trời': `Năng lượng cốt lõi của bạn được đầu tư vào lĩnh vực ${theme}. Đây là nơi bạn tỏa sáng mạnh mẽ nhất, nơi bạn tìm thấy mục đích và sự tự hào.`,
    'Mặt Trăng': `Cảm xúc và nhu cầu an toàn của bạn gắn liền với ${theme}. Bạn cảm thấy như ở nhà khi được tham gia vào lĩnh vực này.`,
    'Thủy Tinh': `Tư duy và cách giao tiếp của bạn được kích hoạt trong lĩnh vực ${theme}. Bạn học hỏi và chia sẻ ý tưởng tốt nhất qua kênh này.`,
    'Kim Tinh': `Tình yêu và giá trị thẩm mỹ của bạn được thể hiện qua ${theme}. Bạn thu hút và tạo ra cái đẹp trong lĩnh vực này.`,
    'Hỏa Tinh': `Động lực và ham muốn của bạn hướng về ${theme}. Đây là nơi bạn hành động quyết liệt và theo đuổi mục tiêu bằng sức mạnh ý chí.`,
    'Mộc Tinh': `Sự phát triển và may mắn đến với bạn qua ${theme}. Bạn mở rộng tầm nhìn và tìm thấy ý nghĩa trong lĩnh vực này.`,
    'Thổ Tinh': `Bài học và trách nhiệm của bạn tập trung tại ${theme}. Bạn xây dựng sự vững vàng qua thời gian và nỗ lực trong lĩnh vực này.`,
  };
  return planetDescriptions[planetName] || `${planetName} ảnh hưởng đến lĩnh vực ${theme} trong cuộc sống của bạn.`;
}

// Diễn giải chi tiết: góc chiếu giữa các hành tinh (aspect cơ bản)
export function getAspectDescription(angleDeg: number): string | null {
  // Góc giữa 2 hành tinh, trả về null nếu không có góc đáng chú ý
  if (angleDeg < 8 || angleDeg > 352) return 'Hợp — hai năng lượng hòa quyện, tăng cường lẫn nhau một cách tự nhiên.';
  if (Math.abs(angleDeg - 180) < 8) return 'Đối — hai năng lượng đối lập cần được cân bằng, tạo ra sự căng thẳng sáng tạo.';
  if (Math.abs(angleDeg - 90) < 8 || Math.abs(angleDeg - 270) < 8) return 'Vuông góc — năng lượng xung đột đòi hỏi hành động để hòa giải, thường là nguồn động lực mạnh mẽ.';
  if (Math.abs(angleDeg - 120) < 8 || Math.abs(angleDeg - 240) < 8) return 'Tam hợp — dòng chảy năng lượng thuận lợi, tài năng tự nhiên và sự hỗ trợ từ vũ trụ.';
  if (Math.abs(angleDeg - 60) < 8 || Math.abs(angleDeg - 300) < 8) return 'Lục hợp — cơ hội hợp tác, sự dễ dàng và tiềm năng cần được khai thác.';
  return null;
}

// Màu riêng cho từng hành tinh (dùng trong UI)
export const planetColors: Record<string, string> = {
  sun: '#f0b43c',
  moon: '#c4a8ff',
  Mercury: '#c0c0c0',
  Venus: '#e8a87c',
  Mars: '#dc503c',
  Jupiter: '#c8a064',
  Saturn: '#b49650',
  asc: '#d4af37',
  mc: '#d4af37',
};

// Màu nền cho từng cung (dùng trong wheel)
export const signColors: string[] = [
  '#dc503c', '#c8a064', '#d4c44c', '#4a9e9e', '#e8a030', '#6a8a5a',
  '#d4af37', '#8a3a8a', '#e07030', '#5a5a7a', '#4a7a9e', '#6a6a9e',
];