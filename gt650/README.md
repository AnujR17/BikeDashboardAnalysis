

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

  - **Plays when throttle is pressed** (Arrow Up key) or **while the bike is moving**
  - **Adjusts playback rate** (0.5x to 2.5x) based on RPM calculated from speed and gear
  - **Modulates volume** based on throttle input and speed
  - **Gradually fades out** as speed decreases to 0 (realistic engine deceleration)
  - **Continues playing after releasing throttle** until speed reaches 0

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

  1. **Throttle Activation**: Engine sound starts when Arrow Up is pressed
  2. **Continues While Moving**: Sound continues playing as long as speed > 0, even after releasing throttle
  3. **Gradual Deceleration**: Sound gradually fades out as speed decreases to 0
  4. **Speed-based RPM**: Calculates realistic RPM based on speed and current gear
  5. **Volume Modulation**: Louder when accelerating, quieter when coasting

  The engine sound file is treated as recorded at ~3500 RPM, and playback rate is adjusted proportionally to simulate different engine speeds.
  
  