export interface Subject {
  id: string;
  name: string;
  weight: number;
  score: number;
  category: 'general' | 'professional' | 'special';
}

export type ScoreState = Record<string, number>;

export interface CalculationResult {
  totalScore: number;
  totalWeightedScore: number;
  totalWeights: number;
  weightedAverage: number;
}

export const SUBJECT_CONFIG: Omit<Subject, 'score'>[] = [
  { id: 'chinese', name: '國文', weight: 3, category: 'general' },
  { id: 'english', name: '英文', weight: 3, category: 'general' },
  { id: 'math', name: '數學', weight: 3, category: 'general' },
  { id: 'economics', name: '經濟學', weight: 4, category: 'professional' },
  { id: 'accounting', name: '會計學', weight: 3, category: 'professional' },
  { id: 'accountingPractice', name: '會計實務', weight: 3, category: 'professional' },
  { id: 'programming', name: '程式設計', weight: 3, category: 'special' },
  { id: 'computerIntro', name: '數位科技概論', weight: 2, category: 'special' },
  { id: 'businessIntro', name: '商業概論', weight: 2, category: 'professional' },
];