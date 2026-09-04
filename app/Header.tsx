'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type User = { email?: string; firstName?: string; lastName?: string; role?: string };

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch { setUser(null); }
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    window.addEventListener('user-updated', loadUser);
    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('user-updated', loadUser);
    };
  }, []);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const initials = (fullName || user?.email || '?').slice(0, 1).toUpperCase();
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user-updated'));
    router.push('/logout');
  };
  const sellerBlock = (
    <>
      <Link href="/my-assets/create" className="text-sm font-medium text-gray-600 transition hover:text-gray-950">Create Asset</Link>
      <Link href="/my-assets" className="text-sm font-medium text-gray-600 transition hover:text-gray-950">My Assets</Link>
    </>
  );
  return (

  <header className="border-b border-gray-200 bg-white">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href="/" className="text-xl font-bold tracking-tight text-gray-950">N5Deal</Link>
      <nav className="flex items-center gap-6" aria-label="Main navigation">
        {user ? (
          <div className="flex items-center gap-3 border-l border-gray-200 pl-6" aria-label="Profile information">
            { user.role === 'Seller' ? sellerBlock: ''}
            <button type="button" onClick={handleLogout} className="text-sm font-medium text-gray-600 transition hover:text-gray-950 cursor-pointer">Log out</button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">{initials}</div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-950">{fullName || user.email}</p>
              <p className="text-xs text-gray-500">{user.role || user.email}</p>
            </div>
          </div>
        ) : (
          <Link href="/login" className="text-sm font-medium text-gray-600 transition hover:text-gray-950">Log in</Link>
        )}
      </nav>
    </div>
  </header>
  );
}
