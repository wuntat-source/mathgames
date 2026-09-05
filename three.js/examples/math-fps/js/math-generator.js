// Generator Soal Matematika untuk Game Tembak Reaksi
// Mendukung jenjang SD, SMP, dan SMA dengan 50 level progresif

export class MathGenerator {
    constructor() {
        this.currentQuestion = null;
    }

    generate(grade = 'sd', level = 1) {
        let questionData;
        const lvl = Math.max(1, Math.min(50, level));

        switch (grade.toLowerCase()) {
            case 'smp':
                questionData = this.generateSMP(lvl);
                break;
            case 'sma':
                questionData = this.generateSMA(lvl);
                break;
            case 'sd':
            default:
                questionData = this.generateSD(lvl);
                break;
        }

        // Buat 3 opsi salah yang masuk akal (distractors)
        const options = this.generateOptions(questionData.answer, questionData.type, questionData.options, grade.toLowerCase());

        this.currentQuestion = {
            grade: grade.toUpperCase(),
            level: lvl,
            question: questionData.text,
            hint: questionData.hint || '',
            correctAnswer: questionData.answer,
            options: options, // Array 4 elemen teracak
            displayAnswer: questionData.displayAnswer || String(questionData.answer)
        };

        return this.currentQuestion;
    }

    // --- JENJANG SEKOLAH DASAR (SD) : LEVEL 1 - 50 ---
    generateSD(level) {
        let a, b, c, answer, text;

        if (level <= 10) {
            // Level 1-10: Penjumlahan & Pengurangan dasar 1-20
            const isAdd = Math.random() > 0.45;
            if (isAdd) {
                a = Math.floor(Math.random() * (5 + level)) + 1;
                b = Math.floor(Math.random() * (6 + level)) + 1;
                answer = a + b;
                text = `${a} + ${b} = ?`;
            } else {
                a = Math.floor(Math.random() * (8 + level)) + 6;
                b = Math.floor(Math.random() * (a - 1)) + 1;
                answer = a - b;
                text = `${a} - ${b} = ?`;
            }
        } else if (level <= 20) {
            // Level 11-20: Penjumlahan & Pengurangan puluhan 1-100
            const op = Math.random();
            if (op < 0.5) {
                a = Math.floor(Math.random() * 45) + 10;
                b = Math.floor(Math.random() * 45) + 5;
                answer = a + b;
                text = `${a} + ${b} = ?`;
            } else {
                a = Math.floor(Math.random() * 60) + 25;
                b = Math.floor(Math.random() * (a - 10)) + 5;
                answer = a - b;
                text = `${a} - ${b} = ?`;
            }
        } else if (level <= 30) {
            // Level 21-30: Tabel Perkalian & Pembagian Genap
            const isMul = Math.random() > 0.45;
            if (isMul) {
                a = Math.floor(Math.random() * 9) + 2;
                b = Math.floor(Math.random() * 9) + 2;
                answer = a * b;
                text = `${a} × ${b} = ?`;
            } else {
                b = Math.floor(Math.random() * 9) + 2;
                answer = Math.floor(Math.random() * 9) + 2;
                a = b * answer;
                text = `${a} ÷ ${b} = ?`;
            }
        } else if (level <= 40) {
            // Level 31-40: Operasi Campuran 2 Langkah (KABATAKU dasar)
            const type = Math.random();
            if (type < 0.4) {
                a = Math.floor(Math.random() * 7) + 2;
                b = Math.floor(Math.random() * 6) + 2;
                c = Math.floor(Math.random() * 20) + 5;
                answer = (a * b) + c;
                text = `${a} × ${b} + ${c} = ?`;
            } else if (type < 0.7) {
                a = Math.floor(Math.random() * 7) + 3;
                b = Math.floor(Math.random() * 6) + 2;
                c = Math.floor(Math.random() * (a * b - 3)) + 1;
                answer = (a * b) - c;
                text = `${a} × ${b} - ${c} = ?`;
            } else {
                b = Math.floor(Math.random() * 6) + 2;
                const divRes = Math.floor(Math.random() * 7) + 2;
                a = b * divRes;
                c = Math.floor(Math.random() * 15) + 5;
                answer = divRes + c;
                text = `${a} ÷ ${b} + ${c} = ?`;
            }
        } else {
            // Level 41-50: Ujian Mahir SD (Perkalian belasan & operasi rantai 3 angka)
            const type = Math.random();
            if (type < 0.4) {
                a = Math.floor(Math.random() * 10) + 11; // 11 - 20
                b = Math.floor(Math.random() * 8) + 3;
                answer = a * b;
                text = `${a} × ${b} = ?`;
            } else if (type < 0.7) {
                a = Math.floor(Math.random() * 5) + 3;
                b = Math.floor(Math.random() * 5) + 2;
                c = Math.floor(Math.random() * 6) + 2;
                answer = a * b * c;
                text = `${a} × ${b} × ${c} = ?`;
            } else {
                a = Math.floor(Math.random() * 25) + 20;
                b = Math.floor(Math.random() * 15) + 10;
                c = Math.floor(Math.random() * 5) + 2;
                answer = a + b * c;
                text = `${a} + ${b} × ${c} = ?`;
            }
        }

        return { text, answer, type: 'number' };
    }

