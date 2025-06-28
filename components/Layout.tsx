import React, { useState } from "react";
import Link from "next/link";
import { Antenna, User, Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  error?: boolean | string;
}

export const Layout = ({ children, error }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-blue-900 text-white px-4 md:px-10 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Hamburger menu (mobile) */}
          <button
            className="md:hidden mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Antenna className="h-7 w-7 text-orange-400 hidden md:inline" />
          <span className="text-xl font-bold hidden md:inline">5G Designer</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg hidden sm:inline">John Doe</span>
          <span className="ml-2 text-xs bg-blue-800 rounded-full px-2 py-1 hidden sm:inline">Ingénieur Réseau</span>
          <div className="rounded-full bg-blue-800 w-8 h-8 flex items-center justify-center font-bold">
            JD
          </div>
        </div>
      </header>
      {/* Sidebar (desktop) + Drawer (mobile) */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-64 bg-blue-900 text-white flex-col justify-between py-8 px-6 min-h-screen">
          <div>
            <nav className="flex flex-col gap-4">
              <Link href="/projects" className="py-2 px-3 rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium">
                <span>📁</span> Projets
              </Link>
              <Link href="/profile" className="py-2 px-3 rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium">
                <User className="h-5 w-5" /> Profil
              </Link>
              <Link href="/settings" className="py-2 px-3 rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium">
                <span>⚙️</span> Paramètres
              </Link>
            </nav>
          </div>
          <div>
            <button className="text-slate-300 hover:text-orange-400 text-sm">Se déconnecter</button>
          </div>
        </aside>
        {/* Sidebar mobile drawer */}
        <div
          className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={!sidebarOpen}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={`fixed top-0 left-0 z-50 w-64 h-full bg-blue-900 text-white flex-col justify-between py-8 px-6 transform transition-transform duration-200 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-label="Menu principal"
        >
          <div>
            <div className="flex items-center mb-12 space-x-3">
              <Antenna className="h-7 w-7 text-orange-400" />
              <span className="text-xl font-bold">5G Designer</span>
            </div>
            <nav className="flex flex-col gap-4">
              <Link href="/projects" className="py-2 px-3 rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium" onClick={() => setSidebarOpen(false)}>
                <span>📁</span> Projets
              </Link>
              <Link href="/profile" className="py-2 px-3 rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium" onClick={() => setSidebarOpen(false)}>
                <User className="h-5 w-5" /> Profil
              </Link>
              <Link href="/settings" className="py-2 px-3 rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium" onClick={() => setSidebarOpen(false)}>
                <span>⚙️</span> Paramètres
              </Link>
            </nav>
          </div>
          <div>
            <button className="text-slate-300 hover:text-orange-400 text-sm">Se déconnecter</button>
          </div>
        </aside>
        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Content */}
          <main className="flex-1 p-2 sm:p-6 md:p-10 bg-white w-full max-w-full overflow-x-auto">
            {error && (
              <div className="mb-4 text-red-500 font-semibold text-center rounded bg-red-100 py-2 px-4 max-w-xl mx-auto">
                Une erreur est survenue. Veuillez réessayer.
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
