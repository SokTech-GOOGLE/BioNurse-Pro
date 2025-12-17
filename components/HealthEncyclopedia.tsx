import React, { useState } from 'react';
import { Search, BookOpen, Activity, AlertCircle } from 'lucide-react';
import { DISEASE_DB } from '../data/medicalData';

const HealthEncyclopedia: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = DISEASE_DB.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <BookOpen className="mr-3 text-emerald-600" />
          Health Encyclopedia
        </h2>
        <p className="text-slate-500 mt-2">Comprehensive guide to common diseases, symptoms, and treatments.</p>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 relative">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search conditions (e.g. Diabetes, Flu, Migraine)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((disease, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-slate-800">{disease.name}</h3>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                {disease.category}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
               <div>
                  <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase mb-2">
                    <AlertCircle size={14} className="mr-2 text-orange-500" /> Symptoms
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{disease.symptoms}</p>
               </div>
               <div>
                  <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase mb-2">
                    <Activity size={14} className="mr-2 text-blue-500" /> Treatment / Management
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{disease.treatment}</p>
               </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
           <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
             No conditions found matching your search.
           </div>
        )}
      </div>
    </div>
  );
};

export default HealthEncyclopedia;
