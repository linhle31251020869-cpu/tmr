// Dữ liệu lăng kính đời sống (FREE) theo Số Đường Đời — Numerology

export interface LifeDomainData {
  portrait: string;
  work: string;
  study: string;
  love: string;
  friendship: string;
}

export const lifeDomainData: Record<string, LifeDomainData> = {
  '1': {
    portrait: 'Bạn là người tiên phong với ý chí mạnh mẽ, sinh ra để dẫn dắt và mở đường. Tinh thần độc lập của bạn luôn thôi thúc bạn đứng trên đôi chân của chính mình và biến ý tưởng thành hiện thực.',
    work: 'Trong công việc, bạn phát huy tốt nhất ở vai trò lãnh đạo, khởi nghiệp hoặc nơi cho phép bạn chủ động quyết định. Bạn dám nhận trách nhiệm và tạo động lực cho người khác, nhưng hãy học cách hợp tác thay vì ôm hết mọi việc.',
    study: 'Trong học tập, bạn học tốt khi tự đặt ra mục tiêu và chủ động tìm hiểu. Bạn tiếp thu nhanh những gì cho phép bạn thể hiện cá tính và sáng tạo. Hãy kiên nhẫn với những kiến thức nền tảng cần sự tỉ mỉ.',
    love: 'Trong tình cảm, bạn thể hiện tình yêu một cách mạnh mẽ và chủ động, thích được là người dẫn dắt mối quan hệ. Bạn cần một người đủ độc lập để không bị lu mờ bởi cá tính của bạn, và đủ tôn trọng để cùng bạn trưởng thành.',
    friendship: 'Trong tình bạn, bạn là người trung thành và luôn bảo vệ bạn bè. Bạn kết bạn với những người có hoài bão và ý chí tương đồng. Hãy cho bạn bè không gian để cũng được là chính họ.',
  },
  '2': {
    portrait: 'Bạn là người hòa giải với tâm hồn nhạy cảm và tinh tế. Bạn có khả năng đọc hiểu cảm xúc người khác và xây dựng sự gắn kết, hài hòa trong mọi mối quan hệ mà không cần gượng ép.',
    work: 'Trong công việc, bạn tỏa sáng ở những vai trò cần hợp tác, ngoại giao, chăm sóc con người hoặc tạo sự cân bằng trong đội nhóm. Bạn làm việc tốt khi có sự hỗ trợ và đồng hành. Đừng ngại đưa ra tiếng nói riêng của mình.',
    study: 'Trong học tập, bạn học hiệu quả khi được trao đổi và học nhóm. Bạn tiếp thu tốt qua câu chuyện, hình ảnh và những ví dụ gần gũi. Hãy tin vào khả năng phân tích của mình, không chỉ dựa vào cảm nhận.',
    love: 'Trong tình cảm, bạn khao khát sự kết nối sâu sắc, chung thủy và nuôi dưỡng lẫn nhau. Bạn yêu bằng sự quan tâm tinh tế và đặt hạnh phúc của người mình yêu lên cao. Hãy nhớ nói lên nhu cầu của chính mình.',
    friendship: 'Trong tình bạn, bạn là người bạn lắng nghe tuyệt vời và luôn giữ hòa khí. Bạn được yêu mến vì sự ấm áp và khả năng hòa giải. Hãy chọn những người bạn tôn trọng bạn, không lợi dụng lòng tốt của bạn.',
  },
  '3': {
    portrait: 'Bạn là người sáng tạo, lạc quan và có khả năng biểu đạt tuyệt vời. Bạn mang năng lượng vui tươi, có duyên trong giao tiếp và truyền cảm hứng cho người khác qua lời nói và ý tưởng.',
    work: 'Trong công việc, bạn tỏa sáng ở những lĩnh vực sáng tạo, truyền thông, nghệ thuật hoặc nơi bạn được thể hiện cá tính. Bạn giỏi khơi nguồn ý tưởng và kết nối mọi người. Hãy rèn sự tập trung để hoàn tất công việc.',
    study: 'Trong học tập, bạn học tốt khi có sự sáng tạo và được trình bày theo cách của mình. Bạn nhớ lâu những gì gắn với hình ảnh và câu chuyện. Hãy hệ thống hóa để biến nhiều ý tưởng thành kiến thức vững chắc.',
    love: 'Trong tình cảm, bạn yêu một cách vui vẻ, lãng mạn và thể hiện cảm xúc qua lời nói, món quà và sự lãng mạn. Bạn cần một người bạn đời cũng biết tận hưởng niềm vui và trân trọng sự biểu đạt của bạn.',
    friendship: 'Trong tình bạn, bạn là người bạn thú vị, hài hước và luôn làm cho mọi buổi gặp trở nên vui vẻ. Bạn dễ kết bạn vì sự duyên dáng. Hãy giữ những tình bạn có chiều sâu, không chỉ vui vẻ bề ngoài.',
  },
  '4': {
    portrait: 'Bạn là người xây dựng thực tế, kỷ luật và đáng tin cậy. Bạn có năng lực tạo nền tảng vững chắc cho mọi thứ, kiên trì vượt qua khó khăn và hoàn thành công việc một cách nghiêm túc.',
    work: 'Trong công việc, bạn là trụ cột đáng tin cậy, xuất sắc ở những vai trò cần tính hệ thống, tổ chức và kỷ luật. Bạn làm việc bền bỉ và giữ chất lượng ổn định. Hãy học cách linh hoạt và đón nhận cách làm mới.',
    study: 'Trong học tập, bạn chăm chỉ, có phương pháp và kiên trì. Bạn học vững khi có cấu trúc và từng bước rõ ràng. Điểm mạnh là sự bền bỉ; hãy thêm sự tò mò khám phá những điều ngoài khuôn khổ.',
    love: 'Trong tình cảm, bạn yêu bằng sự cam kết, trách nhiệm và sự ổn định. Bạn xây dựng mối quan hệ bền vững qua thời gian. Hãy nhớ thể hiện tình cảm bằng lời và sự dịu dàng, không chỉ bằng hành động.',
    friendship: 'Trong tình bạn, bạn là người bạn đáng tin cậy tuyệt đối, luôn giữ lời và sẵn sàng giúp đỡ. Bạn ít bạn nhưng tình bạn rất sâu sắc. Hãy mở lòng với những mối quan hệ mới để cuộc sống thêm phong phú.',
  },
  '5': {
    portrait: 'Bạn là người yêu tự do, đa tài và luôn khao khát trải nghiệm. Bạn linh hoạt, thích nghi nhanh và có năng lượng lan tỏa. Bạn học hỏi tốt nhất qua những chuyến đi và những trải nghiệm mới.',
    work: 'Trong công việc, bạn tỏa sáng ở những môi trường năng động, linh hoạt và có nhiều cơ hội học hỏi. Bạn giỏi thích nghi và xử lý nhiều việc cùng lúc. Hãy tìm một lĩnh vực để đi sâu, vì đa tài nhưng thiếu chiều sâu sẽ khó tạo giá trị bền.',
    study: 'Trong học tập, bạn học tốt nhất qua trải nghiệm, thực hành và sự đa dạng. Bạn mau chán với lý thuyết đơn điệu. Hãy biến việc học thành hành trình khám phá và giữ sự tập trung đủ lâu để hoàn tất.',
    love: 'Trong tình cảm, bạn cần tự do và một người bạn đời hiểu rằng sự độc lập của bạn không phải sự thờ ơ. Bạn yêu một cách hào hứng và mang lại năng lượng mới mẻ. Sự cam kết bền vững đến khi bạn tìm được người khiến bạn muốn dừng chân.',
    friendship: 'Trong tình bạn, bạn là người bạn thích phiêu lưu, luôn mở ra những trải nghiệm mới cho bạn bè. Bạn có nhiều mối quan hệ xã giao rộng. Hãy giữ một vài tình bạn sâu sắc để có chỗ dựa cảm xúc thật sự.',
  },
  '6': {
    portrait: 'Bạn là người nuôi dưỡng, yêu thương và có trách nhiệm với gia đình, cộng đồng. Bạn có khả năng chăm sóc, chữa lành và tạo ra sự hài hòa. Trái tim bạn rộng mở và luôn đặt người khác trong lòng.',
    work: 'Trong công việc, bạn tỏa sáng ở những vai trò chăm sóc, giảng dạy, tư vấn hoặc nơi bạn có thể giúp đỡ con người. Bạn có khả năng xây dựng môi trường ấm áp và có trách nhiệm. Hãy học cách cân bằng giữa cho đi và giữ lại năng lượng cho bản thân.',
    study: 'Trong học tập, bạn học tốt khi thấy kiến thức có thể giúp ích cho người khác. Bạn tiếp thu qua sự quan tâm và các mối quan hệ. Hãy chọn những lĩnh vực bạn yêu thích và cho phép bản thân theo đuổi cả ước mơ riêng.',
    love: 'Trong tình cảm, bạn yêu một cách sâu sắc, tận tụy và có xu hướng chăm lo cho người mình yêu rất chu đáo. Bạn tạo nên tổ ấm ấm áp. Hãy nhớ bạn cũng xứng đáng được yêu thương và chăm sóc như cách bạn dành cho người khác.',
    friendship: 'Trong tình bạn, bạn là người bạn nuôi dưỡng, luôn sẵn lòng giúp đỡ và tạo sự an toàn. Bạn bè tìm đến bạn để được chở che. Hãy đặt ranh giới lành mạnh để lòng tốt của bạn không bị lạm dụng.',
  },
  '7': {
    portrait: 'Bạn là người tìm kiếm tri thức và tâm linh với đời sống nội tâm phong phú. Bạn suy nghĩ sâu sắc, thích phân tích và luôn tìm kiếm ý nghĩa ẩn sau mọi điều. Bạn cần những khoảng lặng để nạp lại năng lượng.',
    work: 'Trong công việc, bạn phát huy tốt ở những lĩnh vực nghiên cứu, phân tích, công nghệ hoặc tư vấn sâu. Bạn làm việc độc lập tốt và cần không gian yên tĩnh để tập trung. Hãy học cách chia sẻ và hợp tác để mở rộng giá trị của bạn.',
    study: 'Trong học tập, bạn xuất sắc khi được nghiên cứu sâu và tự do khám phá. Bạn thích những môn kích thích tư duy và tri thức. Hãy giữ sự cân bằng giữa thế giới nội tâm và việc kết nối với thực tế, con người.',
    love: 'Trong tình cảm, bạn cần sự tôn trọng không gian riêng và chiều sâu tâm hồn. Bạn ít nói về cảm xúc nhưng yêu rất sâu. Hãy tìm một người kiên nhẫn để bước vào thế giới nội tâm của bạn và cùng bạn chia sẻ những suy tư.',
    friendship: 'Trong tình bạn, bạn là người bạn trầm lặng nhưng sâu sắc. Bạn kết bạn với những người có chiều sâu trí tuệ. Hãy nhớ rằng việc mở lòng và chia sẻ với bạn bè giúp cuộc sống của bạn bớt cô đơn.',
  },
  '8': {
    portrait: 'Bạn là người có tham vọng, năng lực lãnh đạo và khả năng kiến tạo sự thịnh vượng. Bạn có tư duy thực tế, quyết đoán và hướng tới những thành tựu lớn. Bạn biến mục tiêu thành kết quả bằng sự nỗ lực bền bỉ.',
    work: 'Trong công việc, bạn tỏa sáng ở những vai trò quản lý, kinh doanh, tài chính hoặc nơi bạn có thể tạo ra tác động lớn. Bạn có năng lực ra quyết định và chịu trách nhiệm. Hãy giữ sự liêm chính và dùng quyền lực một cách có ý nghĩa.',
    study: 'Trong học tập, bạn học tốt khi có mục tiêu rõ ràng và thấy được ứng dụng thực tế. Bạn có tố chất lãnh đạo trong học nhóm. Hãy phát triển sự kiên nhẫn với kiến thức nền tảng, không chỉ chạy theo kết quả.',
    love: 'Trong tình cảm, bạn thể hiện tình yêu qua sự bảo vệ, lo toan và mong muốn xây dựng tương lai vững chắc. Bạn cần một người hiểu tham vọng của bạn nhưng cũng nhắc bạn sống chậm lại và tận hưởng hiện tại.',
    friendship: 'Trong tình bạn, bạn là người bạn hào phóng và luôn giúp đỡ bạn bè tiến lên. Bạn đánh giá cao sự trung thành. Hãy giữ những tình bạn chân thật bên cạnh những mối quan hệ có tính công việc.',
  },
  '9': {
    portrait: 'Bạn là người nhân đạo, có trái tim rộng mở và lòng vị tha. Bạn hướng tới những giá trị nhân văn, yêu thương phổ quát và khao khát cống hiến cho điều tốt đẹp. Bạn có tầm nhìn bao dung và sáng tạo.',
    work: 'Trong công việc, bạn tỏa sáng ở những lĩnh vực cộng đồng, thiện nguyện, nghệ thuật hoặc nơi bạn có thể phụng sự và tạo thay đổi tích cực. Bạn làm việc bằng trái tim và lý tưởng. Hãy học cách đặt ranh giới để không kiệt sức vì mọi người.',
    study: 'Trong học tập, bạn học tốt khi thấy kiến thức gắn với những vấn đề nhân văn và rộng lớn. Bạn có tầm nhìn bao quát. Hãy kết hợp lý tưởng với sự kiên nhẫn thực hành để biến hiểu biết thành hành động cụ thể.',
    love: 'Trong tình cảm, bạn yêu một cách bao dung, sâu sắc và đặt người mình yêu trong một tình yêu rộng lớn, không chiếm hữu. Bạn cần một người hiểu lòng vị tha của bạn và cho bạn không gian để sống với lý tưởng.',
    friendship: 'Trong tình bạn, bạn là người bạn hào phóng, vị tha và luôn nâng đỡ bạn bè vượt qua khó khăn. Bạn có tầm ảnh hưởng tốt đẹp đến những người xung quanh. Hãy chọn những người bạn biết trân trọng và đáp lại tình cảm của bạn.',
  },
  '11': {
    portrait: 'Bạn là người trực giác và truyền cảm hứng, sở hữu nguồn năng lượng tâm linh nhạy bén. Bạn nhìn thấy những tầng ý nghĩa mà ít người nhận ra và có khả năng khơi dậy niềm tin, lý tưởng ở người khác.',
    work: 'Trong công việc, bạn tỏa sáng ở những vai trò truyền cảm hứng, lãnh đạo bằng tầm nhìn, tư vấn hoặc sáng tạo. Bạn có khả năng nhìn thấy tiềm năng và định hướng người khác. Hãy bảo vệ năng lượng nhạy cảm của bạn trước sự ồn ào xung quanh.',
    study: 'Trong học tập, bạn học qua trực giác, cảm hứng và khả năng nắm bắt ý nghĩa sâu. Bạn thích những môn mở ra tri thức tâm linh và triết lý. Hãy bổ sung tính thực tế và hệ thống để trực giác của bạn có nền tảng vững chắc.',
    love: 'Trong tình cảm, bạn khao khát một mối quan hệ có chiều sâu tâm hồn và sự thấu hiểu không cần lời. Bạn yêu bằng cảm hứng và lý tưởng. Hãy tìm một người đủ ổn định để neo giữ năng lượng nhạy cảm của bạn.',
    friendship: 'Trong tình bạn, bạn là người bạn truyền cảm hứng và giúp bạn bè nhìn thấy tiềm năng của chính họ. Bạn kết bạn sâu và có ý nghĩa. Hãy giữ những mối quan hệ nâng đỡ tinh thần của bạn, không làm bạn cạn kiệt.',
  },
  '22': {
    portrait: 'Bạn là bậc thầy xây dựng, kết hợp tầm nhìn vĩ đại với năng lực hiện thực hóa hiếm có. Bạn không chỉ mơ về những giấc mơ lớn mà còn biết cách biến chúng thành những công trình bền vững có ý nghĩa.',
    work: 'Trong công việc, bạn có năng lực lãnh đạo các dự án tầm cỡ và xây dựng những thứ có giá trị lâu dài. Bạn giỏi quản lý nguồn lực và tổ chức. Hãy học cách phân chia trách nhiệm và chăm sóc sức khỏe của bản thân.',
    study: 'Trong học tập, bạn học tốt khi gắn kiến thức với những mục tiêu lớn và ứng dụng thực tế. Bạn có khả năng tổng hợp nhiều lĩnh vực. Hãy rèn sự khiêm nhường học hỏi từ mọi người, không chỉ tự mình trải nghiệm.',
    love: 'Trong tình cảm, bạn yêu một cách nghiêm túc và có trách nhiệm, hướng tới việc xây dựng tương lai cùng nhau. Bạn cần một người bạn đời đủ tầm để đồng hành với tham vọng và đủ ấm áp để làm dịu bớt gánh nặng của bạn.',
    friendship: 'Trong tình bạn, bạn là người bạn đáng tin, hào phóng và luôn hỗ trợ bạn bè hiện thực hóa mục tiêu. Bạn kết bạn với những người có tầm nhìn. Hãy nhớ dành thời gian cho những niềm vui giản dị bên bạn bè.',
  },
  '33': {
    portrait: 'Bạn là bậc thầy giảng dạy với trái tim nhân hậu và tình yêu vô điều kiện. Bạn sở hữu năng lượng chữa lành, truyền cảm hứng và có khả năng nâng đỡ nhiều người bằng lòng trắc ẩn và sự hiện diện từ bi.',
    work: 'Trong công việc, bạn tỏa sáng ở những vai trò giảng dạy, chữa lành, hướng dẫn tinh thần hoặc nơi bạn có thể phụng sự bằng tình yêu thương. Bạn tạo ra tác động sâu sắc qua cách bạn quan tâm. Hãy chăm sóc bản thân để duy trì nguồn năng lượng cho đi.',
    study: 'Trong học tập, bạn học tốt khi gắn kiến thức với mục đích giúp đỡ người khác. Bạn có năng lực truyền đạt và chia sẻ. Hãy nhớ bạn cũng cần được học hỏi và được nâng đỡ, không chỉ là người cho đi.',
    love: 'Trong tình cảm, bạn yêu một cách vị tha, sâu sắc và có khả năng chữa lành cho người mình yêu. Bạn tạo ra tình yêu bao dung. Hãy tìm một người hiểu và đáp lại sự cho đi của bạn, để bạn không rơi vào vai người hy sinh.',
    friendship: 'Trong tình bạn, bạn là người bạn ấm áp, truyền cảm hứng và luôn chữa lành bằng sự hiện diện của mình. Bạn bè được bạn nâng đỡ rất nhiều. Hãy chọn những người bạn có thể cùng bạn cân bằng giữa cho và nhận.',
  },
};