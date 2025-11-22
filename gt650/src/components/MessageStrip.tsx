import { ArrowLeft, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

type MessageType = 'nav' | 'advisory' | 'critical' | 'moment-saved';
type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';
type Mode = 'normal' | 'focus';

interface MessageStripProps {
  type: MessageType;
  theme: Theme;
  mode: Mode;
}

export function MessageStrip({ type, theme, mode }: MessageStripProps) {
  const getMessageContent = () => {
    switch (type) {
      case 'nav':
        return {
          icon: <ArrowLeft size={mode === 'focus' ? 40 : 24} color="#F4EDE1" strokeWidth={2.5} />,
          text: 'Turn left in 200 m',
          color: '#F4EDE1',
          showLanes: true,
        };
      case 'advisory':
        return {
          icon: <AlertTriangle size={20} color="#FFB000" />,
          text: 'Check tire pressure soon',
          color: '#FFB000',
          showLanes: false,
        };
      case 'critical':
        return {
          icon: <AlertCircle size={20} color="#E53935" />,
          text: 'Engine Overheat — Stop Safely',
          color: '#E53935',
          showLanes: false,
        };
      case 'moment-saved':
        return {
          icon: <CheckCircle size={20} color="#31C48D" />,
          text: 'Moment saved',
          color: '#31C48D',
          showLanes: false,
        };
    }
  };

  const content = getMessageContent();
  const stripHeight = mode === 'focus' ? 64 : 48;

  return (
    <div
      className="flex items-center justify-between px-4 gap-3"
      style={{
        width: mode === 'focus' ? '800px' : '640px',
        height: `${stripHeight}px`,
        backgroundColor: 'rgba(27, 29, 31, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '10px',
        border: type === 'critical' ? '1px solid rgba(229, 57, 53, 0.4)' : type === 'advisory' ? '1px solid rgba(255, 176, 0, 0.4)' : 'none',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Left section - Icon */}
      <div className="flex items-center justify-center" style={{ minWidth: mode === 'focus' ? '48px' : '32px' }}>
        {content.icon}
      </div>

      {/* Middle section - Text */}
      <div
        className="flex-1"
        style={{
          fontSize: mode === 'focus' ? '20px' : '16px',
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: '600',
          color: content.color,
          letterSpacing: '0.05em',
        }}
      >
        {content.text}
      </div>

      {/* Right section - Lane guidance (only for nav) */}
      {content.showLanes && (
        <div className="flex gap-1.5 items-end" style={{ height: mode === 'focus' ? '32px' : '24px' }}>
          {[0, 1, 2, 3].map((lane) => (
            <div
              key={lane}
              style={{
                width: '6px',
                height: lane === 1 ? (mode === 'focus' ? '32px' : '24px') : (mode === 'focus' ? '22px' : '16px'),
                backgroundColor: lane === 1 ? '#F4EDE1' : '#3A3A3C',
                borderRadius: '2px',
                transition: 'all 200ms',
              }}
            />
          ))}
        </div>
      )}

      {/* TPMS icon for advisory */}
      {type === 'advisory' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#FFB000" strokeWidth="2" />
          <path d="M12 8v4m0 4h.01" stroke="#FFB000" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}