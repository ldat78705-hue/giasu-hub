import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { classRequest, tutors } = req.body;
    if (!classRequest || !tutors) {
      return res.status(400).json({ error: 'Missing classRequest or tutors' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: key });

    const prompt = `Bạn là Trí tuệ nhân tạo Smart Matching AI của Gia Sư Hub.
Lớp học yêu cầu:
- Môn: ${classRequest.subject}
- Địa điểm: ${classRequest.location}
- Yêu cầu thêm: ${classRequest.requirements || 'Không có'}
- Phí: ${classRequest.fee} VNĐ

Danh sách gia sư hiện có:
${JSON.stringify(tutors, null, 2)}

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
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '[]');
    return res.status(200).json({ matches: data });
  } catch (error: any) {
    console.error('AI Matching Error:', error);
    return res.status(500).json({ error: error.message || 'Failed matching' });
  }
}
