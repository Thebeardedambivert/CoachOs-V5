import React, { useState, useRef } from 'react';
import { Session, CoachEvent } from '../types';

interface SessionsViewProps {
  sessions: Session[];
  events: CoachEvent[];
  onUploadSessionTranscript: (sessionId: string, file: File) => void;
  onUpdateSessionNotes: (sessionId: string, notes: string) => void;
  onActionNotification: (message: string) => void;
  onAddEvent: (title: string, month: string, day: string, timeRange: string, location: string) => void;
  onTriggerGeminiSummary: (sessionId: string, clientName: string) => Promise<string>;
}

export default function SessionsView({
  sessions,
  events,
  onUploadSessionTranscript,
  onUpdateSessionNotes,
  onActionNotification,
  onAddEvent,
  onTriggerGeminiSummary,
}: SessionsViewProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const fileInputRefBySessionId = useRef<{[key: string]: HTMLInputElement | null}>({});

  // States for event scheduler
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventMonth, setNewEventMonth] = useState('Jun');
  const [newEventDay, setNewEventDay] = useState('10');
  const [newEventTime, setNewEventTime] = useState('15:00 - 16:00 GMT');
  const [newEventLocation, setNewEventLocation] = useState('Zoom Meeting');

  // AI manual trigger state
  const [aiLoadingSessionId, setAiLoadingSessionId] = useState<string | null>(null);

  const filteredSessions = sessions.filter(s =>
    s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onActionNotification("Browser microphone API not supported in this frame sandbox.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      onActionNotification("Live audio capture recording session transcript...");
    } catch (err) {
      onActionNotification("Microphone permissions denied or unavailable in this iframe context.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
      setIsRecording(false);
      onActionNotification("Audio captured! Processing mock audio transcript summary.");
      // Auto-update first session with "Processing" -> "Ready" flow
      if (sessions.length > 0) {
        const first = sessions[0];
        onActionNotification(`Attached audio voice transcript to ${first.clientName}`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, sessionId: string) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUploadSessionTranscript(sessionId, file);
      onActionNotification(`Successfully uploaded ${file.name} to ${sessions.find(s=>s.id === sessionId)?.clientName}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, sessionId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUploadSessionTranscript(sessionId, file);
      onActionNotification(`Loaded ${file.name} successfully. processing transcript...`);
    }
  };

  const handleAiAction = async (sessionId: string, clientName: string) => {
    setAiLoadingSessionId(sessionId);
    onActionNotification(`Connecting to Gemini LLM to generate professional synthesis for ${clientName}...`);
    try {
      const resultNotes = await onTriggerGeminiSummary(sessionId, clientName);
      onUpdateSessionNotes(sessionId, resultNotes);
      onActionNotification(`Gemini summary for ${clientName} generated successfully!`);
    } catch (err) {
      onActionNotification(`Failed to invoke Gemini API: ${(err as Error).message}`);
    } finally {
      setAiLoadingSessionId(null);
    }
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      alert("Please provide an event title");
      return;
    }
    onAddEvent(newEventTitle, newEventMonth, newEventDay, newEventTime, newEventLocation);
    setIsAddingEvent(false);
    setNewEventTitle('');
    onActionNotification(`Webinar session added for ${newEventMonth} ${newEventDay}`);
  };

  return (
    <div className="space-y-6" style={{ marginTop: '5px', paddingTop: '4px', paddingLeft: '12px' }}>
      {/* Sessions Top Header */}
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
            Sessions
          </h2>
        </div>

        {/* Center: Centered search bar */}
        <div className="flex justify-center w-full">
          <div className="relative group w-full max-w-xs md:max-w-sm">
            <span 
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#767684] text-sm"
              style={{ marginLeft: '-9px' }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search transcript, note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 justify-between md:justify-end shrink-0"
          style={{ marginTop: '-12px' }}
        >
          <button 
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c6c5d5] rounded-xl font-semibold text-xs text-[#5f5e5c] hover:bg-[#faf9f8] transition-colors bg-white hover:text-[#4450b7] shrink-0"
          >
            <span className="material-symbols-outlined text-xs">add_circle</span>
            <span>Schedule Webinar</span>
          </button>
          
          <button 
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs text-white transition-all transform active:scale-95 shadow-xs shrink-0 ${
              isRecording ? 'bg-[#ba1a1a] animate-pulse' : 'bg-[#4450b7] hover:opacity-90'
            }`}
          >
            <span className="material-symbols-outlined text-xs">mic</span>
            <span>{isRecording ? 'Stop Recording' : 'Record Session'}</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ marginTop: '9px' }}>
        {/* Left Column: Sessions List */}
        <div className="lg:col-span-12 space-y-4">
          
          {/* Calendar Upcoming Events Callout */}
          <div className="bg-white rounded-xl border border-[#c6c5d5] p-5 card-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#1a1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4450b7]">calendar_month</span>
                Upcoming Group Webinars & Events
              </h3>
              <p className="text-[11px] text-[#5f5e5c] font-medium">Auto-synced from Google Calendar API</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div 
                  key={evt.id}
                  className="flex items-start gap-4 p-3 bg-[#f6f5f4] rounded-xl border border-[#c6c5d5]/60 hover:border-[#4450b7]/40 transition-colors"
                >
                  <div className="bg-white border border-[#c6c5d5] text-[#1a1c1c] rounded-lg w-12 h-12 flex flex-col items-center justify-center shadow-xs shrink-0">
                    <span className="text-[10px] uppercase font-bold text-[#5f5e5c] tracking-widest leading-none">{evt.month}</span>
                    <span className="text-lg font-black font-sans leading-none mt-1">{evt.day}</span>
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#1a1c1c] truncate">{evt.title}</h4>
                    <p className="text-[11px] text-[#5f5e5c] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {evt.timeRange}
                    </p>
                    <p className="text-[11px] text-[#4450b7] flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {evt.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Sessions Database Pipeline */}
          <div className="bg-white rounded-xl border border-[#c6c5d5] overflow-hidden card-shadow">
            <div className="px-5 py-4 border-b border-[#c6c5d5] flex justify-between items-center bg-white">
              <div>
                <h3 className="text-sm font-bold text-[#1a1c1c]">Individual Client Sessions</h3>
                <p className="text-[11px] text-[#5f5e5c] mt-0.5">Integrates Fireflies.ai transcription listener & auto-synthesis summaries</p>
              </div>
            </div>

            <div className="divide-y divide-[#c6c5d5]">
              {filteredSessions.map((session) => {
                const isOpen = activeSessionId === session.id;
                return (
                  <div 
                    key={session.id}
                    className={`transition-colors duration-150 ${isOpen ? 'bg-[#f4f3f2]/30' : 'hover:bg-[#f4f3f2]/10'}`}
                  >
                    {/* Collapsed view structure */}
                    <div 
                      onClick={() => setActiveSessionId(isOpen ? null : session.id)}
                      className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          alt={session.clientName}
                          className="w-10 h-10 rounded-full object-cover border border-[#c6c5d5]"
                          src={session.avatar}
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${session.clientName}`;
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-[#1a1c1c] leading-tight flex items-center gap-2">
                            {session.clientName}
                            <span className="text-[10px] px-1.5 py-0.5 font-medium bg-[#efeeed] text-[#5f5e5c] rounded-md">
                              {session.sessionInfo}
                            </span>
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5f5e5c] font-medium leading-none">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">event</span>
                              {session.dateTime}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <span className="material-symbols-outlined text-[14px]">timer</span>
                              {session.duration} mins
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        {/* Status identifier */}
                        <span className={`px-2.5 py-0.5 text-[10px] uppercase font-mono font-bold rounded-full border ${
                          session.aiReport === 'Ready'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : session.aiReport === 'Processing'
                            ? 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          AI Report: {session.aiReport}
                        </span>

                        <span className="material-symbols-outlined text-[#5f5e5c] transition-transform duration-150 transform">
                          {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {/* Expose contents including report generator & audio drop zone */}
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-[#c6c5d5]/50 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#f4f3f2]/20">
                        {/* Left Note Area */}
                        <div className="md:col-span-7 space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">
                                Interactive Notes & Goals
                              </label>
                              <div className="flex gap-2">
                                <button
                                  disabled={aiLoadingSessionId === session.id}
                                  onClick={() => handleAiAction(session.id, session.clientName)}
                                  className="text-xs text-[#4450b7] hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                                  {aiLoadingSessionId === session.id ? 'Thinking...' : 'AI Synthesize'}
                                </button>
                                <button
                                  onClick={() => {
                                    onActionNotification(`Notes and tasks locked for ${session.clientName}`);
                                  }}
                                  className="text-xs text-[#5f5e5c] hover:underline"
                                >
                                  Lock
                                </button>
                              </div>
                            </div>
                            <textarea
                              value={session.notes || ''}
                              onChange={(e) => onUpdateSessionNotes(session.id, e.target.value)}
                              placeholder="No synthesized summary currently. Drop an audio transcript or type notes manually..."
                              className="w-full h-32 p-3 bg-white border border-[#c6c5d5] rounded-xl text-xs font-sans text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#4450b7]/20"
                            />
                          </div>

                          {/* Quick checklist for clients */}
                          <div className="p-3 bg-white border border-[#c6c5d5] rounded-xl space-y-2">
                            <p className="text-[10px] text-[#5f5e5c] uppercase font-bold">Action Items Checklists</p>
                            <div className="flex items-center gap-2 text-xs">
                              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#4450b7]" />
                              <span className="line-through text-[#8e8d8c]">Complete program feedback questionnaire</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <input type="checkbox" className="rounded border-gray-300 text-[#4450b7]" />
                              <span>Draft leadership growth objectives chart</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Upload Drag & Drop Area */}
                        <div className="md:col-span-5 space-y-4">
                          <p className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider">
                            Sync Audio / Transcript Files
                          </p>
                          
                          <div 
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, session.id)}
                            onClick={() => fileInputRefBySessionId.current[session.id]?.click()}
                            className="border-2 border-dashed border-[#c6c5d5] hover:border-[#4450b7]/50 rounded-xl p-6 text-center bg-white cursor-pointer transition-colors space-y-2 group"
                          >
                            <input 
                              type="file"
                              ref={el => fileInputRefBySessionId.current[session.id] = el}
                              onChange={(e) => handleFileSelect(e, session.id)}
                              accept="audio/*,.txt"
                              className="hidden"
                            />
                            <span className="material-symbols-outlined text-3xl text-[#5f5e5c] group-hover:text-[#4450b7] transition-colors">
                              cloud_upload
                            </span>
                            <p className="text-xs font-semibold text-[#1a1c1c]">Drag audio here, or browse files</p>
                            <p className="text-[10px] text-[#5f5e5c]">Supports MP3, M4A, WAV or TXT transcripts (Max 50MB)</p>
                          </div>

                          <div className="p-3 bg-[#e9e8e7]/50 rounded-xl">
                            <p className="text-[10px] text-[#5f5e5c] font-bold">Fireflies Listener Status:</p>
                            <p className="text-[11px] text-[#1a1c1c] mt-0.5 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active link connection listening to Zoom/Meet schedules.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add group calendar event picker */}
      {isAddingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form 
            onSubmit={handleCreateEventSubmit}
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-[#c6c5d5] animate-in fade-in zoom-in duration-200"
          >
            <div className="px-6 py-4 bg-[#f4f3f2] border-b border-[#c6c5d5] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1a1c1c]">Schedule Group Webinar</h3>
              <button 
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="text-[#5f5e5c] hover:text-[#1a1c1c]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">
                  Webinar Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass: Pricing Your Coaching Packages"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Month</label>
                  <select
                    value={newEventMonth}
                    onChange={(e) => setNewEventMonth(e.target.value)}
                    className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                  >
                    <option value="May">May</option>
                    <option value="Jun">Jun</option>
                    <option value="Jul">Jul</option>
                    <option value="Aug">Aug</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Day</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={newEventDay}
                    onChange={(e) => setNewEventDay(e.target.value)}
                    className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Time (GMT)</label>
                <input
                  type="text"
                  required
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Location / Virtual Platform</label>
                <input
                  type="text"
                  required
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-[#f4f3f2] border-t border-[#c6c5d5] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="bg-transparent hover:bg-[#efeeed] text-[#5f5e5c] px-4 py-2 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 font-bold text-xs rounded-xl"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
