import { motion } from 'motion/react';
import { Settings, Moon, Sun, Volume2, Bluetooth, Navigation, X } from 'lucide-react';

type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function SettingsModal({ isOpen, onClose, theme, onThemeChange }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        backgroundColor: '#1B1D1F',
        borderRadius: '12px',
        border: '2px solid #2A2C2E',
        padding: '24px',
        zIndex: 100,
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings size={24} color="#F4EDE1" />
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'Inter',
              fontWeight: '700',
              color: '#F4EDE1',
            }}
          >
            Settings
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(42, 44, 46, 0.5)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} color="#F4EDE1" />
        </button>
      </div>

      {/* Theme Selection */}
      <div className="mb-6">
        <div
          style={{
            fontSize: '14px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#8E8E92',
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}
        >
          THEME
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onThemeChange('classic-amber')}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: theme === 'classic-amber' ? 'rgba(255, 193, 90, 0.15)' : 'rgba(42, 44, 46, 0.5)',
              border: theme === 'classic-amber' ? '2px solid #FFC15A' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sun size={24} color={theme === 'classic-amber' ? '#FFC15A' : '#8E8E92'} />
            <div
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '600',
                color: theme === 'classic-amber' ? '#FFC15A' : '#8E8E92',
              }}
            >
              Classic Amber
            </div>
          </button>
          <button
            onClick={() => onThemeChange('ivory-mono')}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: theme === 'ivory-mono' ? 'rgba(244, 237, 225, 0.15)' : 'rgba(42, 44, 46, 0.5)',
              border: theme === 'ivory-mono' ? '2px solid #F4EDE1' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Moon size={24} color={theme === 'ivory-mono' ? '#F4EDE1' : '#8E8E92'} />
            <div
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '600',
                color: theme === 'ivory-mono' ? '#F4EDE1' : '#8E8E92',
              }}
            >
              Ivory Mono
            </div>
          </button>
          <button
            onClick={() => onThemeChange('night-indigo')}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: theme === 'night-indigo' ? 'rgba(62, 160, 230, 0.15)' : 'rgba(42, 44, 46, 0.5)',
              border: theme === 'night-indigo' ? '2px solid #3EA0E6' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Navigation size={24} color={theme === 'night-indigo' ? '#3EA0E6' : '#8E8E92'} />
            <div
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '600',
                color: theme === 'night-indigo' ? '#3EA0E6' : '#8E8E92',
              }}
            >
              Night Indigo
            </div>
          </button>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="mb-4">
        <div
          style={{
            fontSize: '14px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#8E8E92',
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}
        >
          QUICK SETTINGS
        </div>
        <div className="flex flex-col gap-2">
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(42, 44, 46, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="flex items-center gap-3">
              <Bluetooth size={20} color="#31C48D" />
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: '#F4EDE1',
                }}
              >
                Bluetooth
              </div>
            </div>
            <div
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '500',
                color: '#31C48D',
              }}
            >
              Connected
            </div>
          </div>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(42, 44, 46, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="flex items-center gap-3">
              <Volume2 size={20} color="#F4EDE1" />
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: '#F4EDE1',
                }}
              >
                Volume
              </div>
            </div>
            <div
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '500',
                color: '#8E8E92',
              }}
            >
              75%
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div
        style={{
          padding: '12px',
          backgroundColor: 'rgba(42, 44, 46, 0.3)',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'Inter',
          fontWeight: '500',
          color: '#8E8E92',
          textAlign: 'center',
        }}
      >
        Press <span style={{ color: '#F4EDE1' }}>M</span> to close • Press <span style={{ color: '#F4EDE1' }}>C</span> to toggle connectivity
      </div>
    </motion.div>
  );
}
