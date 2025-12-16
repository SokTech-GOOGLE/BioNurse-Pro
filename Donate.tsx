import React from 'react';
import { CreditCard, Smartphone, CheckCircle, MessageCircle, Facebook, Users } from 'lucide-react';
import { DONATION_INFO, COMMUNITY_LINKS } from '../constants';

const Donate: React.FC = () => {
  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50 flex flex-col items-center">
       <div className="max-w-3xl w-full pb-10">
         <div className="text-center mb-10">
           <h2 className="text-3xl font-bold text-slate-800 mb-4">Support BioNurse Pro</h2>
           <p className="text-slate-600 max-w-lg mx-auto">
             Help us maintain the AI infrastructure and bring better healthcare tools to everyone. 
             Upgrade to Premium for faster AI responses.
           </p>
         </div>

         <div className="grid md:grid-cols-2 gap-6 mb-10">
           {/* MoMo Card */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-teal-400 transition-colors">
              <div className="absolute top-0 right-0 bg-yellow-400 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-20 group-hover:scale-110 transition-transform"></div>
              <div className="mb-6 bg-yellow-50 w-12 h-12 rounded-xl flex items-center justify-center text-yellow-600">
                 <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Mobile Money</h3>
              <p className="text-sm text-slate-500 mb-6">Send support via MoMo (Liberia)</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="font-mono text-lg font-bold text-slate-700">{DONATION_INFO.momo}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(DONATION_INFO.momo)}
                  className="text-xs text-teal-600 font-bold hover:underline"
                >
                  COPY
                </button>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-400">
                <CheckCircle size={12} className="mr-1 text-teal-500" /> Verified Merchant
              </div>
           </div>

           {/* UBA Card */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-red-400 transition-colors">
              <div className="absolute top-0 right-0 bg-red-400 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-20 group-hover:scale-110 transition-transform"></div>
              <div className="mb-6 bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center text-red-600">
                 <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Bank Transfer</h3>
              <p className="text-sm text-slate-500 mb-6">Direct deposit via UBA</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="font-mono text-lg font-bold text-slate-700">{DONATION_INFO.uba}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(DONATION_INFO.uba)}
                  className="text-xs text-teal-600 font-bold hover:underline"
                >
                  COPY
                </button>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-400">
                <CheckCircle size={12} className="mr-1 text-teal-500" /> Akin S. Sokpah
              </div>
           </div>
         </div>

         {/* Community Section */}
         <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>
            
            <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                    <Users className="mr-3" /> Join Our Community
                </h3>
                <p className="mb-8 text-teal-100 max-w-lg mx-auto">
                    Connect with fellow nurses, students, and medical professionals. Share knowledge, ask questions, and get the latest updates.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a 
                        href={COMMUNITY_LINKS.whatsapp} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg transform hover:-translate-y-1"
                    >
                        <MessageCircle className="mr-2" /> WhatsApp Group
                    </a>
                    <a 
                        href={COMMUNITY_LINKS.messenger} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg transform hover:-translate-y-1"
                    >
                        <Facebook className="mr-2" /> Messenger Group
                    </a>
                </div>
            </div>
         </div>

       </div>
    </div>
  );
};

export default Donate;