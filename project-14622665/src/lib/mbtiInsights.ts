// Nội dung phản chiếu bản thân theo từng nhóm tính cách (Free) — tập trung vào "hiểu chính mình"

export interface MbtiInsight {
  portrait: string;
  strengths: string[];
  develop: string[];
  work: string;
  study: string;
  love: string;
  friendship: string;
  suggestion: string;
}

export const mbtiInsights: Record<string, MbtiInsight> = {
  ENFP: {
    portrait:
      'Bạn là một tâm hồn rộng mở, luôn nhìn thấy những khả năng mới ở mọi người và mọi hoàn cảnh. Năng lượng của bạn lan tỏa nhẹ nhàng: bạn kết nối thế giới qua sự đồng cảm, trí tưởng tượng và niềm tin rằng điều tốt đẹp luôn có thể xảy ra.',
    strengths: ['Giàu trí tưởng tượng và sáng tạo', 'Tò mò, ham học điều mới', 'Đồng cảm và kết nối tự nhiên', 'Nhiệt huyết lan tỏa', 'Linh hoạt trong tư duy'],
    develop: ['Kiên nhẫn với những bước chậm và chi tiết', 'Hoàn tất thay vì chỉ bắt đầu', 'Không tự áp lực phải làm hài lòng tất cả', 'Tập trung dài hạn khi cảm hứng lên xuống'],
    work: 'Trong công việc, bạn tỏa sáng ở những môi trường linh hoạt, cho phép sáng tạo và gắn kết với con người. Bạn làm tốt việc khơi mở ý tưởng, truyền động lực và xây cầu nối giữa các thành viên. Áp lực của bạn nằm ở những công việc lặp lại, quy trình cứng nhắc khiến năng lượng của bạn dần cạn.',
    study: 'Bạn học tốt nhất khi kiến thức gắn với ý nghĩa và cảm hứng. Những bài học qua câu chuyện, thảo luận, thực hành sẽ khiến bạn tiếp thu nhanh; còn học thuộc lòng hay làm theo khuôn sẽ khiến bạn mau chán. Hãy để trí tò mò dẫn đường, nhưng cũng dành không gian để hệ thống lại những gì đã học.',
    love: 'Trong tình cảm, bạn tìm kiếm một sự kết nối chân thành và có chiều sâu tinh thần. Bạn hào phóng trong việc quan tâm và thể hiện tình cảm, nhưng cũng cần một người đủ vững để cùng bạn lớn lên. Khi được thấu hiểu mà không bị gò bó, tình yêu của bạn trở thành nơi nuôi dưỡng cả hai.',
    friendship: 'Bạn là một người bạn ấm áp, luôn sẵn lòng lắng nghe và nâng đỡ. Bạn kết bạn nhanh vì sự chân thành của mình, và giữ bạn lâu vì luôn quan tâm đến điều họ thật sự cần. Nhớ chăm sóc bản thân song song với việc cho đi.',
    suggestion: 'Hãy dành một khoảng yên tĩnh để lắng nghe chính mình, ghi lại những điều khiến bạn thực sự sống động — đó là manh mối để bạn tiếp tục hành trình khám phá bản thân ở những lớp tiếp theo.',
  },
  INFP: {
    portrait:
      'Bạn có một thế giới nội tâm phong phú, nơi những giá trị và ước mơ được nâng niu như báu vật. Bạn nhìn thấy vẻ đẹp ở những điều nhỏ bé, và luôn khao khát một cuộc sống có ý nghĩa hơn là chỉ tồn tại theo khuôn.',
    strengths: ['Đồng cảm sâu sắc', 'Sống theo giá trị và lý tưởng', 'Giàu trí tưởng tượng', 'Suy nghĩ sâu sắc', 'Chân thành và dịu dàng'],
    develop: ['Nói lên nhu cầu của bản thân rõ ràng hơn', 'Không tự khắt khe vì không đạt lý tưởng tuyệt đối', 'Biến ý tưởng thành hành động cụ thể', 'Đối diện thực tế thay vì chỉ mơ về khả năng'],
    work: 'Trong công việc, bạn cần một ý nghĩa đủ lớn để dốc lòng. Bạn làm việc tốt khi có không gian để sáng tạo, khi công việc phản ánh giá trị của mình và khi bạn được đóng góp theo cách riêng. Những môi trường ồn ào, ganh đua hoặc đòi hỏi sự giả tạo sẽ nhanh chóng làm bạn kiệt sức.',
    study: 'Bạn học sâu những gì chạm đến trái tim và trí tưởng tượng. Hãy học qua câu chuyện, qua việc kết nối kiến thức với điều bạn quan tâm. Bạn cần thời gian riêng để suy ngẫm và thẩm thấu, đừng ép bản thân học vội trong không gian ồn ào.',
    love: 'Trong tình cảm, bạn khao khát một mối liên kết tâm hồn, nơi sự chân thật và chiều sâu được đặt lên hàng đầu. Bạn yêu bằng cả trái tim và dễ tổn thương, vì thế bạn cần một người đủ tinh tế để hiểu những gì bạn không cần phải nói thành lời.',
    friendship: 'Bạn là người bạn thủy chung, ít nhưng chọn lọc. Bạn trao đi sự lắng nghe chân thành và đón nhận bạn bè bằng lòng bao dung. Những tình bạn sâu sắc, ít người nhưng ý nghĩa, là điều bạn thực sự trân quý.',
    suggestion: 'Hãy viết ra ba điều bạn tin là quan trọng nhất trong cuộc đời mình. Quan sát cách chúng hiện diện trong những quyết định hằng ngày — đó là cánh cửa để bạn hiểu rõ hơn nội tâm của mình.',
  },
  ENFJ: {
    portrait:
      'Bạn sinh ra để kết nối và nâng đỡ. Với sự nhạy cảm xã hội tinh tế, bạn đọc được cảm xúc của những người xung quanh và biết cách giúp họ bước tới. Bạn mang trong mình nguồn năng lượng truyền cảm hứng, khiến người khác tin rằng họ có thể tốt hơn.',
    strengths: ['Lãnh đạo bằng sự truyền cảm hứng', 'Đồng cảm và giao tiếp tốt', 'Tổ chức và kết nối mọi người', 'Tận tâm với mục tiêu chung', 'Có trách nhiệm'],
    develop: ['Học cách không ôm hết trách nhiệm vào mình', 'Dành thời gian chăm sóc bản thân', 'Chấp nhận rằng không thể làm hài lòng tất cả', 'Đặt ranh giới lành mạnh với người khác'],
    work: 'Trong công việc, bạn là người gắn kết tập thể và dẫn dắt bằng tầm nhìn. Bạn phát huy mạnh mẽ ở vai trò liên quan con người, phát triển đội nhóm và truyền động lực. Hãy cẩn thận đừng để việc chăm lo cho người khác khiến bạn quên mất nhu cầu của chính mình.',
    study: 'Bạn học hiệu quả trong môi trường hợp tác, nơi kiến thức được trao đổi và áp dụng để giúp đỡ mọi người. Bạn tiếp thu tốt qua giảng giải, thảo luận nhóm và khi biết mục đích học để làm gì. Một mục tiêu nhân văn sẽ là động lực học lớn nhất của bạn.',
    love: 'Trong tình cảm, bạn dành rất nhiều sự quan tâm và mong muốn người mình yêu được hạnh phúc. Bạn cần một người hiểu rằng sự chăm sóc của bạn xuất phát từ tình yêu chân thành, đồng thời cũng cho bạn không gian được là chính mình, không chỉ là người cho đi.',
    friendship: 'Bạn là người bạn gắn kết và hỗ trợ rất tốt. Bạn nhớ những điều nhỏ nhặt của bạn bè, luôn có mặt khi họ cần và giúp họ nhìn thấy tiềm năng của mình. Tình bạn với bạn là sự đồng hành và cùng phát triển.',
    suggestion: 'Hãy hỏi bản thân: điều gì khiến bạn thấy mình có ích và tràn đầy nhất? Những câu trả lời đó sẽ chỉ cho bạn đâu là nơi bạn có thể cống hiến lâu dài mà không bị cạn kiệt.',
  },
  INFJ: {
    portrait:
      'Bạn là một người có chiều sâu hiếm thấy: điềm tĩnh bên ngoài nhưng giàu cảm xúc và lý tưởng bên trong. Bạn nhìn thấy những mối liên kết mà ít người nhận ra, và mang trong mình một trực giác sắc bén về con người và tương lai.',
    strengths: ['Trực giác và tầm nhìn sâu sắc', 'Kiên định với nguyên tắc', 'Sáng tạo và có tầm nhìn', 'Thấu hiểu người khác tinh tế', 'Tận tâm với điều mình tin'],
    develop: ['Cân bằng giữa lý tưởng và thực tế', 'Chia sẻ nội tâm thay vì giữ quá kín', 'Không tự cô lập khi bị hiểu lầm', 'Thư giãn và chấp nhận sự không hoàn hảo'],
    work: 'Trong công việc, bạn hướng tới một sứ mệnh có ý nghĩa và được dấn thân vào điều mình tin. Bạn tỏa sáng ở những vai trò cần tầm nhìn, tư vấn, nghiên cứu hoặc tạo ra sự chuyển hóa. Bạn cần không gian tĩnh để tư duy và ít bị quản lý chặt chẽ.',
    study: 'Bạn học rất sâu khi thấy kiến thức có ý nghĩa và gắn với bức tranh lớn. Bạn thích lý thuyết, khái niệm và tầng ý nghĩa ẩn sau. Hãy để trực giác dẫn dắt việc lựa chọn chủ đề, nhưng kèm theo cách hệ thống hóa để biến hiểu biết thành giá trị thực.',
    love: 'Trong tình cảm, bạn khao khát sự kết nối tâm hồn thực sự, hiếm hoi và sâu sắc. Bạn ít nói về cảm xúc nhưng yêu rất đậm. Bạn cần một người kiên nhẫn đủ để bước vào thế giới nội tâm của bạn, nơi bạn dần dần mở cửa.',
    friendship: 'Bạn kết bạn sâu và chọn lọc. Với những người thân, bạn là người lắng nghe tuyệt vời và luôn đưa ra những góc nhìn giúp họ sáng tỏ. Bạn cũng cần những khoảng thời gian ở một mình để nạp lại năng lượng.',
    suggestion: 'Hãy viết ra những điều bạn cảm nhận được nhưng chưa nói thành lời. Mang chúng ra đối chiếu với những gì bạn làm hằng ngày — đó là cách bạn chuyển hóa chiều sâu nội tâm thành một cuộc sống có ý nghĩa.',
  },
  ENTJ: {
    portrait:
      'Bạn là người có tầm nhìn và năng lực tổ chức bẩm sinh. Bạn không chỉ mơ về mục tiêu lớn mà còn biết cách lập kế hoạch để chạm đến nó. Bạn dứt khoát, yêu thích trật tự và luôn tìm cách cải thiện mọi thứ xung quanh.',
    strengths: ['Tư duy chiến lược', 'Quyết đoán và hiệu quả', 'Lãnh đạo tự nhiên', 'Tham vọng lành mạnh', 'Giải quyết vấn đề tốt'],
    develop: ['Kiên nhẫn với nhịp độ của người khác', 'Lắng nghe cảm xúc, không chỉ lý lẽ', 'Dành chỗ cho sự tự phát', 'Không biến mọi thứ thành cuộc cạnh tranh'],
    work: 'Trong công việc, bạn thăng hoa ở vai trò lãnh đạo, quản lý hoặc nơi cần ra quyết định chiến lược. Bạn giỏi nhìn bức tranh lớn, giao việc đúng người và thúc đẩy kết quả. Bạn cần một môi trường cho phép bạn chủ động và tạo tác động rõ ràng.',
    study: 'Bạn học hiệu quả khi có mục tiêu rõ ràng và thấy được ứng dụng của kiến thức. Bạn thích lập kế hoạch học tập, đặt câu hỏi sắc bén và tự kiểm soát tiến độ. Hãy nhớ rằng không phải mọi giá trị đều đến từ hiệu quả — đôi khi chậm lại để lĩnh hội sâu hơn cũng quan trọng.',
    love: 'Trong tình cảm, bạn có thể thể hiện tình yêu qua hành động, sự bảo vệ và đồng hành hơn là lời ngọt ngào. Bạn cần một người đủ mạnh mẽ và độc lập để đối thoại thẳng thắn, đồng thời mềm mại để chạm đến cảm xúc của bạn.',
    friendship: 'Bạn là người bạn trung thành và luôn sẵn sàng giúp bạn mình tiến lên. Bạn đưa ra lời khuyên thẳng thắn, thực tế. Bạn kết nối sâu hơn khi tình bạn có sự tôn trọng, tin cậy và cùng chia sẻ mục tiêu.',
    suggestion: 'Hãy dành thời gian không làm gì cả để quan sát bản thân ngoài những mục tiêu. Bạn còn có một thế giới cảm xúc và sáng tạo đáng được khám phá — không chỉ là những kết quả đo đếm được.',
  },
  INTJ: {
    portrait:
      'Bạn là người có tư duy độc lập và tầm nhìn dài hạn. Bạn thích nhìn mọi thứ một cách có hệ thống, luôn tìm kiếm sự hoàn thiện trong ý tưởng và kế hoạch. Vẻ ngoài điềm tĩnh của bạn che giấu một thế giới phân tích không ngừng nghỉ bên trong.',
    strengths: ['Tư duy chiến lược và phân tích', 'Độc lập', 'Quyết đoán khi đã hiểu rõ', 'Kiên trì theo đuổi mục tiêu', 'Sáng tạo trong cách giải quyết'],
    develop: ['Chia sẻ quá trình suy nghĩ với người khác', 'Kiên nhẫn với cảm xúc — của mình và của người', 'Linh hoạt khi kế hoạch thay đổi', 'Đừng tự đặt tiêu chuẩn quá khắt khe'],
    work: 'Trong công việc, bạn xuất sắc ở những vai trò cần tư duy chiến lược, nghiên cứu, thiết kế hệ thống hoặc cải tiến quy trình. Bạn thích làm việc độc lập với mục tiêu rõ ràng và quyền chủ động. Bạn phát huy tốt nhất khi được tin tưởng và đánh giá bằng kết quả.',
    study: 'Bạn học sâu nhất những môn có cấu trúc logic và cho phép bạn tự nghiên cứu. Bạn thích nắm nguyên lý cốt lõi rồi tự mở rộng. Hãy cho phép bản thân hợp tác đôi khi, vì những góc nhìn mới từ người khác có thể làm phong phú cách bạn nhìn vấn đề.',
    love: 'Trong tình cảm, bạn yêu bằng sự cam kết và chiều sâu hơn là lời hoa mỹ. Bạn cần một người tôn trọng sự độc lập và không gian của bạn, đồng thời đủ kiên nhẫn để hiểu rằng sự lặng im của bạn không phải là sự lạnh nhạt.',
    friendship: 'Bạn ít bạn nhưng rất trung thành với những người bạn thật sự. Bạn đánh giá cao sự thông minh, chính trực và không phô trương. Với bạn, một cuộc trò chuyện sâu sắc đáng giá hơn nhiều cuộc gặp mặt xã giao.',
    suggestion: 'Hãy cho phép bản thân khám phá những điều chưa có kế hoạch, những cảm xúc và sở thích "không cần lý do". Bạn có thể tìm thấy ở đó những phần của chính mình mà sự phân tích chưa từng chạm tới.',
  },
  ENTP: {
    portrait:
      'Bạn là người có đầu óc nhanh nhạy và yêu thích thử thách trí tuệ. Bạn thấy thế giới đầy những khả năng chưa được khai phá, và luôn hào hứng với những ý tưởng mới mẻ, táo bạo. Bạn có tài nhìn ra kẽ hở trong mọi lập luận — kể cả của chính mình.',
    strengths: ['Đổi mới và sáng tạo', 'Tư duy nhanh và linh hoạt', 'Tranh luận sắc bén', 'Thích ứng tốt', 'Nhìn ra nhiều khả năng'],
    develop: ['Đi sâu và hoàn tất thay vì nhảy hết ý này sang ý khác', 'Kiên trì với chi tiết thực hiện', 'Tôn trọng cảm xúc khi tranh luận', 'Học cách cam kết'],
    work: 'Trong công việc, bạn tỏa sáng ở những môi trường đầy thử thách, cho phép thử nghiệm và tư duy khác biệt. Bạn giỏi khởi xướng, giải quyết vấn đề phức tạp và thích nghi nhanh. Bạn dễ nhàm chán với quy trình cố định và cần không gian để tự do khám phá.',
    study: 'Bạn học tốt nhất qua tranh luận, câu hỏi mở và thử nghiệm. Bạn thích những môn kích thích tư duy phản biện. Hãy nhớ hệ thống hóa lại và hoàn tất từng chủ đề, vì việc biết nhiều nhưng chưa đi sâu sẽ không tạo nên năng lực bền vững.',
    love: 'Trong tình cảm, bạn khao khát một người bạn đời cũng là người bạn tâm giao thú vị, có thể cùng bạn khám phá và tranh luận. Bạn yêu bằng sự sôi nổi nhưng cũng cần sự tự do. Sự cam kết với bạn lớn dần khi bạn tìm thấy người khiến mọi cuộc trò chuyện đều đáng giá.',
    friendship: 'Bạn là người bạn vui vẻ, thông minh và mang đến năng lượng. Bạn thích những cuộc gặp kèm ý tưởng mới và những câu chuyện kích thích. Bạn bè tìm đến bạn để nhìn vấn đề theo hướng hoàn toàn khác.',
    suggestion: 'Hãy chọn một ý tưởng mà bạn từng hào hứng nhưng bỏ dở, và quyết tâm đưa nó đi đến cùng. Chiều sâu bạn xây dựng trên một thứ có ý nghĩa sẽ tiết lộ nhiều điều hơn là vô số khởi đầu.',
  },
  INTP: {
    portrait:
      'Bạn là người có trí tuệ phân tích và khao khát hiểu thấu bản chất của sự vật. Bạn thích khám phá lý thuyết, xây dựng khái niệm và tìm ra logic ẩn sau mọi hiện tượng. Thế giới nội tâm của bạn đầy những câu hỏi thú vị chưa có lời giải.',
    strengths: ['Tư duy phân tích và logic', 'Sáng tạo trong ý tưởng', 'Khách quan', 'Hiểu sâu về hệ thống', 'Tò mò trí tuệ'],
    develop: ['Chia sẻ ý tưởng dù chưa hoàn hảo', 'Thực hiện thay vì chỉ phân tích', 'Chú ý đến cảm xúc và con người', 'Tránh tê liệt bởi phân tích quá mức'],
    work: 'Trong công việc, bạn phát huy tốt ở những lĩnh vực cần tư duy sâu: nghiên cứu, phân tích dữ liệu, phát triển sản phẩm hay giải quyết vấn đề phức tạp. Bạn làm việc tốt nhất khi có quyền tập trung độc lập và được đánh giá bằng năng lực, không phải bằng giao tiếp xã giao.',
    study: 'Bạn học xuất sắc khi được tự do khám phá những chủ đề kích thích trí tuệ. Bạn thích lý thuyết, mô hình và cách mọi thứ vận hành. Hãy cân bằng giữa việc nghiên cứu và việc trao đổi với người khác để làm giàu thêm góc nhìn của bạn.',
    love: 'Trong tình cảm, bạn yêu bằng sự chân thành và chiều sâu trí tuệ. Bạn có thể ngại thể hiện tình cảm bằng lời, nhưng thể hiện qua sự quan tâm thông minh và đồng hành. Bạn cần một người tôn trọng không gian riêng và chia sẻ những cuộc trò chuyện sâu.',
    friendship: 'Bạn kết bạn qua những sở thích chung và sự tôn trọng trí tuệ. Với bạn bè thân, bạn là người lắng nghe và đưa ra góc nhìn phân tích giúp họ sáng tỏ. Bạn cần những người bạn hiểu rằng sự trầm lặng của bạn là cách bạn đang suy nghĩ, không phải đang xa cách.',
    suggestion: 'Hãy để trí tò mò dẫn bạn đến một điều bạn chưa từng thử — một hoạt động thể chất, một mối quan hệ mới hoặc một sáng tạo thủ công. Khám phá thế giới bằng cảm xúc và trải nghiệm sẽ làm bạn trọn vẹn hơn.',
  },
  ESFJ: {
    portrait:
      'Bạn là người ấm áp, chu đáo và luôn đặt người khác trong trái tim mình. Bạn có năng lực tổ chức tuyệt vời và khao khát tạo ra một môi trường hài hòa, nơi ai cũng được chăm lo. Bạn lan tỏa sự an toàn và gắn kết một cách tự nhiên.',
    strengths: ['Ấm áp và chu đáo', 'Có trách nhiệm', 'Hòa đồng và đáng tin', 'Tổ chức tốt', 'Quan tâm đến chi tiết của người khác'],
    develop: ['Học cách nói không và đặt ranh giới', 'Đừng coi việc được yêu quý là tiêu chí giá trị bản thân', 'Chấp nhận xung đột lành mạnh', 'Chăm sóc bản thân nhiều hơn'],
    work: 'Trong công việc, bạn là người xây dựng tinh thần đội nhóm và chăm lo cho mọi thành viên. Bạn tỏa sáng ở những vai trò cần sự chu đáo, tổ chức và hỗ trợ con người. Bạn cần được trân trọng và cần một môi trường hòa thuận để cống hiến hết mình.',
    study: 'Bạn học tốt nhất khi có thầy cô hoặc bạn bè hỗ trợ và khi kiến thức gắn với ứng dụng giúp ích con người. Bạn chăm chỉ, có trách nhiệm với bài vở. Hãy học cách đặt câu hỏi và đưa ra ý kiến riêng, vì bạn có nhiều giá trị hơn những gì bạn nghĩ.',
    love: 'Trong tình cảm, bạn yêu bằng sự quan tâm cụ thể và mong muốn người mình yêu được hạnh phúc trong cuộc sống thường nhật. Bạn tận tâm, trung thành và trân trọng những cử chỉ chu đáo được đáp lại. Hãy nhớ bạn cũng xứng đáng được chăm sóc như cách bạn chăm sóc người khác.',
    friendship: 'Bạn là người bạn đáng tin cậy, luôn nhớ những dịp đặc biệt và sẵn lòng giúp đỡ. Bạn tạo nên những nhóm bạn gắn bó, ấm áp. Tình bạn của bạn được xây bằng sự quan tâm đều đặn và đáng tin cậy.',
    suggestion: 'Hãy lập danh sách những điều bạn làm cho chính mình mỗi tuần — không phải cho ai khác. Nuôi dưỡng bản thân không phải là ích kỷ, mà là cách để bạn có thể tiếp tục lan tỏa sự ấm áp một cách bền vững.',
  },
  ISFJ: {
    portrait:
      'Bạn là người có trái tim dịu dàng và tinh thần trách nhiệm cao. Bạn quan sát nhu cầu của người khác từ rất sớm và âm thầm chăm lo mà ít khi cần được ghi nhận. Sự bền bỉ và lòng trung thành là nét đẹp thầm lặng của bạn.',
    strengths: ['Hỗ trợ và đáng tin cậy', 'Kiên nhẫn', 'Tận tâm với từng chi tiết', 'Nhạy cảm với nhu cầu người khác', 'Trung thành'],
    develop: ['Nói lên cảm xúc và nhu cầu của mình', 'Đừng hy sinh bản thân quá mức', 'Cởi mở với sự thay đổi', 'Nhận ra giá trị của chính mình'],
    work: 'Trong công việc, bạn là người nền tảng: cẩn thận, đáng tin và luôn hoàn thành tốt vai trò được giao. Bạn tỏa sáng ở những nơi cần sự tỉ mỉ, chăm sóc và hỗ trợ. Bạn làm việc hiệu quả nhất khi được trân trọng và có một nhịp độ ổn định.',
    study: 'Bạn học tốt khi có tài liệu rõ ràng, được hướng dẫn tận tình và thấy kiến thức hữu dụng. Bạn chăm chỉ và kiên trì. Hãy tin vào khả năng tư duy của mình, đừng chỉ dừng lại ở việc ghi nhớ — bạn cũng có những góc nhìn sâu sắc đáng giá.',
    love: 'Trong tình cảm, bạn yêu bằng sự quan tâm âm thầm và bền bỉ. Bạn nhớ những điều nhỏ nhặt và chăm sóc người mình yêu bằng hành động. Bạn cần một người nhìn thấy và trân trọng những điều thầm lặng bạn làm, và đủ kiên nhẫn để bạn mở lời về cảm xúc.',
    friendship: 'Bạn là người bạn trung thành, luôn có mặt khi cần và chăm lo rất chu đáo. Bạn không cần đông bạn, chỉ cần những tình bạn thật. Bạn bè quý bạn vì sự đáng tin cậy và lòng tốt không cần thể hiện.',
    suggestion: 'Hãy thử một lần ưu tiên nhu cầu của bản thân trước và quan sát điều gì xảy ra. Bạn có quyền được chăm sóc, được nghỉ ngơi và được nói "không" — điều đó không làm giảm giá trị của sự tốt bụng bạn đang có.',
  },
  ESTJ: {
    portrait:
      'Bạn là người thực tế, nguyên tắc và có tổ chức. Bạn tin vào sự nỗ lực, trách nhiệm và trật tự. Bạn là chỗ dựa vững chắc cho gia đình và tổ chức, luôn đảm bảo mọi việc vận hành đúng hướng và đúng hạn.',
    strengths: ['Ngăn nắp và có hệ thống', 'Tận tâm, trung thực', 'Quyết đoán', 'Có trách nhiệm', 'Lãnh đạo thực tế'],
    develop: ['Linh hoạt hơn với cách làm của người khác', 'Chú ý đến cảm xúc, không chỉ kết quả', 'Học cách thư giãn và không kiểm soát mọi thứ', 'Cởi mở với ý tưởng mới'],
    work: 'Trong công việc, bạn là người giữ kỷ luật và đảm bảo hiệu quả. Bạn tỏa sáng ở vai trò quản lý, vận hành hoặc nơi cần trật tự rõ ràng. Bạn có khả năng thúc đẩy mọi người hoàn thành công việc đúng tiến độ và đúng chuẩn mực.',
    study: 'Bạn học tốt khi có cấu trúc, mục tiêu rõ ràng và bài học thực tế. Bạn chăm chỉ, đi đúng hướng dẫn và có tính kỷ luật cao. Hãy thử đôi khi đặt câu hỏi về giả định và khám phá những cách tiếp cận mới ngoài sách vở.',
    love: 'Trong tình cảm, bạn thể hiện tình yêu qua sự cam kết, trách nhiệm và việc xây dựng một cuộc sống ổn định. Bạn yêu thương gia đình theo cách thực tế và bảo vệ. Bạn cần một người hiểu rằng sự nghiêm túc của bạn là cách bạn đang lo lắng và yêu thương.',
    friendship: 'Bạn là người bạn đáng tin, thẳng thắn và luôn giúp đỡ thực tế. Bạn coi trọng sự chính trực và giữ lời hứa. Với bạn bè, bạn là người có thể trông cậy trong mọi khó khăn.',
    suggestion: 'Hãy cho phép bản thân một khoảng không không có kế hoạch — không cần hiệu quả, không cần mục đích. Khám phá lại niềm vui và cảm xúc sẽ giúp bạn cân bằng giữa trách nhiệm và hạnh phúc của chính mình.',
  },
  ISTJ: {
    portrait:
      'Bạn là người đáng tin cậy, thực tế và có nguyên tắc rõ ràng. Bạn xây dựng cuộc sống bằng sự chăm chỉ, trách nhiệm và tinh thần giữ lời. Lời nói của bạn đáng giá, và công việc bạn làm luôn chắc chắn.',
    strengths: ['Trung thực và có trách nhiệm', 'Ý chí mạnh mẽ', 'Kiên định', 'Chi tiết và cẩn thận', 'Đáng tin cậy tuyệt đối'],
    develop: ['Cởi mở với sự thay đổi và cách làm mới', 'Bày tỏ cảm xúc dễ dàng hơn', 'Chấp nhận sự mơ hồ', 'Học cách thư giãn và tận hưởng'],
    work: 'Trong công việc, bạn là nền tảng vững chắc của tổ chức. Bạn hoàn thành tốt nhiệm vụ, tuân thủ quy trình và đảm bảo chất lượng. Bạn tỏa sáng ở những vai trò cần độ chính xác, độ tin cậy và tinh thần trách nhiệm cao.',
    study: 'Bạn học tốt khi có tài liệu rõ ràng, phương pháp cụ thể và mục tiêu thực tế. Bạn chăm chỉ, kiên trì và có kỷ luật học tập. Hãy thử mở lòng với những phương pháp học khác lạ — chúng có thể mở ra khả năng mà bạn chưa khám phá.',
    love: 'Trong tình cảm, bạn thể hiện tình yêu qua sự chung thủy, trách nhiệm và những việc làm cụ thể. Bạn yêu một cách bền bỉ và đáng tin. Bạn cần một người hiểu rằng sự ít nói của bạn không phải là thiếu tình cảm, mà là cách bạn yêu thương một cách chân thật.',
    friendship: 'Bạn là người bạn thật thà và đáng tin cậy. Bạn ít lời nhưng lời hứa là lời vàng. Bạn bè quý bạn vì sự vững vàng, chính trực và luôn giúp đỡ khi cần. Tình bạn của bạn là sự tin cậy được xây qua năm tháng.',
    suggestion: 'Hãy cho phép mình trải nghiệm những điều chưa có trong kế hoạch — một chuyến đi không lịch trình, một sở thích mới lạ. Những khám phá này sẽ làm phong phú thế giới nội tâm của bạn, nơi bạn chưa dành nhiều thời gian khám phá.',
  },
  ESFP: {
    portrait:
      'Bạn là người yêu đời, sống trọn vẹn từng khoảnh khắc và lan tỏa năng lượng tích cực. Bạn có khả năng khiến những người xung quanh cảm thấy được chào đón và vui vẻ. Bạn học qua trải nghiệm thực tế hơn là lý thuyết suông.',
    strengths: ['Nhiệt huyết và vui vẻ', 'Thực tế', 'Giao tiếp tự nhiên', 'Linh hoạt', 'Tận hưởng hiện tại'],
    develop: ['Lên kế hoạch dài hạn', 'Đối diện với những vấn đề khó khăn thay vì né tránh', 'Cân bằng giữa niềm vui và trách nhiệm', 'Suy nghĩ trước khi hành động'],
    work: 'Trong công việc, bạn tỏa sáng ở những môi trường năng động, tương tác với con người và có hành động thực tế. Bạn làm việc tốt khi được tự do thể hiện cá tính và nhìn thấy kết quả ngay. Công việc quá thụ động và cô lập sẽ nhanh chóng làm bạn chán.',
    study: 'Bạn học tốt nhất qua thực hành, trải nghiệm và hình ảnh sinh động. Bạn tiếp thu nhanh khi bài học có hoạt động, có người hướng dẫn nhiệt tình. Hãy tìm cách biến việc học thành trải nghiệm thú vị, và rèn sự kiên nhẫn với những phần lý thuyết cần thiết.',
    love: 'Trong tình cảm, bạn yêu một cách nồng nhiệt, vui vẻ và luôn tạo niềm vui cho mối quan hệ. Bạn cần sự tự do và một người đồng hành cùng bạn tận hưởng cuộc sống. Tình yêu của bạn phát triển mạnh khi được chia sẻ những trải nghiệm ý nghĩa cùng nhau.',
    friendship: 'Bạn là linh hồn của những buổi tụ họp, người bạn vui vẻ và hào phóng. Bạn kết bạn dễ dàng vì sự chân thành và cởi mở. Bạn bè quý bạn vì bạn luôn khiến mọi người cảm thấy thoải mái và được đón nhận.',
    suggestion: 'Hãy thử dành một khoảng yên tĩnh mỗi ngày — chỉ lắng nghe chính mình thay vì lấp đầy bằng hoạt động. Những cảm xúc và suy nghĩ sâu bên dưới nụ cười cũng xứng đáng được bạn lắng nghe.',
  },
  ISFP: {
    portrait:
      'Bạn là người nhạy cảm, nghệ sĩ và sống thật với giá trị của mình. Bạn trân trọng cái đẹp ở những điều giản dị và thể hiện bản thân qua hành động hơn là lời nói. Thế giới của bạn giàu cảm xúc, nhưng bạn chọn chia sẻ nó một cách chọn lọc.',
    strengths: ['Nhạy cảm và tinh tế', 'Sáng tạo', 'Chân thật', 'Linh hoạt', 'Quan sát sâu sắc'],
    develop: ['Nói lên cảm xúc và nhu cầu', 'Không né tránh xung đột', 'Cam kết với mục tiêu dài hạn', 'Đừng quá khắt khe với bản thân'],
    work: 'Trong công việc, bạn phát huy tốt khi làm việc phản ánh giá trị và cho phép bạn sáng tạo theo cách riêng. Bạn làm việc hiệu quả nhất trong môi trường tôn trọng cá tính, không quá gò bó. Bạn cần thấy công việc của mình có ý nghĩa và chạm đến con người.',
    study: 'Bạn học tốt qua thực hành, hình ảnh và khi kiến thức chạm đến cảm xúc của bạn. Bạn học những gì mình yêu thích rất nhanh. Hãy kiên nhẫn với những môn bạn chưa thấy hứng thú, vì chúng có thể mở ra những khả năng mới.',
    love: 'Trong tình cảm, bạn yêu sâu và chân thật nhưng có thể ngại thể hiện bằng lời. Bạn yêu bằng sự quan tâm tinh tế và những hành động ý nghĩa. Bạn cần một người kiên nhẫn, không phán xét, đủ tinh tế để cảm nhận được tình yêu qua những gì bạn không nói ra.',
    friendship: 'Bạn là người bạn dễ gần và chân thành. Bạn không cần nhiều bạn, nhưng với những người thân, bạn luôn lắng nghe và thấu hiểu. Bạn bè cảm thấy được an toàn khi ở bên bạn vì bạn không phán xét.',
    suggestion: 'Hãy dành thời gian làm điều gì đó sáng tạo chỉ vì niềm vui của bạn — vẽ, viết, nấu ăn hay chụp ảnh. Đó là cách bạn kết nối lại với phần nghệ sĩ và cảm xúc sâu bên trong mình.',
  },
  ESTP: {
    portrait:
      'Bạn là người sống nhanh, hành động thực tế và luôn sẵn sàng đối mặt với thử thách. Bạn có năng lực quan sát sắc bén và phản ứng nhanh nhạy trong mọi tình huống. Bạn học bằng cách làm và thăng hoa khi được tự do vận động.',
    strengths: ['Táo bạo và dũng cảm', 'Thực tế', 'Nhạy bén', 'Linh hoạt ứng biến', 'Năng động'],
    develop: ['Nghĩ đến hậu quả dài hạn', 'Kiên nhẫn với những việc chậm', 'Chú ý đến cảm xúc người khác', 'Cam kết lâu dài'],
    work: 'Trong công việc, bạn tỏa sáng ở những môi trường năng động, hành động nhanh và giải quyết vấn đề trực tiếp. Bạn làm tốt ở vai trò cần sự nhanh nhạy, đàm phán, vận hành hoặc đối mặt với tình huống thực tế. Bạn dễ chán với công việc lặp lại và cần thử thách thường xuyên.',
    study: 'Bạn học tốt nhất qua thực hành, thử nghiệm và trải nghiệm thực tế. Lý thuyết trừu tượng khó giữ chân bạn, nhưng bạn lại rất giỏi khi được áp dụng ngay. Hãy tìm cách biến việc học thành thử thách cụ thể để kích thích sự hứng thú của bạn.',
    love: 'Trong tình cảm, bạn yêu một cách sôi nổi, trực tiếp và đầy năng lượng. Bạn cần sự tự do và một người đồng hành thú vị, không ràng buộc quá chặt. Khi bạn cam kết, bạn rất bảo vệ và trung thành theo cách thực tế.',
    friendship: 'Bạn là người bạn vui vẻ, phiêu lưu và luôn sẵn sàng cho những trải nghiệm mới. Bạn kết bạn nhanh vì sự cởi mở. Bạn bè thích ở bên bạn vì cuộc sống quanh bạn luôn sinh động và thú vị.',
    suggestion: 'Hãy thử một điều đòi hỏi sự kiên nhẫn và chiều sâu mà bạn thường tránh — học một kỹ năng phức tạp, đọc một cuốn sách dài hoặc lắng nghe ai đó trọn vẹn. Bạn có thể khám phá ra một sức mạnh mới bên trong mình.',
  },
  ISTP: {
    portrait:
      'Bạn là người thực tế, điềm tĩnh và có kỹ năng ứng dụng xuất sắc. Bạn thích hiểu cách mọi thứ vận hành bằng cách trực tiếp trải nghiệm. Bạn độc lập, không cần nhiều lời hoa mỹ, và luôn giữ được sự bình tĩnh trong những tình huống căng thẳng.',
    strengths: ['Tư duy thực tế', 'Khéo tay và kỹ thuật', 'Điềm tĩnh trong khủng hoảng', 'Độc lập', 'Linh hoạt'],
    develop: ['Chia sẻ cảm xúc nhiều hơn', 'Cam kết với mối quan hệ và mục tiêu', 'Đừng cô lập khi gặp vấn đề', 'Chú ý đến con người, không chỉ sự vật'],
    work: 'Trong công việc, bạn là người giải quyết vấn đề bằng kỹ năng thực tế. Bạn tỏa sáng ở những nơi cần tay nghề, kỹ thuật, xử lý tình huống và tự do vận hành. Bạn làm việc tốt nhất khi được tin tưởng giao việc và tự do tìm ra cách làm hiệu quả.',
    study: 'Bạn học tốt nhất khi được thực hành trực tiếp và thấy kiến thức có ứng dụng. Bạn giỏi lĩnh hội qua thao tác, sửa chữa, thử nghiệm. Hãy kiên nhẫn với phần lý thuyết nền tảng — chúng sẽ làm cho kỹ năng của bạn vững hơn rất nhiều.',
    love: 'Trong tình cảm, bạn thể hiện tình yêu qua hành động và sự đồng hành hơn là lời ngọt ngào. Bạn cần sự tự do và một người hiểu rằng sự ít nói của bạn là bản chất, không phải sự thờ ơ. Khi bạn chọn cam kết, bạn rất trung thành và thực tế trong việc chăm lo cho người mình yêu.',
    friendship: 'Bạn là người bạn thú vị vì sự điềm tĩnh và những kỹ năng thực tế bạn mang lại. Bạn không cần trò chuyện nhiều để có một tình bạn tốt. Bạn bè quý bạn vì sự đáng tin và khả năng luôn có cách xử lý trong mọi tình huống.',
    suggestion: 'Hãy thử kết nối với cảm xúc của mình qua viết nhật ký hoặc nghệ thuật — điều bạn thường để sang một bên. Những cảm xúc bên dưới sự điềm tĩnh cũng là một phần quan trọng của con người bạn, đáng được bạn thấu hiểu.',
  },
};