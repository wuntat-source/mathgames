// leaderboard.js - Modul Terpadu Papan Peringkat (Leaderboard) Pemain
// Mengelola penyimpanan, pemeringkatan, dan filter skor untuk Game 1 (FPS) dan Game 2 (Runner)

const LEADERBOARD_KEY = 'math_games_leaderboard_v1';

const DEFAULT_LEADERBOARDS = {
    fps: [
        { name: 'Budi "Sniper Kilat"', score: 18500, grade: 'sma', level: 50, extra: '98% Akurasi', date: '2026-09-04' },
        { name: 'Siti Nurhaliza', score: 15200, grade: 'smp', level: 42, extra: '95% Akurasi', date: '2026-09-04' },
        { name: 'Kevin Santoso', score: 12800, grade: 'sd', level: 35, extra: '92% Akurasi', date: '2026-09-03' },
        { name: 'Dimas Pratama', score: 10400, grade: 'sma', level: 28, extra: '90% Akurasi', date: '2026-09-02' },
        { name: 'Ayu Lestari', score: 8900, grade: 'smp', level: 20, extra: '88% Akurasi', date: '2026-09-01' },
        { name: 'Rian Hidayat', score: 7200, grade: 'sd', level: 15, extra: '85% Akurasi', date: '2026-08-30' },
        { name: 'Putri Melati', score: 5600, grade: 'sd', level: 10, extra: '82% Akurasi', date: '2026-08-28' }
    ],
    runner: [
        { name: 'Andi "Turbo Runner"', score: 19800, grade: 'sma', level: 50, extra: '5x Combo Max', date: '2026-09-05' },
        { name: 'Zahra Aulia', score: 16400, grade: 'smp', level: 45, extra: '5x Combo Max', date: '2026-09-04' },
        { name: 'Fajar Ramadhan', score: 13900, grade: 'sd', level: 38, extra: '4x Combo', date: '2026-09-04' },
        { name: 'Nabila Putri', score: 11200, grade: 'sma', level: 30, extra: '4x Combo', date: '2026-09-03' },
        { name: 'Ilham Wijaya', score: 9500, grade: 'smp', level: 24, extra: '3x Combo', date: '2026-09-02' },
        { name: 'Tasya Maharani', score: 7800, grade: 'sd', level: 18, extra: '3x Combo', date: '2026-09-01' },
        { name: 'Bayu Perkasa', score: 6100, grade: 'sd', level: 12, extra: '2x Combo', date: '2026-08-29' }
    ]
};

class LeaderboardManager {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        if (typeof localStorage !== 'undefined') {
            try {
                const raw = localStorage.getItem(LEADERBOARD_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.fps && parsed.runner) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.error('Gagal membaca leaderboard dari localStorage', e);
            }
        }

        // Simpan data default awal
        this.saveData(DEFAULT_LEADERBOARDS);
        return JSON.parse(JSON.stringify(DEFAULT_LEADERBOARDS));
    }

    saveData(dataToSave) {
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(dataToSave || this.data));
            } catch (e) {
                console.error('Gagal menyimpan leaderboard ke localStorage', e);
            }
        }
    }

    // Ambil daftar skor terurut (Top Players)
    getScores(gameId = 'fps', gradeFilter = 'all', limit = 10) {
        const list = this.data[gameId] || [];
        let filtered = list;

        if (gradeFilter && gradeFilter !== 'all') {
            filtered = list.filter(item => item.grade.toLowerCase() === gradeFilter.toLowerCase());
        }

        // Urutkan berdasarkan skor tertinggi menurun (descending)
        filtered.sort((a, b) => b.score - a.score);

        return filtered.slice(0, limit);
    }

    // Tambah rekor baru
    addScore(gameId, { name, score, grade, level, extra = '' }) {
        if (!this.data[gameId]) {
            this.data[gameId] = [];
        }

        const cleanName = (name && name.trim()) ? name.trim().slice(0, 24) : 'Pemain Anonim';
        const today = new Date().toISOString().split('T')[0];

        const newEntry = {
            name: cleanName,
            score: Math.round(score),
            grade: (grade || 'sd').toLowerCase(),
            level: Number(level) || 1,
            extra: extra || '',
            date: today
        };

        this.data[gameId].push(newEntry);

        // Urutkan dan batasi agar tidak membengkak
        this.data[gameId].sort((a, b) => b.score - a.score);
        if (this.data[gameId].length > 50) {
            this.data[gameId] = this.data[gameId].slice(0, 50);
        }

        this.saveData();

        // Cari peringkat entri baru ini
        const rankIndex = this.data[gameId].findIndex(
            item => item.name === newEntry.name && item.score === newEntry.score && item.date === newEntry.date
        );

        return {
            rank: rankIndex + 1,
            entry: newEntry
        };
    }

    // Format badge jenjang
    getGradeBadge(grade) {
        switch ((grade || '').toLowerCase()) {
            case 'smp':
                return { label: 'SMP', color: '#ffd200' };
            case 'sma':
                return { label: 'SMA', color: '#ff007b' };
            case 'sd':
            default:
                return { label: 'SD', color: '#00f0ff' };
        }
    }
}

// Instance singleton
export const leaderboard = new LeaderboardManager();

// Lampirkan juga ke window agar mudah diakses tanpa import jika diperlukan
if (typeof window !== 'undefined') {
    window.leaderboardManager = leaderboard;
}
