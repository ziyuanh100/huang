import React, { useState, useMemo } from 'react';
import { SubjectInput } from './components/SubjectInput';
import { AnalysisSection } from './components/AnalysisSection';
import { SUBJECT_CONFIG, ScoreState, Subject, CalculationResult } from './types';
import { Calculator, PieChart, Info } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

const App: React.FC = () => {
  // Initialize scores with 0
  const [scores, setScores] = useState<ScoreState>(
    SUBJECT_CONFIG.reduce((acc, sub) => ({ ...acc, [sub.id]: 0 }), {})
  );

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const subjects: Subject[] = useMemo(() => {
    return SUBJECT_CONFIG.map(config => ({
      ...config,
      score: scores[config.id] || 0
    }));
  }, [scores]);

  const result: CalculationResult = useMemo(() => {
    let totalScore = 0;
    let totalWeightedScore = 0;
    let totalWeights = 0;

    subjects.forEach(sub => {
      totalScore += sub.score;
      totalWeightedScore += sub.score * sub.weight;
      totalWeights += sub.weight;
    });

    return {
      totalScore,
      totalWeightedScore,
      totalWeights,
      weightedAverage: totalWeights > 0 ? totalWeightedScore / totalWeights : 0
    };
  }, [subjects]);

  const chartData = subjects.map(s => ({
    subject: s.name,
    score: s.score,
    weightedScore: s.score * s.weight,
    fullMark: 100
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Calculator className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">加權成績計算系統</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            專為商管/資管群設計
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 transform hover:-translate-y-1 transition-transform">
            <p className="text-blue-100 font-medium mb-1">加權平均分數</p>
            <div className="text-4xl font-bold tracking-tight">
              {result.weightedAverage.toFixed(2)}
            </div>
            <div className="mt-2 text-xs text-blue-100 opacity-80">
              總學分/權重: {result.totalWeights}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
             <p className="text-gray-500 font-medium mb-1 text-sm uppercase tracking-wide">加權總分</p>
             <div className="text-3xl font-bold text-gray-800">
               {result.totalWeightedScore.toFixed(1)}
             </div>
             <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((result.weightedAverage / 100) * 100, 100)}%` }}
                ></div>
             </div>
          </div>

           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
             <p className="text-gray-500 font-medium mb-1 text-sm uppercase tracking-wide">原始總分</p>
             <div className="text-3xl font-bold text-gray-800">
               {result.totalScore}
             </div>
             <p className="text-xs text-gray-400 mt-2">不含加權計算</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Info size={20} className="text-indigo-500" />
                <h2 className="text-lg font-bold text-gray-800">科目成績輸入</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(subject => (
                  <SubjectInput
                    key={subject.id}
                    {...subject}
                    value={scores[subject.id] || 0}
                    onChange={handleScoreChange}
                  />
                ))}
              </div>
            </div>

            {/* AI Analysis Section */}
            <AnalysisSection subjects={subjects} />
          </div>

          {/* Right Column: Charts */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <PieChart size={20} className="text-indigo-500" />
                <h2 className="text-lg font-bold text-gray-800">能力分佈雷達圖</h2>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <PieChart size={20} className="text-teal-500" />
                <h2 className="text-lg font-bold text-gray-800">加權貢獻圖</h2>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="subject" type="category" width={80} tick={{ fontSize: 11 }} interval={0} />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 rounded shadow-lg border border-gray-100 text-xs">
                              <p className="font-bold">{data.subject}</p>
                              <p>原始分數: {data.score}</p>
                              <p className="text-indigo-600">加權分數: {data.weightedScore.toFixed(1)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="weightedScore" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;