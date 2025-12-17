import React, { useState, useRef, useEffect } from 'react';
import { Camera, Activity, Fingerprint, Thermometer, Heart, AlertCircle, Scan, Zap } from 'lucide-react';
import { addActivity } from '../services/storage';

const VitalsScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ temp: number; heartRate: number; spo2: number; condition: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions to use the Bio-Scanner.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setProgress(0);
    setResult(null);

    // Simulation of scanning process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishScan();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const finishScan = () => {
    setIsScanning(false);
    
    // AI Estimation Simulation (Randomized within clinical ranges for demo)
    const temp = (97.5 + Math.random() * 2).toFixed(1);
    const heartRate = Math.floor(60 + Math.random() * 40);
    const spo2 = Math.floor(95 + Math.random() * 4);
    
    let condition = "Healthy / Normal";
    if (parseFloat(temp) > 99.0) condition = "Elevated Temp / Possible Inflammation";
    if (heartRate > 90) condition = "Tachycardia / Stress Response";

    setResult({
      temp: parseFloat(temp),
      heartRate,
      spo2,
      condition
    });
    
    addActivity(`Bio-Scan Complete: Temp ${temp}°F, HR ${heartRate}`, 'success');
  };

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-900 text-white flex flex-col items-center justify-center relative">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-cyan-400 flex items-center justify-center tracking-wider">
            <Scan className="mr-3 animate-pulse" /> BIO-SCANNER
          </h2>
          <p className="text-slate-400 text-sm mt-2">AI-Powered Vitals & Symptom Analysis</p>
        </div>

        {/* Camera Viewport */}
        <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-8">
          {!stream && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              Initializing Bio-Sensors...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle size={40} className="text-red-500 mb-4" />
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isScanning ? 'opacity-50' : 'opacity-80'}`} 
          />
          
          {/* Overlay HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Target Reticle */}
            <div className={`w-48 h-64 border-2 border-cyan-400/50 rounded-2xl relative transition-all duration-300 ${isScanning ? 'scale-95 border-cyan-400' : ''}`}>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-400 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-400 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-400 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-400 -mb-1 -mr-1"></div>
              
              {!isScanning && !result && (
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <Fingerprint size={64} className="text-cyan-400/20 animate-pulse" />
                  <p className="text-cyan-400/80 font-mono text-xs mt-4">PLACE FINGER OVER CAMERA</p>
                </div>
              )}
            </div>

            {/* Scanning Line */}
            {isScanning && (
              <div className="absolute top-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scan-down"></div>
            )}
          </div>
        </div>

        {/* Controls & Results */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
           {isScanning ? (
             <div className="text-center py-4">
               <div className="text-cyan-400 font-mono text-xl mb-2 font-bold">{progress}% ANALYZING</div>
               <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                 <div className="bg-cyan-500 h-full transition-all duration-75" style={{width: `${progress}%`}}></div>
               </div>
               <p className="text-xs text-slate-400 mt-2">Measuring vascular micro-changes...</p>
             </div>
           ) : result ? (
             <div className="animate-fade-in-up">
               <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 text-center">
                   <Thermometer size={20} className="mx-auto text-orange-400 mb-1" />
                   <div className="text-2xl font-bold text-white">{result.temp}°F</div>
                   <div className="text-[10px] text-slate-400">TEMP</div>
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 text-center">
                   <Heart size={20} className="mx-auto text-red-500 mb-1" />
                   <div className="text-2xl font-bold text-white">{result.heartRate}</div>
                   <div className="text-[10px] text-slate-400">BPM</div>
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 text-center">
                   <Activity size={20} className="mx-auto text-cyan-400 mb-1" />
                   <div className="text-2xl font-bold text-white">{result.spo2}%</div>
                   <div className="text-[10px] text-slate-400">SpO2</div>
                 </div>
               </div>
               <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl mb-4">
                 <div className="text-xs text-cyan-400 font-bold uppercase mb-1">AI Assessment</div>
                 <div className="text-white font-medium">{result.condition}</div>
               </div>
               <button onClick={handleScan} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white transition-colors">
                 Scan Again
               </button>
             </div>
           ) : (
             <button 
               onMouseDown={handleScan}
               onTouchStart={handleScan}
               disabled={!stream}
               className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-lg text-white shadow-lg shadow-cyan-900/50 transition-all flex items-center justify-center"
             >
               <Fingerprint size={24} className="mr-3" />
               HOLD TO SCAN
             </button>
           )}
           
           <div className="mt-4 text-center">
              <p className="text-[10px] text-slate-500 flex items-center justify-center">
                <AlertCircle size={10} className="mr-1" /> 
                Experimental AI Feature. Not for medical diagnosis.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsScanner;
