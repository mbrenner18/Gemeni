
import React from 'react';

const MASCOT_URL = 'https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/999beefaeb31c8dc64402ab4f974039b727387fa/mascot.png';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  mood?: string;
  src?: string;
}

const Mascot: React.FC<MascotProps> = ({ size = 'md', className = '', mood = 'happy', src }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
    xxl: 'w-72 h-72 md:w-80 md:h-80'
  };

  const imageSrc = src || MASCOT_URL;

  return (
    <div className={`relative flex items-center justify-center py-2 ${sizeClasses[size]} ${className}`}>
      <style>{`
        @keyframes martian-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-martian-float {
          animation: martian-float 4s ease-in-out infinite;
        }
      `}</style>
      <img 
        src={imageSrc} 
        alt={`Me-Lap the Martian (${mood})`}
        className="w-full h-full object-contain animate-martian-float scale-90 sm:scale-100" 
      />
    </div>
  );
};

export default Mascot;