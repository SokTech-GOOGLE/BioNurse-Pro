import React, { useState } from 'react';
import { Search, Stethoscope, ChevronRight } from 'lucide-react';
import { MEDICAL_SPECIALTIES } from '../data/medicalData';

const SpecialtyGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MEDICAL_SPECIALTIES.filter(spec => 
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    spec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.conditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Stethoscope className="mr-3 text-blue-600" />
          Medical Specialty Guide
        </h2>
        <p className="text-slate-500 mt-2">Find the right type of doctor for your health needs.</p>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 relative">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by doctor type (e.g. Heart, Skin) or condition..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((spec) => (
          <div key={spec.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center mb-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <Stethoscope size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-slate-800 text-lg">{spec.name}</h3>
                 <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">{spec.title}</p>
               </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              {spec.description}
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Commonly Treats:</span>
              <div className="flex flex-wrap gap-2">
                {spec.conditions.map((cond, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium">
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
           <div className="col-span-full text-center py-12 text-slate-400">
             No specialties found. Try searching for "Heart" or "Cancer".
           </div>
        )}
      </div>
    </div>
  );
};

export default SpecialtyGuide;