    // --- JENJANG SEKOLAH MENENGAH PERTAMA (SMP) : LEVEL 1 - 50 ---
    generateSMP(level) {
        let text, answer;

        if (level <= 10) {
            // Level 1-10: Operasi Bilangan Bulat Negatif
            const a = (Math.floor(Math.random() * 15) + 2) * (Math.random() > 0.5 ? -1 : 1);
            const b = (Math.floor(Math.random() * 15) + 2) * (Math.random() > 0.5 ? -1 : 1);
            const op = Math.random() > 0.5 ? '+' : '-';
            answer = op === '+' ? a + b : a - b;
            const bStr = b < 0 ? `(${b})` : `${b}`;
            text = `${a} ${op} ${bStr} = ?`;
        } else if (level <= 20) {
            // Level 11-20: Persamaan Linear Satu Variabel (ax + b = c)
            const a = Math.floor(Math.random() * 5) + 2;
            const x = Math.floor(Math.random() * 12) + 1;
            const isSub = Math.random() > 0.5;
            const b = Math.floor(Math.random() * 15) + 1;
            const c = isSub ? a * x - b : a * x + b;
            answer = x;
            text = isSub ? `${a}x - ${b} = ${c}, cari x?` : `${a}x + ${b} = ${c}, cari x?`;
        } else if (level <= 30) {
            // Level 21-30: Perpangkatan & Penarikan Akar Kuadrat Sempurna
            if (Math.random() > 0.45) {
                const roots = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256];
                const maxIdx = Math.min(roots.length, 6 + Math.floor(level / 3));
                const val = roots[Math.floor(Math.random() * maxIdx)];
                answer = Math.round(Math.sqrt(val));
                text = `√${val} = ?`;
            } else {
                const base = Math.floor(Math.random() * 8) + 4;
                answer = base * base;
                text = `${base}² = ?`;
            }
        } else if (level <= 40) {
            // Level 31-40: Persentase, Rasio & Pecahan
            const percentages = [10, 15, 20, 25, 50, 75];
            const p = percentages[Math.floor(Math.random() * percentages.length)];
            const base = (Math.floor(Math.random() * 8) + 2) * 20;
            answer = Math.round((p / 100) * base);
            text = `${p}% dari ${base} = ?`;
        } else {
            // Level 41-50: Ujian Mahir SMP (Aljabar dua ruas & Pangkat Negatif/Pecahan)
            const type = Math.random();
            if (type < 0.5) {
                // 3x + 4 = x + 16 -> 2x = 12 -> x = 6
                const a = Math.floor(Math.random() * 3) + 3;
                const c = Math.floor(Math.random() * 2) + 1; // c < a
                const x = Math.floor(Math.random() * 8) + 2;
                const diff = (a - c) * x;
                const b = Math.floor(Math.random() * 6) + 1;
                const d = b + diff;
                answer = x;
                text = `${a}x + ${b} = ${c}x + ${d}, cari x?`;
            } else {
                const a = (Math.floor(Math.random() * 6) + 2) * -1;
                const b = Math.floor(Math.random() * 6) + 2;
                answer = a * b;
                text = `(${a}) × ${b} = ?`;
            }
        }

