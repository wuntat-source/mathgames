// audio.js - Web Audio API Synthesizer untuk Math Runner 3D
// Murni prosedural tanpa ketergantungan file audio eksternal

class RunnerAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    ensureContext() {
        if (!this.initialized) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // Suara langkah kaki halus saat berlari
    playFootstep() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(90, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    // Suara melompat (Swoosh up)
    playJump() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(580, now + 0.16);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.18);
        } catch (e) {}
    }

    // Suara bermanuver ganti jalur (Lane Shift Dash)
    playDash() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(450, now + 0.07);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    // Suara gerbang matematika benar (Success Chord)
    playCorrect() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.50]; // Chord C Major tinggi

            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const delay = idx * 0.04;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + delay);

                gain.gain.setValueAtTime(0.14, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + delay);
                osc.stop(now + delay + 0.35);
            });
        } catch (e) {}
    }

    // Suara gerbang matematika salah (Wrong Buzzer)
    playWrong() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.setValueAtTime(110, now + 0.12);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.28);
        } catch (e) {}
    }

    // Suara menabrak rintangan balok (Impact Thud)
    playCrash() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }

    // Suara mengambil koin (Retro Ring)
    playCoin() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {}
    }

    // Suara Nitro / Speed Boost saat combo
    playBoost() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.35);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.38);
        } catch (e) {}
    }

    // Suara Kemenangan / Naik Level (Level Complete Fanfare)
    playVictory() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C - E - G - C - E
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const delay = idx * 0.09;
                const dur = (idx === notes.length - 1) ? 0.6 : 0.18;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + delay);

                gain.gain.setValueAtTime(0.2, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + delay);
                osc.stop(now + delay + dur);
            });
        } catch (e) {}
    }

    // Suara Game Over
    playGameOver() {
        if (this.isMuted || !this.ctx) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const notes = [392.00, 369.99, 349.23, 311.13]; // G4 -> F#4 -> F4 -> Eb4
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const delay = idx * 0.16;

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now + delay);

                gain.gain.setValueAtTime(0.2, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.005, now + delay + 0.28);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + delay);
                osc.stop(now + delay + 0.28);
            });
        } catch (e) {}
    }
}

export const runnerAudio = new RunnerAudio();
