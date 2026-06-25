import { GoogleGenAI } from '@google/genai';

/**
 * Client-side AI service that calls Gemini directly from the browser.
 * API key is provided by admin settings stored in Firestore.
 */

function getAI(apiKey: string): GoogleGenAI {
  if (!apiKey) throw new Error('Chưa cấu hình API Key AI. Vui lòng vào Cài đặt để nhập Gemini API Key.');
  return new GoogleGenAI({ apiKey });
}

export async function aiSmartSearch(apiKey: string, query: string) {
  const ai = getAI(apiKey);
  const prompt = `Bạn là hệ thống AI phân tích nhu cầu tìm gia sư của trung tâm Gia Sư Thành Đạt tại Hà Nội.
Từ khóa tìm kiếm của người dùng: "${query}".
Hãy phân tích yêu cầu này và trả về định dạng JSON gồm:
1. "extractedSubject": tên môn học chính (VD: Toán, Tiếng Anh, IELTS, Vật Lý, Python...) hoặc rỗng
2. "extractedLocation": địa điểm hoặc quận huyện (VD: Quận 1, Quận 7, Online...) hoặc rỗng
3. "intentSummary": tóm tắt ngắn 1 câu về nhu cầu để hiển thị cho người dùng
4. "suggestedMaxFee": mức học phí gợi ý VNĐ trên buổi (VD: 300000)

Chỉ trả về JSON hợp lệ.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
  return JSON.parse(response.text || '{}');
}

export async function aiMatchTutors(
  apiKey: string,
  classRequest: { subject: string; location: string; requirements?: string; fee: number },
  tutors: any[]
) {
  const ai = getAI(apiKey);
  const prompt = `Bạn là Trí tuệ nhân tạo Smart Matching AI của Gia Sư Thành Đạt.
Lớp học yêu cầu:
- Môn: ${classRequest.subject}
- Địa điểm: ${classRequest.location}
- Yêu cầu thêm: ${classRequest.requirements || 'Không có'}
- Phí: ${classRequest.fee} VNĐ

Danh sách gia sư hiện có:
${JSON.stringify(tutors.map(t => ({ code: t.code, name: t.name, subjects: t.subjects, qualification: t.qualification, hourlyRate: t.hourlyRate, rating: t.rating })), null, 2)}

Hãy chọn ra tối đa 3 gia sư phù hợp nhất từ danh sách trên. Trả về định dạng JSON là một mảng các object:
[
  {
    "tutorCode": "mã gia sư",
    "matchPercentage": số phần trăm từ 80 đến 99,
    "aiRationale": "Lý do ngắn gọn 1 câu vì sao gia sư này rất match với lớp"
  }
]
Chỉ trả về mảng JSON hợp lệ.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
  return JSON.parse(response.text || '[]');
}

export async function aiOptimizeSeo(apiKey: string, topic: string) {
  const ai = getAI(apiKey);
  const prompt = `Bạn là chuyên gia tối ưu hóa công cụ tìm kiếm (SEO) cho website trung tâm gia sư Gia Sư Thành Đạt tại Hà Nội.
Chủ đề cần tối ưu: "${topic || 'Gia sư chất lượng cao tại Hà Nội và Online'}".

Hãy tạo cấu trúc SEO tiêu chuẩn gồm:
1. "metaTitle": Tiêu đề chuẩn SEO hấp dẫn (< 60 ký tự)
2. "metaDescription": Mô tả chuẩn SEO tăng CTR (< 155 ký tự)
3. "topKeywords": Mảng 6 từ khóa gợi ý có lượt tìm kiếm cao
4. "contentOutline": Mảng 3 luận điểm chính để viết bài blog thu hút học viên/phụ huynh

Trả về định dạng JSON hợp lệ.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
  return JSON.parse(response.text || '{}');
}

export async function aiGenerateClass(apiKey: string, rawNotes: string) {
  const ai = getAI(apiKey);
  const prompt = `Từ ghi chú nhanh của nhân viên trung tâm gia sư: "${rawNotes}".
Hãy biên tập thành thông tin lớp học chỉn chu trả về JSON gồm:
- "subject": Môn học đầy đủ rõ ràng
- "studentInfo": Trình độ học sinh (VD: Học sinh lớp 10 ôn thi)
- "location": Địa điểm học
- "fee": Mức học phí gợi ý (số nguyên VNĐ)
- "schedule": Lịch học
- "requirements": Yêu cầu chi tiết với gia sư

Chỉ trả về JSON hợp lệ.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
  return JSON.parse(response.text || '{}');
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const ai = getAI(apiKey);
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello, respond with just "ok"',
    });
    return true;
  } catch {
    return false;
  }
}
