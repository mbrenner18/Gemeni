import React from 'react';
import { PlantAnalysis } from '../types';
import Mascot from './Mascot';

const MASCOT_SUCCESS_URL = 'https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/Martian_Success.png';

interface PlantPassportProps {
  data: PlantAnalysis;
  onClose: () => void;
}

const PlantPassport: React.FC<PlantPassportProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm aspect-[3/5] bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-visible flex flex-col p-8">
        
        {/* Grid Lines Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0 overflow-hidden rounded-[3rem]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Header */}
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div>
            <div className="bg-orange-600 text-[8px] font-black text-white px-2 py-0.5 rounded tracking-[0.3em] uppercase mb-1 inline-block shadow-lg shadow-orange-900/40">
              Planet-Earth Protocol
            </div>
            <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none break-words max-w-[200px]">
              {data.name || "Unknown Bio-Unit"}
            </h2>
            <div className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mt-2 font-mono">
              ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/20 transition-all active:scale-90 z-50">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* 2x2 Data Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 flex-1">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col justify-between backdrop-blur-md">
            <div className="text-[8px] font-black text-yellow-400 uppercase tracking-widest mb-1"><i className="fas fa-sun"></i> Photon</div>
            <div className="text-white text-xs font-black uppercase">{data.sun.level}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col justify-between backdrop-blur-md">
            <div className="text-[8px] font-black text-green-400 uppercase tracking-widest mb-1"><i className="fas fa-seedling"></i> Phase</div>
            <div className="text-white text-xs font-black uppercase">{data.seed.stage}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col justify-between backdrop-blur-md">
            <div className="text-[8px] font-black text-orange-400 uppercase tracking-widest mb-1"><i className="fas fa-mountain"></i> Soil</div>
            <div className="text-white text-xs font-black uppercase truncate">pH {data.soil.ph}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col justify-between backdrop-blur-md">
            <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1"><i className="fas fa-tint"></i> Water</div>
            <div className="text-white text-xs font-black uppercase">{data.water.status}</div>
          </div>
        </div>

        {/* 🥋 REBALANCED FOOTER SECTION */}
        <div className="relative z-10 mt-8 min-h-[120px]">
          <div className="bg-black/40 border-t border-white/10 pt-4 px-2 pr-24 rounded-b-2xl">
            <div className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Tactical Mission Log</div>
            <p className="text-white/80 text-[11px] italic leading-relaxed font-medium">"{data.missionLog}"</p>
          </div>

          {/* 🥋 MASCOT AS THE "VALIDATION SEAL" */}
          <div className="absolute -bottom-4 -right-4 z-20 transition-transform hover:scale-110 duration-500">
            <Mascot 
              src={MASCOT_SUCCESS_URL} 
              size="lg"
              mood="success" 
              className="drop-shadow-[0_0_30px_rgba(234,88,12,0.8)] h-32 w-auto"
            />
          </div>
        </div>

        {/* Scan Bar Animation */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent shadow-[0_0_15px_#fff] animate-scan-line z-30 pointer-events-none"></div>

        <style>{`
          @keyframes scan-line {
            0% { top: 0%; opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .animate-scan-line {
            animation: scan-line 4s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PlantPassport;