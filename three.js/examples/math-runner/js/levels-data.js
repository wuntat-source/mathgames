// levels-data.js - Sistem 50 Level & Target Nilai untuk Math Parkour Runner 3D
// Mendukung jenjang SD, SMP, SMA dengan penyimpanan permanen localStorage

export const TOTAL_LEVELS = 50;

export const GRADE_CONFIG = {
    sd: {
        name: 'Sekolah Dasar (SD)',
        badge: 'SD',
        color: '#00f0ff',
        totalLevels: TOTAL_LEVELS,
        baseTarget: 3000,
        targetIncrement: 250
    },
    smp: {
        name: 'Sekolah Menengah Pertama (SMP)',
        badge: 'SMP',
        color: '#ffd200',
        totalLevels: TOTAL_LEVELS,
        baseTarget: 3500,
        targetIncrement: 300
    },
    sma: {
        name: 'Sekolah Menengah Atas (SMA)',
        badge: 'SMA',
        color: '#ff007b',
        totalLevels: TOTAL_LEVELS,
        baseTarget: 4000,
        targetIncrement: 350
    }
};

class LevelManager {
    constructor() {
        this.storageKey = 'math_runner_3d_progress_v1';
        this.progress = this.loadProgress();
    }

    loadProgress() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Gagal membaca progress level', e);
        }

        // Default: Level 1 terbuka untuk setiap jenjang
        return {
            sd: { unlocked: 1, scores: {}, stars: {} },
            smp: { unlocked: 1, scores: {}, stars: {} },
            sma: { unlocked: 1, scores: {}, stars: {} }
        };
    }

    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        } catch (e) {
            console.error('Gagal menyimpan progress level', e);
        }
    }

    getTargetScore(grade, level) {
        const conf = GRADE_CONFIG[grade] || GRADE_CONFIG.sd;
        return conf.baseTarget + (level - 1) * conf.targetIncrement;
    }

    isUnlocked(grade, level) {
        const g = this.progress[grade];
        if (!g) return level === 1;
        return level <= (g.unlocked || 1);
    }

    getHighScore(grade, level) {
        const g = this.progress[grade];
        return (g && g.scores && g.scores[level]) ? g.scores[level] : 0;
    }

    getStars(grade, level) {
        const g = this.progress[grade];
        return (g && g.stars && g.stars[level]) ? g.stars[level] : 0;
    }

    recordResult(grade, level, score) {
        const target = this.getTargetScore(grade, level);
        const passed = score >= target;

        if (!this.progress[grade]) {
            this.progress[grade] = { unlocked: 1, scores: {}, stars: {} };
        }
        const g = this.progress[grade];

        // Hitung bintang
        let stars = 0;
        if (passed) {
            stars = 1;
            if (score >= target * 1.25) stars = 2;
            if (score >= target * 1.5) stars = 3;
        }

        // Update score & stars
        if (!g.scores[level] || score > g.scores[level]) {
            g.scores[level] = score;
        }
        if (!g.stars[level] || stars > g.stars[level]) {
            g.stars[level] = stars;
        }

        // Buka level berikutnya jika lulus
        let nextLevelUnlocked = false;
        if (passed && level < TOTAL_LEVELS) {
            if (level + 1 > (g.unlocked || 1)) {
                g.unlocked = level + 1;
                nextLevelUnlocked = true;
            }
        }

        this.saveProgress();

        return {
            passed,
            target,
            score,
            stars,
            nextLevelUnlocked,
            nextLevel: Math.min(level + 1, TOTAL_LEVELS)
        };
    }

    getLevelTitle(grade, level) {
        if (grade === 'sd') {
            if (level <= 10) return 'Operasi Satuan & Belasan';
            if (level <= 20) return 'Penjumlahan & Pengurangan Puluhan';
            if (level <= 30) return 'Tabel Perkalian & Pembagian';
            if (level <= 40) return 'Operasi Campuran 2 Langkah';
            return 'Master Aritmatika Cepat';
        } else if (grade === 'smp') {
            if (level <= 10) return 'Bilangan Bulat Negatif';
            if (level <= 20) return 'Persamaan Linier Dasar (x)';
            if (level <= 30) return 'Pangkat Kuadrat & Kubik';
            if (level <= 40) return 'Akar Kuadrat & Pecahan';
            return 'Aljabar & Persamaan Lanjutan';
        } else {
            if (level <= 10) return 'Trigonometri Sudut Istimewa';
            if (level <= 20) return 'Logaritma Dasar';
            if (level <= 30) return 'Faktorisasi Persamaan Kuadrat';
            if (level <= 40) return 'Barisan & Deret Aritmatika';
            return 'Kalkulus & Analisis Lanjutan';
        }
    }
}

export const levelManager = new LevelManager();
