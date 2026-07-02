import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('matchmaker');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Mock validation
    setTimeout(() => {
      if (username.trim() === 'matchmaker' && password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid matchmaker credentials. Try matchmaker / admin123.');
        setLoading(false);
      }
    }, 450);
  };

  return (
    <div className="warm-paper-bg min-h-screen flex items-center justify-center p-6 relative">
      <div className="radial-glow" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-border rounded-card shadow-card p-8 z-10 relative"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
            <HeartHandshake className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-text-primary tracking-tight mt-2">
            Welcome back, Matchmaker
          </h2>
          <p className="text-xs text-text-secondary">
            Sign in to manage profiles and review compatibility suggestions.
          </p>
        </div>

        {/* Credentials reminder alert */}
        <div className="bg-background-secondary border border-border rounded-interactive p-3 flex gap-2.5 items-start mb-6 text-xs text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-text-primary">Demo Account Credentials:</span><br />
            Username: <code className="font-mono bg-white px-1 py-0.5 rounded border border-border">matchmaker</code><br />
            Password: <code className="font-mono bg-white px-1 py-0.5 rounded border border-border">admin123</code>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-error/5 border border-error/20 text-error rounded-interactive p-3 flex gap-2 items-center text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-background border border-border rounded-interactive px-3.5 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all text-text-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-text-secondary">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-background border border-border rounded-interactive pl-3.5 pr-10 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all text-text-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-white py-2.5 rounded-interactive font-heading font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={onBack}
          disabled={loading}
          className="w-full text-center text-xs text-text-secondary hover:text-text-primary transition-colors mt-6 underline cursor-pointer"
        >
          Back to Welcome Screen
        </button>
      </motion.div>
    </div>
  );
};
