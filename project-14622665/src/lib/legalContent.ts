// Nội dung các trang chính sách pháp lý (dựa trên tài liệu chính thức của The Mystic Room)

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'subheading'; text: string };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  subtitle: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
}

const CONTACT_ITEMS = ['Email: tmysticroom@gmail.com', 'Website: themysticrooms.com'];

export const privacyPolicy: LegalDoc = {
  title: 'Chính Sách Bảo Mật',
  subtitle: 'The Mystic Room — Nơi phép màu thuộc về bạn',
  updated: '22/09/2026',
  intro: [
    'Tại The Mystic Room, chúng tôi tôn trọng quyền riêng tư và sự tin tưởng của mỗi người.',
    'Chúng tôi hiểu rằng những thông tin bạn chia sẻ trong quá trình khám phá bản thân là một phần trong câu chuyện cá nhân của bạn. Vì vậy, chúng tôi cam kết thu thập, sử dụng và bảo vệ dữ liệu của bạn một cách minh bạch, có trách nhiệm và phù hợp với mục đích cung cấp trải nghiệm trên nền tảng.',
    'Chính sách bảo mật này giải thích cách The Mystic Room thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn truy cập và sử dụng nền tảng.',
  ],
  sections: [
    {
      heading: '2. Thông tin chúng tôi thu thập',
      blocks: [
        { type: 'p', text: 'Để cung cấp trải nghiệm cá nhân hóa, The Mystic Room có thể thu thập các nhóm thông tin sau:' },
        { type: 'subheading', text: '2.1. Thông tin tài khoản' },
        { type: 'p', text: 'Khi bạn tạo tài khoản hoặc sử dụng các tính năng lưu trữ kết quả, chúng tôi có thể thu thập:' },
        {
          type: 'list',
          items: [
            'Họ tên hoặc tên hiển thị.',
            'Địa chỉ email.',
            'Thông tin đăng nhập.',
            'Các thông tin khác mà bạn chủ động cung cấp trong quá trình sử dụng dịch vụ.',
          ],
        },
        { type: 'subheading', text: '2.2. Thông tin trải nghiệm cá nhân' },
        { type: 'p', text: 'Trong quá trình khám phá trên The Mystic Room, bạn có thể cung cấp các thông tin phục vụ cho việc tạo trải nghiệm cá nhân hóa, bao gồm:' },
        {
          type: 'list',
          items: [
            'Câu trả lời trong các bài trắc nghiệm tính cách.',
            'Ngày sinh và các thông tin liên quan được bạn cung cấp để tạo trải nghiệm Birth Chart hoặc Numerology.',
            'Các lựa chọn, tương tác hoặc dữ liệu được tạo ra trong quá trình sử dụng các trải nghiệm trên nền tảng.',
            'Kết quả khám phá cá nhân của bạn.',
          ],
        },
        { type: 'p', text: 'Những thông tin này được sử dụng nhằm tạo ra các nội dung phản chiếu phù hợp với trải nghiệm của từng người.' },
        { type: 'subheading', text: '2.3. Thông tin kỹ thuật' },
        { type: 'p', text: 'Khi bạn truy cập website, chúng tôi có thể tự động thu thập một số thông tin kỹ thuật như:' },
        {
          type: 'list',
          items: [
            'Loại thiết bị truy cập.',
            'Trình duyệt.',
            'Hệ điều hành.',
            'Địa chỉ IP.',
            'Dữ liệu về cách bạn tương tác với nền tảng.',
          ],
        },
        { type: 'p', text: 'Những thông tin này giúp chúng tôi cải thiện hiệu suất, giao diện và trải nghiệm người dùng.' },
      ],
    },
    {
      heading: '3. Cách chúng tôi sử dụng thông tin',
      blocks: [
        { type: 'p', text: 'The Mystic Room sử dụng thông tin của bạn cho các mục đích sau:' },
        { type: 'subheading', text: 'Cung cấp trải nghiệm cá nhân hóa' },
        { type: 'p', text: 'Dữ liệu bạn cung cấp được sử dụng để tạo ra các nội dung, kết quả và trải nghiệm phù hợp với thông tin bạn đã chia sẻ.' },
        { type: 'subheading', text: 'Lưu giữ hành trình khám phá' },
        { type: 'p', text: 'Thông tin tài khoản giúp bạn lưu lại kết quả, truy cập lại trải nghiệm và quản lý hành trình cá nhân trên nền tảng.' },
        { type: 'subheading', text: 'Cải thiện sản phẩm và trải nghiệm' },
        { type: 'p', text: 'Chúng tôi phân tích dữ liệu sử dụng ở mức tổng hợp để cải thiện giao diện, tính năng và chất lượng dịch vụ.' },
        { type: 'subheading', text: 'Hỗ trợ người dùng' },
        { type: 'p', text: 'Thông tin được sử dụng để phản hồi các câu hỏi, hỗ trợ kỹ thuật hoặc xử lý các vấn đề liên quan đến tài khoản.' },
        { type: 'subheading', text: 'Gửi thông tin cập nhật' },
        { type: 'p', text: 'The Mystic Room có thể gửi thông báo về tính năng mới hoặc nội dung liên quan nếu bạn đồng ý nhận thông tin từ chúng tôi. Bạn có thể hủy đăng ký nhận email bất kỳ lúc nào.' },
      ],
    },
    {
      heading: '4. Cam kết bảo vệ thông tin',
      blocks: [
        { type: 'p', text: 'The Mystic Room cam kết:' },
        {
          type: 'list',
          items: [
            'Không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.',
            'Không sử dụng dữ liệu cá nhân để đưa ra đánh giá tuyệt đối, gắn nhãn hoặc định nghĩa con người bạn.',
            'Không xem các trải nghiệm trên nền tảng như một công cụ thay thế cho tư vấn chuyên môn về tâm lý, y tế, pháp lý hoặc tài chính.',
          ],
        },
        { type: 'p', text: 'Các trải nghiệm như trắc nghiệm tính cách, Birth Chart, Numerology hoặc Tarot Reflection được tạo ra nhằm mục đích khám phá, suy ngẫm và cung cấp thêm góc nhìn cá nhân.' },
      ],
    },
    {
      heading: '5. Chia sẻ thông tin với bên thứ ba',
      blocks: [
        { type: 'p', text: 'The Mystic Room chỉ chia sẻ thông tin cá nhân trong các trường hợp cần thiết, bao gồm:' },
        { type: 'subheading', text: 'Nhà cung cấp dịch vụ hỗ trợ vận hành' },
        { type: 'p', text: 'Chúng tôi có thể sử dụng các bên thứ ba để hỗ trợ vận hành website như:' },
        {
          type: 'list',
          items: [
            'Dịch vụ lưu trữ dữ liệu.',
            'Hệ thống gửi email.',
            'Công cụ phân tích website.',
            'Các nền tảng hỗ trợ kỹ thuật.',
          ],
        },
        { type: 'p', text: 'Các bên này chỉ được phép xử lý thông tin trong phạm vi cần thiết để cung cấp dịch vụ.' },
        { type: 'subheading', text: 'Yêu cầu pháp lý' },
        { type: 'p', text: 'Thông tin có thể được cung cấp khi có yêu cầu hợp pháp từ cơ quan có thẩm quyền theo quy định pháp luật.' },
        { type: 'subheading', text: 'Khi có sự đồng ý của bạn' },
        { type: 'p', text: 'Chúng tôi chỉ chia sẻ thông tin khác khi bạn chủ động cho phép.' },
      ],
    },
    {
      heading: '6. Quyền của bạn đối với dữ liệu cá nhân',
      blocks: [
        { type: 'p', text: 'Bạn có quyền:' },
        {
          type: 'list',
          items: [
            'Truy cập thông tin cá nhân của mình.',
            'Yêu cầu chỉnh sửa thông tin không chính xác.',
            'Yêu cầu xóa tài khoản hoặc dữ liệu cá nhân.',
            'Từ chối nhận các thông tin marketing từ The Mystic Room.',
          ],
        },
        { type: 'p', text: 'Để thực hiện các quyền trên, bạn có thể liên hệ với chúng tôi qua thông tin ở cuối trang.' },
      ],
    },
    {
      heading: '7. Cookie và công nghệ theo dõi',
      blocks: [
        { type: 'p', text: 'The Mystic Room có thể sử dụng Cookie và các công nghệ tương tự để:' },
        {
          type: 'list',
          items: [
            'Ghi nhớ trạng thái đăng nhập.',
            'Cải thiện tốc độ và trải nghiệm website.',
            'Hiểu cách người dùng tương tác với nền tảng.',
          ],
        },
        { type: 'p', text: 'Bạn có thể điều chỉnh cài đặt Cookie thông qua trình duyệt của mình.' },
      ],
    },
    {
      heading: '8. Quyền riêng tư của trẻ em',
      blocks: [
        { type: 'p', text: 'The Mystic Room không hướng đến việc thu thập dữ liệu cá nhân của trẻ em dưới độ tuổi được pháp luật quy định.' },
        { type: 'p', text: 'Nếu phát hiện dữ liệu được cung cấp bởi người dùng chưa đủ độ tuổi phù hợp mà không có sự đồng ý cần thiết từ phụ huynh hoặc người giám hộ, chúng tôi sẽ xem xét và xử lý theo quy định.' },
      ],
    },
    {
      heading: '9. Cập nhật chính sách bảo mật',
      blocks: [
        { type: 'p', text: 'The Mystic Room có thể cập nhật Chính Sách Bảo Mật này theo thời gian nhằm phản ánh những thay đổi trong hoạt động vận hành hoặc yêu cầu pháp lý.' },
        { type: 'p', text: 'Phiên bản cập nhật mới nhất sẽ luôn được hiển thị trên trang này.' },
      ],
    },
    {
      heading: '10. Liên hệ',
      blocks: [
        { type: 'p', text: 'Nếu bạn có câu hỏi về Chính Sách Bảo Mật hoặc muốn thực hiện quyền liên quan đến dữ liệu cá nhân, vui lòng liên hệ:' },
        { type: 'list', items: CONTACT_ITEMS },
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: 'Điều Khoản Dịch Vụ',
  subtitle: 'The Mystic Room — Nơi phép màu thuộc về bạn',
  updated: '22/09/2026',
  intro: [
    'Chào mừng bạn đến với The Mystic Room — nền tảng khám phá bản thân giúp bạn nhìn nhận chính mình qua nhiều góc nhìn khác nhau.',
    'Bằng việc truy cập website, tạo tài khoản, sử dụng dịch vụ hoặc mua sản phẩm từ The Mystic Room, bạn xác nhận rằng mình đã đọc, hiểu và đồng ý với các Điều Khoản Dịch Vụ dưới đây. Nếu bạn không đồng ý với bất kỳ nội dung nào, vui lòng ngừng sử dụng dịch vụ.',
  ],
  sections: [
    {
      heading: '1. Giới thiệu',
      blocks: [
        { type: 'p', text: 'The Mystic Room là nền tảng khám phá bản thân, được tạo ra để giúp người dùng nhìn nhận bản thân qua nhiều góc nhìn khác nhau thông qua các trải nghiệm cá nhân hóa.' },
        { type: 'p', text: 'Nền tảng cung cấp các trải nghiệm như Mystic Mirror, Moon Window, Numerology và Tarot Table, cùng các nội dung phân tích chuyên sâu và sản phẩm cá nhân hóa nhằm hỗ trợ bạn trong hành trình suy ngẫm, khám phá và kết nối với câu chuyện riêng của mình.' },
        { type: 'subheading', text: 'Triết lý của The Mystic Room' },
        { type: 'p', text: 'Chúng tôi không định nghĩa bạn là ai, không đưa ra quyết định thay bạn và không tạo ra những khuôn mẫu cố định về con người bạn. Chúng tôi chỉ mở ra những góc nhìn để bạn tự khám phá chính mình.' },
      ],
    },
    {
      heading: '2. Phạm vi dịch vụ',
      blocks: [
        { type: 'p', text: 'The Mystic Room cung cấp các trải nghiệm khám phá bản thân và sản phẩm cá nhân hóa, bao gồm:' },
        { type: 'subheading', text: '2.1. Mystic Mirror' },
        { type: 'p', text: 'Mystic Mirror là trải nghiệm trắc nghiệm tính cách lấy cảm hứng từ các mô hình khám phá tính cách phổ biến. Thông qua các câu hỏi và lựa chọn của người dùng, hệ thống tạo ra những góc nhìn về xu hướng suy nghĩ, cách phản ứng, cảm xúc và cách bạn kết nối với thế giới xung quanh.' },
        { type: 'subheading', text: '2.2. Moon Window' },
        { type: 'p', text: 'Moon Window là trải nghiệm khám phá bản đồ sao cá nhân dựa trên thông tin người dùng cung cấp như ngày sinh, giờ sinh và nơi sinh.' },
        { type: 'p', text: 'Dịch vụ bao gồm:' },
        {
          type: 'list',
          items: [
            'Nội dung khám phá cơ bản được cung cấp trên nền tảng.',
            'Phân tích chuyên sâu Bản đồ sao có trả phí với nội dung mở rộng và góc nhìn chi tiết.',
          ],
        },
        { type: 'subheading', text: '2.3. Numerology — Thần số học' },
        { type: 'p', text: 'Numerology cung cấp những góc nhìn cá nhân dựa trên thông tin ngày sinh hoặc dữ liệu mà người dùng cung cấp.' },
        { type: 'p', text: 'Dịch vụ bao gồm:' },
        {
          type: 'list',
          items: [
            'Các nội dung khám phá cơ bản.',
            'Báo cáo phân tích chuyên sâu có trả phí với các diễn giải mở rộng.',
          ],
        },
        { type: 'subheading', text: '2.4. Tarot Table' },
        { type: 'p', text: 'Tarot Table là trải nghiệm sử dụng biểu tượng Tarot như một công cụ phản chiếu và suy ngẫm. Nội dung Tarot không nhằm mục đích dự đoán chắc chắn tương lai hoặc đưa ra câu trả lời tuyệt đối cho các quyết định cá nhân.' },
        { type: 'subheading', text: '2.5. Vật phẩm cá nhân hóa' },
        { type: 'p', text: 'The Mystic Room cung cấp các sản phẩm vòng tay hoặc vật phẩm cá nhân hóa dựa trên thông tin, lựa chọn và câu chuyện mà người dùng chia sẻ trong hành trình khám phá.' },
        { type: 'p', text: 'Các sản phẩm này mang ý nghĩa biểu tượng, thẩm mỹ và cá nhân, giúp người dùng lưu giữ một dấu mốc hoặc lời nhắc nhở dành riêng cho bản thân.' },
        { type: 'p', text: 'The Mystic Room không tuyên bố rằng vòng tay, đá hoặc phụ kiện có khả năng chữa bệnh, thay đổi vận mệnh hoặc tạo ra tác động siêu nhiên được đảm bảo.' },
      ],
    },
    {
      heading: '3. Tài khoản và thông tin người dùng',
      blocks: [
        { type: 'p', text: 'Một số tính năng trên The Mystic Room có thể yêu cầu người dùng tạo tài khoản.' },
        { type: 'p', text: 'Khi sử dụng tài khoản, bạn đồng ý:' },
        {
          type: 'list',
          items: [
            'Cung cấp thông tin chính xác và cập nhật.',
            'Bảo vệ thông tin đăng nhập cá nhân.',
            'Không chia sẻ tài khoản cho người khác sử dụng trái phép.',
            'Chịu trách nhiệm đối với hoạt động phát sinh từ tài khoản của mình.',
          ],
        },
        { type: 'p', text: 'Đối với các trải nghiệm cá nhân hóa, người dùng có trách nhiệm cung cấp thông tin đầu vào phù hợp. Các kết quả từ Bản đồ sao, Thần số học hoặc những trải nghiệm liên quan có thể bị ảnh hưởng nếu thông tin được cung cấp không chính xác.' },
      ],
    },
    {
      heading: '4. Tính chất của nội dung khám phá bản thân',
      blocks: [
        { type: 'p', text: 'Các nội dung trên The Mystic Room được tạo ra nhằm mục đích:' },
        { type: 'list', items: ['Khám phá bản thân.', 'Cung cấp góc nhìn tham khảo.', 'Khuyến khích sự suy ngẫm cá nhân.'] },
        { type: 'p', text: 'Các trải nghiệm như Mystic Mirror, Moon Window, Numerology và Tarot Table:' },
        {
          type: 'list',
          items: [
            'Không phải là đánh giá tuyệt đối về con người bạn.',
            'Không dùng để gắn nhãn hoặc giới hạn khả năng của bạn.',
            'Không dự đoán chắc chắn tương lai.',
            'Không thay thế tư vấn chuyên môn về tâm lý, y tế, pháp lý, tài chính hoặc các lĩnh vực chuyên môn khác.',
          ],
        },
        { type: 'p', text: 'Mọi quyết định trong cuộc sống vẫn thuộc về sự lựa chọn và trách nhiệm của chính người dùng.' },
      ],
    },
    {
      heading: '5. Nội dung trả phí và dịch vụ chuyên sâu',
      blocks: [
        { type: 'p', text: 'The Mystic Room có thể cung cấp các nội dung trả phí bao gồm:' },
        { type: 'list', items: ['Phân tích chuyên sâu Bản đồ sao.', 'Phân tích chuyên sâu Thần số học.', 'Các nội dung cá nhân hóa khác được giới thiệu trên nền tảng.'] },
        { type: 'p', text: 'Trước khi thanh toán, người dùng sẽ được cung cấp thông tin về:' },
        { type: 'list', items: ['Nội dung dịch vụ.', 'Giá bán.', 'Phạm vi cung cấp.', 'Phương thức nhận kết quả.'] },
        { type: 'p', text: 'Sau khi giao dịch hoàn tất, người dùng được quyền truy cập và sử dụng nội dung đã mua cho mục đích cá nhân.' },
        { type: 'p', text: 'Các nội dung số được cá nhân hóa có thể có chính sách hoàn tiền hoặc hủy riêng theo Chính Sách Hoàn Tiền được công bố trên website.' },
      ],
    },
    {
      heading: '6. Thanh toán',
      blocks: [
        { type: 'p', text: 'Khi thực hiện giao dịch trên The Mystic Room, người dùng cam kết:' },
        {
          type: 'list',
          items: [
            'Cung cấp thông tin thanh toán chính xác.',
            'Sử dụng phương thức thanh toán hợp pháp.',
            'Kiểm tra thông tin trước khi xác nhận giao dịch.',
          ],
        },
        { type: 'p', text: 'Thanh toán có thể được xử lý thông qua các đơn vị cung cấp dịch vụ thanh toán bên thứ ba.' },
        { type: 'p', text: 'The Mystic Room không chịu trách nhiệm đối với các vấn đề phát sinh từ hệ thống thanh toán nằm ngoài phạm vi kiểm soát trực tiếp của chúng tôi.' },
        { type: 'p', text: 'Trong trường hợp xảy ra lỗi giao dịch, người dùng có thể liên hệ với The Mystic Room để được hỗ trợ kiểm tra.' },
      ],
    },
    {
      heading: '7. AI và nội dung cá nhân hóa',
      blocks: [
        { type: 'p', text: 'Một số trải nghiệm trên The Mystic Room có thể sử dụng công nghệ AI nhằm hỗ trợ tạo ra nội dung phù hợp hơn dựa trên thông tin người dùng cung cấp.' },
        { type: 'p', text: 'Các nội dung được tạo bởi AI:' },
        { type: 'list', items: ['Mang tính tham khảo và cá nhân hóa trải nghiệm.', 'Không phải là đánh giá chuyên môn.', 'Không đại diện cho kết luận chính thức về con người người dùng.'] },
        { type: 'p', text: 'The Mystic Room luôn hướng đến việc sử dụng công nghệ như một công cụ hỗ trợ quá trình khám phá bản thân.' },
      ],
    },
    {
      heading: '8. Quyền và trách nhiệm của người dùng',
      blocks: [
        { type: 'p', text: 'Người dùng có quyền:' },
        { type: 'list', items: ['Trải nghiệm các tính năng được cung cấp trên nền tảng.', 'Truy cập các nội dung đã mua.', 'Sử dụng kết quả cá nhân cho mục đích cá nhân.'] },
        { type: 'p', text: 'Người dùng không được:' },
        {
          type: 'list',
          items: [
            'Sao chép, bán lại hoặc phân phối nội dung trả phí.',
            'Sao chép hệ thống, câu hỏi, nội dung phân tích hoặc thiết kế của The Mystic Room.',
            'Can thiệp vào hoạt động kỹ thuật của website.',
            'Sử dụng dịch vụ cho mục đích trái pháp luật.',
          ],
        },
      ],
    },
    {
      heading: '9. Quyền sở hữu trí tuệ',
      blocks: [
        { type: 'p', text: 'Các tài sản thuộc The Mystic Room bao gồm:' },
        {
          type: 'list',
          items: [
            'Tên thương hiệu.',
            'Logo.',
            'Hình ảnh.',
            'Thiết kế giao diện.',
            'Nội dung website.',
            'Hệ thống câu hỏi.',
            'Cách trình bày và nội dung phân tích được xây dựng.',
          ],
        },
        { type: 'p', text: 'Các mô hình hoặc hệ thống nền tảng bên ngoài như các mô hình tính cách, chiêm tinh học, Numerology hoặc Tarot không thuộc quyền sở hữu độc quyền của The Mystic Room.' },
        { type: 'p', text: 'The Mystic Room sở hữu cách thể hiện, nội dung biên soạn, thiết kế và trải nghiệm được xây dựng trên nền tảng.' },
      ],
    },
    {
      heading: '10. Giới hạn trách nhiệm',
      blocks: [
        { type: 'p', text: 'The Mystic Room luôn cố gắng duy trì chất lượng dịch vụ và trải nghiệm tốt nhất cho người dùng. Tuy nhiên:' },
        {
          type: 'list',
          items: [
            'Nội dung trên nền tảng chỉ mang tính tham khảo và phản chiếu cá nhân.',
            'The Mystic Room không chịu trách nhiệm đối với các quyết định được người dùng đưa ra dựa trên cách hiểu hoặc áp dụng cá nhân từ nội dung trải nghiệm.',
            'Website có thể gặp gián đoạn do các yếu tố kỹ thuật, bảo trì hoặc sự cố ngoài khả năng kiểm soát.',
          ],
        },
      ],
    },
    {
      heading: '11. Dịch vụ bên thứ ba',
      blocks: [
        { type: 'p', text: 'Website có thể chứa liên kết hoặc tích hợp với các dịch vụ bên ngoài như nền tảng thanh toán hoặc mạng xã hội.' },
        { type: 'p', text: 'The Mystic Room không kiểm soát và không chịu trách nhiệm về nội dung, chính sách hoặc hoạt động của các dịch vụ bên thứ ba.' },
      ],
    },
    {
      heading: '12. Thay đổi dịch vụ',
      blocks: [
        { type: 'p', text: 'The Mystic Room có quyền cập nhật, điều chỉnh hoặc mở rộng dịch vụ nhằm cải thiện trải nghiệm người dùng.' },
        { type: 'p', text: 'Các thay đổi quan trọng có thể được thông báo trên website hoặc thông qua các kênh liên hệ phù hợp.' },
      ],
    },
    {
      heading: '13. Thay đổi Điều Khoản Dịch Vụ',
      blocks: [
        { type: 'p', text: 'The Mystic Room có thể cập nhật Điều Khoản Dịch Vụ theo thời gian.' },
        { type: 'p', text: 'Phiên bản mới nhất sẽ được đăng tải trên website cùng ngày cập nhật.' },
        { type: 'p', text: 'Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được thay đổi đồng nghĩa với việc bạn chấp nhận phiên bản cập nhật.' },
      ],
    },
    {
      heading: '14. Liên hệ',
      blocks: [
        { type: 'p', text: 'Nếu bạn có câu hỏi liên quan đến Điều Khoản Dịch Vụ, vui lòng liên hệ:' },
        { type: 'list', items: CONTACT_ITEMS },
      ],
    },
  ],
};

export const refundPolicy: LegalDoc = {
  title: 'Chính Sách Hoàn Tiền',
  subtitle: 'The Mystic Room — Nơi phép màu thuộc về bạn',
  updated: '22/09/2026',
  intro: [
    'Tại The Mystic Room, chúng tôi tin rằng mỗi hành trình khám phá bản thân đều mang một câu chuyện riêng. Các trải nghiệm và sản phẩm cá nhân hóa được tạo ra với mong muốn giúp bạn kết nối sâu hơn với chính mình, thông qua những góc nhìn phản chiếu và những dấu ấn mang ý nghĩa cá nhân.',
    'Chính sách này áp dụng cho các nội dung kỹ thuật số trả phí, sản phẩm cá nhân hóa và các dịch vụ được cung cấp trên nền tảng The Mystic Room.',
    'Bằng việc thực hiện giao dịch trên website, bạn xác nhận đã đọc, hiểu và đồng ý với các điều khoản được quy định trong chính sách này.',
  ],
  sections: [
    {
      heading: '1. Giới thiệu',
      blocks: [
        { type: 'p', text: 'Tại The Mystic Room, chúng tôi hiểu rằng mỗi giao dịch không chỉ là một sản phẩm hoặc dịch vụ, mà còn gắn liền với kỳ vọng và trải nghiệm riêng của từng người dùng. Vì vậy, Chính Sách Hoàn Tiền này được xây dựng nhằm đảm bảo sự minh bạch, rõ ràng và cân bằng quyền lợi giữa bạn và The Mystic Room.' },
        { type: 'p', text: 'Chính sách này áp dụng cho các nội dung kỹ thuật số trả phí, sản phẩm cá nhân hóa và các dịch vụ được cung cấp trên nền tảng The Mystic Room.' },
      ],
    },
    {
      heading: '2. Chính sách hoàn tiền đối với nội dung kỹ thuật số',
      blocks: [
        { type: 'p', text: 'Các nội dung kỹ thuật số trả phí tại The Mystic Room bao gồm:' },
        {
          type: 'list',
          items: [
            'Moon Window – Birth Chart chuyên sâu: Phân tích bản đồ sao cá nhân dựa trên thông tin ngày sinh, giờ sinh và nơi sinh do người dùng cung cấp.',
            'Numerology chuyên sâu: Phân tích các chỉ số cá nhân dựa trên thông tin ngày sinh và dữ liệu liên quan.',
            'Các báo cáo hoặc nội dung cá nhân hóa kỹ thuật số khác được cung cấp trên nền tảng.',
          ],
        },
        { type: 'subheading', text: '2.1. Đặc điểm của nội dung cá nhân hóa' },
        { type: 'p', text: 'Các nội dung kỹ thuật số tại The Mystic Room được tạo ra dựa trên dữ liệu riêng của từng người dùng.' },
        { type: 'p', text: 'Trước khi hoàn tất thanh toán, người dùng có trách nhiệm kiểm tra kỹ các thông tin đã cung cấp, bao gồm nhưng không giới hạn:' },
        { type: 'list', items: ['Họ tên.', 'Ngày, tháng, năm sinh.', 'Giờ sinh.', 'Nơi sinh.', 'Email nhận kết quả.'] },
        { type: 'p', text: 'Do đặc điểm của nội dung kỹ thuật số cá nhân hóa, sau khi hệ thống bắt đầu xử lý và tạo kết quả dựa trên dữ liệu của người dùng, nội dung này không thể thu hồi hoặc tái sử dụng cho một người dùng khác.' },
        { type: 'p', text: 'Vì vậy, yêu cầu hoàn tiền đối với nội dung đã được tạo thành công theo đúng thông tin người dùng cung cấp có thể không được áp dụng.' },
        { type: 'p', text: 'Các nội dung phân tích trên The Mystic Room được xây dựng nhằm mục đích khám phá, chiêm nghiệm và tham khảo cá nhân. Việc người dùng có góc nhìn khác với nội dung được cung cấp không được xem là lỗi dịch vụ nếu hệ thống đã thực hiện đúng theo thông tin đầu vào.' },
        { type: 'subheading', text: '2.2. Các trường hợp được xem xét hỗ trợ hoàn tiền' },
        { type: 'p', text: 'The Mystic Room luôn sẵn sàng xem xét hỗ trợ trong các trường hợp:' },
        { type: 'subheading', text: 'Lỗi thanh toán' },
        { type: 'list', items: ['Người dùng bị trừ tiền nhiều lần cho cùng một giao dịch do lỗi hệ thống hoặc lỗi xử lý thanh toán.'] },
        { type: 'subheading', text: 'Không nhận được nội dung' },
        { type: 'list', items: ['Người dùng đã thanh toán thành công nhưng không nhận được báo cáo, kết quả hoặc quyền truy cập dịch vụ do lỗi từ hệ thống.'] },
        { type: 'subheading', text: 'Lỗi kỹ thuật từ nền tảng' },
        { type: 'list', items: ['Nội dung không thể hiển thị, không thể truy cập hoặc xảy ra lỗi nghiêm trọng khiến dịch vụ không thể được cung cấp đúng như mô tả.'] },
        { type: 'subheading', text: 'Các trường hợp đặc biệt khác' },
        { type: 'list', items: ['The Mystic Room có thể xem xét từng trường hợp cụ thể nhằm đảm bảo trải nghiệm hợp lý cho người dùng.'] },
      ],
    },
    {
      heading: '3. Chính sách hoàn tiền đối với vòng tay và sản phẩm cá nhân hóa',
      blocks: [
        { type: 'p', text: 'The Mystic Room cung cấp các sản phẩm cá nhân hóa như:' },
        { type: 'list', items: ['Vòng tay cá nhân hóa.', 'Charm.', 'Các vật phẩm mang dấu ấn cá nhân.'] },
        { type: 'p', text: 'Mỗi sản phẩm được thiết kế dựa trên những lựa chọn riêng của người dùng như kiểu dáng, màu sắc, chất liệu, phụ kiện hoặc ý nghĩa cá nhân mà bạn mong muốn lưu giữ.' },
        { type: 'p', text: 'Do đặc điểm của sản phẩm cá nhân hóa, mỗi đơn hàng có thể trải qua quá trình chuẩn bị, thiết kế và chế tác.' },
        { type: 'p', text: 'Người dùng có trách nhiệm kiểm tra kỹ thông tin đơn hàng trước khi xác nhận đặt hàng.' },
        { type: 'subheading', text: '3.1. Các trường hợp không áp dụng hoàn tiền' },
        { type: 'p', text: 'The Mystic Room không áp dụng hoàn tiền trong các trường hợp:' },
        {
          type: 'list',
          items: [
            'Người dùng thay đổi quyết định sau khi sản phẩm đã bắt đầu quá trình thiết kế hoặc chế tác.',
            'Người dùng không yêu thích sản phẩm do cảm nhận hoặc sở thích cá nhân.',
            'Sản phẩm có sự khác biệt nhỏ về màu sắc, vân, độ trong hoặc đặc điểm tự nhiên của vật liệu.',
            'Những khác biệt nhỏ phát sinh từ quá trình chế tác thủ công tạo nên tính độc bản của sản phẩm.',
          ],
        },
        { type: 'subheading', text: '3.2. Các trường hợp được hỗ trợ đổi, sửa hoặc hoàn tiền' },
        { type: 'p', text: 'The Mystic Room có thể hỗ trợ xử lý trong các trường hợp:' },
        { type: 'subheading', text: 'Lỗi sản xuất' },
        { type: 'list', items: ['Sản phẩm bị lỗi về kết cấu.', 'Sản phẩm không đúng với thiết kế hoặc thông tin đơn hàng đã được xác nhận.'] },
        { type: 'subheading', text: 'Hư hỏng trong quá trình vận chuyển' },
        { type: 'list', items: ['Sản phẩm bị hư hỏng khi nhận.'] },
        { type: 'p', text: 'Người dùng vui lòng cung cấp hình ảnh hoặc video thể hiện tình trạng sản phẩm để The Mystic Room kiểm tra và hỗ trợ.' },
        { type: 'subheading', text: 'Sai thông tin đơn hàng' },
        { type: 'list', items: ['Sản phẩm nhận được không đúng với đơn hàng đã xác nhận.'] },
      ],
    },
    {
      heading: '4. Điều kiện gửi yêu cầu hoàn tiền',
      blocks: [
        { type: 'p', text: 'Để The Mystic Room có thể kiểm tra và xử lý yêu cầu, người dùng vui lòng cung cấp:' },
        {
          type: 'list',
          items: [
            'Họ tên người đặt hàng.',
            'Email hoặc thông tin liên hệ được sử dụng khi mua hàng.',
            'Mã đơn hàng.',
            'Mô tả chi tiết vấn đề gặp phải.',
            'Hình ảnh hoặc video minh chứng nếu yêu cầu liên quan đến sản phẩm vật lý.',
          ],
        },
        { type: 'p', text: 'Đối với các vấn đề liên quan đến thanh toán hoặc lỗi hệ thống, người dùng có thể cung cấp thêm:' },
        {
          type: 'list',
          items: [
            'Hình ảnh xác nhận giao dịch.',
            'Thông báo lỗi.',
            'Thông tin liên quan từ đơn vị thanh toán.',
          ],
        },
      ],
    },
    {
      heading: '5. Quy trình xử lý yêu cầu',
      blocks: [
        { type: 'subheading', text: 'Bước 1: Gửi yêu cầu' },
        { type: 'p', text: 'Người dùng gửi thông tin hỗ trợ qua email: tmysticroom@gmail.com. Vui lòng ghi rõ tiêu đề: [Yêu cầu hoàn tiền/Hỗ trợ đơn hàng] – Mã đơn hàng.' },
        { type: 'subheading', text: 'Bước 2: Kiểm tra thông tin' },
        { type: 'p', text: 'The Mystic Room sẽ kiểm tra:' },
        {
          type: 'list',
          items: [
            'Thông tin giao dịch.',
            'Trạng thái dịch vụ.',
            'Tình trạng sản phẩm (nếu có).',
            'Các thông tin liên quan do người dùng cung cấp.',
          ],
        },
        { type: 'subheading', text: 'Bước 3: Phản hồi kết quả' },
        { type: 'p', text: 'The Mystic Room sẽ thông báo kết quả xử lý muộn nhất trong vòng 3–5 ngày làm việc kể từ khi nhận đủ thông tin cần thiết.' },
      ],
    },
    {
      heading: '6. Phương thức hoàn tiền',
      blocks: [
        { type: 'p', text: 'Trong trường hợp yêu cầu hoàn tiền được chấp thuận, khoản tiền sẽ được xử lý thông qua:' },
        { type: 'list', items: ['Phương thức thanh toán ban đầu; hoặc', 'Phương thức khác được hai bên thống nhất trong từng trường hợp.'] },
        { type: 'p', text: 'Thời gian tiền được ghi nhận vào tài khoản có thể phụ thuộc vào ngân hàng, ví điện tử hoặc đơn vị thanh toán liên quan.' },
        { type: 'p', text: 'The Mystic Room sẽ cung cấp thông tin xác nhận xử lý hoàn tiền sau khi hoàn tất thủ tục.' },
      ],
    },
    {
      heading: '7. Các trường hợp không áp dụng hoàn tiền',
      blocks: [
        { type: 'p', text: 'The Mystic Room có thể không áp dụng hoàn tiền trong các trường hợp:' },
        {
          type: 'list',
          items: [
            'Người dùng cung cấp thông tin cá nhân không chính xác dẫn đến kết quả cá nhân hóa không phù hợp.',
            'Người dùng không đồng ý với nội dung phân tích nhưng dịch vụ đã được cung cấp đúng theo dữ liệu đầu vào.',
            'Người dùng không đọc kỹ mô tả dịch vụ trước khi thanh toán.',
            'Nội dung kỹ thuật số đã được tạo và cung cấp thành công.',
            'Người dùng đã truy cập hoặc sử dụng nội dung kỹ thuật số đã mua.',
            'Sản phẩm cá nhân hóa đã bắt đầu quá trình thiết kế hoặc chế tác.',
          ],
        },
      ],
    },
    {
      heading: '8. Thay đổi và cập nhật chính sách',
      blocks: [
        { type: 'p', text: 'The Mystic Room có thể cập nhật hoặc điều chỉnh Chính Sách Hoàn Tiền nhằm phù hợp với sự phát triển của nền tảng, dịch vụ mới hoặc các thay đổi trong hoạt động vận hành.' },
        { type: 'p', text: 'Phiên bản mới nhất của chính sách sẽ được cập nhật trên website cùng ngày áp dụng.' },
      ],
    },
    {
      heading: '9. Liên hệ',
      blocks: [
        { type: 'p', text: 'Nếu bạn có câu hỏi hoặc cần hỗ trợ liên quan đến Chính Sách Hoàn Tiền, vui lòng liên hệ:' },
        { type: 'list', items: CONTACT_ITEMS },
      ],
    },
  ],
};