        return { text, answer, type: 'number' };
    }

    // --- JENJANG SEKOLAH MENENGAH ATAS (SMA) : LEVEL 1 - 50 ---
    generateSMA(level) {
        let text, answer, displayAnswer;

        if (level <= 10) {
            // Level 1-10: Trigonometri Sudut Istimewa Dasar
            const trigTable = [
                { func: 'sin(30°)', val: 0.5, disp: '0.5' },
                { func: 'sin(90°)', val: 1, disp: '1' },
                { func: 'sin(0°)', val: 0, disp: '0' },
                { func: 'cos(60°)', val: 0.5, disp: '0.5' },
                { func: 'cos(0°)', val: 1, disp: '1' },
                { func: 'cos(90°)', val: 0, disp: '0' },
                { func: 'tan(45°)', val: 1, disp: '1' },
                { func: 'tan(0°)', val: 0, disp: '0' },
                { func: 'sin²(45°) + cos²(45°)', val: 1, disp: '1' }
            ];
            const item = trigTable[Math.floor(Math.random() * trigTable.length)];
            text = `${item.func} = ?`;
            answer = item.val;
            displayAnswer = item.disp;
            return {
                text,
                answer,
                displayAnswer,
                type: 'number',
                options: [0, 0.5, 1, 2]
            };
        } else if (level <= 20) {
            // Level 11-20: Logaritma Basis 2, 3, 5, 10
            const logs = [
                { base: 2, num: 8, ans: 3 },
                { base: 2, num: 16, ans: 4 },
                { base: 2, num: 32, ans: 5 },
                { base: 2, num: 64, ans: 6 },
                { base: 3, num: 9, ans: 2 },
                { base: 3, num: 27, ans: 3 },
                { base: 3, num: 81, ans: 4 },
                { base: 5, num: 25, ans: 2 },
                { base: 5, num: 125, ans: 3 },
                { base: 10, num: 100, ans: 2 },
                { base: 10, num: 1000, ans: 3 }
            ];
            const item = logs[Math.floor(Math.random() * logs.length)];
            const bPrefix = item.base === 10 ? '' : item.base;
            text = `${bPrefix}log(${item.num}) = ?`;
            answer = item.ans;
        } else if (level <= 30) {
            // Level 21-30: Persamaan Kuadrat (x - p)(x - q) = 0
            const p = Math.floor(Math.random() * 4) + 1;
            const q = Math.floor(Math.random() * 5) + 3;
            const b = p + q;
            const c = p * q;
            const askMax = Math.random() > 0.5;
            answer = askMax ? Math.max(p, q) : Math.min(p, q);
            const targetWord = askMax ? 'terbesar' : 'terkecil';
            text = `Akar ${targetWord} x² - ${b}x + ${c} = 0?`;
        } else if (level <= 40) {
            // Level 31-40: Barisan & Deret Aritmatika (Un = a + (n-1)b)
            const a = Math.floor(Math.random() * 6) + 2;
            const b = Math.floor(Math.random() * 4) + 2;
            const n = Math.floor(Math.random() * 6) + 4; // suku ke 4 - 9
            answer = a + (n - 1) * b;
            text = `${a}, ${a + b}, ${a + 2 * b}... Suku ke-${n} = ?`;
        } else {
            // Level 41-50: Ujian Mahir SMA (Sifat Logaritma Kombinasi & Barisan Geometri)
            const type = Math.random();
            if (type < 0.5) {
                // 2log(4) + 2log(8) = 2 + 3 = 5
                answer = 5;
                text = `²log(4) + ²log(8) = ?`;
            } else {
                // Barisan geometri rasio 2: a, ar, ar^2
                const a = Math.floor(Math.random() * 3) + 2;
                const r = 2;
                const n = 4; // Suku ke 4 = a * 8
                answer = a * Math.pow(r, n - 1);
                text = `${a}, ${a * r}, ${a * r * r}... Suku ke-${n} = ?`;
            }
        }

        return { text, answer, displayAnswer: displayAnswer || String(answer), type: 'number' };
    }

    generateOptions(correctAnswer, type, predefinedOptions, grade = 'sd') {
        if (predefinedOptions && Array.isArray(predefinedOptions)) {
            const copy = [...predefinedOptions];
            return copy.sort(() => Math.random() - 0.5);
        }

        const optionsSet = new Set();
        optionsSet.add(correctAnswer);

        const offsets = [-2, -1, 1, 2, -3, 3, -4, 4, -5, 5, 10, -10];
        offsets.sort(() => Math.random() - 0.5);

        for (const offset of offsets) {
            if (optionsSet.size >= 4) break;
            const candidate = typeof correctAnswer === 'number' ? Number((correctAnswer + offset).toFixed(2)) : null;
            if (candidate !== null && candidate !== correctAnswer) {
                if (grade === 'sd' && candidate < 0) continue;
                optionsSet.add(candidate);
            }
        }

        let seed = 1;
        while (optionsSet.size < 4) {
            const fake = correctAnswer + (seed++);
            optionsSet.add(fake);
        }

        const optionsArray = Array.from(optionsSet);
        return optionsArray.sort(() => Math.random() - 0.5);
    }
}
