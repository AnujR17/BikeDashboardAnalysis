import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Gauge, Bluetooth, MapPin, AlertTriangle, Phone, Navigation, MapPinned } from 'lucide-react';

type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';
type Mode = 'normal' | 'focus';
type HealthStatus = 'ok' | 'advisory' | 'critical';

interface RpmPodProps {
  speed: number;
  gear: number;
  range: number;
  fuelLevel: number;
  theme: Theme;
  mode: Mode;
  healthStatus: HealthStatus;
  startupAnimation: boolean;
  tripDistance: number;
  engineTemp: number;
  currentTime: string;
  bluetooth: boolean;
  gps: boolean;
  showDigitalInfo: boolean;
  showKeyboardGuide?: boolean;
  highBeam?: boolean;
  neutral?: boolean;
  showSettingsModal?: boolean;
  distressMode?: boolean;
  showMapModal?: boolean;
}

export function RpmPod({
  speed,
  gear,
  range,
  fuelLevel,
  theme,
  mode,
  healthStatus,
  startupAnimation,
  tripDistance,
  engineTemp,
  currentTime,
  bluetooth,
  gps,
  showDigitalInfo,
  showKeyboardGuide = false,
  highBeam = false,
  neutral = false,
  showSettingsModal = false,
  distressMode = false,
  showMapModal = false,
}: RpmPodProps) {
  // Calculate RPM based on speed and gear
  const calculateRPM = () => {
    if (speed === 0) return 0;
    
    // RPM calculation based on gear ratios
    // Lower gears = higher RPM at same speed
    const gearRatios = [8000, 6500, 5500, 4800, 4200, 3800];
    const baseRPM = (speed / 180) * gearRatios[gear - 1];
    return Math.min(10000, Math.round(baseRPM));
  };

  const rpm = calculateRPM();

  // Theme colors
  const themeColors = {
    'classic-amber': '#FFC15A',
    'ivory-mono': '#C08A3D',
    'night-indigo': '#3EA0E6',
  };

  const needleColor = rpm > 8000 ? '#E53935' : themeColors[theme];
  
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
  
  // Convert RPM (0-10000) to angle (135° to 405°)
  const rpmToAngle = (r: number) => {
    return 135 + (r / 10000) * 270;
  };

  const currentAngle = rpmToAngle(rpm);

  return (
    <div className="relative" style={{ width: '400px', height: '400px' }}>
      {/* Outer bezel */}
      <svg width="400" height="400" className="absolute inset-0">
        <defs>
          <radialGradient id="bezelGradient2">
            <stop offset="0%" stopColor="#3A3D40" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2A2C2E" stopOpacity="1" />
          </radialGradient>
          <filter id="needleGlow2">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glassGlare2">
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
        </defs>

        {/* Bezel ring */}
        <circle cx="200" cy="200" r="200" fill="url(#bezelGradient2)" />
        <circle cx="200" cy="200" r="176" fill={bezelColors[theme]} />

        {/* Glass glare */}
        <ellipse
          cx="160"
          cy="160"
          rx="120"
          ry="80"
          fill="#FFFFFF"
          opacity="0.04"
          filter="url(#glassGlare2)"
        />

        {/* Dial circle background */}
        <circle cx="200" cy="200" r="176" fill={dialColors[theme]} />

        {/* RPM tick marks - every 1000 RPM */}
        {Array.from({ length: 11 }, (_, i) => {
          const rpmValue = i * 1000;
          const angle = rpmToAngle(rpmValue);
          const rad = ((angle - 90) * Math.PI) / 180;
          const isMajor = i % 2 === 0;
          const innerRadius = isMajor ? 140 : 150;
          const outerRadius = 160;

          const x1 = 200 + innerRadius * Math.cos(rad);
          const y1 = 200 + innerRadius * Math.sin(rad);
          const x2 = 200 + outerRadius * Math.cos(rad);
          const y2 = 200 + outerRadius * Math.sin(rad);

          return (
            <g key={`rpm-tick-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={rpmValue >= 8000 ? '#E53935' : textColor}
                strokeWidth={isMajor ? '3' : '2'}
                strokeOpacity={rpmValue >= 8000 ? '1' : '0.7'}
              />
              {isMajor && (
                <text
                  x={200 + 120 * Math.cos(rad)}
                  y={200 + 120 * Math.sin(rad)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={rpmValue >= 8000 ? '#E53935' : secondaryTextColor}
                  fontSize="18"
                  fontFamily="'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif"
                  fontWeight="700"
                  letterSpacing="0.02em"
                >
                  {i}
                </text>
              )}
            </g>
          );
        })}

        {/* RPM label */}
        <text
          x="200"
          y="260"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#8E8E92"
          fontSize="14"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="600"
          letterSpacing="2"
        >
          RPM × 1000
        </text>

        {/* Needle with glow */}
        <motion.g
          animate={{ rotate: currentAngle }}
          initial={{ rotate: startupAnimation ? 135 : currentAngle }}
          transition={{ 
            duration: startupAnimation ? 0.8 : 0.15,
            ease: 'easeOut',
          }}
          style={{
            originX: '200px',
            originY: '200px',
          }}
        >
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="60"
            stroke={needleColor}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#needleGlow2)"
            opacity="0.9"
          />
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="60"
            stroke={needleColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Center pivot */}
        <circle cx="200" cy="200" r="9" fill="#2A2C2E" />
        <circle cx="200" cy="200" r="6" fill={needleColor} opacity="0.8" />
        <circle cx="200" cy="200" r="3" fill="#121314" />

        {/* Fuel indicator bar - vertical on right side */}
        <g transform="translate(330, 150)">
          {/* Background bar */}
          <rect
            x="0"
            y="0"
            width="12"
            height="100"
            rx="6"
            fill="#2A2C2E"
          />
          {/* Fuel level bar */}
          <motion.rect
            x="0"
            y={100 - fuelLevel}
            width="12"
            height={fuelLevel}
            rx="6"
            fill={fuelLevel < 20 ? '#E53935' : fuelLevel < 40 ? '#FFB000' : '#31C48D'}
            initial={startupAnimation ? { height: 0 } : { height: fuelLevel }}
            animate={{ height: fuelLevel }}
            transition={{ duration: 0.3 }}
          />
          {/* Fuel icon */}
          <text
            x="6"
            y="115"
            textAnchor="middle"
            fill="#8E8E92"
            fontSize="10"
            fontFamily="Inter"
            fontWeight="600"
          >
            ⛽
          </text>
        </g>
      </svg>

      {/* Digital RPM Display */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '115px',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
            fontWeight: '800',
            color: themeColors[theme],
            letterSpacing: '0.02em',
            textShadow: `0 0 20px ${themeColors[theme]}80`,
          }}
        >
          {Math.round(rpm)}
        </div>
        <div
          style={{
            fontSize: '10px',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: '700',
            color: '#8E8E92',
            textAlign: 'center',
            marginTop: '-4px',
            letterSpacing: '0.15em',
          }}
        >
          RPM
        </div>
      </div>

      {/* Shift Light System */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50px',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {/* 5 LED shift lights */}
        {[0, 1, 2, 3, 4].map((index) => {
          const thresholds = [6000, 6300, 6600, 7000, 7500];
          const isActive = rpm >= thresholds[index];
          const isDangerZone = index === 4 && rpm >= 7500;
          
          // Color progression: amber → orange → red
          let color = '#FFC15A'; // Classic amber
          if (index >= 3) color = '#FFB000'; // Bright orange
          if (index === 4) color = '#E53935'; // Red for danger zone
          
          return (
            <motion.div
              key={index}
              animate={
                isDangerZone
                  ? {
                      opacity: [1, 0.3, 1],
                      scale: [1, 1.2, 1],
                    }
                  : isActive
                  ? { opacity: 1 }
                  : { opacity: 0.15 }
              }
              transition={
                isDangerZone
                  ? { duration: 0.3, repeat: Infinity }
                  : { duration: 0.2 }
              }
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: isActive ? color : '#2A2C2E',
                border: `1px solid ${isActive ? color : '#1A1C1E'}`,
                boxShadow: isActive
                  ? `0 0 12px ${color}80, inset 0 0 6px ${color}40`
                  : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Digital Info Screen - only visible when showDigitalInfo is true */}
      <AnimatePresence>
        {showDigitalInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{
              left: '0px',
              top: '0px',
              width: '400px',
              height: '400px',
              backgroundColor: 'rgba(27, 29, 31, 0.98)',
              borderRadius: '50%',
              border: '2px solid #2A2C2E',
              padding: '60px 50px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Connectivity icons - top center with status labels */}
            <div className="absolute top-10 flex gap-8">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={bluetooth ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bluetooth
                    size={20}
                    color={bluetooth ? '#31C48D' : '#8E8E92'}
                    opacity={bluetooth ? 1 : 0.3}
                  />
                </motion.div>
                <div style={{
                  fontSize: '8px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: bluetooth ? '#31C48D' : '#8E8E92',
                  opacity: bluetooth ? 1 : 0.4,
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}>
                  {bluetooth ? 'CONNECTED' : 'OFF'}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={gps ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <MapPin
                    size={20}
                    color={gps ? '#31C48D' : '#8E8E92'}
                    opacity={gps ? 1 : 0.3}
                  />
                </motion.div>
                <div style={{
                  fontSize: '8px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: gps ? '#31C48D' : '#8E8E92',
                  opacity: gps ? 1 : 0.4,
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}>
                  {gps ? 'ACTIVE' : 'OFF'}
                </div>
              </div>
            </div>

            {/* Range - center top with visual emphasis */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <div
                  style={{
                    fontSize: '72px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: range < 20 ? '#E53935' : range < 40 ? '#FFB000' : textColor,
                    lineHeight: 1,
                    textShadow: range < 20 ? '0 4px 16px rgba(229, 57, 53, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {range}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                    marginBottom: '8px',
                  }}
                >
                  km
                </div>
              </div>
              <div style={{
                fontSize: '9px',
                fontFamily: 'Inter',
                fontWeight: '600',
                color: '#8E8E92',
                letterSpacing: '2px',
                opacity: 0.6,
              }}>
                ESTIMATED RANGE
              </div>
            </div>

            {/* Mini info cards with improved hierarchy */}
            <div className="flex gap-3 mb-6">
              {/* Trip */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-2"
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(42, 44, 46, 0.6)',
                  borderRadius: '12px',
                  minWidth: '85px',
                  border: '1px solid rgba(142, 142, 146, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                    letterSpacing: '1.5px',
                  }}
                >
                  TRIP
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: textColor,
                    lineHeight: 1,
                  }}
                >
                  {Math.round(tripDistance)}
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    opacity: 0.5,
                  }}
                >
                  km
                </div>
              </motion.div>

              {/* Temperature with color coding */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-2"
                style={{
                  padding: '14px 18px',
                  backgroundColor: engineTemp > 95 ? 'rgba(229, 57, 53, 0.1)' : 'rgba(42, 44, 46, 0.6)',
                  borderRadius: '12px',
                  minWidth: '85px',
                  border: engineTemp > 95 ? '1px solid rgba(229, 57, 53, 0.3)' : '1px solid rgba(142, 142, 146, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                    letterSpacing: '1.5px',
                  }}
                >
                  TEMP
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: engineTemp > 95 ? '#E53935' : textColor,
                    lineHeight: 1,
                  }}
                >
                  {engineTemp}°
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    opacity: 0.5,
                  }}
                >
                  celsius
                </div>
              </motion.div>

              {/* Clock */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-2"
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(42, 44, 46, 0.6)',
                  borderRadius: '12px',
                  minWidth: '85px',
                  border: '1px solid rgba(142, 142, 146, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                    letterSpacing: '1.5px',
                  }}
                >
                  TIME
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: textColor,
                    lineHeight: 1,
                  }}
                >
                  {currentTime}
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    opacity: 0.5,
                  }}
                >
                  local
                </div>
              </motion.div>
            </div>

            {/* Smart Alerts with improved visual feedback */}
            <div
              className="flex items-center justify-center gap-4"
              style={{
                padding: '10px 20px',
                backgroundColor: healthStatus === 'ok' ? 'rgba(49, 196, 141, 0.1)' : healthStatus === 'advisory' ? 'rgba(255, 176, 0, 0.1)' : 'rgba(229, 57, 53, 0.1)',
                borderRadius: '10px',
                border: `1px solid ${healthStatus === 'ok' ? 'rgba(49, 196, 141, 0.2)' : healthStatus === 'advisory' ? 'rgba(255, 176, 0, 0.2)' : 'rgba(229, 57, 53, 0.2)'}`,
              }}
            >
              <motion.div
                animate={healthStatus === 'advisory' ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Gauge
                  size={18}
                  color={healthStatus === 'advisory' ? '#FFB000' : '#8E8E92'}
                  opacity={healthStatus === 'advisory' ? 1 : 0.3}
                />
              </motion.div>
              <motion.div
                animate={healthStatus === 'critical' ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Wrench
                  size={18}
                  color={healthStatus === 'critical' ? '#E53935' : '#8E8E92'}
                  opacity={healthStatus === 'critical' ? 1 : 0.3}
                />
              </motion.div>
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: healthStatus === 'ok' ? '#31C48D' : healthStatus === 'advisory' ? '#FFB000' : '#E53935',
                  letterSpacing: '0.5px',
                }}
              >
                {healthStatus === 'ok' ? 'ALL OK' : healthStatus === 'advisory' ? 'CHECK TPMS' : 'SERVICE DUE'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Screen - only visible when showSettingsModal is true */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{
              left: '0px',
              top: '0px',
              width: '400px',
              height: '400px',
              backgroundColor: 'rgba(27, 29, 31, 0.98)',
              borderRadius: '50%',
              border: '2px solid #2A2C2E',
              padding: '70px 60px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Title with icon */}
            <div className="flex items-center gap-2 mb-10">
              <Wrench size={18} color={themeColors[theme]} opacity={0.8} />
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  color: themeColors[theme],
                  letterSpacing: '2px',
                }}
              >
                SETTINGS
              </div>
            </div>

            {/* Settings items with improved visual hierarchy */}
            <div className="flex flex-col gap-5" style={{ width: '100%', maxWidth: '260px' }}>
              {/* Display - most important, highlighted */}
              <motion.div 
                whileHover={{ x: 2 }}
                className="flex items-center justify-between"
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(42, 44, 46, 0.4)',
                  borderRadius: '10px',
                  border: `1px solid ${themeColors[theme]}40`,
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#F4EDE1',
                    letterSpacing: '0.5px',
                  }}
                >
                  Display Theme
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: themeColors[theme],
                    padding: '4px 12px',
                    backgroundColor: `${themeColors[theme]}20`,
                    borderRadius: '6px',
                  }}
                >
                  {theme === 'classic-amber' ? 'Amber' : theme === 'ivory-mono' ? 'Ivory' : 'Indigo'}
                </div>
              </motion.div>

              {/* Units */}
              <motion.div 
                whileHover={{ x: 2 }}
                className="flex items-center justify-between"
                style={{
                  padding: '10px 16px',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#F4EDE1',
                  }}
                >
                  Units
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                  }}
                >
                  Metric
                </div>
              </motion.div>

              {/* Service - with visual feedback */}
              <motion.div 
                whileHover={{ x: 2 }}
                className="flex items-center justify-between"
                style={{
                  padding: '10px 16px',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#F4EDE1',
                  }}
                >
                  Next Service
                </div>
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#31C48D',
                      boxShadow: '0 0 6px rgba(49, 196, 141, 0.6)',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '13px',
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: '#31C48D',
                    }}
                  >
                    1200 km
                  </div>
                </div>
              </motion.div>

              {/* Brightness with improved slider */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center justify-between">
                  <div
                    style={{
                      fontSize: '13px',
                      fontFamily: 'Inter',
                      fontWeight: '500',
                      color: '#F4EDE1',
                    }}
                  >
                    Brightness
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: '#8E8E92',
                    }}
                  >
                    70%
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(42, 44, 46, 0.6)',
                    borderRadius: '4px',
                    position: 'relative',
                    border: '1px solid rgba(142, 142, 146, 0.1)',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${themeColors[theme]}80, ${themeColors[theme]})`,
                      borderRadius: '4px',
                      boxShadow: `0 0 8px ${themeColors[theme]}40`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Distress Signal Screen - only visible when distressMode is true */}
      <AnimatePresence>
        {distressMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{
              left: '0px',
              top: '0px',
              width: '400px',
              height: '400px',
              backgroundColor: 'rgba(27, 29, 31, 0.98)',
              borderRadius: '50%',
              border: '3px solid #E53935',
              padding: '70px 60px',
              boxShadow: '0 8px 24px rgba(229, 57, 53, 0.5), 0 0 40px rgba(229, 57, 53, 0.2), inset 0 1px 2px rgba(229, 57, 53, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Pulsing Alert Icon with glow */}
            <motion.div
              className="absolute top-10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle size={32} color="#E53935" fill="#E53935" opacity={0.9} />
            </motion.div>

            {/* Title */}
            <div
              style={{
                fontSize: '18px',
                fontFamily: 'Inter',
                fontWeight: '700',
                color: '#E53935',
                marginBottom: '6px',
                marginTop: '36px',
                letterSpacing: '2.5px',
                textShadow: '0 2px 12px rgba(229, 57, 53, 0.4)',
              }}
            >
              DISTRESS SIGNAL
            </div>

            {/* Status with animated indicator */}
            <div className="flex items-center gap-2 mb-5">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FFB000',
                  boxShadow: '0 0 10px rgba(255, 176, 0, 0.8)',
                }}
              />
              <div
                style={{
                  fontSize: '10px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: '#FFB000',
                  letterSpacing: '0.5px',
                }}
              >
                Signal sent to emergency contacts
              </div>
            </div>

            {/* Location with improved hierarchy */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3 mb-4"
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(49, 196, 141, 0.08)',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '260px',
                border: '1px solid rgba(49, 196, 141, 0.2)',
              }}
            >
              <MapPin size={18} color="#31C48D" strokeWidth={2.5} />
              <div>
                <div
                  style={{
                    fontSize: '8px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: '#31C48D',
                    letterSpacing: '1.5px',
                    marginBottom: '3px',
                  }}
                >
                  LIVE LOCATION
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    color: '#F4EDE1',
                    letterSpacing: '0.3px',
                  }}
                >
                  12.9716° N, 77.5946° E
                </div>
              </div>
            </motion.div>

            {/* Emergency Contacts with improved design */}
            <div className="flex flex-col gap-2" style={{ width: '100%', maxWidth: '260px' }}>
              <div style={{
                fontSize: '8px',
                fontFamily: 'Inter',
                fontWeight: '700',
                color: '#8E8E92',
                letterSpacing: '1.5px',
                marginBottom: '2px',
                paddingLeft: '4px',
              }}>
                EMERGENCY CONTACTS
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'rgba(42, 44, 46, 0.6)',
                  borderRadius: '10px',
                  border: '1px solid rgba(142, 142, 146, 0.15)',
                }}
              >
                <div style={{
                  padding: '7px',
                  backgroundColor: 'rgba(49, 196, 141, 0.15)',
                  borderRadius: '8px',
                }}>
                  <Phone size={14} color="#31C48D" strokeWidth={2.5} />
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    color: '#F4EDE1',
                    letterSpacing: '0.5px',
                  }}
                >
                  +91 98765 43210
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'rgba(42, 44, 46, 0.6)',
                  borderRadius: '10px',
                  border: '1px solid rgba(142, 142, 146, 0.15)',
                }}
              >
                <div style={{
                  padding: '7px',
                  backgroundColor: 'rgba(49, 196, 141, 0.15)',
                  borderRadius: '8px',
                }}>
                  <Phone size={14} color="#31C48D" strokeWidth={2.5} />
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    color: '#F4EDE1',
                    letterSpacing: '0.5px',
                  }}
                >
                  +91 87654 32109
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map/Navigation Screen - only visible when showMapModal is true */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{
              left: '0px',
              top: '0px',
              width: '400px',
              height: '400px',
              backgroundColor: 'rgba(27, 29, 31, 0.98)',
              borderRadius: '50%',
              border: '2px solid #2A2C2E',
              padding: '70px 70px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Title with icon */}
            <div className="flex items-center gap-2 mb-8">
              <MapPinned size={20} color={themeColors[theme]} opacity={0.9} />
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  color: themeColors[theme],
                  letterSpacing: '2px',
                }}
              >
                NAVIGATION
              </div>
            </div>

            {/* Current Location with pulsing indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3 mb-5"
              style={{
                padding: '12px 14px',
                backgroundColor: 'rgba(49, 196, 141, 0.08)',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '230px',
                border: '1px solid rgba(49, 196, 141, 0.2)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin size={16} color="#31C48D" fill="#31C48D" opacity={0.8} />
              </motion.div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '7px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: '#31C48D',
                    letterSpacing: '1.2px',
                    marginBottom: '3px',
                  }}
                >
                  CURRENT LOCATION
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    color: '#F4EDE1',
                    letterSpacing: '0.2px',
                  }}
                >
                  12.9716° N, 77.5946° E
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    marginTop: '2px',
                  }}
                >
                  Bangalore, Karnataka
                </div>
              </div>
            </motion.div>

            {/* Route Info Cards */}
            <div className="flex gap-3 mb-5">
              {/* Distance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-2"
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(42, 44, 46, 0.6)',
                  borderRadius: '12px',
                  minWidth: '85px',
                  border: '1px solid rgba(142, 142, 146, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                    letterSpacing: '1.5px',
                  }}
                >
                  DISTANCE
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: textColor,
                    lineHeight: 1,
                  }}
                >
                  42
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    opacity: 0.5,
                  }}
                >
                  km
                </div>
              </motion.div>

              {/* ETA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-2"
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(42, 44, 46, 0.6)',
                  borderRadius: '12px',
                  minWidth: '85px',
                  border: '1px solid rgba(142, 142, 146, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                    letterSpacing: '1.5px',
                  }}
                >
                  ETA
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: textColor,
                    lineHeight: 1,
                  }}
                >
                  11:38
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    opacity: 0.5,
                  }}
                >
                  local
                </div>
              </motion.div>

              {/* Speed Limit */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-2"
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(229, 57, 53, 0.1)',
                  borderRadius: '12px',
                  minWidth: '85px',
                  border: '1px solid rgba(229, 57, 53, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#8E8E92',
                    letterSpacing: '1.5px',
                  }}
                >
                  LIMIT
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: '#E53935',
                    lineHeight: 1,
                  }}
                >
                  60
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    opacity: 0.5,
                  }}
                >
                  km/h
                </div>
              </motion.div>
            </div>

            {/* Next Turn Instruction */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-2"
              style={{
                padding: '10px 12px',
                backgroundColor: `${themeColors[theme]}15`,
                borderRadius: '10px',
                width: '100%',
                maxWidth: '220px',
                border: `1px solid ${themeColors[theme]}30`,
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  padding: '6px',
                  backgroundColor: `${themeColors[theme]}20`,
                  borderRadius: '6px',
                  flexShrink: 0,
                }}
              >
                <Navigation size={16} color={themeColors[theme]} />
              </motion.div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    color: textColor,
                    marginBottom: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Turn right in 800m
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#8E8E92',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  onto MG Road
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}