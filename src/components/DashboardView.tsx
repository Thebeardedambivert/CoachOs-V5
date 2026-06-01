import React, { useState } from 'react';
import { LiveActivity } from '../types';

interface DashboardProps {
  liveActivities: LiveActivity[];
  totalLeads: number;
  activeWorkflowsCount: number;
  sessionsThisMonthCount: number;
  membersCount: number;
  onNavigate: (view: string) => void;
  onAddLeadClick: () => void;
  onActionNotification: (message: string) => void;
}

export default function DashboardView({
  liveActivities,
  totalLeads,
  activeWorkflowsCount,
  sessionsThisMonthCount,
  membersCount,
  onNavigate,
  onAddLeadClick,
  onActionNotification,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const filteredActivities = liveActivities.filter(activity =>
    activity.leadClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            className="text-xl font-bold text-[#4450b7] hidden sm:block pl-14"
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
            Dashboard
          </h2>
        </div>

        {/* Center: Centered search bar */}
        <div className="flex justify-center w-full">
          <div className="relative group w-full max-w-xs md:max-w-sm">
            <span 
               className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#767684] text-base group-focus-within:text-[#4450b7] transition-colors"
              style={{ marginLeft: '-9px' }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search workflow..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#f4f3f2] border-none rounded-lg pr-4 py-1.5 text-[13px] w-full focus:outline-none focus:ring-2 focus:ring-[#4450b7]/20 transition-all font-sans text-[#1a1c1c] text-center placeholder:text-center"
              style={{
                width: '401px',
                marginLeft: '-61px',
                paddingLeft: '48px',
                marginTop: '-24px',
                paddingTop: '5px',
                paddingRight: '15px',
                paddingBottom: '1px',
                marginBottom: '1px'
               }}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div 
          className="flex items-center gap-2 sm:gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 justify-between md:justify-end"
          style={{ marginTop: '-12px', paddingTop: '10px', width: '333px', marginLeft: '-5px' }}
        >
          <div className="flex gap-2 mr-2 sm:mr-4 border-r border-[#c6c5d5] pr-2 sm:pr-4 shrink-0">
            <button 
              onClick={() => onActionNotification("No new notifications")}
              className="p-1 hover:bg-[#e3e2e1] rounded-lg transition-colors cursor-pointer text-[#5f5e5c] active:scale-90"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button 
              onClick={() => onNavigate('sessions')}
              className="p-1 hover:bg-[#e3e2e1] rounded-lg transition-colors cursor-pointer text-[#5f5e5c] active:scale-90"
              title="Calendar"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => onActionNotification("Quick Notes sidebar is being initialized")}
              className="bg-[#e9e8e7] text-[#5f5e5c] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#e3e2e1] transition-all"
              style={{ width: '94.8375px', marginLeft: '-1px' }}
            >
              Quick Notes
            </button>
            <button 
              onClick={() => onActionNotification("Sessions planner initiated. Please go to sessions tab.")}
              className="bg-[#4450b7] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              Create Session
            </button>
          </div>
        </div>
      </header>

      {/* Pages Canvas stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" style={{ marginTop: '9px' }}>
        {/* Active Automations */}
        <div 
          onMouseEnter={() => setIsHovered('card1')}
          onMouseLeave={() => setIsHovered(null)}
          className={`bg-white p-4 rounded-xl border border-[#c6c5d5] hover:border-[#4450b7]/50 transition-all duration-300 ${
            isHovered === 'card1' ? '-translate-y-1 shadow-md' : 'shadow-sm'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider">Active Automations</span>
            <span className="material-symbols-outlined text-[#5e6ad2] text-sm">bolt</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#1a1c1c]">{activeWorkflowsCount}/10</span>
            <span className="text-xs text-[#4450b7] font-bold">{(activeWorkflowsCount * 10)}%</span>
          </div>
        </div>

        {/* Leads This Week */}
        <div 
          onMouseEnter={() => setIsHovered('card2')}
          onMouseLeave={() => setIsHovered(null)}
          className={`bg-white p-4 rounded-xl border border-[#c6c5d5] hover:border-[#4450b7]/50 transition-all duration-300 ${
            isHovered === 'card2' ? '-translate-y-1 shadow-md' : 'shadow-sm'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider">Leads This Week</span>
            <span className="material-symbols-outlined text-[#834f00] text-sm font-bold">person_add</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#1a1c1c]">{totalLeads}</span>
            <span className="text-xs text-[#ba1a1a] font-bold">+12%</span>
          </div>
        </div>

        {/* Sessions This Month */}
        <div 
          onMouseEnter={() => setIsHovered('card3')}
          onMouseLeave={() => setIsHovered(null)}
          className={`bg-white p-4 rounded-xl border border-[#c6c5d5] hover:border-[#4450b7]/50 transition-all duration-300 ${
            isHovered === 'card3' ? '-translate-y-1 shadow-md' : 'shadow-sm'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider">Sessions This Month</span>
            <span className="material-symbols-outlined text-[#4450b7] text-sm">event_available</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#1a1c1c]">{sessionsThisMonthCount}</span>
            <span className="text-xs text-[#4450b7] font-bold">On Track</span>
          </div>
        </div>

        {/* Community Members */}
        <div 
          onMouseEnter={() => setIsHovered('card4')}
          onMouseLeave={() => setIsHovered(null)}
          className={`bg-white p-4 rounded-xl border border-[#c6c5d5] hover:border-[#4450b7]/50 transition-all duration-300 ${
            isHovered === 'card4' ? '-translate-y-1 shadow-md' : 'shadow-sm'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider">Community Members</span>
            <span className="material-symbols-outlined text-[#5f5e5c] text-sm">groups</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#1a1c1c]">{membersCount}</span>
            <span className="text-xs text-[#4450b7] font-bold">+5 new</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Live activity & Next Session column */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-8 bg-white rounded-xl card-shadow overflow-hidden border border-[#c6c5d5] flex flex-col">
          <div className="px-5 py-4 border-b border-[#c6c5d5] flex justify-between items-center bg-white">
            <h3 className="text-sm font-bold text-[#1a1c1c]">Live Activity</h3>
            <span 
              onClick={() => onActionNotification("Showing real-time logs updated 1m ago.")}
              className="text-xs text-[#4450b7] font-semibold cursor-pointer hover:underline"
            >
              View All
            </span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-[#5f5e5c] bg-[#f4f3f2]/30">
                  <th className="px-5 py-2.5 font-semibold">Event</th>
                  <th className="px-5 py-2.5 font-semibold">Lead/Client</th>
                  <th className="px-5 py-2.5 font-semibold">Status</th>
                  <th className="px-5 py-2.5 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c5d5]">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-[#5f5e5c]">
                      No active logs match the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((activity) => (
                    <tr 
                      key={activity.id}
                      className="hover:bg-[#f4f3f2]/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.iconBg} ${activity.iconColor}`}>
                            <span className="material-symbols-outlined text-base">
                              {activity.icon}
                            </span>
                          </div>
                          <span className="text-[13px] font-semibold text-[#1a1c1c]">{activity.event}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-[#5f5e5c]">
                        {activity.leadClient}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase font-bold inline-block border ${
                          activity.status === 'Processed'
                            ? 'bg-[#dfe0ff] text-[#2e3aa2] border-[#bdc2ff]/30'
                            : activity.status === 'Sent'
                            ? 'bg-[#e5e2de] text-[#1c1c1a] border-[#c9c6c3]/30'
                            : 'bg-[#ffdad6] text-[#93000a] border-[#ffdad6]'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-[#5f5e5c] font-mono whitespace-nowrap">
                        {activity.time}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Next Session Widget */}
          <div className="bg-[#4450b7] text-white rounded-xl p-5 card-shadow relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[11px] font-bold opacity-80 uppercase tracking-widest block mb-1">
                Next Session
              </span>
              <h4 className="text-base font-bold mb-3 tracking-tight">Strategy Sync w/ Alex Volkov</h4>
              
              <div className="flex items-center gap-4 mb-4 text-[#bdc2ff]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-xs font-mono font-medium">14:30</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span className="text-xs font-medium">Google Meet</span>
                </div>
              </div>

              <button 
                onClick={() => onActionNotification("Launching secure Meet room client ID google-meet-sync-volkov")}
                className="w-full bg-[#5e6ad2]/50 hover:bg-[#5e6ad2] text-white py-1.5 rounded-lg font-semibold text-xs transition-all border border-[#bdc2ff]/30 backdrop-blur-sm transform active:scale-95"
              >
                Launch Meeting
              </button>
            </div>
            {/* Visual glow element on hover */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-xl p-5 card-shadow border border-[#c6c5d5]">
            <h3 className="text-sm font-bold text-[#1a1c1c] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onAddLeadClick}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#f4f3f2] hover:bg-[#5e6ad2]/5 hover:text-[#4450b7] transition-all group border border-transparent hover:border-[#4450b7]/10"
              >
                <span className="material-symbols-outlined text-[#5f5e5c] group-hover:text-[#4450b7] text-lg">person_add</span>
                <span className="text-[11px] font-bold">Add Lead</span>
              </button>
              
              <button 
                onClick={() => onNavigate('community')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#f4f3f2] hover:bg-[#5e6ad2]/5 hover:text-[#4450b7] transition-all group border border-transparent hover:border-[#4450b7]/10"
              >
                <span className="material-symbols-outlined text-[#5f5e5c] group-hover:text-[#4450b7] text-lg">mail</span>
                <span className="text-[11px] font-bold">Broadcast</span>
              </button>

              <button 
                onClick={() => onNavigate('content')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#f4f3f2] hover:bg-[#5e6ad2]/5 hover:text-[#4450b7] transition-all group border border-transparent hover:border-[#4450b7]/10"
              >
                <span className="material-symbols-outlined text-[#5f5e5c] group-hover:text-[#4450b7] text-lg">article</span>
                <span className="text-[11px] font-bold">Resource</span>
              </button>

              <button 
                onClick={() => onNavigate('automations')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#f4f3f2] hover:bg-[#5e6ad2]/5 hover:text-[#4450b7] transition-all group border border-transparent hover:border-[#4450b7]/10"
              >
                <span className="material-symbols-outlined text-[#5f5e5c] group-hover:text-[#4450b7] text-lg">payments</span>
                <span className="text-[11px] font-bold">Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row: Efficiency Banner with parallax illustration support */}
      <section 
        className="relative rounded-2xl overflow-hidden h-40 group cursor-default shadow-sm border border-[#c6c5d5] bg-[#1a1c1c]/95"
        style={{ height: '164px' }}
      >
        <img 
          alt="Efficiency Background" 
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 transition-transform duration-1000 group-hover:scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_NdFEqFnPVRaFeJcnTYSuTcMWq4W3WwehbFHuFULIzO2TXu6QHmN6d2GDBuuo32ku8cMA8nwKTuPQZjFh3W-V1fGx6DD5VanZ9YguxbcJ3aoNg-rLejxTX-aK-VTK2gYuc1DO71MEyKbVRCJ69RS6TWD-ro5LJQXcrYhWr-WZwAn_Yt57w0a-SO0twsou4DsLjf1v1xi94uY8N7LK4FwwYv4ejUv3N5uwYJKB44EQxv-F_ZsTtsh6-8zVLvkQhvgtHNY8MJldGY4" 
          style={{ height: '194.4px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4450b7] via-[#4450b7]/95 to-transparent"></div>
        <div 
          className="relative h-full flex items-center px-8 z-10 text-white"
          style={{ marginLeft: '1px', paddingTop: '0px', paddingLeft: '32px', marginTop: '3px' }}
        >
          <div 
            className="flex flex-col md:flex-row md:items-center gap-6 justify-between w-full"
            style={{ height: '159.5px' }}
          >
            <div className="flex items-center gap-6">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-md hidden sm:block shadow-inner">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  speed
                </span>
              </div>
              <div>
                <h3 
                  className="text-lg font-bold text-white mb-0.5 tracking-tight"
                  style={{ marginTop: '4px' }}
                >
                  Coach Efficiency Metric
                </h3>
                <p 
                  className="text-xs text-white/80 max-w-md leading-relaxed"
                  style={{ marginY: '0', marginTop: '8px' }}
                >
                  Your active automations handled 142 micro-tasks this week, keeping your focus strictly on high-impact human coaching.
                </p>
              </div>
            </div>
            <div className="border-l border-white/20 pl-6 shrink-0">
              <span 
                className="text-3xl font-bold text-white block tracking-tight font-sans h-9"
                style={{
                  marginTop: '-18px',
                  height: '34px',
                  width: '234.6px',
                  marginLeft: '-19px'
                }}
              >
                4.2h
              </span>
              <span 
                className="text-[10px] text-white/70 uppercase tracking-widest font-semibold block"
                style={{
                  marginTop: '1px',
                  paddingTop: '5px',
                  paddingLeft: '-1px',
                  marginLeft: '-20px',
                  height: '28px'
                }}
              >
                Time Saved Today
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
