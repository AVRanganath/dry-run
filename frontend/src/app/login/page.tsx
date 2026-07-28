'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await register({ name, email, password });
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface embossed-card rounded-xl p-8 w-full max-w-md">
        <h1 className="font-headline-lg text-primary text-center mb-6">Access Portal</h1>
        
        <div className="flex mb-6 border-b border-outline-variant/30">
          <button 
            className={`flex-1 py-2 font-label-caps text-label-caps ${isLogin ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-2 font-label-caps text-label-caps ${!isLogin ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant'}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container rounded font-body-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block font-label-caps text-label-caps mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full debossed-well bg-surface-container-lowest p-3 rounded font-data-mono text-data-mono outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block font-label-caps text-label-caps mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full debossed-well bg-surface-container-lowest p-3 rounded font-data-mono text-data-mono outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block font-label-caps text-label-caps mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full debossed-well bg-surface-container-lowest p-3 rounded font-data-mono text-data-mono outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block font-label-caps text-label-caps mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full debossed-well bg-surface-container-lowest p-3 rounded font-data-mono text-data-mono outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full mt-6 bg-primary text-on-primary mechanical-btn py-3 rounded uppercase font-label-caps text-label-caps tracking-widest"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
