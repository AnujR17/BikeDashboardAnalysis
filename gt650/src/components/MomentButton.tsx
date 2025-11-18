import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Star } from 'lucide-react';

type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';

interface MomentButtonProps {
  onSave: () => void;
  theme: Theme;
}

export function MomentButton({ onSave, theme }: MomentButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    onSave();
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handlePress}
      className="relative flex items-center justify-center"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: isPressed ? 'rgba(49, 196, 141, 0.3)' : 'rgba(42, 44, 46, 0.8)',
        border: '2px solid rgba(244, 237, 225, 0.3)',
        cursor: 'pointer',
        transition: 'all 200ms',
        boxShadow: isPressed ? '0 0 12px rgba(49, 196, 141, 0.5)' : 'none',
      }}
    >
      <div className="relative">
        <MapPin size={18} color="#F4EDE1" strokeWidth={2} />
        <Star
          size={8}
          color="#F4EDE1"
          fill="#F4EDE1"
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
          }}
        />
      </div>
    </motion.button>
  );
}
