import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic } = req.body;

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: key });

    const prompt = `Bạn là chuyên gia tối ưu hóa công cụ tìm kiếm (SEO) cho website trung tâm gia sư trực tuyến Gia Sư Hub.
Chủ đề cần tối ưu: "${topic || 'Gia sư chất lượng cao tại TP.HCM và Online'}".

Hãy tạo cấu trúc SEO tiêu chuẩn gồm:
1. "metaTitle": Tiêu đề chuẩn SEO hấp dẫn (< 60 ký tự)
2. "metaDescription": Mô tả chuẩn SEO tăng CTR (< 155 ký tự)
3. "topKeywords": Mảng 6 từ khóa gợi ý có lượt tìm kiếm cao
4. "contentOutline": Mảng 3 luận điểm chính để viết bài blog thu hút học viên/phụ huynh

Trả về định dạng JSON hợp lệ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('SEO Optimizer Error:', error);
    return res.status(500).json({ error: error.message || 'Failed SEO gen' });
  }
}
