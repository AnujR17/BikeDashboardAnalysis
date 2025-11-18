import { useEffect, useRef, useState } from 'react';

interface AudioProps {
  speed: number;
  gear: number;
  leftTurn: boolean;
  rightTurn: boolean;
  isBrakePressed: boolean;
  isThrottlePressed: boolean;
  startupComplete?: boolean;
}

export function useMotorcycleAudio({
  speed,
  gear,
  leftTurn,
  rightTurn,
  isBrakePressed,
  isThrottlePressed,
  startupComplete = true,
}: AudioProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const engineAudioRef = useRef<HTMLAudioElement | null>(null);
  const exhaustPopAudioRef = useRef<HTMLAudioElement | null>(null);
  const hornAudioRef = useRef<HTMLAudioElement | null>(null);
  const turnIntervalRef = useRef<number | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const previousSpeedRef = useRef(0);
  const previousGearRef = useRef(1);
  const startupPlayedRef = useRef(false);

  // Audio file paths - Using the provided videoplayback m4a file
  const AUDIO_FILES = {
    // Main engine sound - using the provided m4a file
    engine: '/sounds/videoplayback-[AudioTrimmer.com].m4a',
    
    // Exhaust pop/backfire sound for deceleration and downshifts
    // Will use synthesized sound if not available
    exhaustPop: '/sounds/continental-gt-650-exhaust-pop.mp3',
    
    // Horn sound - Will use synthesized sound if not available
    horn: '/sounds/continental-gt-650-horn.mp3',
  };

  // Initialize Audio Context and load audio files
  useEffect(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();

    // Create and preload engine audio
    const engineAudio = new Audio(AUDIO_FILES.engine);
    engineAudio.loop = true;
    engineAudio.volume = 0.4;
    engineAudio.preservesPitch = false; // Allow pitch shifting with playback rate
    engineAudioRef.current = engineAudio;

    // Preload exhaust pop audio
    const exhaustPopAudio = new Audio(AUDIO_FILES.exhaustPop);
    exhaustPopAudio.volume = 0.6;
    exhaustPopAudioRef.current = exhaustPopAudio;

    // Preload horn audio
    const hornAudio = new Audio(AUDIO_FILES.horn);
    hornAudio.volume = 0.7;
    hornAudioRef.current = hornAudio;

    // Handle loading
    const handleCanPlay = () => setAudioLoaded(true);
    engineAudio.addEventListener('canplaythrough', handleCanPlay);

    // Fallback: If audio files don't exist, still mark as loaded to prevent errors
    const fallbackTimer = setTimeout(() => {
      setAudioLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      engineAudio.removeEventListener('canplaythrough', handleCanPlay);
      engineAudio.pause();
      exhaustPopAudio.pause();
      hornAudio.pause();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Engine sound with RPM-based playback rate
  useEffect(() => {
    if (!engineAudioRef.current || !audioLoaded) return;

    const engineAudio = engineAudioRef.current;

    // Start playing engine on any movement or throttle
    if (speed > 0 || isThrottlePressed) {
      // Calculate RPM based on speed and gear
      const gearRatios = [8000, 6500, 5500, 4800, 4200, 3800];
      
      // Base RPM calculation
      let baseRPM = 1000; // Idle RPM
      
      if (speed > 0) {
        // RPM increases with speed relative to gear
        baseRPM = (speed / 180) * gearRatios[gear - 1];
      } else if (isThrottlePressed) {
        // Rev engine even when stationary (neutral/clutch)
        baseRPM = 3500;
      }
      
      // Apply throttle boost for aggressive acceleration
      const throttleBoost = isThrottlePressed ? 1500 : 0;
      const rpm = Math.min(10000, Math.max(1000, baseRPM + throttleBoost));

      // Map RPM to playback rate
      // Assuming the recorded audio is at ~3500 RPM
      const recordedRPM = 3500;
      const playbackRate = Math.max(0.5, Math.min(2.5, rpm / recordedRPM));

      // Adjust volume based on throttle and speed
      const baseVolume = 0.3;
      const throttleVolume = isThrottlePressed ? 0.65 : baseVolume;
      const speedFactor = Math.min(1, speed / 100);
      const finalVolume = Math.max(baseVolume, throttleVolume * (0.5 + speedFactor * 0.5));
      
      engineAudio.playbackRate = playbackRate;
      engineAudio.volume = finalVolume;

      // Start playing if not already
      if (engineAudio.paused) {
        engineAudio.play().catch(err => {
          console.warn('Engine audio play failed:', err);
        });
      }
    } else {
      // Gradually reduce volume and stop when idle
      const currentVolume = engineAudio.volume;
      if (currentVolume > 0.05) {
        engineAudio.volume = Math.max(0, currentVolume - 0.03);
        engineAudio.playbackRate = Math.max(0.5, engineAudio.playbackRate - 0.05);
      } else {
        engineAudio.pause();
        engineAudio.currentTime = 0;
      }
    }
  }, [speed, gear, isThrottlePressed, audioLoaded]);

  // Startup engine rev when dashboard is ready
  useEffect(() => {
    if (!engineAudioRef.current || !audioLoaded || !startupComplete || startupPlayedRef.current) return;
    
    const engineAudio = engineAudioRef.current;
    
    // Play startup rev sequence (will only work after user interaction due to browser autoplay policy)
    const playStartupRev = () => {
      startupPlayedRef.current = true;
      
      engineAudio.volume = 0.5;
      engineAudio.playbackRate = 0.8;
      engineAudio.play().catch(err => {
        console.log('Startup audio play blocked by browser - waiting for user interaction');
      });
      
      // Rev up then settle to idle
      setTimeout(() => {
        if (engineAudio) {
          engineAudio.playbackRate = 1.5; // Rev up
        }
      }, 300);
      
      setTimeout(() => {
        if (engineAudio && speed === 0 && !isThrottlePressed) {
          engineAudio.playbackRate = 0.7; // Back to idle
          engineAudio.volume = 0.3;
        }
      }, 800);
      
      setTimeout(() => {
        if (engineAudio && speed === 0 && !isThrottlePressed) {
          engineAudio.pause();
          engineAudio.currentTime = 0;
        }
      }, 1500);
    };
    
    // Try to play immediately
    playStartupRev();
    
    // Fallback: play on first user interaction if initial play was blocked
    const handleFirstInteraction = () => {
      if (!startupPlayedRef.current) {
        playStartupRev();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [audioLoaded, startupComplete]);

  // Exhaust pop on deceleration and downshift
  useEffect(() => {
    if (!exhaustPopAudioRef.current || !audioLoaded) return;

    const currentSpeed = speed;
    const previousSpeed = previousSpeedRef.current;
    const currentGear = gear;
    const previousGear = previousGearRef.current;

    // Trigger exhaust pop on:
    // 1. Rapid deceleration (speed drop > 5 km/h)
    // 2. Downshift at speed
    const rapidDecel = previousSpeed - currentSpeed > 5;
    const downshift = currentGear < previousGear && currentSpeed > 20;

    if ((rapidDecel || downshift) && currentSpeed > 0) {
      const exhaustPopAudio = exhaustPopAudioRef.current;
      exhaustPopAudio.currentTime = 0;
      exhaustPopAudio.play().catch(err => {
        console.warn('Exhaust pop audio play failed:', err);
      });
    }

    previousSpeedRef.current = currentSpeed;
    previousGearRef.current = currentGear;
  }, [speed, gear, audioLoaded]);

  // Turn indicator sound (using Web Audio API for precise timing)
  useEffect(() => {
    if (!audioContextRef.current) return;

    // Clear existing interval
    if (turnIntervalRef.current) {
      clearInterval(turnIntervalRef.current);
      turnIntervalRef.current = null;
    }

    if (leftTurn || rightTurn) {
      // Play immediately
      playTurnClickSound();
      
      // Then repeat every 500ms
      turnIntervalRef.current = window.setInterval(() => {
        playTurnClickSound();
      }, 500);
    }

    return () => {
      if (turnIntervalRef.current) {
        clearInterval(turnIntervalRef.current);
      }
    };
  }, [leftTurn, rightTurn]);

  const playTurnClickSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    
    // Sharp click envelope
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  };

  const playHornSound = () => {
    if (hornAudioRef.current && audioLoaded) {
      // Use audio file if available
      const hornAudio = hornAudioRef.current;
      hornAudio.currentTime = 0;
      hornAudio.play().catch(err => {
        console.warn('Horn audio play failed, using fallback');
        playHornSoundFallback();
      });
    } else {
      // Fallback to synthesized horn
      playHornSoundFallback();
    }
  };

  const playHornSoundFallback = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Royal Enfield Continental GT 650 electric horn - dual-tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const masterGain = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(415, ctx.currentTime);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(495, ctx.currentTime);
    
    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime);
    
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.03);
    masterGain.gain.setValueAtTime(0.6, ctx.currentTime + 0.4);
    masterGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    
    osc1.connect(gain1);
    osc2.connect(gain2);
    
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    
    masterGain.connect(ctx.destination);
    
    const startTime = ctx.currentTime;
    const stopTime = ctx.currentTime + 0.45;
    
    osc1.start(startTime);
    osc2.start(startTime);
    
    osc1.stop(stopTime);
    osc2.stop(stopTime);
  };

  return { playHornSound };
}
