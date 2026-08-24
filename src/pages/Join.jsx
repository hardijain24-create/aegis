import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function Join() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const apiUrl = 'https://aegisb.onrender.com';

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/signup/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed');
      setMsg('Account created successfully! Welcome to AEGIS.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setMsg('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/signup/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Google Auth failed');
      setMsg('Successfully logged in with Google!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-[#11110F] flex flex-col font-sans">
      <nav className="p-8 flex justify-between items-center border-b border-[rgba(17,17,15,0.08)]">
        <a href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="6" width="16" height="3.5" rx="1.75" fill="#11110F" />
            <rect x="4" y="14.5" width="16" height="3.5" rx="1.75" fill="#11110F" />
          </svg>
          <span className="font-heading font-medium text-2xl tracking-tight">AEGIS</span>
        </a>
      </nav>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-[#E8E6E0] p-8 md:p-12 rounded-[8px] border border-[rgba(17,17,15,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <span className="text-[10px] font-mono tracking-widest text-[#686660] uppercase mb-4 block text-center">
            01 / JOIN US
          </span>
          <h2 className="text-3xl font-heading font-semibold text-center mb-8 uppercase tracking-wide">
            Welcome
          </h2>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">{error}</div>}
          {msg && <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded">{msg}</div>}

          <form onSubmit={handleLocalSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col border-b border-[rgba(17,17,15,0.15)] pb-2">
              <label className="text-[10px] font-mono tracking-wider text-[#686660] uppercase mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-[#11110F] font-body text-base placeholder-neutral-400"
                placeholder="you@domain.com"
              />
            </div>
            
            <div className="flex flex-col border-b border-[rgba(17,17,15,0.15)] pb-2">
              <label className="text-[10px] font-mono tracking-wider text-[#686660] uppercase mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-[#11110F] font-body text-base placeholder-neutral-400"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="mt-4 bg-[#11110F] text-[#F2F0EB] py-3 rounded-full text-sm font-medium tracking-wide transition-colors hover:bg-[#686660]"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-[rgba(17,17,15,0.1)]"></div>
            <span className="text-xs font-mono text-[#686660] uppercase tracking-wider">or</span>
            <div className="flex-1 h-[1px] bg-[rgba(17,17,15,0.1)]"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
