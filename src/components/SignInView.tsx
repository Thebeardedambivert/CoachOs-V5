import React, { useState } from 'react';

interface SignInProps {
  onSignInSuccess: (email: string) => void;
  onActionNotification: (message: string) => void;
}

export default function SignInView({ onSignInSuccess, onActionNotification }: SignInProps) {
  const [email, setEmail] = useState('alex.volkov@coachos.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onSignInSuccess(email);
      onActionNotification(`Logged in as account administrator ${email}`);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#c6c5d5] p-8 card-shadow space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#4450b7] rounded-2xl mx-auto flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl font-bold">fitness_center</span>
          </div>
          <h1 className="text-xl font-bold text-[#1a1c1c] tracking-tight">Welcome to CoachOS V5</h1>
          <p className="text-xs text-[#5f5e5c]">Professional Coaching Portal & n8n triggers manager</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-xs font-semibold">
            <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Admin Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-sans"
            />
          </div>

          <div className="space-y-1.5 text-xs font-semibold">
            <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Password passphrase</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4450b7] disabled:opacity-50 hover:opacity-90 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm active:scale-95"
          >
            {isLoading ? 'Accessing Secure Core...' : 'Sign In To Portal'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[10px] text-[#5f5e5c]">
            Secure login page • Admin details pre-filled. Click Sign In directly to browse the workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
