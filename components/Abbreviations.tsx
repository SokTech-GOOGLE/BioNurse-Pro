import React, { useState } from 'react';
import { Search, Book } from 'lucide-react';
import { ABBREVIATIONS } from '../data/medicalData';

const Abbreviations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = ABBREVIATIONS.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Book className="mr-3 text-emerald-600" />
          Medical Abbreviations
        </h2>
        <p className="text-slate-500 mt-2">Common clinical shorthand definitions.</p>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 relative">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search abbreviation or definition..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-700 text-sm uppercase w-1/4">Term</th>
              <th className="p-4 font-bold text-slate-700 text-sm uppercase w-1/2">Definition</th>
              <th className="p-4 font-bold text-slate-700 text-sm uppercase w-1/4">Category</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-emerald-700 font-mono text-lg">{item.term}</td>
                <td className="p-4 text-slate-700 font-medium">{item.definition}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                    {item.category}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
               <tr><td colSpan={3} className="p-8 text-center text-slate-400">No abbreviations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Abbreviations;
