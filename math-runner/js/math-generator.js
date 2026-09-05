// math-generator.js - Generator Soal Matematika untuk Math Parkour Runner 3D
// Menghasilkan 3 opsi jawaban (1 Benar, 2 Pengecoh) untuk 3 Gerbang Portal (Kiri, Tengah, Kanan)

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

        // Buat 2 pengecoh (distractors) untuk mendapatkan total 3 opsi (sesuai 3 jalur lintasan)
        const optionsData = this.generateThreeOptions(questionData.answer, questionData.type, questionData.options);

        this.currentQuestion = {
            grade: grade.toUpperCase(),
            level: lvl,
            question: questionData.text,
            hint: questionData.hint || '',
            correctAnswer: questionData.answer,
            options: optionsData.options, // Array 3 elemen: [kiri, tengah, kanan]
            correctLane: optionsData.correctIndex, // 0 = Kiri, 1 = Tengah, 2 = Kanan
            displayAnswer: questionData.displayAnswer || String(questionData.answer)
        };

        return this.currentQuestion;
    }

    // --- JENJANG SEKOLAH DASAR (SD) : LEVEL 1 - 50 ---
    generateSD(level) {
        let a, b, c, answer, text;

        if (level <= 10) {
            // Level 1-10: Penjumlahan & Pengurangan 1-20
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
            // Level 11-20: Puluhan 10-100
            const op = Math.random();
            if (op < 0.5) {
                a = Math.floor(Math.random() * 45) + 12;
                b = Math.floor(Math.random() * 45) + 8;
                answer = a + b;
                text = `${a} + ${b} = ?`;
            } else {
                a = Math.floor(Math.random() * 50) + 40;
                b = Math.floor(Math.random() * (a - 10)) + 5;
                answer = a - b;
                text = `${a} - ${b} = ?`;
            }
        } else if (level <= 30) {
            // Level 21-30: Perkalian tabel 1-10 & Pembagian genap
            const isMul = Math.random() > 0.4;
            if (isMul) {
                a = Math.floor(Math.random() * 9) + 2;
                b = Math.floor(Math.random() * 9) + 2;
                answer = a * b;
                text = `${a} × ${b} = ?`;
            } else {
                b = Math.floor(Math.random() * 8) + 2;
                answer = Math.floor(Math.random() * 9) + 2;
                a = b * answer;
                text = `${a} ÷ ${b} = ?`;
            }
        } else if (level <= 40) {
            // Level 31-40: Campuran 2 langkah (a x b) + c atau (a + b) - c
            const mode = Math.floor(Math.random() * 2);
            if (mode === 0) {
                a = Math.floor(Math.random() * 6) + 2;
                b = Math.floor(Math.random() * 6) + 2;
                c = Math.floor(Math.random() * 15) + 1;
                answer = (a * b) + c;
                text = `(${a} × ${b}) + ${c} = ?`;
            } else {
                a = Math.floor(Math.random() * 30) + 20;
                b = Math.floor(Math.random() * 20) + 10;
                c = Math.floor(Math.random() * 15) + 5;
                answer = a + b - c;
                text = `${a} + ${b} - ${c} = ?`;
            }
        } else {
            // Level 41-50: Campuran berkecepatan tinggi & perkalian belasan
            const mode = Math.floor(Math.random() * 3);
            if (mode === 0) {
                a = Math.floor(Math.random() * 7) + 11;
                b = Math.floor(Math.random() * 6) + 2;
                answer = a * b;
                text = `${a} × ${b} = ?`;
            } else if (mode === 1) {
                a = Math.floor(Math.random() * 8) + 2;
                b = Math.floor(Math.random() * 7) + 2;
                c = Math.floor(Math.random() * 12) + 3;
                answer = (a * b) - c;
                text = `(${a} × ${b}) - ${c} = ?`;
            } else {
                b = Math.floor(Math.random() * 8) + 3;
                answer = Math.floor(Math.random() * 12) + 4;
                a = b * answer;
                c = Math.floor(Math.random() * 20) + 5;
                answer = answer + c;
                text = `(${a} ÷ ${b}) + ${c} = ?`;
            }
        }

        return { text, answer, type: 'number' };
    }

    // --- JENJANG SEKOLAH MENENGAH PERTAMA (SMP) : LEVEL 1 - 50 ---
    generateSMP(level) {
        let text, answer;

        if (level <= 10) {
            // Level 1-10: Operasi Bilangan Bulat Negatif
            const a = Math.floor(Math.random() * 24) - 12;
            const b = Math.floor(Math.random() * 24) - 12;
            const isAdd = Math.random() > 0.5;
            if (isAdd) {
                answer = a + b;
                text = `${a} + (${b}) = ?`;
            } else {
                answer = a - b;
                text = `${a} - (${b}) = ?`;
            }
        } else if (level <= 20) {
            // Level 11-20: Persamaan Linier Satu Variabel (ax + b = c)
            const x = Math.floor(Math.random() * 15) - 5;
            const a = Math.floor(Math.random() * 6) + 2;
            const b = Math.floor(Math.random() * 18) - 8;
            const c = a * x + b;
            const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            text = `${a}x ${bSign} = ${c}, x = ?`;
            answer = x;
        } else if (level <= 30) {
            // Level 21-30: Perpangkatan (Kuadrat / Kubik)
            const isCube = level > 25 && Math.random() > 0.5;
            if (isCube) {
                const base = Math.floor(Math.random() * 6) + 1;
                answer = Math.pow(base, 3);
                text = `${base}³ = ?`;
            } else {
                const base = Math.floor(Math.random() * 15) + 2;
                answer = base * base;
                text = `${base}² = ?`;
            }
        } else if (level <= 40) {
            // Level 31-40: Penarikan Akar Kuadrat & Operasi Campuran
            const base = Math.floor(Math.random() * 16) + 3;
            const sq = base * base;
            const offset = Math.floor(Math.random() * 10) + 1;
            const isAdd = Math.random() > 0.5;
            if (isAdd) {
                answer = base + offset;
                text = `√${sq} + ${offset} = ?`;
            } else {
                answer = base - offset;
                text = `√${sq} - ${offset} = ?`;
            }
        } else {
            // Level 41-50: Persamaan Aljabar & Akar Lanjutan
            const x = Math.floor(Math.random() * 16) + 2;
            const a = Math.floor(Math.random() * 4) + 2;
            const b = Math.floor(Math.random() * 5) + 1;
            const rhs = a * x - b * x;
            text = `${a}x - ${b}x = ${rhs}, x = ?`;
            answer = x;
        }

        return { text, answer, type: 'number' };
    }

    // --- JENJANG SEKOLAH MENENGAH ATAS (SMA) : LEVEL 1 - 50 ---
    generateSMA(level) {
        let text, answer;

        if (level <= 15) {
            // Level 1-15: Nilai Sudut Istimewa Trigonometri
            const angles = [0, 30, 45, 60, 90];
            const angle = angles[Math.floor(Math.random() * angles.length)];
            const func = ['sin', 'cos', 'tan'][Math.floor(Math.random() * (angle === 90 ? 2 : 3))];

            let rawAns;
            if (func === 'sin') {
                if (angle === 0) rawAns = '0';
                else if (angle === 30) rawAns = '1/2';
                else if (angle === 45) rawAns = '1/2√2';
                else if (angle === 60) rawAns = '1/2√3';
                else rawAns = '1';
            } else if (func === 'cos') {
                if (angle === 0) rawAns = '1';
                else if (angle === 30) rawAns = '1/2√3';
                else if (angle === 45) rawAns = '1/2√2';
                else if (angle === 60) rawAns = '1/2';
                else rawAns = '0';
            } else {
                if (angle === 0) rawAns = '0';
                else if (angle === 30) rawAns = '1/3√3';
                else if (angle === 45) rawAns = '1';
                else if (angle === 60) rawAns = '√3';
            }

            text = `${func}(${angle}°) = ?`;
            const trigOptions = ['0', '1/2', '1/2√2', '1/2√3', '1', '1/3√3', '√3'];
            return {
                text,
                answer: rawAns,
                type: 'trig',
                options: trigOptions.filter(o => o !== rawAns)
            };
        } else if (level <= 30) {
            // Level 16-30: Logaritma Dasar (ⁿlog(b))
            const bases = [2, 3, 5, 10];
            const base = bases[Math.floor(Math.random() * bases.length)];
            const exp = Math.floor(Math.random() * 4) + 1;
            const arg = Math.pow(base, exp);
            text = `^${base}log(${arg}) = ?`;
            answer = exp;
            return { text, answer, type: 'number' };
        } else if (level <= 40) {
            // Level 31-40: Akar Persamaan Kuadrat x² - (x1+x2)x + (x1*x2) = 0
            const x1 = Math.floor(Math.random() * 8) + 1;
            const x2 = Math.floor(Math.random() * 8) + 1;
            const sum = x1 + x2;
            const prod = x1 * x2;
            text = `Akar dari x² - ${sum}x + ${prod} = 0, x = ?`;
            answer = x1;
            return {
                text,
                answer,
                type: 'number',
                hint: `x = ${x1} atau ${x2}`
            };
        } else {
            // Level 41-50: Barisan Aritmatika / Geometri Un
            const a = Math.floor(Math.random() * 8) + 2;
            const b = Math.floor(Math.random() * 6) + 2;
            const n = Math.floor(Math.random() * 5) + 4;
            const un = a + (n - 1) * b;
            text = `Barisan ${a}, ${a+b}, ${a+2*b}... Suku ke-${n} (U_${n}) = ?`;
            answer = un;
            return { text, answer, type: 'number' };
        }
    }

    // Menghasilkan tepat 3 opsi (1 Benar + 2 Pengecoh) dan teracak di 3 jalur
    generateThreeOptions(correct, type, customDistractors) {
        const distractors = new Set();

        if (type === 'trig' && customDistractors) {
            const shuffled = [...customDistractors].sort(() => 0.5 - Math.random());
            distractors.add(shuffled[0]);
            distractors.add(shuffled[1]);
        } else if (typeof correct === 'number') {
            const deltas = [-3, -2, -1, 1, 2, 3, 4, 5, -4].sort(() => 0.5 - Math.random());
            for (let d of deltas) {
                const candidate = correct + d;
                if (candidate !== correct) {
                    distractors.add(candidate);
                    if (distractors.size >= 2) break;
                }
            }
            // Cadangan jika kurang dari 2
            let fallback = 1;
            while (distractors.size < 2) {
                distractors.add(correct + (fallback++ * 10));
            }
        } else {
            distractors.add(String(Number(correct) + 1));
            distractors.add(String(Number(correct) - 1));
        }

        const distArray = Array.from(distractors).slice(0, 2);
        const all = [
            { text: String(correct), isCorrect: true },
            { text: String(distArray[0]), isCorrect: false },
            { text: String(distArray[1]), isCorrect: false }
        ];

        // Acak posisi ke 3 jalur: 0 = Kiri, 1 = Tengah, 2 = Kanan
        all.sort(() => 0.5 - Math.random());

        const correctIndex = all.findIndex(item => item.isCorrect);

        return {
            options: all.map(item => item.text),
            correctIndex: correctIndex
        };
    }
}

export const mathGenerator = new MathGenerator();
