import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Loader2, Sparkles, Cpu } from 'lucide-react';
import { ChatMessage, MessageRole, AIProvider } from '../types';
import { generateMedicalResponse } from '../services/geminiService';
import { generateOpenAIResponse } from '../services/openaiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: MessageRole.SYSTEM,
      text: "Hello, I am BioNurse Pro. How can I assist with your health today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let responseText = "";

    try {
      if (provider === 'gemini') {
        // Prepare Gemini history (strings)
        const history = messages
          .filter(m => m.role !== MessageRole.SYSTEM)
          .map(m => `${m.role === MessageRole.USER ? 'User' : 'Assistant'}: ${m.text}`);
        
        responseText = await generateMedicalResponse(userMsg.text, history);
      } else {
        // Prepare OpenAI history (objects)
        const history = messages.filter(m => m.role !== MessageRole.SYSTEM);
        responseText = await generateOpenAIResponse(userMsg.text, history);
      }
    } catch (error) {
      responseText = "I encountered an error processing your request. Please try again.";
    }

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: MessageRole.MODEL,
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Chat Header with Model Control */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
         <div className="flex items-center text-slate-700 font-medium text-sm">
           <Bot size={18} className="mr-2 text-teal-600" />
           <span>BioNurse Assistant</span>
         </div>
         
         <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setProvider('gemini')}
             className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
               provider === 'gemini' 
                 ? 'bg-white text-teal-700 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             <Sparkles size={14} className="mr-1.5" />
             Gemini 2.5
           </button>
           <button 
             onClick={() => setProvider('openai')}
             className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
               provider === 'openai' 
                 ? 'bg-white text-indigo-700 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             <Cpu size={14} className="mr-1.5" />
             GPT-4o
           </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === MessageRole.USER 
                  ? 'bg-indigo-600 ml-3' 
                  : provider === 'gemini' ? 'bg-teal-600 mr-3' : 'bg-indigo-500 mr-3'
              }`}>
                {msg.role === MessageRole.USER ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === MessageRole.USER 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className={`text-[10px] mt-2 opacity-70 ${msg.role === MessageRole.USER ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {msg.role === MessageRole.MODEL && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-slate-100 text-[9px] font-bold tracking-wide text-slate-500 border border-slate-200">
                      {msg.id === '1' ? 'SYSTEM' : (provider === 'gemini' ? 'GEMINI' : 'GPT-4o')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="flex flex-row">
               <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${provider === 'gemini' ? 'bg-teal-600' : 'bg-indigo-500'}`}>
                 <Bot size={16} className="text-white" />
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center">
                 <Loader2 className={`animate-spin mr-2 ${provider === 'gemini' ? 'text-teal-600' : 'text-indigo-500'}`} size={16} />
                 <span className="text-slate-500 text-sm">
                   {provider === 'gemini' ? 'Gemini is analyzing...' : 'GPT-4o is thinking...'}
                 </span>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className={`bg-slate-50 border border-slate-200 rounded-xl flex items-center p-1 focus-within:ring-2 focus-within:border-transparent transition-all ${provider === 'gemini' ? 'focus-within:ring-teal-500' : 'focus-within:ring-indigo-500'}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask ${provider === 'gemini' ? 'Gemini 2.5' : 'GPT-4o'} a health question...`}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-slate-700 placeholder-slate-400 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`p-3 rounded-lg transition-colors ${
              input.trim() && !loading 
                ? (provider === 'gemini' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700') + ' text-white shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center text-xs text-slate-400">
          <AlertCircle size={12} className="mr-1" />
          <span>BioNurse Pro is an AI assistant. For emergencies, please call your local emergency number immediately.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
