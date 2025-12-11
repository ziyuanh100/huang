import React, { useState } from 'react';
import { Subject } from '../types';
import { getStudyAdvice } from '../services/gemini';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';

interface AnalysisSectionProps {
  subjects: Subject[];
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ subjects }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAdvice('');
    try {
      const result = await getStudyAdvice(subjects);
      setAdvice(result);
      setHasFetched(true);
    } catch (e) {
      setAdvice('發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 shadow-sm border border-indigo-100 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-900">AI 成績診斷與建議</h3>
            <p className="text-sm text-indigo-600">使用 Gemini 模型分析您的學習狀況</p>
          </div>
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              分析中...
            </>
          ) : (
            <>
              <BookOpen size={20} />
              {hasFetched ? '重新分析' : '開始分析'}
            </>
          )}
        </button>
      </div>

      {advice && (
        <div className="mt-4 p-5 bg-white rounded-xl border border-indigo-100 shadow-inner animate-fade-in text-gray-700 leading-relaxed whitespace-pre-wrap">
          {advice}
        </div>
      )}
      
      {!advice && !loading && !hasFetched && (
        <div className="mt-4 text-center text-gray-400 py-8 border-2 border-dashed border-indigo-100 rounded-xl">
          輸入完成績後，點擊按鈕獲取專屬學習建議
        </div>
      )}
    </div>
  );
};