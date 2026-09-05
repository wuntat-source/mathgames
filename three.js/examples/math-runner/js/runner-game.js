// runner-game.js - Controller Utama Math Parkour Runner 3D
import * as THREE from 'three';
import { RunnerPlayer } from './runner-player.js';
import { RunnerWorld } from './runner-world.js';
import { mathGenerator } from './math-generator.js';
import { levelManager, TOTAL_LEVELS, GRADE_CONFIG } from './levels-data.js';
import { runnerAudio } from './audio.js';
import { leaderboard } from './leaderboard.js';
import { shopManager, POWER_UPS, SKINS } from './shop-data.js';

class RunnerGame {
    constructor() {
        this.container = document.getElementById('game-container');
        this.clock = new THREE.Clock();

        // Status Permainan
        this.isPlaying = false;
        this.isPaused = false;
        this.currentGrade = 'sd';
        this.currentLevel = 1;

        // Gameplay Metrics
        this.score = 0;
        this.targetScore = 3000;
        this.lives = 3;
        this.maxLives = 3;
        this.combo = 1;
        this.currentQuestionIndex = 0;
        this.totalQuestionsPerLevel = 10;
        this.correctAnswersCount = 0;

        // Power-Up State
        this.hasShield = false;
        this.magnetTimer = 0;
        this.nitroTimer = 0;

        // Kecepatan & Nitro Boost
        this.baseSpeed = 22;
        this.currentSpeed = 22;
        this.boostTimer = 0;

        // Jarak Spawn Gerbang & Rintangan
        this.distanceTravelled = 0;
        this.nextGateDistance = -55;
        this.activeQuestionData = null;

        this.initThree();
        this.initEntities();
        this.initEventListeners();
        this.initUI();
    }

