import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Activity, Heart, Thermometer, Droplets, Stethoscope, Clock, Calendar, Zap } from 'lucide-react';
import { getActivities } from '../services/storage';
import { ActivityLog } from '../types';

const StatCard = ({ icon: Icon, title, value, unit, color, gradient, animate }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`${color.replace('bg-', 'text-')} ${animate ? 'animate-pulse' : ''}`} size={24} />
      </div>
      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Normal</span>
    </div>
    <div className="relative z-10">
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline">
        <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
        <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  // Live Data State
  const [heartRate, setHeartRate] = useState(72);
  const [data, setData] = useState([
    { name: '00', heartRate: 72, temp: 98.6 },
    { name: '05', heartRate: 75, temp: 98.4 },
    { name: '10', heartRate: 71, temp: 98.7 },
    { name: '15', heartRate: 74, temp: 98.5 },
    { name: '20', heartRate: 78, temp: 99.1 },
    { name: '25', heartRate: 73, temp: 98.6 },
    { name: '30', heartRate: 72, temp: 98.4 },
  ]);

  useEffect(() => {
    // Load initial activities
    setActivities(getActivities());

    // Listen for new activities from other components
    const handleStorageUpdate = () => {
      setActivities(getActivities());
    };
    window.addEventListener('activityUpdated', handleStorageUpdate);

    // Live Chart Interval
    const interval = setInterval(() => {
      setHeartRate(prev => {
        // Random fluctuation between 68 and 85
        const fluctuation = Math.floor(Math.random() * 5) - 2;
        let nextVal = prev + fluctuation;
        if (nextVal > 85) nextVal = 85;
        if (nextVal < 68) nextVal = 68;
        return nextVal;
      });

      setData(prevData => {
        const lastEntry = prevData[prevData.length - 1];
        // Parse the "minutes" and add 5
        let nextTime = parseInt(lastEntry.name) + 5;
        if (nextTime >= 60) nextTime = 0;
        
        const newEntry = {
          name: nextTime.toString().padStart(2, '0'),
          heartRate: Math.floor(68 + Math.random() * 15),
          temp: parseFloat((98.2 + Math.random()).toFixed(1))
        };
        
        return [...prevData.slice(1), newEntry];
      });
    }, 2000); // Update every 2 seconds for visual effect

    return () => {
      clearInterval(interval);
      window.removeEventListener('activityUpdated', handleStorageUpdate);
    };
  }, []);

  return (
    <div className="p-6 md:p-10 overflow-y-auto h-full bg-slate-50">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center">
             Doctor's Dashboard
             <span className="ml-3 flex h-3 w-3 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
             </span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Real-time patient monitoring and analytics.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Calendar size={18} className="text-slate-400 mr-2" />
          <span className="text-sm font-semibold text-slate-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={Heart} 
          title="Pulse Rate" 
          value={heartRate} 
          unit="bpm" 
          color="bg-rose-500" 
          gradient="from-rose-500 to-rose-700"
          animate={true}
        />
        <StatCard 
          icon={Thermometer} 
          title="Temperature" 
          value={data[data.length-1].temp} 
          unit="°F" 
          color="bg-orange-500" 
          gradient="from-orange-500 to-orange-700"
        />
        <StatCard 
          icon={Droplets} 
          title="Blood Pressure" 
          value="118/78" 
          unit="mmHg" 
          color="bg-blue-500" 
          gradient="from-blue-500 to-blue-700"
        />
        <StatCard 
          icon={Stethoscope} 
          title="Resp. Rate" 
          value="16" 
          unit="rpm" 
          color="bg-teal-500" 
          gradient="from-teal-500 to-teal-700"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Large Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <Activity className="mr-2 text-rose-500" size={20} />
              Live Vitals Monitor
            </h3>
            <div className="flex space-x-2">
               <span className="w-3 h-3 rounded-full bg-rose-500"></span><span className="text-xs text-slate-500 mr-2">Heart Rate</span>
               <span className="w-3 h-3 rounded-full bg-orange-400"></span><span className="text-xs text-slate-500">Temp</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" animationDuration={1000} />
                <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel / Quick Actions */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[480px]">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Zap className="mr-2 text-yellow-500" size={20} />
            System Activity
          </h3>
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {activities.length > 0 ? activities.map((item, idx) => (
              <div key={idx} className="flex relative pl-6 pb-2 animate-fade-in-up">
                <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                  item.type === 'alert' ? 'bg-red-500' : 
                  item.type === 'note' ? 'bg-blue-500' : 
                  item.type === 'success' ? 'bg-green-500' : 'bg-teal-500'
                }`}></div>
                <div className="absolute left-1.5 top-4 bottom-0 w-px bg-slate-100"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">{item.time}</p>
                  <p className="text-sm font-medium text-slate-700 leading-snug">{item.text}</p>
                </div>
              </div>
            )) : (
              <div className="text-center text-slate-400 mt-10">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;