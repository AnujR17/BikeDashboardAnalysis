import { useState, useEffect } from 'react';
import { LeftPod } from './components/LeftPod';
import { RpmPod } from './components/RpmPod';
import { MessageStrip } from './components/MessageStrip';
import { TopOverlay } from './components/TopOverlay';
import { MomentButton } from './components/MomentButton';
import { TurnIndicators } from './components/TurnIndicators';
import { motion, AnimatePresence } from 'motion/react';
import { useMotorcycleAudio } from './hooks/useMotorcycleAudio';

type Theme = 'classic-amber' | 'ivory-mono' | 'night-indigo';
type Mode = 'normal' | 'focus';
type MessageType = 'nav' | 'advisory' | 'critical' | 'moment-saved';
type HealthStatus = 'ok' | 'advisory' | 'critical';

export default function App() {
  const [theme, setTheme] = useState<Theme>('classic-amber');
  const [mode, setMode] = useState<Mode>('normal');
  const [messageType, setMessageType] = useState<MessageType>('nav');
  const [leftTurn, setLeftTurn] = useState(false);
  const [rightTurn, setRightTurn] = useState(false);
  const [highBeam, setHighBeam] = useState(false);
  const [neutral, setNeutral] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('ok');
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState(1);
  const [fuelLevel, setFuelLevel] = useState(70);
  const [range, setRange] = useState(56);
  const [showStartup, setShowStartup] = useState(true);
  const [startupComplete, setStartupComplete] = useState(false);
  const [bluetooth, setBluetooth] = useState(true);
  const [gps, setGps] = useState(true);
  const [showSpeedGlow, setShowSpeedGlow] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isThrottlePressed, setIsThrottlePressed] = useState(false);
  const [isBrakePressed, setIsBrakePressed] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tripDistance, setTripDistance] = useState(124);
  const [engineTemp, setEngineTemp] = useState(78);
  const [currentTime, setCurrentTime] = useState('10:24');
  const [distressMode, setDistressMode] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Initialize motorcycle audio
  const { playHornSound } = useMotorcycleAudio({
    speed,
    gear,
    leftTurn,
    rightTurn,
    isBrakePressed,
    isThrottlePressed,
  });

  // Startup animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartup(false);
      setTimeout(() => setStartupComplete(true), 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss message after delay
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  // Speed glow effect when > 100 km/h
  useEffect(() => {
    if (speed > 100) {
      setShowSpeedGlow(true);
      const timer = setTimeout(() => setShowSpeedGlow(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowSpeedGlow(false);
    }
  }, [speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setIsThrottlePressed(true);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setIsBrakePressed(true);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setLeftTurn(prev => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setRightTurn(prev => !prev);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setShowSettingsModal(prev => !prev);
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          setBluetooth(prev => !prev);
          setGps(prev => !prev);
          break;
        case 't':
        case 'T':
          e.preventDefault();
          // Cycle through themes
          setTheme(prev => 
            prev === 'classic-amber' ? 'ivory-mono' : 
            prev === 'ivory-mono' ? 'night-indigo' : 'classic-amber'
          );
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          playHornSound();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setNeutral(prev => !prev);
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          setDistressMode(prev => !prev);
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          setShowMapModal(prev => !prev);
          break;
        case '1':
          e.preventDefault();
          setMessageType('nav');
          setShowMessage(true);
          break;
        case '2':
          e.preventDefault();
          setMessageType('advisory');
          setShowMessage(true);
          break;
        case '3':
          e.preventDefault();
          setMessageType('critical');
          setShowMessage(true);
          break;
        case 'o':
        case 'O':
          e.preventDefault();
          setHealthStatus('ok');
          break;
        case 'w':
        case 'W':
          e.preventDefault();
          setHealthStatus('advisory');
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          setHealthStatus('critical');
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setIsThrottlePressed(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setIsBrakePressed(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playHornSound]);

  // Realistic speed and gear simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prevSpeed => {
        let newSpeed = prevSpeed;
        
        // Throttle: accelerate based on current gear
        if (isThrottlePressed) {
          const accelerationRate = gear === 1 ? 1.5 : gear === 2 ? 1.2 : gear === 3 ? 1.0 : gear === 4 ? 0.8 : gear === 5 ? 0.7 : 0.6;
          newSpeed = Math.min(180, prevSpeed + accelerationRate);
        }
        // Brake: strong deceleration
        else if (isBrakePressed) {
          newSpeed = Math.max(0, prevSpeed - 2.5);
        }
        // Engine braking when throttle is released (more realistic)
        else if (prevSpeed > 0) {
          // Stronger deceleration when throttle is released, similar to real bikes
          const engineBraking = prevSpeed > 80 ? 1.2 : prevSpeed > 40 ? 0.9 : 0.6;
          newSpeed = Math.max(0, prevSpeed - engineBraking);
        }
        
        return Math.round(newSpeed);
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isThrottlePressed, isBrakePressed, gear]);

  // Fuel consumption based on speed and throttle
  useEffect(() => {
    const interval = setInterval(() => {
      if (isThrottlePressed && speed > 0) {
        setFuelLevel(prev => {
          const consumption = speed > 100 ? 0.015 : speed > 60 ? 0.01 : 0.005;
          const newFuel = Math.max(0, prev - consumption);
          // Update range based on fuel level (rough calculation)
          setRange(Math.round((newFuel / 100) * 80)); // ~80km max range
          return newFuel;
        });
        
        // Update trip distance
        setTripDistance(prev => prev + 0.001);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isThrottlePressed, speed]);

  // Automatic gear shifting based on speed
  useEffect(() => {
    let newGear = gear;
    
    if (speed === 0) {
      setNeutral(true); // Show N when stopped
      newGear = 1;
    } else {
      setNeutral(false); // Hide N when moving
      
      if (speed < 20) {
        newGear = 1;
      } else if (speed < 40) {
        newGear = 2;
      } else if (speed < 65) {
        newGear = 3;
      } else if (speed < 95) {
        newGear = 4;
      } else if (speed < 130) {
        newGear = 5;
      } else {
        newGear = 6;
      }
    }
    
    if (newGear !== gear) {
      setGear(newGear);
    }
  }, [speed]);

  const handleMomentSave = () => {
    setMessageType('moment-saved');
    setShowMessage(true);
  };

  const bgColors = {
    'classic-amber': '#121314',
    'ivory-mono': '#121314',
    'night-indigo': '#0E1219',
  };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: bgColors[theme],
        background: `radial-gradient(ellipse at center, ${bgColors[theme]} 0%, ${theme === 'night-indigo' ? '#06080C' : '#0A0B0C'} 100%)`,
      }}
    >
      {/* Main dashboard container - scaled to fit */}
      <div
        className="relative"
        style={{
          width: '1200px',
          height: '500px',
          transform: 'scale(0.85)',
          transformOrigin: 'center center',
        }}
      >
        {/* Startup greeting */}
        <AnimatePresence>
          {showStartup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 flex items-center justify-center z-50"
            >
              <div style={{ fontSize: '24px', color: '#F4EDE1', fontFamily: "'Rajdhani', sans-serif", fontWeight: '600', letterSpacing: '0.1em' }}>
                Good Morning, Kabir.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {startupComplete && (
          <>
            {/* RE monogram */}
            <div
              className="absolute"
              style={{
                top: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '18px',
                fontWeight: '700',
                color: '#8E8E92',
                opacity: 0.6,
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '3px',
              }}
            >
              RE
            </div>

            {/* Health Status Indicator - Below RE text */}
            <div
              className="absolute"
              style={{
                top: '70px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(18, 19, 20, 0.85)',
                  borderRadius: '8px',
                  border: `1px solid ${healthStatus === 'ok' ? '#31C48D' : healthStatus === 'advisory' ? '#FFB000' : '#E53935'}`,
                  padding: '8px 12px',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: healthStatus === 'ok' ? '#31C48D' : healthStatus === 'advisory' ? '#FFB000' : '#E53935',
                    boxShadow: `0 0 8px ${healthStatus === 'ok' ? '#31C48D' : healthStatus === 'advisory' ? '#FFB000' : '#E53935'}`,
                  }}
                />
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '600',
                    color: healthStatus === 'ok' ? '#31C48D' : healthStatus === 'advisory' ? '#FFB000' : '#E53935',
                    letterSpacing: '0.5px',
                  }}
                >
                  {healthStatus === 'ok' ? 'ALL OK' : healthStatus === 'advisory' ? 'CHECK VEHICLE' : 'SERVICE REQUIRED'}
                </div>
              </div>
            </div>

            {/* Dashboard cluster container with shadow */}
            <div
              className="relative"
              style={{
                width: '900px',
                height: '400px',
                marginTop: '60px',
                marginLeft: 'auto',
                marginRight: 'auto',
                filter: 'drop-shadow(0px 24px 32px rgba(0, 0, 0, 0.25))',
              }}
            >
              {/* Left Pod Glow */}
              <div
                className="absolute"
                style={{
                  left: '0px',
                  top: '0px',
                  width: '400px',
                  height: '400px',
                  borderRadius: '50%',
                  background: theme === 'classic-amber' 
                    ? 'radial-gradient(circle, rgba(255, 193, 90, 0.15) 0%, rgba(255, 193, 90, 0.05) 40%, transparent 70%)'
                    : theme === 'ivory-mono'
                    ? 'radial-gradient(circle, rgba(192, 138, 61, 0.12) 0%, rgba(192, 138, 61, 0.04) 40%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(62, 160, 230, 0.15) 0%, rgba(62, 160, 230, 0.05) 40%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              
              {/* Right Pod Glow */}
              <div
                className="absolute"
                style={{
                  left: '500px',
                  top: '0px',
                  width: '400px',
                  height: '400px',
                  borderRadius: '50%',
                  background: theme === 'classic-amber' 
                    ? 'radial-gradient(circle, rgba(255, 193, 90, 0.15) 0%, rgba(255, 193, 90, 0.05) 40%, transparent 70%)'
                    : theme === 'ivory-mono'
                    ? 'radial-gradient(circle, rgba(192, 138, 61, 0.12) 0%, rgba(192, 138, 61, 0.04) 40%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(62, 160, 230, 0.15) 0%, rgba(62, 160, 230, 0.05) 40%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />

              {/* Left Pod */}
              <div
                className="absolute"
                style={{
                  left: '0px',
                  top: '0px',
                  zIndex: 1,
                }}
              >
                <LeftPod
                  speed={speed}
                  leftTurn={leftTurn}
                  rightTurn={rightTurn}
                  highBeam={highBeam}
                  neutral={neutral}
                  healthStatus={healthStatus}
                  theme={theme}
                  startupAnimation={!showStartup}
                  showSpeedGlow={showSpeedGlow}
                  gear={gear}
                />
              </div>

              {/* Right Pod */}
              <div
                className="absolute"
                style={{
                  left: '500px',
                  top: '0px',
                  zIndex: 1,
                }}
              >
                <RpmPod
                  speed={speed}
                  gear={gear}
                  range={range}
                  fuelLevel={fuelLevel}
                  theme={theme}
                  mode={mode}
                  healthStatus={healthStatus}
                  startupAnimation={!showStartup}
                  tripDistance={tripDistance}
                  engineTemp={engineTemp}
                  currentTime={currentTime}
                  bluetooth={bluetooth}
                  gps={gps}
                  showDigitalInfo={!bluetooth || !gps}
                  highBeam={highBeam}
                  neutral={neutral}
                  showSettingsModal={showSettingsModal}
                  distressMode={distressMode}
                  showMapModal={showMapModal}
                />
              </div>

              {/* Moment Button */}
              <div
                className="absolute"
                style={{
                  left: '-60px',
                  bottom: '20px',
                  zIndex: 2,
                }}
              >
                <MomentButton onSave={handleMomentSave} theme={theme} />
              </div>

              {/* Turn Indicators - Between the two dials at bottom */}
              <div
                className="absolute"
                style={{
                  left: '370px',
                  bottom: '0px',
                }}
              >
                <TurnIndicators leftTurn={leftTurn} rightTurn={rightTurn} />
              </div>
            </div>

            {/* Keyboard Controls Card - Below and centered */}
            <div
              className="absolute"
              style={{
                top: '520px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(18, 19, 20, 0.85)',
                  borderRadius: '12px',
                  border: '1px solid rgba(142, 142, 146, 0.2)',
                  padding: '16px 20px',
                  backdropFilter: 'blur(8px)',
                  width: '400px',
                }}
              >
                {/* Title */}
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '600',
                    color: '#8E8E92',
                    marginBottom: '12px',
                    letterSpacing: '1.5px',
                    textAlign: 'center',
                  }}
                >
                  KEYBOARD CONTROLS
                </div>

                {/* Controls grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 24px' }}>
                  {/* Theme */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#8E8E92', fontFamily: "'Rajdhani', sans-serif", fontWeight: '600', letterSpacing: '0.05em' }}>
                      Theme
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
                        color: theme === 'classic-amber' ? '#FFC15A' : theme === 'ivory-mono' ? '#F4EDE1' : '#3EA0E6',
                        backgroundColor: 'rgba(42, 44, 46, 0.6)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        letterSpacing: '0.02em',
                      }}
                    >
                      T
                    </div>
                  </div>

                  {/* High Beam */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#8E8E92', fontFamily: "'Rajdhani', sans-serif", fontWeight: '600', letterSpacing: '0.05em' }}>
                      High Beam
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
                        color: highBeam ? '#4EA8DE' : '#8E8E92',
                        backgroundColor: 'rgba(42, 44, 46, 0.6)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        letterSpacing: '0.02em',
                      }}
                    >
                      H
                    </div>
                  </div>

                  {/* Neutral */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#8E8E92', fontFamily: "'Rajdhani', sans-serif", fontWeight: '600', letterSpacing: '0.05em' }}>
                      Neutral
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontFamily: "'Barlow', 'DIN Alternate', 'DIN 1451', sans-serif",
                        color: neutral ? '#31C48D' : '#8E8E92',
                        backgroundColor: 'rgba(42, 44, 46, 0.6)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        letterSpacing: '0.02em',
                      }}
                    >
                      N
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Strip - Pop-up notification */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute"
                  style={{
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <MessageStrip type={messageType} theme={theme} mode={mode} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}