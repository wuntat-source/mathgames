// Modul Sistem Level & Progres Permainan
// Mendukung 50 level untuk masing-masing jenjang (SD, SMP, SMA)
// Dilengkapi target nilai kelulusan, penyimpanan localStorage, dan kurva kesulitan

export class LevelManager {
    constructor() {
        this.totalLevels = 50;
        this.storageKey = 'math_fps_progress_v1';
        this.progress = this.loadProgress();
    }

    // Hitung target nilai kelulusan untuk level tertentu (1 - 50)
    // Formula dasar: Level 1 = 3500, bertambah 300 per level hingga level 50 (~18200)
    getTargetScore(level) {
        const lvl = Math.max(1, Math.min(this.totalLevels, level));
        return 3500 + (lvl - 1) * 300;
    }

    // Durasi waktu per soal sesuai level dan jenjang (makin tinggi level, makin menantang)
    getQuestionDuration(grade, level) {
        let baseTime = 10;
        if (grade === 'smp') baseTime = 9;
        if (grade === 'sma') baseTime = 8;

        // Berkurang sedikit tiap 10 level, minimal 5.5 detik
        const reduction = Math.min(2.5, Math.floor((level - 1) / 10) * 0.5);
        return Math.max(5.5, baseTime - reduction);
    }

    // Dapatkan judul topik/materi per rentang level
    getLevelTitle(grade, level) {
        if (grade === 'sd') {
            if (level <= 10) return 'Penjumlahan & Pengurangan Dasar (1 - 20)';
            if (level <= 20) return 'Operasi Bilangan Puluhan (1 - 100)';
            if (level <= 30) return 'Tabel Perkalian & Pembagian Genap';
            if (level <= 40) return 'Operasi Campuran 2 Langkah';
            return 'Ujian Mahir Matematika Dasar SD';
        } else if (grade === 'smp') {
            if (level <= 10) return 'Operasi Bilangan Bulat Positif & Negatif';
            if (level <= 20) return 'Persamaan Linier Satu Variabel (ax + b = c)';
            if (level <= 30) return 'Perpangkatan & Penarikan Akar Kuadrat';
            if (level <= 40) return 'Persentase & Pecahan Praktis';
            return 'Ujian Mahir Aljabar & Aritmatika SMP';
        } else {
            if (level <= 10) return 'Trigonometri Sudut Istimewa Dasar';
            if (level <= 20) return 'Logaritma Basis 2, 3, 5, dan 10';
            if (level <= 30) return 'Faktorisasi Persamaan Kuadrat';
            if (level <= 40) return 'Barisan & Deret Aritmatika Suku ke-n';
            return 'Ujian Mahir Matematika Sains SMA';
        }
    }

    // Muat data progres dari LocalStorage browser
    loadProgress() {
        const defaultProgress = {
            sd: { unlockedLevel: 1, scores: {}, stars: {} },
            smp: { unlockedLevel: 1, scores: {}, stars: {} },
            sma: { unlockedLevel: 1, scores: {}, stars: {} }
        };

        try {
            if (typeof localStorage === 'undefined') return defaultProgress;
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return defaultProgress;
            const parsed = JSON.parse(raw);
            return {
                sd: Object.assign({}, defaultProgress.sd, parsed.sd || {}),
                smp: Object.assign({}, defaultProgress.smp, parsed.smp || {}),
                sma: Object.assign({}, defaultProgress.sma, parsed.sma || {})
            };
        } catch (e) {
            console.warn('Gagal memuat progres permainan:', e);
            return defaultProgress;
        }
    }

    // Simpan progres ke LocalStorage browser
    saveProgress() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
            }
        } catch (e) {
            console.error('Gagal menyimpan progres permainan:', e);
        }
    }

    // Catat hasil permainan satu level
    // Mengembalikan objek { passed, newUnlock, stars, target }
    recordLevelResult(grade, level, score) {
        const g = grade.toLowerCase();
        if (!this.progress[g]) return { passed: false, newUnlock: false, stars: 0, target: this.getTargetScore(level) };

        const target = this.getTargetScore(level);
        const passed = score >= target;

        // Hitung bintang kelulusan (1, 2, atau 3)
        let stars = 0;
        if (passed) {
            stars = 1;
            if (score >= target * 1.3) stars = 2;
            if (score >= target * 1.6) stars = 3;
        }

        // Simpan highscore jika lebih tinggi
        const currentHigh = this.progress[g].scores[level] || 0;
        if (score > currentHigh) {
            this.progress[g].scores[level] = score;
        }

        // Simpan bintang jika lebih banyak
        const currentStars = this.progress[g].stars[level] || 0;
        if (stars > currentStars) {
            this.progress[g].stars[level] = stars;
        }

        // Buka level berikutnya jika lulus dan masih dalam batas 50 level
        let newUnlock = false;
        if (passed && level < this.totalLevels) {
            const nextLvl = level + 1;
            if (nextLvl > this.progress[g].unlockedLevel) {
                this.progress[g].unlockedLevel = nextLvl;
                newUnlock = true;
            }
        }

        this.saveProgress();
        return { passed, newUnlock, stars, target };
    }

    // Dapatkan status semua 50 level untuk jenjang tertentu
    getGradeLevelsData(grade) {
        const g = grade.toLowerCase();
        const info = this.progress[g] || { unlockedLevel: 1, scores: {}, stars: {} };
        const list = [];

        for (let lvl = 1; lvl <= this.totalLevels; lvl++) {
            const isUnlocked = lvl <= info.unlockedLevel;
            const isCurrent = lvl === info.unlockedLevel;
            const targetScore = this.getTargetScore(lvl);
            const highScore = info.scores[lvl] || 0;
            const stars = info.stars[lvl] || 0;

            list.push({
                level: lvl,
                grade: g,
                isUnlocked,
                isCurrent,
                targetScore,
                highScore,
                stars,
                title: this.getLevelTitle(g, lvl)
            });
        }

        return list;
    }

    // Reset progress untuk jenjang tertentu atau semua
    resetProgress(grade = null) {
        if (grade) {
            const g = grade.toLowerCase();
            if (this.progress[g]) {
                this.progress[g] = { unlockedLevel: 1, scores: {}, stars: {} };
            }
        } else {
            this.progress = {
                sd: { unlockedLevel: 1, scores: {}, stars: {} },
                smp: { unlockedLevel: 1, scores: {}, stars: {} },
                sma: { unlockedLevel: 1, scores: {}, stars: {} }
            };
        }
        this.saveProgress();
    }
}
