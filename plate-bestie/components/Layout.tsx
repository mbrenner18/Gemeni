import React from 'react';
import { AppState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeState: AppState;
  onNavigate: (state: AppState) => void;
  stats: { xp: number; coins: number; streak: number };
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeState, 
  onNavigate, 
  stats,
  audioEnabled,
  setAudioEnabled
}) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* 🥋 TOP HEADER: MISSION STATUS & CURRENCY */}
      <header className="shrink-0 p-4 flex items-center justify-between border-b bg-white z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mascot Icon */}
          <div className="bg-white p-1 rounded-xl flex items-center justify-center border-2 border-slate-50 shadow-sm overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/Martian_Happy.png" 
              alt="Me-Lap Mascot"
              className="h-8 w-8 object-contain"
            />
          </div>
          
          <div className="flex flex-col">
            <span 
              className="font-black text-xl tracking-normal leading-none"
              style={{ color: '#58CC02' }}
            >
              Plate Bestie
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">
              Mars Mission Uplink
            </span>
          </div>
        </div>

        {/* 🥋 AUDIO TOGGLE (Vocal Interface) */}
        <div className="flex items-center gap-2 ml-auto mr-3">
          <button 
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              if(audioEnabled) window.speechSynthesis.cancel();
            }} 
            className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${audioEnabled ? 'bg-[#58CC02]' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md 
              ${audioEnabled ? 'left-[22px]' : 'left-[2px]'}`}>
            </div>
            <i className={`fas ${audioEnabled ? 'fa-volume-high text-[#58CC02]' : 'fa-volume-xmark text-slate-400'} 
              absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-black transition-colors`}>
            </i>
          </button>
        </div>

        {/* 🥋 STATS: Bio-Data Points (XP) & Research Credits (Coins) */}
        <div className="flex gap-2">
          <div className="bg-slate-50 px-3 py-1.5 rounded-full text-slate-700 font-bold text-[9px] tracking-wider flex items-center gap-1.5 border border-slate-200">
            <i className="fas fa-dna text-blue-500"></i> {stats.xp} BDP
          </div>
          <div className="bg-green-50 px-3 py-1.5 rounded-full text-green-700 font-bold text-[9px] tracking-wider flex items-center gap-1.5 border border-green-200">
            <i className="fas fa-flask" style={{ color: '#58CC02' }}></i> {stats.coins} RC
          </div>
        </div>
      </header>

      {/* 🥋 MAIN CONTENT VIEWPORT */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
        {children}
      </main>

      {/* 🥋 BOTTOM NAVIGATION DOCK (The "Controller") */}
      <nav className="shrink-0 h-24 bg-white border-t border-slate-100 flex items-center justify-around px-4 z-50">
        
        {/* HOME / BRIEFING */}
        <button 
          onClick={() => onNavigate(AppState.HOME)}
          className={`bouncy w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeState === AppState.HOME ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
          aria-label="Home"
        >
          <i className="fas fa-home text-xl"></i>
        </button>
        
        {/* MISSION LOGS / ARCHIVE */}
        <button 
          onClick={() => onNavigate(AppState.HISTORY)}
          className={`bouncy w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeState === AppState.HISTORY ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
          aria-label="Archive"
        >
          <i className="fas fa-history text-xl"></i>
        </button>

        {/* SCANNER / SENSORS */}
        <button 
          onClick={() => onNavigate(AppState.SCAN)}
          className={`bouncy w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            activeState === AppState.SCAN || 
            activeState === AppState.ANALYZING || 
            activeState === AppState.SPACE_SCAN || 
            activeState === AppState.SPACE_RESULTS 
              ? 'bg-blue-600 text-white shadow-lg scale-110' 
              : 'bg-slate-50 text-slate-400'
          }`}
          aria-label="Sensors"
        >
          <i className="fas fa-crosshairs text-xl"></i>
        </button>

        {/* 🥋 MISSION CONTROL (Updated from Settings) */}
        <button 
          onClick={() => onNavigate(AppState.SETTINGS)}
          className={`bouncy w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeState === AppState.SETTINGS ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
          aria-label="Mission Control"
        >
          {/* 🥋 Trophy icon signals goals and achievement */}
          <i className={`fas fa-trophy text-xl ${activeState === AppState.SETTINGS ? 'animate-pulse' : ''}`}></i>
        </button>
      </nav>
    </div>
  );
};

export default Layout;