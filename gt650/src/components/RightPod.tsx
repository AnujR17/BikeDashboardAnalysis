import { motion } from 'motion/react';
import { Wrench, Gauge, Bluetooth, MapPin } from 'lucide-react';

type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';
type Mode = 'normal' | 'focus';
type HealthStatus = 'ok' | 'advisory' | 'critical';

interface RightPodProps {
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
}

export function RightPod({
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
}: RightPodProps) {
  const textColor = '#F4EDE1';
  const accentColor = '#31C48D';

  // Fuel arc: segmented 0-100% display
  // We'll use a circular arc from bottom-left to bottom-right (approximately 180° on lower half)
  const fuelStartAngle = 180; // bottom-left
  const fuelEndAngle = 360; // bottom-right
  const fuelRange = fuelEndAngle - fuelStartAngle;
  const fuelCurrentAngle = fuelStartAngle + (fuelLevel / 100) * fuelRange;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  return (
    <div className="relative" style={{ width: '400px', height: '400px' }}>
      {/* Outer bezel */}
      <svg width="400" height="400" className="absolute inset-0">
        <defs>
          <radialGradient id="bezelGradient2">
            <stop offset="0%" stopColor="#3A3D40" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2A2C2E" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="fuelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8EE1C7" />
            <stop offset="100%" stopColor="#31C48D" />
          </linearGradient>
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
        <circle cx="200" cy="200" r="176" fill="#121314" />

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
        <circle cx="200" cy="200" r="176" fill="#1A1C1E" />

        {/* Fuel gauge background arc - bottom half */}
        <path
          d={describeArc(200, 200, 162, fuelStartAngle, fuelEndAngle)}
          stroke="#3A3A3C"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Fuel gauge tick marks - every 10% (11 ticks total) */}
        {Array.from({ length: 11 }, (_, i) => {
          const angle = fuelStartAngle + (i * fuelRange) / 10;
          const rad = ((angle - 90) * Math.PI) / 180;
          const innerRadius = 157;
          const outerRadius = 167;

          const x1 = 200 + innerRadius * Math.cos(rad);
          const y1 = 200 + innerRadius * Math.sin(rad);
          const x2 = 200 + outerRadius * Math.cos(rad);
          const y2 = 200 + outerRadius * Math.sin(rad);

          return (
            <line
              key={`fuel-tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={textColor}
              strokeWidth="2"
              strokeOpacity="0.5"
            />
          );
        })}

        {/* Fuel gauge filled arc with animation */}
        <motion.path
          initial={startupAnimation ? { pathLength: 0 } : { pathLength: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          d={describeArc(200, 200, 162, fuelStartAngle, fuelCurrentAngle)}
          stroke="url(#fuelGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Fuel icon and label */}
        <g transform="translate(200, 330)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#8E8E92"
            fontSize="14"
            fontFamily="'Rajdhani', sans-serif"
            fontWeight="600"
            letterSpacing="0.15em"
          >
            FUEL
          </text>
        </g>

        {/* 0% and 100% labels */}
        <text
          x="60"
          y="210"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#8E8E92"
          fontSize="14"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="600"
          letterSpacing="0.1em"
        >
          E
        </text>
        <text
          x="340"
          y="210"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#8E8E92"
          fontSize="14"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="600"
          letterSpacing="0.1em"
        >
          F
        </text>
      </svg>

      {/* Digital sub-dial - 240px circle */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: '80px',
          top: '80px',
          width: '240px',
          height: '240px',
        }}
      >
        {/* Gear indicator */}
        <div
          style={{
            fontSize: '72px',
            fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
            fontWeight: '800',
            color: textColor,
            lineHeight: 1,
            marginBottom: '16px',
            letterSpacing: '0.02em',
          }}
        >
          {gear}
        </div>

        {/* True Range */}
        <div className="flex items-baseline gap-1 mb-4">
          <div
            style={{
              fontSize: '48px',
              fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
              fontWeight: '800',
              color: textColor,
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
          >
            {range}
          </div>
          <div
            style={{
              fontSize: '20px',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: '600',
              color: '#8E8E92',
              letterSpacing: '0.1em',
            }}
          >
            km
          </div>
        </div>

        {/* Mini chips - only show in normal mode */}
        {mode === 'normal' && (
          <div className="flex gap-2">
            {/* Trip */}
            <div
              className="flex flex-col items-center gap-1"
              style={{
                padding: '4px 6px',
                backgroundColor: 'rgba(42, 44, 46, 0.5)',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '600',
                  color: '#8E8E92',
                  letterSpacing: '0.15em',
                }}
              >
                TRIP
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
                  fontWeight: '700',
                  color: textColor,
                  letterSpacing: '0.02em',
                }}
              >
                {tripDistance}
              </div>
            </div>

            {/* Temperature */}
            <div
              className="flex flex-col items-center gap-1"
              style={{
                padding: '4px 6px',
                backgroundColor: 'rgba(42, 44, 46, 0.5)',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '600',
                  color: '#8E8E92',
                  letterSpacing: '0.15em',
                }}
              >
                TEMP
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
                  fontWeight: '700',
                  color: textColor,
                  letterSpacing: '0.02em',
                }}
              >
                {engineTemp}°
              </div>
            </div>

            {/* Clock */}
            <div
              className="flex flex-col items-center gap-1"
              style={{
                padding: '4px 6px',
                backgroundColor: 'rgba(42, 44, 46, 0.5)',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '600',
                  color: '#8E8E92',
                  letterSpacing: '0.15em',
                }}
              >
                TIME
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
                  fontWeight: '700',
                  color: textColor,
                  letterSpacing: '0.02em',
                }}
              >
                {currentTime}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Health icons - lower right quadrant */}
      <div
        className="absolute flex gap-3"
        style={{
          right: '70px',
          bottom: '70px',
        }}
      >
        {/* TPMS */}
        <div
          style={{
            opacity: healthStatus === 'advisory' ? 1 : 0.2,
            transition: 'opacity 200ms',
          }}
        >
          <Gauge size={18} color={healthStatus === 'advisory' ? '#FFB000' : '#8E8E92'} />
        </div>

        {/* Service */}
        <div
          style={{
            opacity: healthStatus === 'critical' ? 1 : 0.2,
            transition: 'opacity 200ms',
          }}
        >
          <Wrench size={18} color={healthStatus === 'critical' ? '#E53935' : '#8E8E92'} />
        </div>

        {/* Bluetooth */}
        <div
          style={{
            opacity: bluetooth ? 1 : 0.2,
            transition: 'opacity 200ms',
          }}
        >
          <Bluetooth size={18} color={bluetooth ? '#31C48D' : '#8E8E92'} />
        </div>

        {/* GPS */}
        <div
          style={{
            opacity: gps ? 1 : 0.2,
            transition: 'opacity 200ms',
          }}
        >
          <MapPin size={18} color={gps ? '#31C48D' : '#8E8E92'} />
        </div>
      </div>
    </div>
  );
}