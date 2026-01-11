import axios from "axios";

export interface AIResponse {
  result: string;
  used_model: string;
}

const API_ENDPOINT = "https://groqprompt.netlify.app/api/ai";

export const fetchNgocHapInfo = async (
  dateStr: string
): Promise<AIResponse> => {
  // Yêu cầu AI trả về Markdown có sử dụng TABLE (Giai đoạn này dùng GFM rất hiệu quả)
  const prompt = `
    Đóng vai trò là chuyên gia phong thủy. Tra cứu ngày **${dateStr} (Dương lịch)** theo Ngọc Hạp Thông Thư.
    
    Yêu cầu output định dạng **Markdown (GFM)**:
    
    ### 📅 Thông tin ngày
    * <Nội dung chuyển đổi Âm lịch, Can chi>
    
    ### 🌟 Tiết khí & Trực
    * <Nội dung>

    ### ⚖️ Phân tích Sao (Cát Tinh - Hung Tinh)
    *(Hãy trả về dưới dạng bảng)*
    | Loại Sao | Tên Sao | Ảnh hưởng |
    | :--- | :--- | :--- |
    | **Sao Tốt** | ... | ... |
    | **Sao Xấu** | ... | ... |

    ### 🛠 Khuyến nghị Việc làm
    *(Dùng check list)*
    - [x] **Nên làm**: ...
    - [ ] **Nên kiêng**: ...

    ### ⏰ Giờ Hoàng Đạo
    *(Trả về dạng danh sách hoặc bảng tùy chọn)*

    **Lời khuyên:** <Một câu kết luận>
  `;

  try {
    const response = await axios.post<AIResponse>(API_ENDPOINT, {
      prompt: prompt,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Không thể kết nối đến máy chủ AI.");
  }
};
