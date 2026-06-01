import React from 'react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onNewClientClick: () => void;
  onLogout: () => void;
  totalLeadsCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  onNewClientClick,
  onLogout,
  totalLeadsCount = 14,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'leads', label: 'Clients', icon: 'group' },
    { id: 'sessions', label: 'Sessions', icon: 'event' },
    { id: 'community', label: 'Community', icon: 'groups' },
    { id: 'content', label: 'Content', icon: 'library_books' },
    { id: 'automations', label: 'Automations', icon: 'bolt' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      <aside className={`fixed left-0 top-0 h-full z-50 py-4 h-screen w-64 flex flex-col bg-[#f4f3f2] border-r border-[#c6c5d5] transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="px-4 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4450b7] rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-base font-bold">fitness_center</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#1a1c1c] leading-none mb-0.5">CoachOS V5</h1>
              <p className="text-[11px] text-[#5f5e5c] leading-none">Professional Suite</p>
            </div>
          </div>
          {/* Close button on mobile list drawer */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-[#5f5e5c] hover:bg-[#e3e2e1] active:translate-y-px"
            aria-label="Close sidebar menu"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onClose) onClose();
                }}
                className={`flex items-center gap-3 px-4 py-2 text-left font-sans text-[14px] transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#5e6ad2]/10 text-[#4450b7] font-semibold border-l-4 border-[#4450b7]'
                    : 'text-[#5f5e5c] hover:bg-[#e3e2e1] hover:translate-x-1'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'text-[#4450b7]' : 'text-[#5f5e5c]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.id === 'leads' && (
                  <span className="ml-auto text-xs bg-[#e5e2de] text-[#1a1c1c] font-mono px-1.5 py-0.5 rounded-full select-none">
                    {totalLeadsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="mt-auto px-4 pt-4 border-t border-[#c6c5d5] flex flex-col gap-2">
          <button
            onClick={() => {
              onNewClientClick();
              if (onClose) onClose();
            }}
            className="w-full bg-[#4450b7] hover:bg-[#5e6ad2] text-white font-semibold text-[13px] py-1.5 rounded-xl block text-center transition-all duration-150 transform active:scale-95 shadow-sm"
          >
            New Client
          </button>
          <button
            onClick={() => {
              onNavigate('settings');
              if (onClose) onClose();
            }}
            className={`flex items-center gap-3 px-4 py-1.5 text-left font-sans text-[13px] text-[#5f5e5c] hover:bg-[#e3e2e1] rounded transition-all ${
              currentView === 'profile' ? 'bg-[#5e6ad2]/10 text-[#4450b7] font-semibold' : ''
            }`}
          >
            <span className="material-symbols-outlined text-sm">account_circle</span>
            <span>Profile</span>
          </button>
          <button
            onClick={() => {
              onLogout();
              if (onClose) onClose();
            }}
            className="flex items-center gap-3 px-4 py-1.5 text-left font-sans text-[13px] text-[#5f5e5c] hover:bg-error-container/10 hover:text-[#ba1a1a] rounded transition-all"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
