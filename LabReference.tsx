import React, { useState } from 'react';
import { Search, FlaskConical, Filter } from 'lucide-react';
import { LAB_VALUES } from '../data/medicalData';

const LabReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(LAB_VALUES.map(item => item.category))];

  const filteredValues = LAB_VALUES.filter(item => {
    const matchesSearch = item.test.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <FlaskConical className="mr-3 text-indigo-600" />
          Lab Reference Guide
        </h2>
        <p className="text-slate-500 mt-2">Normal ranges for common clinical laboratory tests.</p>
      </header>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search test (e.g. Hemoglobin, Sodium)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-700 text-sm uppercase">Test Name</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase">Normal Range</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase">Units</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredValues.length > 0 ? (
                filteredValues.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{item.test}</td>
                    <td className="p-4 font-mono text-indigo-600 font-medium">{item.normalRange}</td>
                    <td className="p-4 text-slate-500 text-sm">{item.units}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No lab tests found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabReference;