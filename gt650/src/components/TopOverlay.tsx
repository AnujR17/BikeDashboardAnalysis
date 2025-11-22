import { Bluetooth, Satellite, Sun } from 'lucide-react';

type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';

interface TopOverlayProps {
  bluetooth: boolean;
  gps: boolean;
  theme: Theme;
}

export function TopOverlay({ bluetooth, gps, theme }: TopOverlayProps) {
  return (
    <div
      className="absolute flex items-center gap-8"
      style={{
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Bluetooth */}
      <div className="flex items-center gap-2">
        <Bluetooth
          size={18}
          color={bluetooth ? '#31C48D' : '#F4EDE1'}
          fill={bluetooth ? '#31C48D' : 'none'}
        />
      </div>

      {/* GPS */}
      <div className="flex items-center gap-2">
        <Satellite
          size={18}
          color={gps ? '#31C48D' : '#F4EDE1'}
        />
      </div>

      {/* Auto brightness */}
      <div className="flex items-center gap-1">
        <Sun size={16} color="#F4EDE1" />
        <div
          style={{
            fontSize: '10px',
            fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
            fontWeight: '700',
            color: '#F4EDE1',
            letterSpacing: '0.02em',
          }}
        >
          A
        </div>
      </div>
    </div>
  );
}
