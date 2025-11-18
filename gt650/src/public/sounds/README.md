# Continental GT 650 Sound Files

This directory should contain authentic Royal Enfield Continental GT 650 sound files for the dashboard.

## Required Sound Files

### 1. Engine Sound (REQUIRED)
**Filename:** `continental-gt-650-engine.mp3`
- **Type:** Looping engine sound
- **Duration:** 2-4 seconds
- **RPM:** Recording should be at idle to mid-range (3000-4000 RPM)
- **Quality:** High-quality recording of the Continental GT 650 parallel twin engine
- **Format:** MP3 or WAV

**Where to find:**
- YouTube: Search "Continental GT 650 engine sound" and use a YouTube to MP3 converter
- Freesound.org: Search for Royal Enfield or motorcycle engine loops
- Record your own if you have access to a Continental GT 650

### 2. Exhaust Pop Sound (OPTIONAL)
**Filename:** `continental-gt-650-exhaust-pop.mp3`
- **Type:** Short exhaust backfire/pop
- **Duration:** 0.5-1 second
- **Use:** Played during deceleration and downshifts
- **Format:** MP3 or WAV

**Where to find:**
- YouTube: Search "Continental GT 650 exhaust pop" or "motorcycle deceleration sound"
- Extract from longer exhaust sound clips

### 3. Horn Sound (OPTIONAL)
**Filename:** `continental-gt-650-horn.mp3`
- **Type:** Horn beep
- **Duration:** 0.5-1 second
- **Use:** Played when pressing the horn button (H key)
- **Format:** MP3 or WAV

**Note:** If horn sound is not provided, the system will use a synthesized dual-tone horn sound.

## How to Add Sound Files

1. Download or record your Continental GT 650 sound files
2. Rename them to match the filenames above
3. Place them in this directory (`/public/sounds/`)
4. Refresh the dashboard - sounds will automatically load

## Current Status

The audio system is configured to:
- ✅ Loop engine sound continuously while moving
- ✅ Adjust playback rate based on RPM (0.5x to 2.5x)
- ✅ Adjust volume based on throttle input
- ✅ Play exhaust pops on rapid deceleration and downshifts
- ✅ Play horn sound on command
- ✅ Fallback to synthesized sounds if files are not found

## Tips for Best Results

1. **Engine Sound:** Choose a clean recording without wind noise
2. **Looping:** Make sure the engine sound loops smoothly
3. **Volume:** The system will automatically adjust volumes, but pre-normalize your files to -3dB
4. **Format:** MP3 is recommended for web compatibility (128-320 kbps)

## Recommended YouTube Searches

- "Royal Enfield Continental GT 650 sound"
- "Continental GT 650 exhaust note"
- "Continental GT 650 engine sound onboard"
- "RE 650 twin engine sound"

Once you add the files, the dashboard will produce authentic Continental GT 650 sounds!
