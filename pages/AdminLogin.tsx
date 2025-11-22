
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { StorageService } from '../services/storageService';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const creds = StorageService.getAdminCreds();

    if (username === creds.username && password === creds.password) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('sending');
    
    // Simulate API call delay
    setTimeout(() => {
      setResetStatus('sent');
    }, 1500);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setResetStatus('idle');
    setResetEmail('');
  };

  // Render Forgot Password View
  if (isForgotPassword) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your email address to receive reset instructions.
            </p>
          </div>

          {resetStatus === 'sent' ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm">
                If an account exists for <strong>{resetEmail}</strong>, you will receive a password reset link shortly.
              </div>
              <button 
                onClick={handleBackToLogin}
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@school.edu"
                />
              </div>
              <button
                type="submit"
                disabled={resetStatus === 'sending'}
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex justify-center items-center"
              >
                {resetStatus === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-gray-600 font-medium py-2.5 hover:text-gray-900 transition"
              >
                Back to Login
              </button>
            </form>
          )}
        </Card>
      </div>
    );
  }

  // Render Login View
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500 text-sm mt-1">Please sign in to manage records</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
