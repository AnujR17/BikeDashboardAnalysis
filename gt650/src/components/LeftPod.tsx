import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Droplet, Battery } from 'lucide-react';

type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';
type HealthStatus = 'ok' | 'advisory' | 'critical';

interface LeftPodProps {
  speed: number;
  leftTurn: boolean;
  rightTurn: boolean;
  highBeam: boolean;
  neutral: boolean;
  healthStatus: HealthStatus;
  theme: Theme;
  startupAnimation: boolean;
  showSpeedGlow: boolean;
  gear: number;
}

export function LeftPod({
  speed,
  leftTurn,
  rightTurn,
  highBeam,
  neutral,
  healthStatus,
  theme,
  startupAnimation,
  showSpeedGlow,
  gear,
}: LeftPodProps) {
  const needleColor = theme === 'classic-amber' ? '#FFC15A' : theme === 'ivory-mono' ? '#C08A3D' : '#3EA0E6';
  const glowColor = showSpeedGlow ? '#FFB000' : needleColor;
  
  // Theme-aware text colors
  const textColor = theme === 'ivory-mono' ? '#1A1C1E' : '#F4EDE1';
  const secondaryTextColor = theme === 'ivory-mono' ? '#3A3D40' : '#8E8E92';
  
  // Theme-based backgrounds
  const bezelColors = {
    'classic-amber': '#2A2C2E',
    'ivory-mono': '#F4EDE1',
    'night-indigo': '#1A2332',
  };

  const dialColors = {
    'classic-amber': '#1A1C1E',
    'ivory-mono': '#E8E1D5',
    'night-indigo': '#0E1219',
  };

  const innerDialColors = {
    'classic-amber': '#121314',
    'ivory-mono': '#D4CCBE',
    'night-indigo': '#06080C',
  };
  
  // Convert speed (0-180 km/h) to angle (135° to 405°)
  // Speed range: 0-180, angle range: 270 degrees starting from 135°
  const speedToAngle = (spd: number) => {
    return 135 + (spd / 180) * 270;
  };

  const currentAngle = speedToAngle(speed);

  return (
    <div className="relative" style={{ width: '400px', height: '400px' }}>
      {/* Outer bezel */}
      <svg width="400" height="400" className="absolute inset-0">
        <defs>
          <radialGradient id="bezelGradient">
            <stop offset="0%" stopColor="#3A3D40" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2A2C2E" stopOpacity="1" />
          </radialGradient>
          <filter id="glassGlare">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.04" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation={showSpeedGlow ? "6" : "4"} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
          </filter>
          <filter id="speedProgressGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bezel ring */}
        <circle
          cx="200"
          cy="200"
          r="200"
          fill="url(#bezelGradient)"
        />
        <circle
          cx="200"
          cy="200"
          r="176"
          fill={bezelColors[theme]}
        />

        {/* Glass glare */}
        <ellipse
          cx="160"
          cy="160"
          rx="120"
          ry="80"
          fill="#FFFFFF"
          opacity="0.04"
          filter="url(#glassGlare)"
        />

        {/* Dial circle background */}
        <circle
          cx="200"
          cy="200"
          r="176"
          fill={dialColors[theme]}
        />

        {/* Speed dial ticks and numbers */}
        {Array.from({ length: 19 }, (_, i) => i * 10).map((value) => {
          const isMajor = value % 20 === 0;
          const angle = 135 + (value / 180) * 270;
          const rad = (angle * Math.PI) / 180;
          const tickLength = isMajor ? 18 : 10;
          const innerRadius = 176 - 20;
          const outerRadius = innerRadius - tickLength;

          const x1 = 200 + innerRadius * Math.cos(rad);
          const y1 = 200 + innerRadius * Math.sin(rad);
          const x2 = 200 + outerRadius * Math.cos(rad);
          const y2 = 200 + outerRadius * Math.sin(rad);

          const isLit = value <= speed && speed > 0;

          return (
            <line
              key={`tick-${value}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isLit ? needleColor : textColor}
              strokeWidth={isMajor ? 2 : 1}
              strokeOpacity={isLit ? 1 : 0.9}
              filter={isLit ? "url(#speedProgressGlow)" : undefined}
              style={{ transition: 'stroke 0.3s ease, stroke-opacity 0.3s ease' }}
            />
          );
        })}

        {/* Speed numbers */}
        {Array.from({ length: 10 }, (_, i) => i * 20).map((value) => {
          const angle = 135 + (value / 180) * 270;
          const rad = (angle * Math.PI) / 180;
          const radius = 176 - 58; // Increased gap from tick marks

          const x = 200 + radius * Math.cos(rad);
          const y = 200 + radius * Math.sin(rad);

          const isLit = value <= speed && speed > 0;

          return (
            <text
              key={`num-${value}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isLit ? needleColor : textColor}
              fontSize="18"
              fontFamily="'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif"
              fontWeight={isLit ? "700" : "600"}
              letterSpacing="0.02em"
              filter={isLit ? "url(#speedProgressGlow)" : undefined}
              style={{ transition: 'fill 0.3s ease, font-weight 0.3s ease' }}
            >
              {value}
            </text>
          );
        })}

        {/* Speed number display */}
        <text
          x="200"
          y="200"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize="72"
          fontFamily="'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif"
          fontWeight="800"
          letterSpacing="0.02em"
        >
          {Math.round(speed)}
        </text>

        {/* Center label "Speed" */}
        <text
          x="200"
          y="260"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={secondaryTextColor}
          fontSize="14"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="600"
          letterSpacing="0.15em"
        >
          SPEED
        </text>
        
        {/* Unit label "km/h" */}
        <text
          x="200"
          y="278"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={secondaryTextColor}
          fontSize="14"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="600"
          letterSpacing="0.1em"
        >
          km/h
        </text>
      </svg>

      {/* Icon ring - positioned absolutely */}
      {/* High beam - top center */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '50%',
          top: '40px',
          transform: 'translateX(-50%)',
          width: '32px',
          height: '32px',
          opacity: highBeam ? 1 : 0.2,
          transition: 'opacity 200ms',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="#4EA8DE" />
          <path
            d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07l-2.83 2.83M8.76 15.24l-2.83 2.83m12.14 0l-2.83-2.83M8.76 8.76L5.93 5.93"
            stroke="#4EA8DE"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Neutral Indicator - bottom center */}
      {neutral && (
        <motion.div
          key="neutral"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute flex items-center justify-center"
          style={{
            left: 'calc(50% - 10px)',
            top: '300px',
            transform: 'translateX(-50%)',
            color: '#31C48D',
            fontSize: '24px',
            fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
            fontWeight: '800',
            letterSpacing: '0.02em',
            textShadow: '0 0 12px rgba(49, 196, 141, 0.6)',
          }}
        >
          N
        </motion.div>
      )}

      {/* Gear Indicator - bottom center (only when moving) */}
      {speed > 0 && !neutral && (
        <motion.div
          key={gear}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute flex items-center justify-center"
          style={{
            left: 'calc(50% - 10px)',
            top: '300px',
            transform: 'translateX(-50%)',
            color: textColor,
            fontSize: '28px',
            fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
            fontWeight: '800',
            letterSpacing: '0.02em',
            textShadow: `0 0 8px ${needleColor}40`,
          }}
        >
          {gear}
        </motion.div>
      )}

      {/* Oil warning - 8 o'clock position */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '65px',
          bottom: '90px',
          width: '24px',
          height: '24px',
          opacity: healthStatus === 'critical' ? 1 : 0.2,
          transition: 'opacity 200ms',
        }}
      >
        <Droplet size={20} color="#E53935" fill="#E53935" />
      </div>

      {/* Battery warning - 4 o'clock position */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: '65px',
          bottom: '90px',
          width: '24px',
          height: '24px',
          opacity: healthStatus === 'advisory' ? 1 : 0.2,
          transition: 'opacity 200ms',
        }}
      >
        <Battery size={20} color="#E53935" />
      </div>
    </div>
  );
}