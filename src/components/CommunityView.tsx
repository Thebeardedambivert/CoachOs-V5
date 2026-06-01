import React, { useState } from 'react';
import { CommunityMember } from '../types';

interface CommunityProps {
  members: CommunityMember[];
  onActionNotification: (message: string) => void;
  onAddMember: (name: string, onboardingStatus: CommunityMember['onboardingStatus']) => void;
}

export default function CommunityView({
  members,
  onActionNotification,
  onAddMember,
}: CommunityProps) {
  const [selectedSubTab, setSelectedSubTab] = useState<'All' | 'Completed' | 'Drip'>('All');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberStatus, setNewMemberStatus] = useState<CommunityMember['onboardingStatus']>('Day 2 Drip');

  const filteredMembers = members.filter(member => {
    if (selectedSubTab === 'All') return true;
    if (selectedSubTab === 'Completed') return member.onboardingStatus === 'Completed';
    if (selectedSubTab === 'Drip') return member.onboardingStatus !== 'Completed';
    return true;
  });

  const getDripBadgeStyle = (status: CommunityMember['onboardingStatus']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Day 5 Drip':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Day 3 Drip':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Day 2 Drip':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember(newMemberName, newMemberStatus);
    setIsAddingMember(false);
    setNewMemberName('');
    onActionNotification(`Student registered! Added "${newMemberName}" onboarding sequence.`);
  };

  return (
    <div className="space-y-6" style={{ marginTop: '5px', paddingTop: '4px', paddingLeft: '12px' }}>
      {/* Top Header */}
      <header 
        className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-4 md:py-0 px-6 sticky top-0 bg-[#faf9f8] z-30 md:h-16 shadow-sm -mx-6 mb-2 border-b border-[#c6c5d5] w-auto"
        style={{
          paddingLeft: '26px',
          marginLeft: '-36px',
          marginTop: '-6px',
          marginBottom: '13px',
          paddingTop: '15px',
          paddingBottom: '0px',
          height: '102.025px'
        }}
      >
        {/* Left: Title side with horizontal offset shift */}
        <div className="flex items-center">
          <h2 
            className="text-xl font-bold text-[#4450b7] pl-14"
            style={{
              marginTop: '-3px',
              marginLeft: '-36px',
              paddingTop: '1px',
              fontSize: '16px',
              textAlign: 'left',
              width: '180.312px',
              height: '26px'
            }}
          >
            Community
          </h2>
        </div>

        {/* Center: Placeholder for uniform columns */}
        <div className="hidden md:block"></div>

        {/* Right: Actions */}
        <div 
          className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 justify-between md:justify-end shrink-0"
          style={{ marginTop: '-12px' }}
        >
          <button 
            type="button"
            onClick={() => {
              onActionNotification("Broadcast email pipeline queued on Supabase.");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c6c5d5] rounded-xl font-semibold text-xs text-[#5f5e5c] hover:bg-[#faf9f8] transition-colors bg-white hover:text-[#4450b7] shrink-0"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            <span>Broadcast Email</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setIsAddingMember(true)}
            className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
            <span>Add Student</span>
          </button>
        </div>
      </header>

      {/* Segmented controls filtering */}
      <div className="flex items-center justify-between" style={{ marginTop: '9px' }}>
        <div className="flex items-center gap-1 p-1 bg-[#efeeed] rounded-xl w-fit">
          <button
            onClick={() => setSelectedSubTab('All')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
              selectedSubTab === 'All' ? 'bg-white text-[#4450b7] shadow-sm' : 'text-[#5f5e5c] hover:bg-white/50'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setSelectedSubTab('Completed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
              selectedSubTab === 'Completed' ? 'bg-white text-[#4450b7] shadow-sm' : 'text-[#5f5e5c] hover:bg-white/50'
            }`}
          >
            Completed Onboarding
          </button>
          <button
            onClick={() => setSelectedSubTab('Drip')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
              selectedSubTab === 'Drip' ? 'bg-white text-[#4450b7] shadow-sm' : 'text-[#5f5e5c] hover:bg-white/50'
            }`}
          >
            Drips In Progress
          </button>
        </div>
      </div>

      {/* Main Table database */}
      <div className="bg-white rounded-xl card-shadow border border-[#c6c5d5] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f3f2] border-b border-[#c6c5d5]">
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Date Joined</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Onboarding drip</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider text-center w-36">Events Attended</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c6c5d5]">
            {filteredMembers.map((member) => (
              <tr 
                key={member.id}
                className="hover:bg-[#f4f3f2]/30 transition-all font-sans text-xs"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${member.avatarColorClass}`}>
                      {member.initials}
                    </div>
                    <span className="font-semibold text-[#1a1c1c] text-sm">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#5f5e5c] font-medium whitespace-nowrap">
                  {member.joinDate}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 text-[9px] rounded-md uppercase font-bold border ${getDripBadgeStyle(member.onboardingStatus)}`}>
                    {member.onboardingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#5f5e5c] font-medium whitespace-nowrap">
                  {member.lastActive}
                </td>
                <td className="px-6 py-4 text-center font-mono font-bold text-[#1a1c1c]">
                  {member.eventsAttended}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onActionNotification(`Drip parameters updated for ${member.name}`)}
                    className="text-[#4450b7] hover:underline font-semibold text-xs active:scale-95"
                  >
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden border border-[#c6c5d5] animate-in fade-in zoom-in duration-200"
          >
            <div className="px-6 py-4 bg-[#f4f3f2] border-b border-[#c6c5d5] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1a1c1c]">Register New Student</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingMember(false)}
                className="text-[#5f5e5c] hover:text-[#1a1c1c]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Onboarding Campaign Location</label>
                <select
                  value={newMemberStatus}
                  onChange={(e) => setNewMemberStatus(e.target.value as CommunityMember['onboardingStatus'])}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                >
                  <option value="Completed">Onboarding Completed (No Drips)</option>
                  <option value="Day 5 Drip">Include into Day 5 drip sequence</option>
                  <option value="Day 3 Drip">Include into Day 3 drip sequence</option>
                  <option value="Day 2 Drip">Include into Day 2 drip sequence</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f4f3f2] border-t border-[#c6c5d5] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingMember(false)}
                className="bg-transparent hover:bg-[#efeeed] text-[#5f5e5c] px-4 py-2 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 font-bold text-xs rounded-xl"
              >
                Register Student
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
