import { GoogleGenAI } from "@google/genai";
import { Subject } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getStudyAdvice = async (subjects: Subject[]): Promise<string> => {
  if (!apiKey) {
    return "請先設定 API Key 才能使用 AI 分析功能。";
  }

  const subjectSummary = subjects
    .map(s => `${s.name}: ${s.score}分 (加權 x${s.weight})`)
    .join('\n');

  const prompt = `
    你是一位專業的升學輔導顧問。請根據以下學生的成績進行分析：
    
    ${subjectSummary}
    
    請提供一段約 150-200 字的分析與建議：
    1. 指出學生的強勢科目與優勢領域。
    2. 指出需要加強的弱點科目，特別是加權較重但分數較低的科目。
    3. 給予具體的學習改進建議。
    4. 語氣要正向鼓勵。
    5. 使用繁體中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "無法產生分析結果，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "分析過程中發生錯誤，請檢查網路連線或 API Key。";
  }
};