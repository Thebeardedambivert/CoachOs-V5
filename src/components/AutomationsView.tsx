import React, { useState } from 'react';
import { Workflow } from '../types';

interface AutomationsProps {
  workflows: Workflow[];
  onToggleWorkflow: (id: string) => void;
  onRunTestWorkflow: (id: string, name: string) => void;
  onAddWorkflow: (name: string, description: string, badge: Workflow['badge']) => void;
  onActionNotification: (message: string) => void;
}

export default function AutomationsView({
  workflows,
  onToggleWorkflow,
  onRunTestWorkflow,
  onAddWorkflow,
  onActionNotification,
}: AutomationsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newWfName, setNewWfName] = useState('');
  const [newWfDesc, setNewWfDesc] = useState('');
  const [newWfBadge, setNewWfBadge] = useState<Workflow['badge']>('High Priority');

  const getBadgeStyle = (badge: Workflow['badge']) => {
    switch (badge) {
      case 'High Priority':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Social':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Engagement':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Events':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'FinOps':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Retention':
        return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
      case 'Critical Error':
        return 'bg-red-200 text-red-900 border-red-300 font-bold';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) {
      alert("Name is required");
      return;
    }
    onAddWorkflow(newWfName, newWfDesc, newWfBadge);
    setIsAdding(false);
    setNewWfName('');
    setNewWfDesc('');
    onActionNotification(`New automated trigger workflow setup: "${newWfName}"`);
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
            Automations
          </h2>
        </div>

        {/* Center: Placeholder for uniform columns */}
        <div className="hidden md:block"></div>

        {/* Right: Actions */}
        <div 
          className="flex items-center gap-4 w-full md:w-auto justify-end shrink-0"
          style={{ marginTop: '-12px' }}
        >
          <button 
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
            <span>New Workflow</span>
          </button>
        </div>
      </header>

      {/* Integration Status Tracker */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1" style={{ marginTop: '9px' }}>
        <h3 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          n8n & Webhook listener Status: ONLINE
        </h3>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
         CoachOS acts as a direct client portal sync. Triggering the "Test" button below sends a mock webhook payload directly to your connected nodes, instantly appearing in the Dashboard live activity logger.
        </p>
      </div>

      {/* Database Container */}
      <div className="bg-white rounded-xl card-shadow border border-[#c6c5d5] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f3f2] border-b border-[#c6c5d5]">
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider w-48">Workflow Name</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider">Trigger Description</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider w-32">Category</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider w-32">Last Triggered</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider text-center w-24">Enabled</th>
              <th className="px-6 py-3.5 text-xs font-bold text-[#5f5e5c] uppercase tracking-wider text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c6c5d5]">
            {workflows.map((wf) => (
              <tr 
                key={wf.id}
                className="hover:bg-[#f4f3f2]/30 transition-all font-sans text-xs"
              >
                <td className="px-6 py-4 font-semibold text-[#1a1c1c]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${wf.enabled ? 'bg-[#4450b7]' : 'bg-[#e9e8e7]'}`}></span>
                    {wf.id}: {wf.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-[#5f5e5c] font-medium leading-relaxed max-w-sm">
                  {wf.description}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border ${getBadgeStyle(wf.badge)}`}>
                    {wf.badge}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#5f5e5c] font-medium whitespace-nowrap">
                  {wf.lastTriggered}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onToggleWorkflow(wf.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4450b7]/20 ${
                      wf.enabled ? 'bg-[#4450b7]' : 'bg-[#d2d1d0]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        wf.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    disabled={!wf.enabled}
                    onClick={() => onRunTestWorkflow(wf.id, wf.name)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all transform active:scale-95 ${
                      wf.enabled
                        ? 'bg-[#efeeed] text-[#4450b7] hover:bg-[#5e6ad2]/10'
                        : 'bg-[#faf9f8] text-[#c9c6c3] cursor-not-allowed'
                    }`}
                  >
                    Test Flow
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Workflow Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-[#c6c5d5] animate-in fade-in zoom-in duration-200"
          >
            <div className="px-6 py-4 bg-[#f4f3f2] border-b border-[#c6c5d5] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1a1c1c]">Setup Automated Trigger</h3>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="text-[#5f5e5c] hover:text-[#1a1c1c]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Workflow Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Post-Call Resource Delivery"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Trigger Hook Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Auto-sends personalized Notion dashboard link when client status updates."
                  value={newWfDesc}
                  onChange={(e) => setNewWfDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Category Tag</label>
                <select
                  value={newWfBadge}
                  onChange={(e) => setNewWfBadge(e.target.value as Workflow['badge'])}
                  className="w-full p-2.5 bg-[#f4f3f2] border border-[#c6c5d5]/80 rounded-xl"
                >
                  <option value="High Priority">High Priority</option>
                  <option value="Social">Social</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Events">Events</option>
                  <option value="Processing">Processing</option>
                  <option value="FinOps">FinOps</option>
                  <option value="Retention">Retention</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f4f3f2] border-t border-[#c6c5d5] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-transparent hover:bg-[#efeeed] text-[#5f5e5c] px-4 py-2 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 font-bold text-xs rounded-xl"
              >
                Create Workflow
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