    // --- 1. SETUP THREE.JS SCENE, CAMERA & LIGHTS ---
    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1d2e5a);
        this.scene.fog = new THREE.FogExp2(0x1d2e5a, 0.012);

        // Kamera di belakang dan sedikit di atas karakter
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 150);
        this.baseCameraPos = new THREE.Vector3(0, 4.4, 6.2);
        this.camera.position.copy(this.baseCameraPos);
        this.camera.lookAt(0, 1.8, -12);

        // Renderer WebGL
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Pencahayaan Lebih Terang & Cerah
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x40e0ff, 1.6);
        dirLight.position.set(10, 25, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        const magentaLight = new THREE.DirectionalLight(0xff3399, 1.3);
        magentaLight.position.set(-10, 20, -10);
        this.scene.add(magentaLight);

        // Responsif Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 2. ENTITAS GAME (PLAYER & WORLD) ---
    initEntities() {
        this.world = new RunnerWorld(this.scene);
        this.player = new RunnerPlayer(this.scene);
    }

    // --- 3. INPUT CONTROLS (KEYBOARD & TOUCH) ---
    initEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (!this.isPlaying || this.isPaused) return;

            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                if (this.player.moveLeft()) {
                    runnerAudio.playDash();
                }
            } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                if (this.player.moveRight()) {
                    runnerAudio.playDash();
                }
            } else if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
                if (this.player.jump()) {
                    runnerAudio.playJump();
                }
            } else if (e.code === 'KeyP' || e.code === 'Escape') {
                this.togglePause();
            }
        });

        // Touch Buttons untuk Mobile
        const btnLeft = document.getElementById('touch-left');
        const btnRight = document.getElementById('touch-right');
        const btnJump = document.getElementById('touch-jump');

        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.player.moveLeft()) runnerAudio.playDash();
            });
        }
        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.player.moveRight()) runnerAudio.playDash();
            });
        }
        if (btnJump) {
            btnJump.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.player.jump()) runnerAudio.playJump();
            });
        }
    }

    // --- 4. UI INITIALIZATION & LEVEL SELECTOR MODAL ---
    initUI() {
        // Navigasi Jenjang (SD, SMP, SMA)
        const gradeTabs = document.querySelectorAll('.grade-tab');
        gradeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                gradeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentGrade = tab.getAttribute('data-grade');
                this.renderLevelGrid();
            });
        });

        // Tombol Pause & Mute
        document.getElementById('btn-pause')?.addEventListener('click', () => this.togglePause());
        document.getElementById('btn-mute')?.addEventListener('click', (e) => {
            const muted = runnerAudio.toggleMute();
            e.currentTarget.textContent = muted ? '🔇' : '🔊';
        });

        // Tombol Modal Aksi
        document.getElementById('btn-resume')?.addEventListener('click', () => this.togglePause());
        document.getElementById('btn-restart-pause')?.addEventListener('click', () => {
            this.togglePause();
            this.startLevel(this.currentGrade, this.currentLevel);
        });
        document.getElementById('btn-menu-pause')?.addEventListener('click', () => {
            this.togglePause();
            this.showMenu();
        });

        // Modal Selesai Level
        document.getElementById('btn-next-level')?.addEventListener('click', () => {
            this.hideModals();
            this.startLevel(this.currentGrade, Math.min(this.currentLevel + 1, TOTAL_LEVELS));
        });
        document.getElementById('btn-retry')?.addEventListener('click', () => {
            this.hideModals();
            this.startLevel(this.currentGrade, this.currentLevel);
        });
        document.getElementById('btn-menu-result')?.addEventListener('click', () => {
            this.hideModals();
            this.showMenu();
        });

        // Tombol Buka Papan Peringkat
        document.getElementById('btn-open-leaderboard-hud')?.addEventListener('click', () => this.showLeaderboard());
        document.getElementById('btn-open-leaderboard-menu')?.addEventListener('click', () => this.showLeaderboard());
        document.getElementById('btn-open-leaderboard-pause')?.addEventListener('click', () => this.showLeaderboard());
        document.getElementById('btn-close-leaderboard')?.addEventListener('click', () => this.hideLeaderboard());

        // Tombol Buka Toko (Shop)
        document.getElementById('btn-open-shop-hud')?.addEventListener('click', () => this.showShop());
        document.getElementById('btn-open-shop-menu')?.addEventListener('click', () => this.showShop());
        document.getElementById('btn-open-shop-pause')?.addEventListener('click', () => this.showShop());
        document.getElementById('btn-close-shop')?.addEventListener('click', () => this.hideShop());

        // Shortcut In-Game Power-Up Activation (Tombol 1, 2, 3)
        window.addEventListener('keydown', (e) => {
            if (!this.isPlaying || this.isPaused) return;
            if (e.code === 'Digit1' || e.code === 'Numpad1') {
                this.activatePowerUp('shield');
            } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
                this.activatePowerUp('heart');
            } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
                this.activatePowerUp('magnet');
            } else if (e.code === 'Digit4' || e.code === 'Numpad4') {
                this.activatePowerUp('nitro');
            }
        });

        // Tab Toko (Power-Up vs Skin)
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.getAttribute('data-shop-tab');
                document.getElementById('shop-tab-powerups').style.display = target === 'powerups' ? 'grid' : 'none';
                document.getElementById('shop-tab-skins').style.display = target === 'skins' ? 'grid' : 'none';
            });
        });

        // Quick Use HUD Buttons
        document.getElementById('hud-btn-shield')?.addEventListener('click', () => this.activatePowerUp('shield'));
        document.getElementById('hud-btn-heart')?.addEventListener('click', () => this.activatePowerUp('heart'));
        document.getElementById('hud-btn-magnet')?.addEventListener('click', () => this.activatePowerUp('magnet'));
        document.getElementById('hud-btn-nitro')?.addEventListener('click', () => this.activatePowerUp('nitro'));

        // Filter Jenjang di Modal Leaderboard
        document.querySelectorAll('.lb-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lb-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const grade = btn.getAttribute('data-lb-grade');
                this.renderRunnerLeaderboard(grade);
            });
        });

        // Simpan Skor Pemain
        document.getElementById('btn-save-score')?.addEventListener('click', () => this.saveScore());

        // Render awal grid level
        this.renderLevelGrid();
        this.showMenu();
    }

    renderLevelGrid() {
        const grid = document.getElementById('level-grid');
        if (!grid) return;
        grid.innerHTML = '';

        for (let lvl = 1; lvl <= TOTAL_LEVELS; lvl++) {
            const isUnlocked = levelManager.isUnlocked(this.currentGrade, lvl);
            const stars = levelManager.getStars(this.currentGrade, lvl);
            const highScore = levelManager.getHighScore(this.currentGrade, lvl);
            const target = levelManager.getTargetScore(this.currentGrade, lvl);

            const card = document.createElement('div');
            card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            if (lvl === this.currentLevel) card.classList.add('selected');

            card.innerHTML = `
                <div class="lvl-number">${lvl}</div>
                <div class="lvl-status">
                    ${isUnlocked ? (stars > 0 ? '⭐'.repeat(stars) : 'Terbuka') : '🔒'}
                </div>
                <div class="lvl-target">Target: ${target.toLocaleString('id-ID')}</div>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    this.startLevel(this.currentGrade, lvl);
                });
            }

            grid.appendChild(card);
        }
    }

    // --- 5. SIKLUS PERMAINAN (START, GAME LOOP, END) ---
    startLevel(grade, level) {
        this.currentGrade = grade;
        this.currentLevel = level;
        this.targetScore = levelManager.getTargetScore(grade, level);

        // Reset metrics
        this.score = 0;
        this.lives = this.maxLives;
        this.combo = 1;
        this.currentQuestionIndex = 0;
        this.correctAnswersCount = 0;
        this.distanceTravelled = 0;
        this.nextGateDistance = -50;
        this.boostTimer = 0;
        this.magnetTimer = 0;
        this.nitroTimer = 0;

        // Terapkan Skin Aktif dari Toko
        const skinCfg = shopManager.getActiveSkinConfig();
        this.player.applySkin(skinCfg);

        // Pasang Shield jika pemain memiliki stok di inventory
        if (shopManager.inventory.shield > 0) {
            shopManager.usePowerUp('shield');
            this.hasShield = true;
            this.player.setShield(true);
            this.showFloatingText('🛡️ ENERGY SHIELD AKTIF!', '#00f0ff');
        } else {
            this.hasShield = false;
            this.player.setShield(false);
        }

        // Scaling kecepatan bertahap sesuai level
        this.baseSpeed = 20 + Math.min(level, 50) * 0.28;
        this.currentSpeed = this.baseSpeed;

        // Reset Player & World
        this.player.reset();
        this.world.clearWorldObjects();

        // Siapkan soal pertama & spawn gerbang pertama
        this.generateNextGate();

        // Spawn beberapa rintangan awal
        this.world.spawnObstacle(-25, this.activeQuestionData.correctLane);
        this.world.spawnCoins(-35, 1);

        this.isPlaying = true;
        this.isPaused = false;
        this.hideModals();
        this.updateHUD();

        runnerAudio.ensureContext();
    }

    generateNextGate() {
        this.currentQuestionIndex++;
        this.activeQuestionData = mathGenerator.generate(this.currentGrade, this.currentLevel);

        // Pasang gerbang 3 jalur di jarak depan
        this.world.spawnMathGates(this.nextGateDistance, this.activeQuestionData);

        // Pasang rintangan dan koin di antara gerbang berikutnya
        const nextDist = this.nextGateDistance - 55;
        this.world.spawnObstacle(this.nextGateDistance - 22, this.activeQuestionData.correctLane);
        this.world.spawnCoins(this.nextGateDistance - 38, Math.floor(Math.random() * 3));

        this.nextGateDistance = nextDist;
        this.updateHUD();
    }

    handleMathResult(isCorrect, value, gateSet) {
        if (isCorrect) {
            // JAWABAN BENAR!
            this.correctAnswersCount++;
            const basePoints = 1000;
            const points = basePoints * this.combo;
            this.score += points;

            // Naikkan combo hingga 5x
            this.combo = Math.min(this.combo + 1, 5);

            // Aktifkan Nitro Speed Boost sesaat
            this.boostTimer = 2.0;

            runnerAudio.playCorrect();
            runnerAudio.playBoost();

            this.showFloatingText(`+${points} TEPAT! COMBO ${this.combo}x!`, '#00ff88');
        } else {
            // JAWABAN SALAH! Jika ada perisai (Energy Shield), perisai menahan dampaknya
            if (this.hasShield) {
                this.hasShield = false;
                this.player.setShield(false);
                runnerAudio.playCrash();
                this.triggerScreenFlash();
                this.showFloatingText(`🛡️ SHIELD MENAHAN KESALAHAN!`, '#00f0ff');
            } else {
                this.combo = 1;
                this.lives--;
                this.player.triggerHurt();

                runnerAudio.playWrong();
                this.triggerScreenFlash();
                this.showFloatingText(`SALAH! (-1 Nyawa)`, '#ff0055');

                if (this.lives <= 0) {
                    this.endGame(false, 'Nyawa Anda telah habis!');
                    return;
                }
            }
        }

        this.updateHUD();

        // Cek jika 10 ronde soal dalam level ini sudah tuntas
        if (this.currentQuestionIndex >= this.totalQuestionsPerLevel) {
            setTimeout(() => {
                const passed = this.score >= this.targetScore;
                this.endGame(passed);
            }, 1200);
        } else {
            // Munculkan soal berikutnya
            this.generateNextGate();
        }
    }

    handleHitObstacle() {
        if (this.nitroTimer > 0) {
            // Saat Nitro Turbo aktif, pemain kebal dari tabrakan
            runnerAudio.playCrash();
            this.showFloatingText(`🚀 DILINDUNGI NITRO TURBO!`, '#00ff88');
            return;
        }

        if (this.hasShield) {
            this.hasShield = false;
            this.player.setShield(false);
            runnerAudio.playCrash();
            this.triggerScreenFlash();
            this.showFloatingText(`🛡️ SHIELD PECAH MENAHAN RINTANGAN!`, '#00f0ff');
            this.updateHUD();
            return;
        }

        this.lives--;
        this.combo = 1;
        this.player.triggerHurt();

        runnerAudio.playCrash();
        this.triggerScreenFlash();
        this.showFloatingText(`NABRAK RINTANGAN!`, '#ffaa00');

        this.updateHUD();

        if (this.lives <= 0) {
            this.endGame(false, 'Terlalu banyak menabrak rintangan!');
        }
    }

    handleCollectCoin() {
        this.score += 150;
        shopManager.addCoins(1); // Tambah +1 saldo koin tetap
        runnerAudio.playCoin();
        this.updateHUD();
    }

    endGame(passed, customMessage = '') {
        this.isPlaying = false;

        const result = levelManager.recordResult(this.currentGrade, this.currentLevel, this.score);

        const modal = document.getElementById('modal-result');
        const title = document.getElementById('result-title');
        const desc = document.getElementById('result-desc');
        const scoreEl = document.getElementById('result-score');
        const targetEl = document.getElementById('result-target');
        const starsEl = document.getElementById('result-stars');
        const btnNext = document.getElementById('btn-next-level');

        if (passed) {
            runnerAudio.playVictory();
            title.textContent = '🎉 LEVEL SELESAI!';
            title.style.color = '#00ff88';
            desc.textContent = `Hebat! Anda berhasil melampaui target nilai kelulusan untuk Level ${this.currentLevel}!`;
            btnNext.style.display = (this.currentLevel < TOTAL_LEVELS) ? 'flex' : 'none';
        } else {
            runnerAudio.playGameOver();
            title.textContent = '⚠️ TARGET BELUM TERCAPAI';
            title.style.color = '#ff0055';
            const selisih = this.targetScore - this.score;
            desc.textContent = customMessage || `Skor Anda kurang ${selisih.toLocaleString('id-ID')} poin lagi untuk lulus.`;
            btnNext.style.display = 'none';
        }

        scoreEl.textContent = this.score.toLocaleString('id-ID');
        targetEl.textContent = this.targetScore.toLocaleString('id-ID');
        starsEl.innerHTML = passed ? '⭐'.repeat(result.stars) : '❌';

        // Pre-fill nama pemain yang tersimpan
        const nameInput = document.getElementById('player-name-input');
        const saveBtn = document.getElementById('btn-save-score');
        const saveMsg = document.getElementById('save-score-msg');
        if (nameInput) {
            nameInput.value = localStorage.getItem('math_player_name') || '';
            nameInput.disabled = false;
        }
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 SIMPAN';
        }
        if (saveMsg) {
            saveMsg.textContent = '';
        }

        modal.classList.remove('hidden');
    }

    saveScore() {
        const nameInput = document.getElementById('player-name-input');
        const saveBtn = document.getElementById('btn-save-score');
        const saveMsg = document.getElementById('save-score-msg');

        const playerName = nameInput ? nameInput.value.trim() : '';
        if (!playerName) {
            if (saveMsg) {
                saveMsg.style.color = '#ff0055';
                saveMsg.textContent = 'Silakan ketik nama Anda terlebih dahulu!';
            }
            return;
        }

        // Simpan nama ke localStorage agar pemain tidak perlu mengetik ulang
        localStorage.setItem('math_player_name', playerName);

        const res = leaderboard.addScore('runner', {
            name: playerName,
            score: this.score,
            grade: this.currentGrade,
            level: this.currentLevel,
            extra: `${this.combo}x Combo Max`
        });

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = '✅ TERSIMPAN';
        }
        if (nameInput) {
            nameInput.disabled = true;
        }
        if (saveMsg) {
            saveMsg.style.color = '#00ff88';
            saveMsg.textContent = `Rekor berhasil dicatat di Peringkat #${res.rank} Papan Peringkat!`;
        }
    }

    showLeaderboard(grade = 'all') {
        this.renderRunnerLeaderboard(grade);
        document.getElementById('modal-leaderboard')?.classList.remove('hidden');
    }

    renderRunnerLeaderboard(grade = 'all') {
        const tbody = document.getElementById('runner-lb-tbody');
        if (!tbody) return;

        const scores = leaderboard.getScores('runner', grade, 10);
        tbody.innerHTML = '';

        if (scores.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:18px; color:#8ea3bf;">Belum ada data skor.</td></tr>`;
            return;
        }

        scores.forEach((item, idx) => {
            const tr = document.createElement('tr');
            const rank = idx + 1;
            const rankMedal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : (rank === 3 ? '🥉' : `#${rank}`));
            const gradeBadge = leaderboard.getGradeBadge(item.grade);

            tr.innerHTML = `
                <td style="padding: 9px 12px; text-align: center; font-weight: 800;">${rankMedal}</td>
                <td style="padding: 9px 12px; font-weight: 700; color: #fff;">${item.name}</td>
                <td style="padding: 9px 12px;">
                    <span style="background: rgba(255,255,255,0.1); color: ${gradeBadge.color}; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 800;">${gradeBadge.label} Lvl ${item.level}</span>
                </td>
                <td style="padding: 9px 12px; text-align: right; color: #ffd200; font-weight: 900; font-family: monospace;">${item.score.toLocaleString('id-ID')}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    showShop() {
        this.renderShopUI();
        document.getElementById('modal-shop')?.classList.remove('hidden');
    }

    hideShop() {
        document.getElementById('modal-shop')?.classList.add('hidden');
        this.updateHUD();
    }

    activatePowerUp(type) {
        if (!this.isPlaying) return;

        if (type === 'shield') {
            if (this.hasShield) {
                this.showFloatingText('Shield sudah aktif!', '#00f0ff');
                return;
            }
            if (shopManager.usePowerUp('shield')) {
                this.hasShield = true;
                this.player.setShield(true);
                runnerAudio.playBoost();
                this.showFloatingText('🛡️ SHIELD DIAKTIFKAN!', '#00f0ff');
                this.updateHUD();
            } else {
                this.showFloatingText('Stok Shield habis! Beli di Toko.', '#ff5577');
            }
        } else if (type === 'heart') {
            if (this.lives >= this.maxLives) {
                this.showFloatingText('Nyawa sudah penuh!', '#00ff88');
                return;
            }
            if (shopManager.usePowerUp('heart')) {
                this.lives = Math.min(this.lives + 1, this.maxLives);
                runnerAudio.playVictory();
                this.showFloatingText('❤️ +1 NYAWA PULIH!', '#00ff88');
                this.updateHUD();
            } else {
                this.showFloatingText('Stok Heart habis! Beli di Toko.', '#ff5577');
            }
        } else if (type === 'magnet') {
            if (this.magnetTimer > 0) {
                this.showFloatingText('Magnet sedang bekerja!', '#ffd200');
                return;
            }
            if (shopManager.usePowerUp('magnet')) {
                this.magnetTimer = 10.0;
                runnerAudio.playBoost();
                this.showFloatingText('🧲 MAGNET KOIN AKTIF 10 DETIK!', '#ffd200');
                this.updateHUD();
            } else {
                this.showFloatingText('Stok Magnet habis! Beli di Toko.', '#ff5577');
            }
        } else if (type === 'nitro') {
            if (this.nitroTimer > 0) {
                this.showFloatingText('Nitro sedang bekerja!', '#ffaa00');
                return;
            }
            if (shopManager.usePowerUp('nitro')) {
                this.nitroTimer = 5.0;
                this.boostTimer = 5.0;
                runnerAudio.playBoost();
                this.showFloatingText('🚀 NITRO TURBO AKTIF 5 DETIK!', '#00ff88');
                this.updateHUD();
            } else {
                this.showFloatingText('Stok Nitro habis! Beli di Toko.', '#ff5577');
            }
        }
    }

    renderShopUI() {
        const coinValEl = document.getElementById('shop-coins-display');
        if (coinValEl) coinValEl.textContent = shopManager.coins.toLocaleString('id-ID');

        // 1. Render Power-Up Items
        const pContainer = document.getElementById('shop-tab-powerups');
        if (pContainer) {
            pContainer.innerHTML = '';
            POWER_UPS.forEach(p => {
                const count = shopManager.inventory[p.id] || 0;
                const card = document.createElement('div');
                card.className = 'shop-item-card';
                card.innerHTML = `
                    <div class="shop-item-icon">${p.icon}</div>
                    <div class="shop-item-info">
                        <div class="shop-item-name">${p.name}</div>
                        <div class="shop-item-desc">${p.desc}</div>
                        <div class="shop-item-meta">
                            <span class="shop-item-stock">Dimiliki: <strong>${count}</strong></span>
                            <span class="shop-item-price">🪙 ${p.price.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <button class="btn-action btn-cyan btn-shop-buy" data-id="${p.id}">BELI (+1)</button>
                `;
                card.querySelector('.btn-shop-buy').addEventListener('click', () => {
                    const res = shopManager.buyPowerUp(p.id);
                    if (res.success) {
                        runnerAudio.playCoin();
                        this.renderShopUI();
                    } else {
                        alert(res.msg);
                    }
                });
                pContainer.appendChild(card);
            });
        }

        // 2. Render Skin Items
        const sContainer = document.getElementById('shop-tab-skins');
        if (sContainer) {
            sContainer.innerHTML = '';
            SKINS.forEach(s => {
                const isOwned = shopManager.skinsData.unlocked.includes(s.id);
                const isActive = shopManager.skinsData.active === s.id;

                const card = document.createElement('div');
                card.className = `shop-item-card ${isActive ? 'active-skin-card' : ''}`;
                card.innerHTML = `
                    <div class="shop-item-icon">${s.icon}</div>
                    <div class="shop-item-info">
                        <div class="shop-item-name">${s.name} ${isActive ? '✅ (Dipakai)' : ''}</div>
                        <div class="shop-item-desc">${s.desc}</div>
                        <div class="shop-item-meta">
                            <span class="shop-item-price">${isOwned ? 'Milik Anda' : `🪙 ${s.price.toLocaleString('id-ID')}`}</span>
                        </div>
                    </div>
                    <button class="btn-action ${isActive ? 'btn-dark' : 'btn-cyan'} btn-skin-action">
                        ${isActive ? 'DIPAKAI' : (isOwned ? 'PAKAI' : 'BELI & PAKAI')}
                    </button>
                `;

                const btn = card.querySelector('.btn-skin-action');
                if (!isActive) {
                    btn.addEventListener('click', () => {
                        if (isOwned) {
                            shopManager.equipSkin(s.id);
                            this.player.applySkin(s);
                            runnerAudio.playBoost();
                            this.renderShopUI();
                        } else {
                            const res = shopManager.buySkin(s.id);
                            if (res.success) {
                                this.player.applySkin(s);
                                runnerAudio.playVictory();
                                this.renderShopUI();
                            } else {
                                alert(res.msg);
                            }
                        }
                    });
                }
                sContainer.appendChild(card);
            });
        }
    }

    hideLeaderboard() {
        document.getElementById('modal-leaderboard')?.classList.add('hidden');
    }

    togglePause() {
        if (!this.isPlaying) return;
        this.isPaused = !this.isPaused;
        const modal = document.getElementById('modal-pause');
        if (this.isPaused) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }

    showMenu() {
        this.isPlaying = false;
        this.renderLevelGrid();
        document.getElementById('modal-menu')?.classList.remove('hidden');
    }

    hideModals() {
        document.getElementById('modal-menu')?.classList.add('hidden');
        document.getElementById('modal-pause')?.classList.add('hidden');
        document.getElementById('modal-result')?.classList.add('hidden');
        document.getElementById('modal-leaderboard')?.classList.add('hidden');
        document.getElementById('modal-shop')?.classList.add('hidden');
    }

    updateHUD() {
        // Badge Jenjang & Level
        const badgeEl = document.getElementById('hud-badge');
        if (badgeEl) {
            const conf = GRADE_CONFIG[this.currentGrade];
            badgeEl.textContent = `${conf.badge} • LEVEL ${this.currentLevel} • SOAL ${Math.min(this.currentQuestionIndex, this.totalQuestionsPerLevel)}/${this.totalQuestionsPerLevel}`;
            badgeEl.style.borderColor = conf.color;
            badgeEl.style.color = conf.color;
        }

        // Teks Soal Aktif
        const qEl = document.getElementById('hud-question');
        if (qEl && this.activeQuestionData) {
            qEl.textContent = this.activeQuestionData.question;
        }

        // Nyawa (Hearts)
        const livesEl = document.getElementById('hud-lives');
        if (livesEl) {
            livesEl.innerHTML = '❤️'.repeat(Math.max(0, this.lives)) + '🖤'.repeat(Math.max(0, this.maxLives - this.lives));
        }

        // Skor & Target
        const scoreEl = document.getElementById('hud-score');
        const targetEl = document.getElementById('hud-target');
        if (scoreEl) scoreEl.textContent = this.score.toLocaleString('id-ID');
        if (targetEl) targetEl.textContent = this.targetScore.toLocaleString('id-ID');

        // Progress Bar Target Skor
        const barEl = document.getElementById('hud-target-bar');
        if (barEl) {
            const pct = Math.min(100, Math.round((this.score / this.targetScore) * 100));
            barEl.style.width = `${pct}%`;
        }

        // Combo Multiplier
        const comboEl = document.getElementById('hud-combo');
        if (comboEl) {
            comboEl.textContent = `${this.combo}x`;
            comboEl.style.display = this.combo > 1 ? 'inline-block' : 'none';
        }

        // Saldo Koin HUD
        const coinEl = document.getElementById('hud-coins');
        if (coinEl) {
            coinEl.textContent = shopManager.coins.toLocaleString('id-ID');
        }

        // Stok Power-up di Tombol HUD
        const cntShield = document.getElementById('stock-shield');
        if (cntShield) cntShield.textContent = shopManager.inventory.shield || 0;
        const cntHeart = document.getElementById('stock-heart');
        if (cntHeart) cntHeart.textContent = shopManager.inventory.heart || 0;
        const cntMagnet = document.getElementById('stock-magnet');
        if (cntMagnet) cntMagnet.textContent = shopManager.inventory.magnet || 0;
        const cntNitro = document.getElementById('stock-nitro');
        if (cntNitro) cntNitro.textContent = shopManager.inventory.nitro || 0;
    }

    triggerScreenFlash() {
        const overlay = document.getElementById('flash-overlay');
        if (overlay) {
            overlay.classList.add('active');
            setTimeout(() => overlay.classList.remove('active'), 250);
        }
    }

    showFloatingText(text, color = '#ffffff') {
        const popup = document.getElementById('hud-popup');
        if (popup) {
            popup.textContent = text;
            popup.style.color = color;
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 900);
        }
    }

    // --- 6. ANIMATION FRAME (RENDER LOOP) ---
    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = Math.min(this.clock.getDelta(), 0.1);

        if (this.isPlaying && !this.isPaused) {
            // Power-Up Timers Countdown
            if (this.magnetTimer > 0) {
                this.magnetTimer -= delta;
            }
            if (this.nitroTimer > 0) {
                this.nitroTimer -= delta;
            }

            // Nitro Boost Handling
            let speed = this.baseSpeed;
            let isBoosted = false;
            if (this.boostTimer > 0 || this.nitroTimer > 0) {
                if (this.boostTimer > 0) this.boostTimer -= delta;
                speed = this.baseSpeed * (this.nitroTimer > 0 ? 1.5 : 1.35);
                isBoosted = true;
            }
            this.currentSpeed = speed;

            // Dynamic Camera FOV saat Nitro Boost
            const targetFOV = isBoosted ? 68 : 60;
            this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFOV, delta * 8);
            this.camera.updateProjectionMatrix();

            // Update Player
            this.player.update(delta, this.currentSpeed, isBoosted);

            // Update World, Gerbang, Rintangan & Koin
            this.world.update(
                delta,
                this.currentSpeed,
                this.player,
                (isCorrect, val, gSet) => this.handleMathResult(isCorrect, val, gSet),
                () => this.handleHitObstacle(),
                () => this.handleCollectCoin(),
                this.magnetTimer > 0
            );

            // Kamera sedikit bergoyang mengikuti ayunan lari
            this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.player.mesh.position.x * 0.45, delta * 12);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Inisialisasi saat window dimuat
window.addEventListener('DOMContentLoaded', () => {
    window.game = new RunnerGame();
    window.game.animate();
});
