import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Triangle } from 'lucide-react';

interface TurnIndicatorsProps {
  leftTurn: boolean;
  rightTurn: boolean;
}

export function TurnIndicators({ leftTurn, rightTurn }: TurnIndicatorsProps) {
  const hazardMode = leftTurn && rightTurn;

  return (
    <div
      className="flex items-center justify-center gap-6"
      style={{
        width: '160px',
        height: '80px',
      }}
    >
      {/* Left Turn Indicator */}
      <motion.div
        className="flex items-center justify-center"
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(26, 28, 30, 0.6)',
          borderRadius: '50%',
          border: '2px solid rgba(49, 196, 141, 0.2)',
        }}
        animate={{
          opacity: leftTurn ? [1, 0.3, 1] : 0.3,
          borderColor: leftTurn ? ['rgba(49, 196, 141, 0.8)', 'rgba(49, 196, 141, 0.2)', 'rgba(49, 196, 141, 0.8)'] : 'rgba(49, 196, 141, 0.2)',
        }}
        transition={{
          duration: 0.7,
          repeat: leftTurn ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <ChevronLeft size={32} color="#31C48D" strokeWidth={3} />
      </motion.div>

      {/* Hazard Indicator - only visible when both are active */}
      {hazardMode && (
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(229, 57, 53, 0.15)',
            borderRadius: '50%',
            top: '-12px',
          }}
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Triangle size={16} color="#E53935" fill="#E53935" />
        </motion.div>
      )}

      {/* Right Turn Indicator */}
      <motion.div
        className="flex items-center justify-center"
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(26, 28, 30, 0.6)',
          borderRadius: '50%',
          border: '2px solid rgba(49, 196, 141, 0.2)',
        }}
        animate={{
          opacity: rightTurn ? [1, 0.3, 1] : 0.3,
          borderColor: rightTurn ? ['rgba(49, 196, 141, 0.8)', 'rgba(49, 196, 141, 0.2)', 'rgba(49, 196, 141, 0.8)'] : 'rgba(49, 196, 141, 0.2)',
        }}
        transition={{
          duration: 0.7,
          repeat: rightTurn ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <ChevronRight size={32} color="#31C48D" strokeWidth={3} />
      </motion.div>
    </div>
  );
}
