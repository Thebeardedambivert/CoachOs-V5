import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LeadsView from './components/LeadsView';
import SessionsView from './components/SessionsView';
import ContentLibraryView from './components/ContentLibraryView';
import AutomationsView from './components/AutomationsView';
import CommunityView from './components/CommunityView';
import SettingsView from './components/SettingsView';
import SignInView from './components/SignInView';

import { Lead, ContentPost, LiveActivity, Workflow, Session, CommunityMember, CoachEvent } from './types';
import { 
  INITIAL_LEADS, 
  INITIAL_POSTS, 
  INITIAL_LIVE_ACTIVITIES, 
  INITIAL_WORKFLOWS, 
  INITIAL_SESSIONS, 
  INITIAL_MEMBERS, 
  INITIAL_EVENTS 
} from './data';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState((true)); // Set true by default but we allow profile logs
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Database States
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [posts, setPosts] = useState<ContentPost[]>(INITIAL_POSTS);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>(INITIAL_LIVE_ACTIVITIES);
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [members, setMembers] = useState<CommunityMember[]>(INITIAL_MEMBERS);
  const [events, setEvents] = useState<CoachEvent[]>(INITIAL_EVENTS);

  // Coach Information Profile details
  const [coachName, setCoachName] = useState('Alex Volkov');
  const [coachEmail, setCoachEmail] = useState('alex.volkov@coachos.com');

  // New Client Modal dialog state
  const [isAddingNewClient, setIsAddingNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientSource, setNewClientSource] = useState('LinkedIn');
  const [newClientStatus, setNewClientStatus] = useState<Lead['status']>('New');

  const showToast = (message: string) => {
    setToastMessage(message);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.volume = 0.3; // Gentle screen-reader audible cues
    try {
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(utterance);
    } catch (e) {
      // Ignored if browser sandbox restricts TTS
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Operations handlers
  const handleAddLiveActivity = (event: string, leadClient: string, status: LiveActivity['status'], icon = 'notifications_active') => {
    const newActivity: LiveActivity = {
      id: `A-${Date.now()}`,
      event,
      leadClient,
      status,
      time: 'Just now',
      icon,
      iconBg: 'bg-primary-container/10',
      iconColor: 'text-[#4450b7]'
    };
    setLiveActivities(prev => [newActivity, ...prev]);
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientEmail.trim()) {
      alert("Name and email are required parameters!");
      return;
    }
    const newLead: Lead = {
      id: `L-0${leads.length + 1}`,
      name: newClientName,
      email: newClientEmail,
      source: newClientSource,
      sourceIcon: newClientSource === 'LinkedIn' ? 'link' : newClientSource === 'Web Form' ? 'article' : newClientSource === 'Referral' ? 'share' : 'mail',
      status: newClientStatus,
      responseTime: '5m',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newClientName}`
    };

    setLeads(prev => [newLead, ...prev]);
    setIsAddingNewClient(false);
    showToast(`Registered coaching lead: ${newClientName}`);
    handleAddLiveActivity('Profile Connection Sync', newClientName, 'Processed', 'person_add');

    // Reset fields
    setNewClientName('');
    setNewClientEmail('');
    setNewClientSource('LinkedIn');
    setNewClientStatus('New');
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
    const targetLead = leads.find(l => l.id === leadId);
    if (targetLead) {
      showToast(`Updated ${targetLead.name} status to ${newStatus}`);
      handleAddLiveActivity('Pipeline Stage Modified', targetLead.name, 'Processed', 'refresh');
    }
  };

  const handleRemoveLead = (leadId: string) => {
    const targetLead = leads.find(l => l.id === leadId);
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    if (targetLead) {
      showToast(`Removed ${targetLead.name} from active lists`);
    }
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, enabled: !wf.enabled } : wf));
    const targetWf = workflows.find(w => w.id === id);
    if (targetWf) {
      showToast(`Automation "${targetWf.name}" is now ${targetWf.enabled ? 'disabled' : 'enabled'}`);
    }
  };

  const handleRunTestWorkflow = (id: string, name: string) => {
    showToast(`Mock webhook payload dispatched for sequence ${name}`);
    handleAddLiveActivity(`Webhook: ${name}`, 'Test Payload', 'Sent', 'webhook');
  };

  const handleAddWorkflow = (name: string, description: string, badge: Workflow['badge']) => {
    const newWf: Workflow = {
      id: `W-${workflows.length + 1}`,
      name,
      description,
      lastTriggered: 'Never',
      badge,
      enabled: true
    };
    setWorkflows(prev => [...prev, newWf]);
    showToast(`Published automation: "${name}"`);
  };

  const handleAddPost = (preview: string, topTrigger: ContentPost['topTrigger'], mediaType: ContentPost['mediaType']) => {
    const newPost: ContentPost = {
      id: `P-${posts.length + 1}`,
      preview,
      date: 'Just now',
      reactions: 0,
      comments: 0,
      reposts: 0,
      dms: 0,
      topTrigger,
      mediaType
    };
    setPosts(prev => [newPost, ...prev]);
    showToast(`Organic Post scheduled to draft pipeline successfully.`);
  };

  const handleUploadSessionTranscript = (sessionId: string, file: File) => {
    // 3-step reactive progress states simulation
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, aiReport: 'Processing' as const } : s))
    );
    showToast(`Parsing ${file.name} metadata voice channels...`);

    setTimeout(() => {
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? {
                ...s,
                aiReport: 'Ready' as const,
                notes: `• Reviewed session transcript extracted from ${file.name}.\n• Identified primary strategic growth benchmarks.\n• Chronological Milestone Tracker: complete roadmap audit by tomorrow at 4:00 PM.`
              }
            : s
        )
      );
      const targetSession = sessions.find(s => s.id === sessionId);
      showToast(`AI Transcript Report Synthesized for ${targetSession?.clientName || 'the client'}`);
    }, 3800);
  };

  const handleUpdateSessionNotes = (sessionId: string, notes: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, notes } : s));
  };

  const handleAddEvent = (title: string, month: string, day: string, timeRange: string, location: string) => {
    const newEvt: CoachEvent = {
      id: `E-${events.length + 1}`,
      title,
      month,
      day,
      timeRange,
      locationType: 'Zoom',
      location,
      sent: false
    };
    setEvents(prev => [...prev, newEvt]);
    showToast(`Coaching webinar event scheduled: ${title}`);
  };

  const handleAddMember = (name: string, onboardingStatus: CommunityMember['onboardingStatus']) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newMem: CommunityMember = {
      id: `M-0${members.length + 1}`,
      name,
      joinDate: 'Today',
      onboardingStatus,
      lastActive: 'Online',
      eventsAttended: 0,
      initials,
      avatarColorClass: 'bg-[#5e6ad2]/20 text-[#4450b7]'
    };
    setMembers(prev => [newMem, ...prev]);
  };

  // Secure full-stack Gemini API integration triggers
  const triggerGeminiSummaryApi = async (sessionId: string, clientName: string): Promise<string> => {
    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName }),
      });
      if (!response.ok) {
        throw new Error("HTTP connection error querying Express server.");
      }
      const data = await response.json();
      return data.notes;
    } catch (e) {
      console.warn("Express server offline. Using styled smart local-generator simulation.", e);
      return `• Synthesized session milestones for ${clientName}.\n• Addressed immediate team scale-up roadblocks discussed.\n• Action checklist: Deliver brand playbook parameters by Thursday morning.`;
    }
  };

  const triggerGeminiDraftApi = async (topic: string): Promise<string> => {
    try {
      const response = await fetch("/api/gemini/draft-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) {
        throw new Error("HTTP connection error querying Express server.");
      }
      const data = await response.json();
      return data.text;
    } catch (e) {
      console.warn("Express server offline. Using styled smart local-generator simulation.", e);
      return `Want to learn a framework about "${topic}"?\n\n• Point 1: Consistency defeats talent.\n• Point 2: Alignment scales faster than brute force.\n\n👇 Repost or reply 'INFO' below, and I'll send my private script indices right to your inbox.`;
    }
  };

  if (!isAuthenticated) {
    return (
      <SignInView 
        onSignInSuccess={(email) => {
          setCoachEmail(email);
          setIsAuthenticated(true);
        }}
        onActionNotification={showToast}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] flex font-sans antialiased text-[#1a1c1c] overflow-x-hidden select-none">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#c6c5d5] flex items-center justify-between px-4 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 -ml-1.5 hover:bg-[#e3e2e1] rounded-lg text-[#1a1c1c] active:scale-95 flex items-center border-none"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          
          <div className="flex items-center gap-1.5">
            <div className="w-6.5 h-6.5 bg-[#4450b7] rounded flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xs font-bold">fitness_center</span>
            </div>
            <span className="text-xs font-bold text-[#1a1c1c] tracking-tight">CoachOS V5</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddingNewClient(true)}
            className="bg-[#4450b7] text-white hover:opacity-95 text-[11px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 active:scale-95 shadow-xs"
          >
            <span className="material-symbols-outlined text-xs font-bold">add</span>
            <span>Lead</span>
          </button>
        </div>
      </header>

      {/* Sidebar navigation controls */}
      <Sidebar 
        currentView={currentView}
        onNavigate={setCurrentView}
        onNewClientClick={() => setIsAddingNewClient(true)}
        onLogout={() => {
          setIsAuthenticated(false);
          showToast("Session security terminated.");
        }}
        totalLeadsCount={leads.length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main viewport frame */}
      <main 
        className="flex-1 min-h-screen lg:pl-64 px-4 lg:px-6 pb-12 pt-18 lg:pt-4 relative w-full overflow-x-hidden"
        style={{ marginTop: '4px', paddingTop: '29px' }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          
          {currentView === 'dashboard' && (
            <DashboardView 
              liveActivities={liveActivities}
              totalLeads={leads.length}
              activeWorkflowsCount={workflows.filter(w => w.enabled).length}
              sessionsThisMonthCount={sessions.length + 2}
              membersCount={members.length}
              onNavigate={setCurrentView}
              onAddLeadClick={() => setIsAddingNewClient(true)}
              onActionNotification={showToast}
            />
          )}

          {currentView === 'leads' && (
            <LeadsView 
              leads={leads}
              onAddLeadClick={() => setIsAddingNewClient(true)}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onRemoveLead={handleRemoveLead}
              onActionNotification={showToast}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'sessions' && (
            <SessionsView 
              sessions={sessions}
              events={events}
              onUploadSessionTranscript={handleUploadSessionTranscript}
              onUpdateSessionNotes={handleUpdateSessionNotes}
              onActionNotification={showToast}
              onAddEvent={handleAddEvent}
              onTriggerGeminiSummary={triggerGeminiSummaryApi}
            />
          )}

          {currentView === 'content' && (
            <ContentLibraryView 
              posts={posts}
              onAddPost={handleAddPost}
              onActionNotification={showToast}
              onTriggerGeminiDraft={triggerGeminiDraftApi}
            />
          )}

          {currentView === 'automations' && (
            <AutomationsView 
              workflows={workflows}
              onToggleWorkflow={handleToggleWorkflow}
              onRunTestWorkflow={handleRunTestWorkflow}
              onAddWorkflow={handleAddWorkflow}
              onActionNotification={showToast}
            />
          )}

          {currentView === 'community' && (
            <CommunityView 
              members={members}
              onActionNotification={showToast}
              onAddMember={handleAddMember}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView 
              coachName={coachName}
              coachEmail={coachEmail}
              onUpdateCoachDetails={(name, email) => {
                setCoachName(name);
                setCoachEmail(email);
              }}
              onActionNotification={showToast}
            />
          )}
        </div>
      </main>

      {/* Modern micro-toast alert popover */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1c1c] text-white py-3.5 px-5 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl tabular-nums animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping"></div>
          <span className="text-xs font-bold tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* New Client/Lead dialog modal popup overlay */}
      {isAddingNewClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form 
            onSubmit={handleCreateLeadSubmit}
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-[#c6c5d5] animate-in fade-in zoom-in duration-200"
          >
            <div className="px-6 py-4 bg-[#f4f3f2] border-b border-[#c6c5d5] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1a1c1c] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg text-[#4450b7]">person_add</span>
                Register New Lead
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNewClient(false)}
                className="text-[#5f5e5c] hover:text-[#1a1c1c]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Lead / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendricks"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. richard@piedpiper.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Traffic Source</label>
                  <select
                    value={newClientSource}
                    onChange={(e) => setNewClientSource(e.target.value)}
                    className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Web Form">Web Form</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Email">Direct Email</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Pipeline Status</label>
                  <select
                    value={newClientStatus}
                    onChange={(e) => setNewClientStatus(e.target.value as Lead['status'])}
                    className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                  >
                    <option value="New">New</option>
                    <option value="Responded">Responded</option>
                    <option value="Booked">Booked</option>
                    <option value="In Session">In Session</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f4f3f2] border-t border-[#c6c5d5] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNewClient(false)}
                className="bg-transparent hover:bg-[#efeeed] text-[#5f5e5c] px-4 py-2 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 font-bold text-xs rounded-xl"
              >
                Create Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
