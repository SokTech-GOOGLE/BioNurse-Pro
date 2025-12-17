import React, { useState } from 'react';
import { ClipboardList, Copy, RefreshCw, Send } from 'lucide-react';

const SbarGenerator: React.FC = () => {
  const [sbar, setSbar] = useState({
    situation: '',
    background: '',
    assessment: '',
    recommendation: ''
  });
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSbar({ ...sbar, [e.target.name]: e.target.value });
  };

  const generateText = () => {
    return `*SBAR HANDOVER REPORT*\n\n*SITUATION:*\n${sbar.situation || 'N/A'}\n\n*BACKGROUND:*\n${sbar.background || 'N/A'}\n\n*ASSESSMENT:*\n${sbar.assessment || 'N/A'}\n\n*RECOMMENDATION:*\n${sbar.recommendation || 'N/A'}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSbar({ situation: '', background: '', assessment: '', recommendation: '' });
  };

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <ClipboardList className="mr-3 text-teal-600" />
          SBAR Handover Tool
        </h2>
        <p className="text-slate-500 mt-2">Standardized communication tool for healthcare professionals.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-teal-700 mb-2 uppercase tracking-wide">Situation</label>
            <p className="text-xs text-slate-400 mb-2">Identify yourself, the patient, and the immediate problem.</p>
            <textarea 
              name="situation" 
              value={sbar.situation} 
              onChange={handleChange}
              rows={3} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              placeholder="Dr. X, this is Nurse Y. I am calling about..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-teal-700 mb-2 uppercase tracking-wide">Background</label>
            <p className="text-xs text-slate-400 mb-2">Admitting diagnosis, history, current meds, and vitals.</p>
            <textarea 
              name="background" 
              value={sbar.background} 
              onChange={handleChange}
              rows={3} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              placeholder="Patient was admitted for... Vitals are..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-teal-700 mb-2 uppercase tracking-wide">Assessment</label>
            <p className="text-xs text-slate-400 mb-2">What do you think is going on? Your clinical impression.</p>
            <textarea 
              name="assessment" 
              value={sbar.assessment} 
              onChange={handleChange}
              rows={3} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              placeholder="I think the problem might be... The patient seems..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-teal-700 mb-2 uppercase tracking-wide">Recommendation</label>
            <p className="text-xs text-slate-400 mb-2">What do you want the physician to do?</p>
            <textarea 
              name="recommendation" 
              value={sbar.recommendation} 
              onChange={handleChange}
              rows={3} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              placeholder="I recommend we... Can you come see the patient?"
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-teal-900 text-white p-8 rounded-3xl shadow-xl">
             <h3 className="text-xl font-bold mb-6 flex items-center">
               <Send size={20} className="mr-3 text-teal-400" />
               Generated Report
             </h3>
             <div className="bg-white/10 p-6 rounded-xl font-mono text-sm leading-relaxed whitespace-pre-wrap mb-6 border border-white/10">
               {generateText()}
             </div>
             
             <div className="flex gap-4">
               <button 
                 onClick={handleCopy}
                 className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg"
               >
                 {copied ? 'Copied!' : <><Copy size={18} className="mr-2" /> Copy to Clipboard</>}
               </button>
               <button 
                 onClick={handleReset}
                 className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center"
               >
                 <RefreshCw size={18} />
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SbarGenerator;
