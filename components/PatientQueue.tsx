import React, { useState, useEffect } from 'react';
import { Users, Clock, MoreVertical, FileText, Plus, X, Trash2, CheckCircle } from 'lucide-react';
import { Patient } from '../types';
import { getPatients, savePatients, addActivity } from '../services/storage';

const PatientQueue: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '', age: 0, gender: 'M', condition: '', triage: 'Stable'
  });

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.condition) return;

    const p: Patient = {
      id: Date.now().toString(),
      name: newPatient.name!,
      age: newPatient.age || 0,
      gender: newPatient.gender as 'M' | 'F',
      condition: newPatient.condition!,
      triage: (newPatient.triage as any) || 'Stable',
      waitingTime: '0m',
      avatarColor: ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500'][Math.floor(Math.random()*5)]
    };

    const updated = [p, ...patients];
    setPatients(updated);
    savePatients(updated);
    addActivity(`New admission: ${p.name} (${p.condition})`, 'alert');
    setShowModal(false);
    setNewPatient({ name: '', age: 0, gender: 'M', condition: '', triage: 'Stable' });
  };

  const handleDischarge = (id: string) => {
    const p = patients.find(pat => pat.id === id);
    const updated = patients.filter(pat => pat.id !== id);
    setPatients(updated);
    savePatients(updated);
    if (p) addActivity(`Discharged patient: ${p.name}`, 'success');
  };

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50 relative">
      <header className="mb-8 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center">
             <Users className="mr-3 text-teal-600" />
             Patient Queue
           </h2>
           <p className="text-slate-500 mt-2">Manage active visits and triage status.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-teal-700 flex items-center transition-all"
        >
           <Plus size={18} className="mr-1" /> New Admission
        </button>
      </header>

      <div className="grid gap-4">
        {patients.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            No patients in queue.
          </div>
        ) : (
          patients.map((patient) => (
            <div key={patient.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between group">
              <div className="flex items-center mb-4 md:mb-0">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${patient.avatarColor} shadow-md flex-shrink-0`}>
                    {patient.name.charAt(0)}
                 </div>
                 <div className="ml-4">
                    <h3 className="font-bold text-slate-800 text-lg">{patient.name}</h3>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="mr-3">{patient.age}yrs • {patient.gender}</span>
                      <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded-lg text-xs truncate max-w-[150px] md:max-w-none">
                        <FileText size={12} className="mr-1" /> {patient.condition}
                      </span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between md:justify-end md:gap-6 w-full md:w-auto">
                 <div className="text-left md:text-right">
                    <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full mb-1 inline-block ${
                       patient.triage === 'Critical' ? 'bg-red-100 text-red-600' :
                       patient.triage === 'Urgent' ? 'bg-orange-100 text-orange-600' :
                       'bg-green-100 text-green-600'
                    }`}>
                      {patient.triage}
                    </div>
                    <div className="flex items-center text-slate-400 text-xs md:justify-end">
                      <Clock size={12} className="mr-1" /> Wait: {patient.waitingTime}
                    </div>
                 </div>
                 <button 
                  onClick={() => handleDischarge(patient.id)}
                  className="p-2 ml-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Discharge / Remove"
                 >
                   <Trash2 size={20} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-800">New Admission</h3>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                   <X size={24} />
                 </button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Patient Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" 
                      placeholder="e.g. John Doe"
                      value={newPatient.name}
                      onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Age</label>
                        <input 
                          type="number" 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" 
                          value={newPatient.age || ''}
                          onChange={e => setNewPatient({...newPatient, age: parseInt(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                          value={newPatient.gender}
                          onChange={e => setNewPatient({...newPatient, gender: e.target.value as any})}
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Chief Complaint</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" 
                      placeholder="e.g. Chest Pain"
                      value={newPatient.condition}
                      onChange={e => setNewPatient({...newPatient, condition: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Triage Priority</label>
                    <div className="flex gap-2">
                       {['Stable', 'Urgent', 'Critical'].map(level => (
                         <button
                           key={level}
                           onClick={() => setNewPatient({...newPatient, triage: level as any})}
                           className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${
                             newPatient.triage === level 
                               ? (level === 'Critical' ? 'bg-red-500 text-white border-red-500' : level === 'Urgent' ? 'bg-orange-500 text-white border-orange-500' : 'bg-green-500 text-white border-green-500')
                               : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                           }`}
                         >
                           {level}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                 <button onClick={handleAddPatient} className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-md transition-colors">
                   Admit Patient
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientQueue;
