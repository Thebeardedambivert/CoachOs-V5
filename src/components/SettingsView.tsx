import React, { useState } from 'react';

interface SettingsProps {
  coachName: string;
  coachEmail: string;
  onUpdateCoachDetails: (name: string, email: string) => void;
  onActionNotification: (message: string) => void;
}

export default function SettingsView({
  coachName,
  coachEmail,
  onUpdateCoachDetails,
  onActionNotification,
}: SettingsProps) {
  const [name, setName] = useState(coachName);
  const [email, setEmail] = useState(coachEmail);
  const [databaseUrl, setDatabaseUrl] = useState('postgresql://postgres:db_pass@db.xxxx.supabase.co:5432/postgres');
  const [webhookSecret, setWebhookSecret] = useState('whsec_n8n_6ad2_v5_4450');
  const [anthropicKey, setAnthropicKey] = useState('••••••••••••••••••••••••••••••');

  // Interactive integrations list
  const [integrations, setIntegrations] = useState([
    { id: 'int-1', name: 'LinkedIn API', state: 'Connected', sync: 'Last synced 4m ago', status: true },
    { id: 'int-2', name: 'Fireflies TRANSCRIPTS', state: 'Connected', sync: 'Active listener', status: true },
    { id: 'int-3', name: 'Cal.com API Schedule', state: 'Connected', sync: '2 Calendars synced', status: true },
    { id: 'int-4', name: 'Supabase DATABASE', state: 'Connected', sync: 'Connection healthy', status: true },
    { id: 'int-5', name: 'Gemini Models (Ultra 1.5)', state: 'Connected', sync: 'Active listener', status: true },
    { id: 'int-6', name: 'n8n WEBHOOK FLOWS', state: 'Connected', sync: '12 Active workflows', status: true },
  ]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCoachDetails(name, email);
    onActionNotification("Profile credentials synchronized to CoachOS cloud.");
  };

  const handleToggleIntegration = (id: string, name: string, currentState: boolean) => {
    setIntegrations(prev =>
      prev.map(int => (int.id === id ? { ...int, state: currentState ? 'Disabled' : 'Connected', status: !currentState } : int))
    );
    onActionNotification(`${name} integration has been ${currentState ? 'disabled' : 'enabled'}`);
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
            Settings & Integrations
          </h2>
        </div>

        {/* Center: Placeholder for uniform columns */}
        <div className="hidden md:block"></div>

        {/* Right: Actions */}
        <div className="hidden md:block"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ marginTop: '9px' }}>
        {/* Left: General Settings & profile details */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl border border-[#c6c5d5] p-5 card-shadow space-y-4">
            <h3 className="text-sm font-bold text-[#1a1c1c] border-b border-[#c6c5d5] pb-2">Coach Credentials</h3>
            
            <div className="space-y-1.5 text-xs font-semibold">
              <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Administrator Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-sans"
              />
            </div>

            <div className="space-y-1.5 text-xs font-semibold">
              <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Contact Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-sans"
              />
            </div>

            <button
              type="submit"
              className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 text-xs font-bold rounded-lg transition-all"
            >
              Update Profile Information
            </button>
          </form>

          {/* n8n Webhook & database keys */}
          <div className="bg-white rounded-xl border border-[#c6c5d5] p-5 card-shadow space-y-4">
            <h3 className="text-sm font-bold text-[#1a1c1c] border-b border-[#c6c5d5] pb-2">Database Connection String</h3>
            
            <div className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Supabase Connection URI</label>
                <input
                  type="text"
                  value={databaseUrl}
                  onChange={(e) => setDatabaseUrl(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">n8n Secret Auth</label>
                  <input
                    type="text"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Gemini API Token overrides</label>
                  <input
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-sans text-xs"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  onActionNotification("Credentials encrypted. Cloud listener synced successfully.");
                }}
                className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 text-xs font-bold rounded-lg transition-all"
              >
                Save Secure Credentials
              </button>
            </div>
          </div>
        </div>

        {/* Right: API Integrations list */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-[#c6c5d5] p-5 card-shadow flex flex-col h-full">
            <div className="border-b border-[#c6c5d5] pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#1a1c1c]">Core Suite Integrations</h3>
              <p className="text-[11px] text-[#5f5e5c] mt-0.5">Toggle active background processes synchronized with CoachOS</p>
            </div>

            <div className="space-y-3.5 flex-1">
              {integrations.map((int) => (
                <div 
                  key={int.id}
                  className="flex items-center justify-between p-3 bg-[#f6f5f4] rounded-xl border border-[#c6c5d5]/80 hover:border-[#4450b7]/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white border border-[#c6c5d5] rounded-lg flex items-center justify-center text-[#5f5e5c] group-hover:text-[#4450b7] transition-all">
                      <span className="material-symbols-outlined text-lg">
                        {int.id === 'int-1' ? 'share' : int.id === 'int-2' ? 'record_voice_over' : int.id === 'int-3' ? 'calendar_month' : int.id === 'int-4' ? 'database' : int.id === 'int-5' ? 'auto_awesome' : 'hub'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a1c1c]">{int.name}</h4>
                      <p className="text-[10px] text-[#5f5e5c] font-medium font-mono inline-flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${int.status ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
                        {int.sync}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleIntegration(int.id, int.name, int.status)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all transform active:scale-95 ${
                      int.status
                        ? 'bg-[#efeeed] text-[#ba1a1a] hover:bg-[#ffdad6]/50'
                        : 'bg-[#4450b7] text-white hover:opacity-90'
                    }`}
                  >
                    {int.status ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
