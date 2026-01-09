
import React, { useState, useEffect, useRef } from 'react';
import { WORD_DATA } from './constants';
import { Category, WordItem } from './types';

const CATEGORIES: Category[] = ['한자어', '외래어', '최신 순화어'];

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'home' | 'study' | 'test' | 'practice'>('home');
  const [testWords, setTestWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Utility to shuffle array
  const shuffle = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const initSession = (mode: 'test' | 'practice' | 'study', category: Category | '전체') => {
    const filtered = category === '전체' 
      ? WORD_DATA 
      : WORD_DATA.filter(w => w.category === category);
    
    let words = [...filtered];
    if (mode === 'test') {
      words = shuffle(words).slice(0, 20);
    } else if (mode === 'practice') {
      words = shuffle(words);
    }

    setTestWords(words);
    setCurrentIndex(0);
    setScore(0);
    setCurrentInput('');
    setShowFeedback(false);
    setIsFinished(false);
    setViewMode(mode);
  };

  const checkAnswer = () => {
    const correct = testWords[currentIndex].purified.some(
      ans => ans.replace(/\s+/g, '') === currentInput.replace(/\s+/g, '').trim()
    );
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setShowFeedback(true);
  };

  const goToNext = () => {
    if (currentIndex + 1 >= testWords.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setCurrentInput('');
      setShowFeedback(false);
      // Give focus back to input after feedback
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (viewMode === 'practice') {
        if (!showFeedback) {
          if (currentInput.trim()) checkAnswer();
        } else {
          goToNext();
        }
      } else if (viewMode === 'test') {
        if (currentInput.trim()) {
          const correct = testWords[currentIndex].purified.some(
            ans => ans.replace(/\s+/g, '') === currentInput.replace(/\s+/g, '').trim()
          );
          if (correct) setScore(s => s + 1);
          
          if (currentIndex + 1 >= testWords.length) {
            setIsFinished(true);
          } else {
            setCurrentIndex(prev => prev + 1);
            setCurrentInput('');
          }
        }
      }
    }
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <header className="text-center mb-16">
        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 animate-bounce">
          실용글쓰기 완벽 대비
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">순화어 마스터</h1>
        <p className="text-slate-500 text-lg">한자어부터 최신 IT 용어까지, 엔터 한 번으로 끝내는 순화 연습</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* 연습하기 섹션 (즉각 피드백) */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-green-500 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <span className="text-6xl text-green-600">🏃‍♂️</span>
           </div>
           <h2 className="text-2xl font-bold mb-6 text-slate-800">1단계: 연습하기</h2>
           <p className="text-slate-500 text-sm mb-6">엔터를 치면 즉시 정답 여부를 알려줍니다. 하나하나 확실히 외울 때 좋습니다.</p>
           <div className="space-y-3">
             <button onClick={() => initSession('practice', '전체')} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md">전체 무작위 연습</button>
             {CATEGORIES.map(cat => (
               <button key={cat} onClick={() => initSession('practice', cat)} className="w-full py-2 border border-green-100 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-all">{cat} 연습</button>
             ))}
           </div>
        </section>

        {/* 학습하기 섹션 (목록 보기) */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-blue-500 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <span className="text-6xl text-blue-600">📚</span>
           </div>
           <h2 className="text-2xl font-bold mb-6 text-slate-800">참고: 목록 보기</h2>
           <p className="text-slate-500 text-sm mb-6">시험에 자주 나오는 순화 대상어와 정답 리스트를 한눈에 훑어보세요.</p>
           <div className="space-y-3">
             <button onClick={() => initSession('study', '전체')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">전체 목록 학습</button>
             {CATEGORIES.map(cat => (
               <button key={cat} onClick={() => initSession('study', cat)} className="w-full py-2 border border-blue-100 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-all">{cat} 목록</button>
             ))}
           </div>
        </section>

        {/* 테스트하기 섹션 (실전 모의고사) */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-orange-500 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <span className="text-6xl text-orange-600">✏️</span>
           </div>
           <h2 className="text-2xl font-bold mb-6 text-slate-800">2단계: 테스트</h2>
           <p className="text-slate-500 text-sm mb-6">실전처럼 20문제를 풀고 마지막에 결과를 확인합니다. 시간 단축 연습에 좋습니다.</p>
           <div className="space-y-3">
             <button onClick={() => initSession('test', '전체')} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md">실전 20문제 테스트</button>
             {CATEGORIES.map(cat => (
               <button key={cat} onClick={() => initSession('test', cat)} className="w-full py-2 border border-orange-100 bg-orange-50 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-all">{cat} 테스트</button>
             ))}
           </div>
        </section>
      </div>

      <div className="mt-16 text-center text-slate-400 text-sm">
        <p>💡 팁: 연습 모드에서 답변을 입력하고 <kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Enter</kbd>를 두 번 누르면 빠르게 다음 문제로 넘어갑니다.</p>
      </div>
    </div>
  );

  const renderStudy = () => (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setViewMode('home')} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold">← 홈으로</button>
        <h2 className="text-2xl font-black text-slate-800">순화어 목록 학습</h2>
        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{testWords.length}개 항목</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {testWords.map((word) => (
          <div key={word.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all">
            <div className="flex-1">
              <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-tighter">{word.category}</span>
              <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{word.original}</span>
            </div>
            <div className="text-right flex-1">
              <span className="text-blue-600 font-black text-xl">{word.purified.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPractice = () => {
    if (isFinished) {
      return (
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-100 animate-in zoom-in duration-300">
            <div className="text-7xl mb-6">🌟</div>
            <h2 className="text-4xl font-black mb-4 text-slate-900">연습 완료!</h2>
            <p className="text-slate-500 text-xl mb-10">총 <span className="text-green-600 font-bold">{testWords.length}</span>개의 단어를 학습했습니다.<br/>정답 횟수: <span className="text-blue-600 font-bold">{score}</span>번</p>
            <button onClick={() => setViewMode('home')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl">홈으로 돌아가기</button>
          </div>
        </div>
      );
    }

    const currentWord = testWords[currentIndex];
    const progress = ((currentIndex + 1) / testWords.length) * 100;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-green-600">{currentIndex + 1}</span>
              <span className="text-slate-400 font-bold">/ {testWords.length}</span>
            </div>
            <span className="text-sm text-slate-400 font-black tracking-widest uppercase">{currentWord.category}</span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={`bg-white rounded-[3rem] p-12 shadow-2xl border-2 transition-all duration-300 ${
          showFeedback 
          ? (isCorrect ? 'border-blue-500 ring-8 ring-blue-50' : 'border-red-500 ring-8 ring-red-50')
          : 'border-slate-100'
        }`}>
          <div className="text-center mb-12">
            <p className="text-slate-400 font-bold text-sm mb-4 uppercase tracking-widest">다음 단어를 순화하시오</p>
            <h2 className="text-5xl font-black text-slate-800">{currentWord.original}</h2>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <input 
                ref={inputRef}
                autoFocus
                type="text"
                value={currentInput}
                readOnly={showFeedback}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={showFeedback ? "" : "순화어를 입력하고 엔터"}
                className={`w-full text-center py-6 px-8 text-3xl font-black border-4 rounded-[2rem] focus:outline-none transition-all ${
                  showFeedback 
                  ? (isCorrect ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-red-50 border-red-200 text-red-700')
                  : 'bg-slate-50 border-slate-200 focus:border-green-500 focus:bg-white focus:shadow-inner'
                }`}
              />
              {showFeedback && (
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg animate-in zoom-in duration-300 ${isCorrect ? 'bg-blue-500' : 'bg-red-500'}`}>
                  {isCorrect ? 'O' : 'X'}
                </div>
              )}
            </div>

            {!showFeedback ? (
              <button
                disabled={!currentInput.trim()}
                onClick={checkAnswer}
                className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all active:scale-95 ${
                  currentInput.trim() ? 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                정답 확인 (Enter)
              </button>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-8 rounded-[2rem] mb-8 text-center ${isCorrect ? 'bg-blue-100/50' : 'bg-red-100/50'}`}>
                  <p className={`text-xl font-black mb-3 ${isCorrect ? 'text-blue-600' : 'text-red-600'}`}>
                    {isCorrect ? '완벽합니다! 🎉' : '다시 확인해보세요!'}
                  </p>
                  <p className="text-3xl font-black text-slate-800">
                    <span className="text-slate-400 text-lg block mb-1">정답 리스트</span>
                    {currentWord.purified.join(', ')}
                  </p>
                </div>
                <button
                  onClick={goToNext}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                >
                  다음 문제로 (Enter)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTest = () => {
    if (isFinished) {
      return (
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <span className="text-5xl">🎯</span>
            </div>
            <h2 className="text-4xl font-black mb-4 text-slate-900">테스트 종료</h2>
            <div className="text-6xl font-black text-blue-600 mb-2">{score * 5}점</div>
            <p className="text-slate-500 text-lg mb-12">총 {testWords.length}문제 중 {score}문제를 맞혔습니다.</p>
            <button onClick={() => setViewMode('home')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all">결과 닫기</button>
          </div>
        </div>
      );
    }

    const currentWord = testWords[currentIndex];
    const progress = ((currentIndex + 1) / testWords.length) * 100;

    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-3">
            <span className="text-lg font-black text-blue-600">Q.{currentIndex + 1}</span>
            <span className="text-xs text-slate-400 font-black tracking-widest uppercase">{currentWord.category}</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-100 text-center">
          <h2 className="text-5xl font-black text-slate-800 mb-12 tracking-tight">{currentWord.original}</h2>
          <input 
            autoFocus
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="정답 입력"
            className="w-full text-center py-5 px-8 text-2xl font-black bg-slate-50 border-4 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none mb-8 transition-all"
          />
          <button
            disabled={!currentInput.trim()}
            onClick={() => handleKeyPress({ key: 'Enter' } as any)}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg active:scale-95"
          >
            다음 문제 (Enter)
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">순</div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">순화어 마스터</span>
          </div>
          {viewMode !== 'home' && (
            <button 
              onClick={() => {
                if(viewMode === 'study' || confirm('진행 중인 내용이 사라집니다. 홈으로 가시겠습니까?')) setViewMode('home');
              }} 
              className="text-sm font-bold text-slate-500 bg-slate-100 px-6 py-2.5 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-all"
            >
              종료하고 나가기
            </button>
          )}
        </div>
      </nav>

      <main className="animate-in fade-in duration-700">
        {viewMode === 'home' && renderHome()}
        {viewMode === 'study' && renderStudy()}
        {viewMode === 'test' && renderTest()}
        {viewMode === 'practice' && renderPractice()}
      </main>

      <footer className="fixed bottom-0 w-full bg-white/60 backdrop-blur-md border-t border-slate-100 py-4 px-4 text-center z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Korean Practical Writing - Purification Master</span>
          <span className="text-[10px] font-medium text-slate-300">누구나 무료로 이용 가능한 실용글쓰기 대비 도구입니다.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
