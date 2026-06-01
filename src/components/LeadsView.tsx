import React, { useState } from 'react';
import { Lead } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onAddLeadClick: () => void;
  onUpdateLeadStatus: (leadId: string, newStatus: Lead['status']) => void;
  onRemoveLead: (leadId: string) => void;
  onActionNotification: (message: string) => void;
  onNavigate: (view: string) => void;
}

export default function LeadsView({
  leads,
  onAddLeadClick,
  onUpdateLeadStatus,
  onRemoveLead,
  onActionNotification,
  onNavigate,
}: LeadsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'All' | Lead['status']>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isUpdatingStatusId, setIsUpdatingStatusId] = useState<string | null>(null);

  // Filter based on Tab & Search
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === 'All' || lead.status === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  // Calculate tabs counts
  const allCount = leads.length;
  const newCount = leads.filter(l => l.status === 'New').length;
  const respondedCount = leads.filter(l => l.status === 'Responded').length;
  const bookedCount = leads.filter(l => l.status === 'Booked').length;
  const inSessionCount = leads.filter(l => l.status === 'In Session').length;

  // Simple Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Source,Status,Response Time\n';
    const rows = leads.map(l => `${l.id},"${l.name}",${l.email},${l.source},${l.status},${l.responseTime}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'coachos_leads_pipeline.csv');
    a.click();
    onActionNotification('Leads CSV file downloaded successfully.');
  };

  const getStatusBadgeStyle = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'bg-[#dfe0ff] text-[#2e3aa2] border-[#bdc2ff]/20';
      case 'Responded':
        return 'bg-[#e5e2de] text-[#5f5e5c] border-[#c9c6c3]/10';
      case 'Booked':
        return 'bg-[#ffddbb] text-[#673d00] border-[#tertiary-fixed]/20';
      case 'In Session':
        return 'bg-[#4450b7] text-white border-transparent';
      default:
        return 'bg-[#faf9f8] text-[#1a1c1c]';
    }
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
            Clients
          </h2>
        </div>

        {/* Center: Centered search bar */}
        <div className="flex justify-center w-full">
          <div className="relative group w-full max-w-xs md:max-w-sm">
            <span 
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#767684] text-sm group-focus-within:text-[#4450b7] transition-colors"
              style={{ marginLeft: '-9px' }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#f4f3f2] border-none rounded-lg pr-4 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#4450b7]/20 transition-all font-sans text-[#1a1c1c] text-center placeholder:text-center"
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
          className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 justify-between md:justify-end"
          style={{ marginTop: '-12px' }}
        >
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onActionNotification('Interactive table search handles matching items')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c6c5d5] rounded-xl font-semibold text-xs text-[#5f5e5c] hover:bg-[#faf9f8] transition-colors bg-white hover:text-[#4450b7] shrink-0"
            >
              <span className="material-symbols-outlined text-xs">filter_list</span>
              <span>Filter</span>
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c6c5d5] rounded-xl font-semibold text-xs text-[#5f5e5c] hover:bg-[#faf9f8] transition-colors bg-white hover:text-[#4450b7] shrink-0"
            >
              <span className="material-symbols-outlined text-xs">download</span>
              <span>Export CSV</span>
            </button>
          </div>
          <div className="flex items-center gap-3 ml-2 border-l border-[#c6c5d5] pl-3 shrink-0">
            <span 
              onClick={() => onActionNotification('Clear notification backlog')} 
              className="material-symbols-outlined text-[#5f5e5c] cursor-pointer hover:text-[#4450b7] transition-colors text-lg"
            >
              notifications
            </span>
            <span 
              onClick={() => onActionNotification('Google Calendar connected: Active syncing')} 
              className="material-symbols-outlined text-[#5f5e5c] cursor-pointer hover:text-[#4450b7] transition-colors text-lg"
            >
              calendar_today
            </span>
          </div>
        </div>
      </header>

      {/* Segmented Control / Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#efeeed] rounded-xl w-fit" style={{ marginTop: '9px' }}>
        <button
          onClick={() => { setSelectedTab('All'); setCurrentPage(1); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
            selectedTab === 'All'
              ? 'bg-white text-[#4450b7] shadow-sm'
              : 'text-[#5f5e5c] hover:bg-white/50'
          }`}
        >
          All <span className="text-[10px] opacity-70 ml-1">({allCount})</span>
        </button>
        <button
          onClick={() => { setSelectedTab('New'); setCurrentPage(1); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
            selectedTab === 'New'
              ? 'bg-white text-[#4450b7] shadow-sm'
              : 'text-[#5f5e5c] hover:bg-white/50'
          }`}
        >
          New <span className="text-[10px] opacity-70 ml-1">({newCount})</span>
        </button>
        <button
          onClick={() => { setSelectedTab('Responded'); setCurrentPage(1); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
            selectedTab === 'Responded'
              ? 'bg-white text-[#4450b7] shadow-sm'
              : 'text-[#5f5e5c] hover:bg-white/50'
          }`}
        >
          Responded <span className="text-[10px] opacity-70 ml-1">({respondedCount})</span>
        </button>
        <button
          onClick={() => { setSelectedTab('Booked'); setCurrentPage(1); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
            selectedTab === 'Booked'
              ? 'bg-white text-[#4450b7] shadow-sm'
              : 'text-[#5f5e5c] hover:bg-white/50'
          }`}
        >
          Booked <span className="text-[10px] opacity-70 ml-1">({bookedCount})</span>
        </button>
        <button
          onClick={() => { setSelectedTab('In Session'); setCurrentPage(1); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-150 ${
            selectedTab === 'In Session'
              ? 'bg-white text-[#4450b7] shadow-sm'
              : 'text-[#5f5e5c] hover:bg-white/50'
          }`}
        >
          In Session <span className="text-[10px] opacity-70 ml-1">({inSessionCount})</span>
        </button>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-xl card-shadow border border-[#c6c5d5] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f3f2] border-b border-[#c6c5d5]">
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Source</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Response Time</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c6c5d5]">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#5f5e5c]">
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => (
                <tr 
                  key={lead.id}
                  className="hover:bg-[#f4f3f2]/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4" onClick={() => setSelectedLead(lead)}>
                    <div className="flex items-center gap-4">
                      <img 
                        alt={lead.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#c6c5d5] shadow-xs" 
                        src={lead.avatar} 
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${lead.name}`;
                        }}
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#1a1c1c] leading-tight group-hover:text-[#4450b7] transition-colors">
                          {lead.name}
                        </p>
                        <p className="text-xs text-[#5f5e5c] font-medium leading-none mt-1">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={() => setSelectedLead(lead)}>
                    <div className="flex items-center gap-1 text-[#5f5e5c]">
                      <span className="material-symbols-outlined text-base">
                        {lead.sourceIcon}
                      </span>
                      <span className="text-xs font-medium">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <span 
                        onClick={() => setIsUpdatingStatusId(isUpdatingStatusId === lead.id ? null : lead.id)}
                        className={`px-3 py-1 text-[11px] rounded-full font-bold uppercase cursor-pointer border hover:shadow-xs active:scale-95 transition-all inline-flex items-center gap-1 ${getStatusBadgeStyle(lead.status)}`}
                      >
                        {lead.status}
                        <span className="text-[10px] font-normal">▼</span>
                      </span>
                      {isUpdatingStatusId === lead.id && (
                        <div className="absolute left-0 mt-1 bg-white border border-[#c6c5d5] rounded-xl shadow-lg z-50 py-1 w-32 font-medium text-xs text-[#1a1c1c]">
                          {(['New', 'Responded', 'Booked', 'In Session'] as Lead['status'][]).map(st => (
                            <button
                              key={st}
                              onClick={() => {
                                onUpdateLeadStatus(lead.id, st);
                                setIsUpdatingStatusId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#efeeed]"
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 tabular-nums text-xs text-[#5f5e5c] font-mono leading-none">
                    {lead.responseTime}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 z-20">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="text-[#4450b7] font-semibold text-xs hover:underline cursor-pointer active:scale-95 transition-all"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => {
                          if (lead.status === 'New') {
                            onUpdateLeadStatus(lead.id, 'Responded');
                            onActionNotification(`Logged response milestone for ${lead.name}`);
                          } else if (lead.status === 'Booked') {
                            onNavigate('sessions');
                            onActionNotification(`Accessing scheduled session parameters for ${lead.name}`);
                          } else {
                            onActionNotification(`History trace initiated for ${lead.name}`);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all transform active:scale-95 whitespace-nowrap ${
                          lead.status === 'New'
                            ? 'bg-[#5e6ad2] text-white hover:opacity-90'
                            : lead.status === 'Booked'
                            ? 'bg-[#4450b7] text-white hover:opacity-90'
                            : 'bg-[#efeeed] text-[#5f5e5c] hover:bg-[#e3e2e1]'
                        }`}
                      >
                        {lead.status === 'New' ? 'Respond' : lead.status === 'Booked' ? 'Manage' : lead.status === 'In Session' ? 'Session' : 'History'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-3.5 flex items-center justify-between bg-white border-t border-[#c6c5d5]">
          <p className="text-xs text-[#5f5e5c] font-sans">
            Showing <span className="text-[#1a1c1c] font-bold">{Math.min(startIndex + 1, filteredLeads.length)}-{Math.min(startIndex + itemsPerPage, filteredLeads.length)}</span> of <span className="text-[#1a1c1c] font-bold">{filteredLeads.length}</span> leads
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#c6c5d5] text-[#5f5e5c] transition-all active:scale-90 ${
                currentPage === 1
                  ? 'opacity-40 cursor-not-allowed bg-transparent'
                  : 'hover:bg-[#efeeed]'
              }`}
            >
              <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#4450b7] text-white shadow-xs'
                    : 'border border-[#c6c5d5] text-[#5f5e5c] hover:bg-[#efeeed]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#c6c5d5] text-[#5f5e5c] transition-all active:scale-90 ${
                currentPage === totalPages
                  ? 'opacity-40 cursor-not-allowed bg-transparent'
                  : 'hover:bg-[#efeeed]'
              }`}
            >
              <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leads Detail Dialog modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-[#c6c5d5] animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-[#f4f3f2] border-b border-[#c6c5d5] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1a1c1c]">Lead Profile Card</h3>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-[#5f5e5c] hover:text-[#1a1c1c] active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  alt={selectedLead.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#4450b7]/30 shadow-md"
                  src={selectedLead.avatar}
                />
                <div>
                  <h4 className="text-base font-bold text-[#1a1c1c]">{selectedLead.name}</h4>
                  <p className="text-xs text-[#5f5e5c] font-mono leading-none mt-1">{selectedLead.email}</p>
                  <p className="text-[11px] text-[#4450b7] bg-[#5e6ad2]/10 font-bold uppercase tracking-wider rounded-md inline-block px-2 py-0.5 mt-2">
                    {selectedLead.id}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#c6c5d5] text-xs font-medium">
                <div>
                  <p className="text-[#5f5e5c] text-[10px] uppercase font-bold tracking-wider">Acquisition Source</p>
                  <p className="text-[#1a1c1c] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">{selectedLead.sourceIcon}</span>
                    {selectedLead.source}
                  </p>
                </div>
                <div>
                  <p className="text-[#5f5e5c] text-[10px] uppercase font-bold tracking-wider">Status Index</p>
                  <div className="mt-1">
                    <select
                      value={selectedLead.status}
                      onChange={(e) => {
                        onUpdateLeadStatus(selectedLead.id, e.target.value as Lead['status']);
                        setSelectedLead(prev => prev ? { ...prev, status: e.target.value as Lead['status'] } : null);
                      }}
                      className="bg-white border border-[#c6c5d5] rounded-lg px-2 py-0.5 text-xs focus:ring-[#4450b7]/20"
                    >
                      <option value="New">New</option>
                      <option value="Responded">Responded</option>
                      <option value="Booked">Booked</option>
                      <option value="In Session">In Session</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-[#5f5e5c] text-[10px] uppercase font-bold tracking-wider">Average response time</p>
                  <p className="text-[#1a1c1c] font-mono font-bold mt-1">{selectedLead.responseTime || 'No metrics'}</p>
                </div>
                <div>
                  <p className="text-[#5f5e5c] text-[10px] uppercase font-bold tracking-wider">Actions Pipeline</p>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${selectedLead.name} from pipeline?`)) {
                        onRemoveLead(selectedLead.id);
                        setSelectedLead(null);
                      }
                    }}
                    className="text-[#ba1a1a] hover:underline mt-1 font-semibold block text-left text-xs"
                  >
                    Delete lead record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights / Micro-bento section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#f4f3f2] p-4 rounded-xl border border-[#c6c5d5] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#5e6ad2]/10 rounded-full flex items-center justify-center text-[#4450b7]">
            <span className="material-symbols-outlined text-xl">trending_up</span>
          </div>
          <div>
            <p className="text-[11px] text-[#5f5e5c] uppercase tracking-wider font-bold">Lead Velocity</p>
            <p className="text-sm font-bold text-[#1a1c1c] font-mono mt-0.5">+12% vs last week</p>
          </div>
        </div>

        <div className="bg-[#f4f3f2] p-4 rounded-xl border border-[#c6c5d5] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#a56500]/10 rounded-full flex items-center justify-center text-[#834f00]">
            <span className="material-symbols-outlined text-xl">timer</span>
          </div>
          <div>
            <p className="text-[11px] text-[#5f5e5c] uppercase tracking-wider font-bold">Avg Response</p>
            <p className="text-sm font-bold text-[#1a1c1c] font-mono mt-0.5">1h 22m</p>
          </div>
        </div>

        <div className="bg-[#f4f3f2] p-4 rounded-xl border border-[#c6c5d5] flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-400/10 rounded-full flex items-center justify-center text-[#5f5e5c]">
            <span className="material-symbols-outlined text-xl">psychology</span>
          </div>
          <div>
            <p className="text-[11px] text-[#5f5e5c] uppercase tracking-wider font-bold">Hottest Source</p>
            <p className="text-sm font-bold text-[#1a1c1c] mt-0.5">LinkedIn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
