

  # Continental GT 650 Dashboard

  An interactive Royal Enfield Continental GT 650 motorcycle dashboard with realistic engine sounds and controls.

  ## Features

  - **Realistic Engine Sound**: Uses the `videoplayback-[AudioTrimmer.com].m4a` audio file for authentic engine revving
  - **Dynamic Audio**: Sound adjusts based on:
    - Speed and gear (RPM calculation)
    - Throttle input (acceleration)
    - Startup rev sequence
  - **Interactive Controls**: Keyboard controls for acceleration, braking, and more
  - **Multiple Themes**: Classic amber, ivory mono, and night indigo themes

  ## Running the code

  1. Run `npm i` to install the dependencies.
  2. Run `npm run dev` to start the development server.
  3. Open your browser (the dashboard will automatically load)
  4. **Press Arrow Up** to accelerate and hear the engine sound

  ## Audio Implementation

  The dashboard uses the sound file located at `/public/sounds/videoplayback-[AudioTrimmer.com].m4a` as the engine sound. The audio system:

  - **Plays only when throttle is pressed** (Arrow Up key)
  - **Adjusts playback rate** (0.5x to 2.5x) based on RPM calculated from speed and gear
  - **Modulates volume** based on throttle input and speed
  - **Stops immediately** when throttle is released or speed reaches 0
  - **No startup sound** - audio only plays during acceleration

  ## Controls

  - **Arrow Up**: Throttle (accelerate)
  - **Arrow Down**: Brake
  - **Arrow Left**: Left turn indicator
  - **Arrow Right**: Right turn indicator
  - **T**: Cycle through themes
  - **H**: Horn
  - **N**: Toggle neutral gear indicator
  - **M**: Open settings modal
  - **1, 2, 3**: Show different message types

  ## How It Works

  The audio system (`useMotorcycleAudio.ts` hook) handles:

  1. **Throttle-Based Playback**: Engine sound only plays when Arrow Up is held down
  2. **Speed to 0**: Sound stops immediately when speed reaches 0 or throttle is released
  3. **Acceleration**: When throttle is pressed, adds 1500 RPM boost and increases volume
  4. **Speed-based RPM**: Calculates realistic RPM based on speed and current gear
  5. **Immediate Stop**: No fade-out, sound cuts immediately when conditions aren't met

  The engine sound file is treated as recorded at ~3500 RPM, and playback rate is adjusted proportionally to simulate different engine speeds.
  
  