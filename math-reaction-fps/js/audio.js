// Web Audio API Procedural Sound Effects
// Tanpa butuh file mp3 eksternal, langsung disintesis di browser

class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Dispatcher suara tembakan berdasarkan tipe senjata
    playWeaponShot(type = 'pistol') {
        if (!this.enabled) return;
        this.init();

        switch (type) {
            case 'rifle':
                this.playRifleShot();
                break;
            case 'shotgun':
                this.playShotgunShot();
                break;
            case 'sniper':
                this.playSniperShot();
                break;
            case 'crossbow':
                this.playCrossbowShot();
                break;
            case 'pistol':
            default:
                this.playPistolShot();
                break;
        }
    }

    // Suara tembakan pistol tajam dan renyah
    playPistolShot() {
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // Low pop
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        oscGain.gain.setValueAtTime(0.8, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    // Suara tembakan senapan serbu (AR-15, M4, M16) punchy dan padat
    playRifleShot() {
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.14;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.028));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // Heavy mid-crack
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.16);
        oscGain.gain.setValueAtTime(1.1, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
    }

    // Suara shotgun menggelegar dahsyat + efek kokang
    playShotgunShot() {
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.22;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.045));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // Massive bass boom
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.25);
        oscGain.gain.setValueAtTime(1.6, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);

        // Suara kokang pompa mekanikal (Pump-action rack) setelah 0.2s
        setTimeout(() => {
            if (!this.enabled || !this.ctx) return;
            const t = this.ctx.currentTime;
            const click = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            click.type = 'triangle';
            click.frequency.setValueAtTime(800, t);
            click.frequency.exponentialRampToValueAtTime(300, t + 0.07);
            clickGain.gain.setValueAtTime(0.4, t);
            clickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);
            click.connect(clickGain);
            clickGain.connect(this.ctx.destination);
            click.start(t);
            click.stop(t + 0.08);
        }, 180);
    }

    // Suara sniper rifle: dentuman jarak jauh menggelegar dengan gema (Reverb/Echo)
    playSniperShot() {
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.07));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(2.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(2.0, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // Heavy seismic blast
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
        oscGain.gain.setValueAtTime(1.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.31);
    }

    // Suara crossbow: hentakan tali dawai panah (Twang) & desing anak panah
    playCrossbowShot() {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);

        // Desing angin peluru panah (Whistle)
        const wind = this.ctx.createOscillator();
        const windGain = this.ctx.createGain();
        wind.type = 'sine';
        wind.frequency.setValueAtTime(900, now + 0.02);
        wind.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        windGain.gain.setValueAtTime(0.3, now + 0.02);
        windGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        wind.connect(windGain);
        windGain.connect(this.ctx.destination);
        wind.start(now + 0.02);
        wind.stop(now + 0.16);
    }

    playGunshot() {
        this.playWeaponShot('pistol');
    }

    // Suara target hancur / kena tembak (Impact Thud)
    playHit() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.11);
    }

    // Suara jawaban benar (Crisp Positive Ding / Chime)
    playCorrect() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Arpeggio gembira)
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteStart = now + idx * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(0.3, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(noteStart);
            osc.stop(noteStart + 0.36);
        });
    }

    // Suara jawaban salah / buzzer penalti
    playWrong() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(110, now + 0.1);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Suara Countdown 3.. 2.. 1..
    playBeep(isHigh = false) {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isHigh ? 880 : 440, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + (isHigh ? 0.4 : 0.2));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + (isHigh ? 0.45 : 0.22));
    }
}

export const soundFX = new SoundFX();
