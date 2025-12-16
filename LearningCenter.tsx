import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, ArrowRight, ArrowLeft, Award, ChevronDown, ChevronRight } from 'lucide-react';
import { QUIZ_MODULES } from '../data/quizData';
import { QuizModule, QuizQuestion } from '../types';

const LearningCenter: React.FC = () => {
  const [activeModule, setActiveModule] = useState<QuizModule | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleModuleSelect = (module: QuizModule) => {
    setActiveModule(module);
    setCurrentQuestionIndex(0);
    setScore(0);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleOptionSelect = (index: number) => {
    if (showResult) return; // Prevent changing answer after reveal
    setSelectedOption(index);
    setShowResult(true);
    
    if (index === activeModule?.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeModule && currentQuestionIndex < activeModule.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      resetQuestionState();
    }
  };

  const handleBackToModules = () => {
    setActiveModule(null);
  };

  // Module List View
  if (!activeModule) {
    return (
      <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <BookOpen className="mr-3 text-teal-600" />
            Learning Center
          </h2>
          <p className="text-slate-500 mt-2">Select a module to start testing your medical knowledge.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {QUIZ_MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleSelect(module)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-400 transition-all text-left group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">
                  {module.questions.length} Questions
                </span>
                <ChevronRight className="text-slate-300 group-hover:text-teal-500 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                {module.title}
              </h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Quiz View
  const currentQuestion: QuizQuestion = activeModule.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / activeModule.questions.length) * 100;

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
           <button 
             onClick={handleBackToModules}
             className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
           >
             <ArrowLeft size={20} className="mr-2" />
             Back to Modules
           </button>
           <div className="flex items-center text-teal-600 font-bold">
             <Award size={20} className="mr-2" />
             Score: {score}
           </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Question {currentQuestionIndex + 1} of {activeModule.questions.length}</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 flex-1 flex flex-col">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
            {currentQuestion.id}. {currentQuestion.question}
          </h3>

          <div className="space-y-3 flex-1">
            {currentQuestion.options.map((option, index) => {
              let optionClass = "border-slate-200 hover:border-teal-400 hover:bg-slate-50";
              let icon = null;

              if (showResult) {
                if (index === currentQuestion.correctAnswerIndex) {
                  optionClass = "bg-green-50 border-green-500 text-green-700";
                  icon = <CheckCircle size={20} className="text-green-600" />;
                } else if (index === selectedOption) {
                  optionClass = "bg-red-50 border-red-500 text-red-700";
                  icon = <XCircle size={20} className="text-red-600" />;
                } else {
                  optionClass = "opacity-50 border-slate-200";
                }
              } else if (selectedOption === index) {
                optionClass = "border-teal-500 bg-teal-50 text-teal-700";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${optionClass}`}
                >
                  <span className="font-medium text-lg mr-4">{String.fromCharCode(65 + index)}. {option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </button>

            {showResult && (
               <div className={`text-sm font-bold ${selectedOption === currentQuestion.correctAnswerIndex ? 'text-green-600' : 'text-red-600'}`}>
                 {selectedOption === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Incorrect'}
               </div>
            )}

            <button
              onClick={handleNextQuestion}
              disabled={!showResult && currentQuestionIndex < activeModule.questions.length - 1} // Optional: Force answer before next?
              className={`flex items-center px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md ${
                currentQuestionIndex === activeModule.questions.length - 1
                 ? 'bg-slate-400 cursor-not-allowed' // End of quiz
                 : showResult 
                   ? 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg' 
                   : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex === activeModule.questions.length - 1 ? 'Finished' : 'Next Question'}
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCenter;
