import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, Heart, Thermometer, Droplets } from 'lucide-react';

const mockData = [
  { name: 'Mon', heartRate: 72, temp: 98.6 },
  { name: 'Tue', heartRate: 75, temp: 98.4 },
  { name: 'Wed', heartRate: 70, temp: 98.7 },
  { name: 'Thu', heartRate: 74, temp: 98.5 },
  { name: 'Fri', heartRate: 78, temp: 98.9 },
  { name: 'Sat', heartRate: 71, temp: 98.3 },
  { name: 'Sun', heartRate: 73, temp: 98.6 },
];

const StatCard = ({ icon: Icon, title, value, unit, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">+2.5%</span>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <div className="flex items-baseline">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <span className="ml-1 text-sm text-slate-400">{unit}</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Health Overview</h2>
        <p className="text-slate-500">Welcome back to BioNurse Pro. Here is your daily summary.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Heart} 
          title="Avg Heart Rate" 
          value="72" 
          unit="bpm" 
          color="bg-rose-500" 
        />
        <StatCard 
          icon={Thermometer} 
          title="Body Temp" 
          value="98.6" 
          unit="°F" 
          color="bg-orange-500" 
        />
        <StatCard 
          icon={Droplets} 
          title="Blood Pressure" 
          value="120/80" 
          unit="mmHg" 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Activity} 
          title="Sleep Score" 
          value="85" 
          unit="/100" 
          color="bg-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Heart Rate Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Temperature History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={[96, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
