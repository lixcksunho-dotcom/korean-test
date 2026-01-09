
export type Category = '한자어' | '외래어' | '최신 순화어';

export interface WordItem {
  id: string;
  original: string;
  purified: string[]; // List of possible correct answers
  category: Category;
}

export interface TestState {
  currentIndex: number;
  userAnswers: string[];
  isFinished: boolean;
  score: number;
}
