import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: key });

    const prompt = `Bạn là hệ thống AI phân tích nhu cầu tìm gia sư của trung tâm Gia Sư Hub.
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
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('AI Smart Search Error:', error);
    return res.status(500).json({ error: error.message || 'Failed AI search' });
  }
}
