import React, { useState } from 'react';
import { Book, ChevronRight, ArrowLeft, Bookmark, Search, Hash, Clock, PlayCircle, Image as ImageIcon, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { NURSING_NOTES_DB } from '../data/nursingNotes';
import { NoteCategory, NoteTopic, NoteQuizQuestion } from '../types';

const NursingNotes: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NoteCategory | null>(null);
  const [activeTopic, setActiveTopic] = useState<NoteTopic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({}); // questionIndex -> selectedOptionIndex
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Search logic across all notes
  const filteredCategories = searchTerm 
    ? NURSING_NOTES_DB.filter(cat => 
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cat.topics.some(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : NURSING_NOTES_DB;

  const handleBack = () => {
    if (activeTopic) {
      setActiveTopic(null);
      setQuizAnswers({});
      setQuizSubmitted(false);
    } else {
      setActiveCategory(null);
    }
  };

  const handleOptionSelect = (qIndex: number, oIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({...prev, [qIndex]: oIndex}));
  };

  const calculateScore = () => {
    if (!activeTopic?.quiz) return 0;
    let correct = 0;
    activeTopic.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const renderContent = (text: string) => {
    // Enhanced markdown-like parser for the notes
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      // Header 1 (Simulated with bold caps)
      if (trimmed.startsWith('**CHAPTER') || (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 60)) {
         return <h3 key={idx} className="text-xl font-extrabold text-slate-800 mt-8 mb-4 border-b-2 border-slate-100 pb-2">{trimmed.replace(/\*\*/g, '')}</h3>;
      }
      
      // Subheader (1.1 etc)
      if (/^\*\*\d+\.\d+/.test(trimmed)) {
         return <h4 key={idx} className="text-lg font-bold text-teal-700 mt-6 mb-2">{trimmed.replace(/\*\*/g, '')}</h4>;
      }

      // Bold key terms within text
      if (trimmed.includes('**')) {
         const parts = trimmed.split('**');
         return (
            <p key={idx} className="mb-3 text-slate-700 leading-7 text-[15px]">
               {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-900 font-bold bg-yellow-50 px-1">{part}</strong> : part)}
            </p>
         );
      }
      
      // List Items
      if (trimmed.startsWith('*')) {
        return (
          <li key={idx} className="ml-6 mb-2 text-slate-700 list-disc marker:text-teal-500 pl-2 leading-relaxed">
             {trimmed.replace(/^\*\s*/, '')}
          </li>
        );
      }
      
      // Numbered Lists (1. )
      if (/^\d+\./.test(trimmed)) {
         return (
            <div key={idx} className="ml-6 mb-2 text-slate-700 flex">
               <span className="font-bold text-teal-600 mr-2 min-w-[20px]">{trimmed.split(' ')[0]}</span>
               <span className="leading-relaxed">
                  {trimmed.replace(/^\d+\.\s*/, '')}
               </span>
            </div>
         );
      }

      if (trimmed === '') return <div key={idx} className="h-2"></div>;
      
      return (
        <p key={idx} className="mb-3 text-slate-700 leading-7 text-[15px]">
           {trimmed}
        </p>
      );
    });
  };

  // 1. Topic Detail View
  if (activeTopic) {
    return (
      <div className="p-4 md:p-8 overflow-y-auto h-full bg-slate-50">
        <button onClick={handleBack} className="flex items-center text-slate-500 hover:text-teal-600 font-bold mb-6 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-20">
          <ArrowLeft size={18} className="mr-2" /> Back to {activeCategory?.title || 'Topics'}
        </button>
        
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Header Banner */}
          <div className={`p-8 md:p-10 ${activeCategory?.color || 'bg-teal-600'} text-white relative overflow-hidden`}>
             <div className="relative z-10">
               <div className="flex items-center space-x-3 mb-4 opacity-90">
                  <span className="flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    <Clock size={12} className="mr-1.5" /> {activeTopic.readTime || "10 Mins"} Read
                  </span>
                  {activeTopic.videoUrl && (
                    <span className="flex items-center bg-red-500/80 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                      <PlayCircle size={12} className="mr-1.5" /> Video Tutorial
                    </span>
                  )}
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{activeTopic.title}</h1>
               <div className="flex flex-wrap gap-2">
                  {activeTopic.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold border border-white/20">
                      #{tag}
                    </span>
                  ))}
               </div>
             </div>
             {/* Abstract BG Pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          {/* Media Section: Video */}
          {activeTopic.videoUrl && (
             <div className="bg-slate-900 aspect-video w-full">
                <iframe 
                  className="w-full h-full"
                  src={activeTopic.videoUrl}
                  title={activeTopic.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
             </div>
          )}

          {/* Media Section: Image/Diagram */}
          {activeTopic.imageUrl && (
             <div className="border-b border-slate-100 bg-slate-50 p-6 flex justify-center">
                <div className="max-w-2xl w-full">
                   <img 
                     src={activeTopic.imageUrl} 
                     alt="Diagram" 
                     className="rounded-xl shadow-md border border-slate-200 w-full object-cover"
                   />
                   <p className="text-center text-xs text-slate-400 mt-2 italic flex items-center justify-center">
                      <ImageIcon size={12} className="mr-1" /> Figure 1: Clinical Illustration
                   </p>
                </div>
             </div>
          )}

          {/* Text Content */}
          <div className="p-8 md:p-12">
             <div className="prose prose-slate max-w-none">
                {renderContent(activeTopic.content)}
             </div>
             
             {/* Embedded Quiz Section */}
             {activeTopic.quiz && activeTopic.quiz.length > 0 && (
               <div className="mt-16 pt-8 border-t-4 border-slate-100">
                 <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                   <HelpCircle className="mr-3 text-teal-600" /> 
                   Knowledge Check
                 </h3>
                 <div className="space-y-6">
                   {activeTopic.quiz.map((q, qIdx) => (
                     <div key={qIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                       <p className="font-bold text-slate-800 mb-4 text-lg">{qIdx + 1}. {q.question}</p>
                       <div className="space-y-2">
                         {q.options.map((opt, oIdx) => {
                           let btnClass = "w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all";
                           if (quizSubmitted) {
                             if (oIdx === q.correctAnswer) btnClass = "w-full text-left p-3 rounded-xl border border-green-500 bg-green-50 text-green-800 font-bold";
                             else if (quizAnswers[qIdx] === oIdx) btnClass = "w-full text-left p-3 rounded-xl border border-red-500 bg-red-50 text-red-800";
                             else btnClass = "w-full text-left p-3 rounded-xl border border-slate-200 bg-white opacity-50";
                           } else if (quizAnswers[qIdx] === oIdx) {
                             btnClass = "w-full text-left p-3 rounded-xl border-2 border-teal-500 bg-teal-50 text-teal-900 font-semibold shadow-sm";
                           }

                           return (
                             <button 
                               key={oIdx}
                               onClick={() => handleOptionSelect(qIdx, oIdx)}
                               disabled={quizSubmitted}
                               className={btnClass}
                             >
                               {opt}
                               {quizSubmitted && oIdx === q.correctAnswer && <CheckCircle className="inline ml-2 text-green-600" size={16}/>}
                               {quizSubmitted && quizAnswers[qIdx] === oIdx && oIdx !== q.correctAnswer && <XCircle className="inline ml-2 text-red-600" size={16}/>}
                             </button>
                           );
                         })}
                       </div>
                       {quizSubmitted && (
                         <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
                           <strong>Explanation:</strong> {q.explanation}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
                 
                 {!quizSubmitted ? (
                   <button 
                     onClick={() => setQuizSubmitted(true)}
                     disabled={Object.keys(quizAnswers).length < activeTopic.quiz.length}
                     className={`mt-8 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                       Object.keys(quizAnswers).length < activeTopic.quiz.length 
                       ? 'bg-slate-300 cursor-not-allowed' 
                       : 'bg-teal-600 hover:bg-teal-700'
                     }`}
                   >
                     Submit Answers
                   </button>
                 ) : (
                   <div className="mt-8 text-center bg-teal-50 p-6 rounded-2xl border border-teal-100">
                     <div className="text-3xl font-bold text-teal-800 mb-2">
                       You scored {calculateScore()} / {activeTopic.quiz.length}
                     </div>
                     <p className="text-teal-600 mb-4">Great job reviewing the material!</p>
                     <button onClick={handleBack} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">
                       Complete Module
                     </button>
                   </div>
                 )}
               </div>
             )}

             {/* Footer if no quiz */}
             {(!activeTopic.quiz || activeTopic.quiz.length === 0) && (
               <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                  <p className="text-slate-400 text-sm mb-4">You have reached the end of this module.</p>
                  <button onClick={handleBack} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                     Mark as Read & Return
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Main View (Categories list)
  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <Book className="mr-3 text-teal-600" />
          Clinical Notebook
        </h2>
        <p className="text-slate-500 mt-2 text-lg">Comprehensive textbook-level lectures, protocols, and integrated quizzes.</p>
      </header>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10 relative flex items-center">
        <Search className="text-slate-400 ml-2" size={24} />
        <input 
          type="text" 
          placeholder="Search topics (e.g., 'IV Insertion', 'Microscope', 'Diabetes')..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-2 bg-transparent text-lg font-medium text-slate-700 placeholder-slate-400 outline-none"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
             <div className={`p-6 ${cat.color} text-white relative overflow-hidden`}>
                <div className="relative z-10">
                   <span className="inline-block bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2">{cat.yearLevel} Year</span>
                   <h3 className="font-bold text-xl leading-tight">{cat.title}</h3>
                   <p className="text-white/80 text-sm mt-2 line-clamp-2">{cat.description}</p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
             </div>
             
             <div className="p-2 flex-1 bg-slate-50/50">
               {cat.topics
                 .filter(t => !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.content.toLowerCase().includes(searchTerm.toLowerCase()))
                 .map((topic) => (
                   <button
                     key={topic.id}
                     onClick={() => { setActiveCategory(cat); setActiveTopic(topic); }}
                     className="w-full flex items-center justify-between p-4 mb-1 bg-white hover:bg-teal-50 border border-transparent hover:border-teal-200 rounded-xl transition-all text-left group shadow-sm"
                   >
                     <div className="flex-1 pr-4">
                       <div className="flex items-center text-slate-800 font-bold mb-1 group-hover:text-teal-700">
                          {topic.videoUrl && <PlayCircle size={14} className="text-red-500 mr-2 flex-shrink-0" />}
                          {topic.title}
                       </div>
                       <div className="flex items-center text-xs text-slate-400">
                          <Clock size={12} className="mr-1" /> {topic.readTime || '10m'}
                          <span className="mx-2">•</span>
                          {topic.quiz && <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-indigo-100 mr-2">QUIZ</span>}
                          <span className="truncate max-w-[150px]">{topic.tags[1] || 'General'}</span>
                       </div>
                     </div>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500" />
                   </button>
               ))}
               {cat.topics.length === 0 && <div className="p-8 text-center text-slate-400 text-sm italic">No matching notes found in this module.</div>}
             </div>
          </div>
        ))}
        
        {filteredCategories.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="inline-block p-6 bg-slate-100 rounded-full mb-4">
               <Search size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No results found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NursingNotes;