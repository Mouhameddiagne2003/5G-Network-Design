import React from "react";
import Link from "next/link";
import { Antenna, User } from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between py-8 px-6 min-h-screen">
        <div>
          <div className="flex items-center mb-12 space-x-3">
            <Antenna className="h-7 w-7 text-orange-400" />
            <span className="text-xl font-bold">5G Designer</span>
          </div>
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
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-blue-900 text-white px-10 py-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="font-semibold text-lg">John Doe</span>
            <span className="ml-2 text-xs bg-blue-800 rounded-full px-2 py-1">Ingénieur Réseau</span>
          </div>
          <div className="rounded-full bg-blue-800 w-8 h-8 flex items-center justify-center font-bold">
            JD
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-10 bg-white">{children}</main>
      </div>
    </div>
  );
};
