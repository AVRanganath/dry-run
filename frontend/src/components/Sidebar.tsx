'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { href: '/', icon: 'folder_open', label: 'Dossier' },
    { href: '/setup', icon: 'work', label: 'Briefcase' },
    { href: '/sessions', icon: 'mic', label: 'Sessions' },
    { href: '/report', icon: 'assignment', label: 'Reports' },
  ];

  const bottomLinks = [
    { href: '/archive', icon: 'inventory_2', label: 'Archive' },
    { href: '/support', icon: 'help_outline', label: 'Support' },
  ];

  return (
    <>
      {/* Mobile TopAppBar */}
      <header className="md:hidden flex justify-between items-center w-full px-gutter py-unit border-b border-outline-variant/30 shadow-[0px_2px_4px_rgba(0,0,0,0.05)] bg-surface z-10 shrink-0">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Dry Run</h1>
        <div className="flex items-center space-x-4">
          <span className="font-body-md font-bold text-on-surface">{user?.name || 'User'}</span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold overflow-hidden border border-outline-variant/50">
            {getInitials(user?.name || '')}
          </div>
        </div>
      </header>
      
      {/* Desktop SideNav */}
      <nav className="hidden md:flex flex-col h-screen w-64 border-r border-outline-variant/50 bg-surface-container-low p-4 space-y-4 shrink-0 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)] z-20 relative">
        <div className="mb-8 px-2">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Dry Run</h1>
        </div>
        
        <div className="flex items-center space-x-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold overflow-hidden border border-outline-variant/30 flex-shrink-0">
            {getInitials(user?.name || '')}
          </div>
          <div className="overflow-hidden">
            <p className="font-body-md text-body-md font-bold text-on-surface truncate">{user?.name || 'User'}</p>
            <p className="font-data-mono text-data-mono text-on-surface-variant text-[10px] truncate">{user?.email || 'email@example.com'}</p>
          </div>
        </div>
        
        <Link href="/setup" className="w-full bg-surface-tint text-on-primary font-label-caps text-label-caps py-3 rounded-lg mb-4 flex items-center justify-center space-x-2 embossed-card hover:translate-y-[1px] transition-transform">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          <span>New Session</span>
        </Link>
        
        <div className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1'}`}
              >
                <span className={`material-symbols-outlined ${isActive ? '' : 'text-outline group-hover:text-primary'}`}>{link.icon}</span>
                <span className="font-label-caps text-label-caps">{link.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto space-y-1 pt-4 border-t border-outline-variant/30">
          {bottomLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors group">
              <span className="material-symbols-outlined text-outline group-hover:text-primary">{link.icon}</span>
              <span className="font-label-caps text-label-caps">{link.label}</span>
            </Link>
          ))}
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-error hover:bg-error-container/30 rounded-lg transition-colors group mt-2"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-caps text-label-caps">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
