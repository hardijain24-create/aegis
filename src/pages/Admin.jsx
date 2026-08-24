import React, { useState } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || 'Access denied');
      setData(result);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#11110F] text-[#F2F0EB] flex flex-col items-center justify-center font-sans p-4 relative">
        <a href="/" className="absolute top-8 left-8 text-[#686660] hover:text-[#F2F0EB] font-mono text-xs uppercase underline">Back to Main</a>
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-6">
          <h2 className="font-heading text-2xl tracking-widest text-center uppercase mb-4 text-[#A9C4C0]">
            Restricted Access
          </h2>
          {error && <p className="text-red-400 text-sm text-center font-mono">{error}</p>}
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b border-[rgba(242,240,235,0.3)] outline-none py-2 text-center font-mono tracking-[0.3em] placeholder-neutral-600 focus:border-[#F2F0EB] transition-colors"
            placeholder="ACCESS CODE"
            autoFocus
          />
          <button 
            type="submit"
            disabled={loading}
            className="border border-[rgba(242,240,235,0.3)] py-3 uppercase font-mono text-xs tracking-widest hover:bg-[#F2F0EB] hover:text-[#11110F] transition-colors"
          >
            {loading ? 'VERIFYING...' : 'ENTER'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-[#11110F] font-sans p-8 md:p-16">
      <header className="mb-12 border-b border-[rgba(17,17,15,0.1)] pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-4xl uppercase tracking-widest mb-2">AEGIS Command</h1>
          <p className="font-mono text-xs text-[#686660] uppercase tracking-wider">Super Admin Dashboard</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="font-mono text-xs uppercase underline hover:no-underline"
        >
          Lock Terminal
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="border border-[rgba(17,17,15,0.1)] p-8 bg-[#E8E6E0] rounded-[4px]">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#686660] mb-4">Total Users</h3>
          <p className="font-heading text-6xl">{data?.total_users || 0}</p>
        </div>
        <div className="border border-[rgba(17,17,15,0.1)] p-8 bg-[#E8E6E0] rounded-[4px]">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#686660] mb-4">Website Visits</h3>
          <p className="font-heading text-6xl">{data?.total_visits || 0}</p>
        </div>
        <div className="border border-[rgba(17,17,15,0.1)] p-8 bg-[#E8E6E0] rounded-[4px]">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#686660] mb-4">System Status</h3>
          <p className="font-heading text-3xl text-green-600 mt-3">ONLINE</p>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-2xl uppercase tracking-widest mb-6">User Registry</h2>
        <div className="overflow-x-auto border border-[rgba(17,17,15,0.1)] rounded-[4px] bg-[#E8E6E0]">
          <table className="w-full text-left font-body text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-widest text-[#686660] border-b border-[rgba(17,17,15,0.1)]">
              <tr>
                <th className="p-4">Signup ID</th>
                <th className="p-4">Email</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((user, idx) => (
                <tr key={user.signup_id} className={`border-b border-[rgba(17,17,15,0.05)] ${idx % 2 === 0 ? 'bg-[#F2F0EB]' : ''}`}>
                  <td className="p-4 font-mono text-xs">{user.signup_id}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 uppercase text-xs">{user.authProvider}</td>
                  <td className="p-4 text-xs text-[#686660]">{new Date(user.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {(!data?.users || data.users.length === 0) && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[#686660]">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
