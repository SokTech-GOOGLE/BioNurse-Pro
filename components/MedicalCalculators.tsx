import React, { useState } from 'react';
import { Calculator, Baby, Droplets, Activity, Brain, HeartPulse, Flame, Syringe } from 'lucide-react';

const MedicalCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' shows grid of tools

  // --- BMI State ---
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // --- IV State ---
  const [volume, setVolume] = useState('');
  const [time, setTime] = useState('');
  const [dropFactor, setDropFactor] = useState('20');
  const [ivResult, setIvResult] = useState<number | null>(null);

  // --- EDD State ---
  const [lmp, setLmp] = useState('');
  const [eddResult, setEddResult] = useState<string | null>(null);

  // --- MAP State ---
  const [sbp, setSbp] = useState('');
  const [dbp, setDbp] = useState('');
  const [mapResult, setMapResult] = useState<number | null>(null);

  // --- GCS State ---
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // --- APGAR State ---
  const [apgarActivity, setApgarActivity] = useState(0);
  const [apgarPulse, setApgarPulse] = useState(0);
  const [apgarGrimace, setApgarGrimace] = useState(0);
  const [apgarAppearance, setApgarAppearance] = useState(0);
  const [apgarRespiration, setApgarRespiration] = useState(0);

  // --- BURN (Parkland) ---
  const [burnWeight, setBurnWeight] = useState('');
  const [bsa, setBsa] = useState('');
  const [fluidResult, setFluidResult] = useState<string | null>(null);

  // --- PEDS DOSE ---
  const [pedsWeight, setPedsWeight] = useState('');
  const [dosePerKg, setDosePerKg] = useState('');
  const [pedsResult, setPedsResult] = useState<string | null>(null);


  // Calculations
  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w && h) {
      const hMeters = h / 100;
      setBmiResult(parseFloat((w / (hMeters * hMeters)).toFixed(2)));
    }
  };

  const calculateIV = () => {
    const v = parseFloat(volume);
    const t = parseFloat(time);
    const df = parseFloat(dropFactor);
    if (v && t && df) setIvResult(Math.round((v * df) / (t * 60)));
  };

  const calculateEDD = () => {
    if (lmp) {
      const date = new Date(lmp);
      date.setDate(date.getDate() + 280);
      setEddResult(date.toDateString());
    }
  };

  const calculateMAP = () => {
    const s = parseFloat(sbp);
    const d = parseFloat(dbp);
    if (s && d) {
      const map = d + (1/3) * (s - d);
      setMapResult(parseFloat(map.toFixed(1)));
    }
  };

  const calculateBurn = () => {
    const w = parseFloat(burnWeight);
    const b = parseFloat(bsa);
    if (w && b) {
      const total = 4 * w * b; // Parkland: 4ml * kg * %BSA
      setFluidResult(`${total} ml`);
    }
  };

  const calculatePeds = () => {
    const w = parseFloat(pedsWeight);
    const d = parseFloat(dosePerKg);
    if (w && d) {
      setPedsResult(`${w * d} mg`);
    }
  };

  const ToolCard = ({ id, icon: Icon, title, desc, color }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
    >
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={color.replace('bg-', 'text-')} size={28} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );

  const BackButton = () => (
    <button onClick={() => setActiveTab('menu')} className="mb-6 flex items-center text-slate-500 hover:text-teal-600 font-bold">
      ← Back to Tools
    </button>
  );

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      {activeTab === 'menu' ? (
        <>
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Calculator className="mr-3 text-teal-600" />
              Clinical Calculators
            </h2>
            <p className="text-slate-500 mt-2">Professional medical tools for daily practice.</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard id="bmi" icon={Activity} title="BMI Calculator" desc="Body Mass Index & Weight" color="bg-teal-500" />
            <ToolCard id="iv" icon={Droplets} title="IV Drip Rate" desc="Flow rate in gtts/min" color="bg-blue-500" />
            <ToolCard id="edd" icon={Baby} title="Due Date" desc="Naegele's Rule" color="bg-rose-500" />
            <ToolCard id="map" icon={HeartPulse} title="MAP" desc="Mean Arterial Pressure" color="bg-red-500" />
            <ToolCard id="gcs" icon={Brain} title="GCS Score" desc="Neuro Assessment" color="bg-purple-500" />
            <ToolCard id="apgar" icon={Baby} title="APGAR" desc="Newborn Assessment" color="bg-orange-500" />
            <ToolCard id="burn" icon={Flame} title="Parkland Formula" desc="Burn Fluid Resuscitation" color="bg-orange-600" />
            <ToolCard id="peds" icon={Syringe} title="Peds Dosing" desc="Weight-based Dosage" color="bg-green-600" />
          </div>
        </>
      ) : (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <BackButton />
          
          {/* BMI */}
          {activeTab === 'bmi' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-teal-500"/> Body Mass Index</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
                <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
              </div>
              <button onClick={calculateBMI} className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl mb-6">Calculate</button>
              {bmiResult && <div className="text-center p-4 bg-teal-50 rounded-xl text-teal-800 font-bold text-3xl">{bmiResult} <span className="text-sm font-normal block mt-1">kg/m²</span></div>}
            </div>
          )}

          {/* Burn / Parkland */}
          {activeTab === 'burn' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Flame className="mr-2 text-orange-600"/> Parkland Burn Formula</h3>
              <p className="text-sm text-slate-500 mb-4">Total fluid requirement for first 24h (Lactated Ringer's)</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="number" placeholder="Weight (kg)" value={burnWeight} onChange={e => setBurnWeight(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
                <input type="number" placeholder="% BSA Burned" value={bsa} onChange={e => setBsa(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
              </div>
              <button onClick={calculateBurn} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl mb-6">Calculate Volume</button>
              {fluidResult && (
                <div className="text-center p-6 bg-orange-50 rounded-xl text-orange-800">
                   <div className="text-3xl font-bold mb-2">{fluidResult}</div>
                   <div className="text-sm font-medium grid grid-cols-2 gap-4 mt-4 text-left">
                     <div className="bg-white p-2 rounded-lg">1st 8 hrs: <span className="font-bold">{parseFloat(fluidResult)/2} ml</span></div>
                     <div className="bg-white p-2 rounded-lg">Next 16 hrs: <span className="font-bold">{parseFloat(fluidResult)/2} ml</span></div>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Pediatric Dose */}
          {activeTab === 'peds' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Syringe className="mr-2 text-green-600"/> Pediatric Dosage</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="number" placeholder="Child Weight (kg)" value={pedsWeight} onChange={e => setPedsWeight(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
                <input type="number" placeholder="Dose (mg/kg)" value={dosePerKg} onChange={e => setDosePerKg(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
              </div>
              <button onClick={calculatePeds} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl mb-6">Calculate Total Dose</button>
              {pedsResult && <div className="text-center p-4 bg-green-50 rounded-xl text-green-800 font-bold text-3xl">{pedsResult}</div>}
            </div>
          )}

          {/* MAP */}
          {activeTab === 'map' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><HeartPulse className="mr-2 text-red-500"/> Mean Arterial Pressure</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="number" placeholder="Systolic (Top)" value={sbp} onChange={e => setSbp(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
                <input type="number" placeholder="Diastolic (Bottom)" value={dbp} onChange={e => setDbp(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
              </div>
              <button onClick={calculateMAP} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl mb-6">Calculate MAP</button>
              {mapResult && (
                <div className="text-center p-4 bg-red-50 rounded-xl text-red-800 font-bold text-3xl">
                  {mapResult} <span className="text-sm font-normal block mt-1">mmHg</span>
                  <span className="text-xs font-normal text-red-600 block mt-1">{mapResult >= 65 ? 'Perfusion Likely Adequate' : 'Perfusion Risk (<65)'}</span>
                </div>
              )}
            </div>
          )}

          {/* GCS */}
          {activeTab === 'gcs' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Brain className="mr-2 text-purple-500"/> Glasgow Coma Scale</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Eye Opening</label>
                  <select value={gcsEye} onChange={e => setGcsEye(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <option value={4}>4 - Spontaneous</option>
                    <option value={3}>3 - To Sound</option>
                    <option value={2}>2 - To Pressure</option>
                    <option value={1}>1 - None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Verbal Response</label>
                  <select value={gcsVerbal} onChange={e => setGcsVerbal(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <option value={5}>5 - Oriented</option>
                    <option value={4}>4 - Confused</option>
                    <option value={3}>3 - Words</option>
                    <option value={2}>2 - Sounds</option>
                    <option value={1}>1 - None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Motor Response</label>
                  <select value={gcsMotor} onChange={e => setGcsMotor(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <option value={6}>6 - Obeys Commands</option>
                    <option value={5}>5 - Localising</option>
                    <option value={4}>4 - Normal Flexion</option>
                    <option value={3}>3 - Abnormal Flexion</option>
                    <option value={2}>2 - Extension</option>
                    <option value={1}>1 - None</option>
                  </select>
                </div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl text-purple-800">
                <div className="text-4xl font-bold">{gcsEye + gcsVerbal + gcsMotor} <span className="text-lg text-purple-600">/ 15</span></div>
                <div className="text-sm mt-2 font-medium">
                  {gcsEye + gcsVerbal + gcsMotor <= 8 ? 'Severe Head Injury (Coma)' : gcsEye + gcsVerbal + gcsMotor <= 12 ? 'Moderate Head Injury' : 'Mild Head Injury'}
                </div>
              </div>
            </div>
          )}

          {/* APGAR */}
          {activeTab === 'apgar' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Baby className="mr-2 text-orange-500"/> APGAR Score</h3>
              
              <div className="space-y-4 mb-6">
                {[
                  { label: "Appearance (Color)", state: apgarAppearance, setter: setApgarAppearance, opts: ["Blue/Pale (0)", "Body Pink/Ext Blue (1)", "All Pink (2)"] },
                  { label: "Pulse (Heart Rate)", state: apgarPulse, setter: setApgarPulse, opts: ["Absent (0)", "<100 bpm (1)", ">100 bpm (2)"] },
                  { label: "Grimace (Reflex)", state: apgarGrimace, setter: setApgarGrimace, opts: ["No Response (0)", "Grimace (1)", "Cry/Cough (2)"] },
                  { label: "Activity (Tone)", state: apgarActivity, setter: setApgarActivity, opts: ["Flaccid (0)", "Some Flexion (1)", "Active Motion (2)"] },
                  { label: "Respiration", state: apgarRespiration, setter: setApgarRespiration, opts: ["Absent (0)", "Slow/Irregular (1)", "Good/Crying (2)"] }
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</label>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      {item.opts.map((opt, val) => (
                         <button 
                           key={val} 
                           onClick={() => item.setter(val)}
                           className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${item.state === val ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}
                         >
                           {opt}
                         </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-xl text-orange-800">
                <div className="text-4xl font-bold">{apgarAppearance + apgarPulse + apgarGrimace + apgarActivity + apgarRespiration} <span className="text-lg text-orange-600">/ 10</span></div>
                <div className="text-sm mt-2 font-medium">
                  Normal: 7-10 | Moderately Depressed: 4-6 | Critical: 0-3
                </div>
              </div>
            </div>
          )}

           {/* IV Calculator (Simplified View) */}
           {activeTab === 'iv' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">IV Drip Rate</h3>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <input type="number" placeholder="Volume (ml)" value={volume} onChange={e => setVolume(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
                  <input type="number" placeholder="Time (hrs)" value={time} onChange={e => setTime(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200" />
                  <select value={dropFactor} onChange={e => setDropFactor(e.target.value)} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                     <option value="10">10 gtt/ml</option>
                     <option value="15">15 gtt/ml</option>
                     <option value="20">20 gtt/ml</option>
                     <option value="60">60 gtt/ml</option>
                  </select>
                </div>
                <button onClick={calculateIV} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mb-6">Calculate</button>
                {ivResult && <div className="text-center p-4 bg-blue-50 rounded-xl text-blue-800 font-bold text-3xl">{ivResult} <span className="text-lg">gtts/min</span></div>}
              </div>
           )}

            {/* EDD (Simplified View) */}
           {activeTab === 'edd' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Due Date Calculator</h3>
                <input type="date" value={lmp} onChange={e => setLmp(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4" />
                <button onClick={calculateEDD} className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl mb-6">Calculate</button>
                {eddResult && <div className="text-center p-4 bg-rose-50 rounded-xl text-rose-800 font-bold text-2xl">{eddResult}</div>}
              </div>
           )}

        </div>
      )}
    </div>
  );
};

export default MedicalCalculators;
