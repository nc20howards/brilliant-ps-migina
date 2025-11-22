import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../constants';
import { StorageService } from '../services/storageService';
import { SiteSettings } from '../types';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const isAdmin = location.pathname.startsWith('/admin');

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500";
  const mobileLinkClass = (path: string) => `block px-3 py-2 rounded-md text-base font-medium ${location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`;

  useEffect(() => {
    const updateSettings = () => {
      setSettings(StorageService.getSettings());
    };

    // Poll every 2s (fallback)
    const interval = setInterval(updateSettings, 2000);
    
    // Listen for immediate updates from Dashboard
    window.addEventListener('schola-settings-changed', updateSettings);

    return () => {
      clearInterval(interval);
      window.removeEventListener('schola-settings-changed', updateSettings);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="text-blue-600">
                  <Icons.Academic />
                </div>
              )}
              <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block">{settings.schoolName}</span>
              <span className="font-bold text-xl text-gray-900 tracking-tight sm:hidden">Brilliant PS</span>
            </Link>
          </div>
          
          {/* Desktop Menu - Visible only on Large screens (lg) and up */}
          <div className="hidden lg:flex items-center space-x-8 whitespace-nowrap">
            {!isAdmin ? (
              <>
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/about" className={isActive('/about')}>About Us</Link>
                <Link to="/contact" className={isActive('/contact')}>Contact Us</Link>
                <Link to="/news" className={isActive('/news')}>News & Events</Link>
                <Link to="/performance" className={isActive('/performance')}>Performance</Link>
                <Link to="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                  Admin Login
                </Link>
              </>
            ) : (
              <>
                 <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Admin Mode</span>
                 <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
                 <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">Exit</Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Button - Visible on screens smaller than lg */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
             {!isAdmin ? (
              <>
                <Link to="/" className={mobileLinkClass('/')} onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/about" className={mobileLinkClass('/about')} onClick={() => setIsMenuOpen(false)}>About Us</Link>
                <Link to="/contact" className={mobileLinkClass('/contact')} onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                <Link to="/news" className={mobileLinkClass('/news')} onClick={() => setIsMenuOpen(false)}>News & Events</Link>
                <Link to="/performance" className={mobileLinkClass('/performance')} onClick={() => setIsMenuOpen(false)}>Performance</Link>
                <Link to="/admin/login" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100" onClick={() => setIsMenuOpen(false)}>
                  Admin Login
                </Link>
              </>
            ) : (
              <>
                 <div className="px-3 py-2 text-xs uppercase font-bold text-gray-400 tracking-wider">Admin Mode</div>
                 <Link to="/admin/dashboard" className={mobileLinkClass('/admin/dashboard')} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                 <Link to="/" className={mobileLinkClass('/')} onClick={() => setIsMenuOpen(false)}>Exit</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;