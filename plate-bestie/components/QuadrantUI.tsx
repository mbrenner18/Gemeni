import React from 'react';
import { PlantAnalysis } from '../types';

interface QuadrantUIProps {
  data: PlantAnalysis;
  compact?: boolean;
}

const QuadrantUI: React.FC<QuadrantUIProps> = ({ data, compact = false }) => {
  const containerClass = compact 
    ? "grid grid-cols-2 gap-1 w-24 h-24" 
    : "grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 w-full p-2 max-w-sm mx-auto";

  const iconClass = compact ? "text-xs" : "text-2xl mb-1";
  const labelClass = compact ? "hidden" : "text-[9px] font-black tracking-widest opacity-70 uppercase mb-1";
  const textClass = compact ? "hidden" : "text-[10px] font-bold text-center leading-tight px-2";
  const boxClass = "flex flex-col items-center justify-center rounded-[2rem] shadow-sm transition-all hover:scale-105 p-3 border border-transparent min-h-[110px]";

  return (
    <div className={containerClass}>
      {/* Sunlight */}
      <div className={`${boxClass} bg-yellow-400 text-yellow-900`}>
        <i className={`fas fa-sun ${iconClass}`}></i>
        <span className={labelClass}>Sunlight</span>
        {!compact && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase mb-0.5">{data.sun.level}</span>
            <span className={textClass}>{data.sun.requirement}</span>
          </div>
        )}
      </div>
      
      {/* Water */}
      <div className={`${boxClass} bg-blue-500 text-white`}>
        <i className={`fas fa-tint ${iconClass}`}></i>
        <span className={labelClass}>Water</span>
        {!compact && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase">{data.water.status}</span>
          </div>
        )}
      </div>
      
      {/* Seed */}
      <div className={`${boxClass} bg-orange-100 text-orange-900 border-orange-200`}>
        <i className={`fas fa-seedling ${iconClass}`}></i>
        <span className={labelClass}>Stage</span>
        {!compact && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase">{data.seed.stage}</span>
          </div>
        )}
      </div>
      
      {/* Soil */}
      <div className={`${boxClass} bg-slate-800 text-slate-100`}>
        <i className={`fas fa-mountain ${iconClass}`}></i>
        <span className={labelClass}>Substrate</span>
        {!compact && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase mb-0.5">{data.soil.quality}</span>
            <span className={textClass}>pH: {data.soil.ph}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuadrantUI;