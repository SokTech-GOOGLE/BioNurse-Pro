import React, { useState } from 'react';
import { Pill, Search, AlertTriangle, FileText } from 'lucide-react';
import { DRUG_DB } from '../data/medicalData';

const DrugReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrugs = DRUG_DB.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drug.indication.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Pill className="mr-3 text-indigo-600" />
          Drug Reference Guide
        </h2>
        <p className="text-slate-500 mt-2">Essential pharmacology for nurses and clinicians.</p>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 relative">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search generic name, class, or indication..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrugs.map((drug, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-slate-800">{drug.name}</h3>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">{drug.class}</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400 font-semibold text-xs uppercase block mb-1">Indication</span>
                <p className="text-slate-700 font-medium">{drug.indication}</p>
              </div>
              
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-semibold text-xs uppercase block mb-1">Typical Dose</span>
                <p className="text-slate-800 font-mono">{drug.dose}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold text-xs uppercase block mb-1">Side Effects / Warnings</span>
                <div className="flex items-start text-red-600 text-xs font-medium">
                  <AlertTriangle size={12} className="mr-1.5 mt-0.5 flex-shrink-0" />
                  {drug.sideEffects}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredDrugs.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-400">
            No drugs found matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugReference;