import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rawNotes } = req.body;

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: key });

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

    return res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Generate Class Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
