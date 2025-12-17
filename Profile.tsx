import React from 'react';
import { User } from 'firebase/auth';
import { MapPin, Globe, Award, MessageCircle, Facebook, Radio } from 'lucide-react';
import { CREATOR_INFO, COMMUNITY_LINKS } from '../constants';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full bg-slate-50">
       <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
             <div className="h-32 bg-teal-600"></div>
             <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-4">
                   <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0f766e&color=fff&size=128`} 
                      className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                      alt="User"
                   />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{user.displayName || 'BioNurse User'}</h2>
                <p className="text-slate-500">{user.email}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-100">Free Access</span>
                   <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold border border-slate-200">Guest ID: #BN-{user.uid.slice(0,6)}</span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Community</h3>
             <p className="text-slate-600 mb-6 text-sm">Join our official groups to stay updated.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                   href={COMMUNITY_LINKS.channel} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors sm:col-span-2"
                >
                   <div className="bg-emerald-200 p-2 rounded-lg mr-3">
                      <Radio size={20} className="text-emerald-700" />
                   </div>
                   <span className="font-semibold">Official WhatsApp Channel</span>
                </a>
                <a 
                   href={COMMUNITY_LINKS.whatsapp} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center p-3 rounded-xl bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 transition-colors"
                >
                   <div className="bg-green-200 p-2 rounded-lg mr-3">
                      <MessageCircle size={20} className="text-green-700" />
                   </div>
                   <span className="font-semibold">WhatsApp Group</span>
                </a>
                <a 
                   href={COMMUNITY_LINKS.messenger} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                   <div className="bg-blue-200 p-2 rounded-lg mr-3">
                      <Facebook size={20} className="text-blue-700" />
                   </div>
                   <span className="font-semibold">Messenger Group</span>
                </a>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
             <h3 className="text-lg font-bold text-slate-800 mb-4">About BioNurse Pro</h3>
             <p className="text-slate-600 mb-6 leading-relaxed">
               BioNurse Pro uses state-of-the-art AI to provide preliminary health assessments. 
               Always consult with a real medical professional for serious conditions.
             </p>
             
             <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Developer Info</h4>
                <div className="space-y-3">
                   <div className="flex items-center text-slate-700">
                      <Award size={18} className="text-teal-500 mr-3" />
                      <span>Created by <span className="font-bold">{CREATOR_INFO.name}</span></span>
                   </div>
                   <div className="flex items-center text-slate-700">
                      <MapPin size={18} className="text-teal-500 mr-3" />
                      <span>{CREATOR_INFO.location}</span>
                   </div>
                   <div className="flex items-center text-slate-700">
                      <Globe size={18} className="text-teal-500 mr-3" />
                      <span>{CREATOR_INFO.role}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Profile;