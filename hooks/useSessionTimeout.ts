import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSessionTimeout = (timeoutDuration: number = 3 * 60 * 1000) => { // Default 3 minutes
  const navigate = useNavigate();
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) return;

    const logout = () => {
      localStorage.removeItem('isAdmin');
      navigate('/admin/login');
      alert('Session timed out due to inactivity.');
    };

    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(logout, timeoutDuration);
    };

    const events = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetTimeout();
    };

    // Initial setup
    resetTimeout();

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate, timeoutDuration]);
};