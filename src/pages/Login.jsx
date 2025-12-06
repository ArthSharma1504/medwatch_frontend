// src/pages/Login.jsx
import React, { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';

export default function Login() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const refresh = useAuthStore((s) => s.refresh);

const submit = async (e) => {
  e.preventDefault();
  setErr('');

  try {
    const res = await api.post('/auth/login', {
      username: u,
      password: p
    });

    if (res.data?.user && res.data?.token) {
      useAuthStore.getState().setSession({
        user: res.data.user,
        token: res.data.token
      });

      if (res.data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/doctor';
      }
    } else {
      setErr('Login failed');
    }
  } catch (err) {
    setErr(err?.response?.data?.error || 'Login failed');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-semibold mb-4">MedWatch — Login</h2>
        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
        <input value={u} onChange={(e)=>setU(e.target.value)} placeholder="Username" className="w-full p-2 border rounded mb-2" />
        <input type="password" value={p} onChange={(e)=>setP(e.target.value)} placeholder="Password" className="w-full p-2 border rounded mb-4" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
