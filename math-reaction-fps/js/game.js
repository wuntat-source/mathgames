import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { soundFX } from './audio.js';
import { MathGenerator } from './math-generator.js';
import { TargetManager } from './target-manager.js';
import { WEAPONS_DATABASE } from './weapons-data.js';
import { WeaponModelBuilder } from './weapon-model-builder.js';
import { ENVIRONMENTS_DATABASE } from './environments-data.js';
import { LevelManager } from './levels-data.js';

export class MathReactionGame {
    constructor() {
        this.container = document.getElementById('game-container');
        this.clock = new THREE.Clock();

        // Level & Grade Progression System
        this.levelMgr = new LevelManager();
        this.selectedGrade = 'sd';
        this.currentLevel = 1;
        this.targetScore = 3500;
        this.isPlaying = false;
        this.isCountingDown = false;
        this.roundCount = 10;
        this.currentRound = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.totalShots = 0;
        this.correctHits = 0;
        this.reactionTimes = [];
        this.questionStartTime = 0;
        this.questionDuration = 9; // Detik per soal
        this.questionTimer = 0;
        this.currentQuestionData = null;

        // Weapon System
        this.weaponsList = WEAPONS_DATABASE;
        this.currentWeaponIndex = 0;
        this.currentWeapon = this.weaponsList[0];
        this.modelBuilder = new WeaponModelBuilder();
        this.isZoomed = false;
        this.defaultFOV = 75;

        // Environment / Background System
        this.envList = ENVIRONMENTS_DATABASE;
        this.currentEnv = this.envList[0]; // Default: Kota
        this.textureLoader = new THREE.TextureLoader();

        // Inisialisasi Modul
        this.mathGen = new MathGenerator();

        this.initThree();
        this.initEnvironment();
        this.initWeapon();
        this.initTargetManager();
        this.initEvents();

        // Render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initThree() {
        // Scene & Fog bernuansa cerah (Daylight Outdoor Shooting Range)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x99d9ea); // Langit biru cerah
        this.scene.fog = new THREE.Fog(0x99d9ea, 25, 75);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.7, 0); // Ketinggian mata pemain (1.7m)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.35;
        this.container.appendChild(this.renderer.domElement);

        // PointerLockControls
        this.controls = new PointerLockControls(this.camera, document.body);

        // Raycaster untuk shooting
        this.raycaster = new THREE.Raycaster();
        this.centerPoint = new THREE.Vector2(0, 0); // Pusat layar/crosshair
    }

    // Generator kanvas tekstur tanah prosedural sesuai tema arena
    generateProceduralGroundTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (type === 'sand') {
            // Tekstur Padang Pasir (Dunes & Grain)
            const grad = ctx.createLinearGradient(0, 0, 512, 512);
            grad.addColorStop(0, '#dfae63');
            grad.addColorStop(0.5, '#c9964b');
            grad.addColorStop(1, '#b68037');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 512);

            // Lapisan riak pasir halus (sand ripples)
            for (let y = 0; y < 512; y += 12) {
                ctx.strokeStyle = (y % 24 === 0) ? 'rgba(245, 215, 145, 0.4)' : 'rgba(145, 95, 35, 0.25)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x <= 512; x += 40) {
                    const waveY = y + Math.sin(x * 0.05) * 4;
                    ctx.lineTo(x, waveY);
                }
                ctx.stroke();
            }

            // Butiran pasir
            for (let i = 0; i < 5000; i++) {
                const rx = Math.random() * 512;
                const ry = Math.random() * 512;
                const alpha = Math.random() * 0.25;
                ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 240, 200, ${alpha})` : `rgba(120, 75, 20, ${alpha})`;
                ctx.fillRect(rx, ry, 2, 2);
            }
        } else if (type === 'grass') {
            // Tekstur Padang Rumput (Lush Green Meadow)
            const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 360);
            grad.addColorStop(0, '#4b8332');
            grad.addColorStop(0.6, '#3a6c25');
            grad.addColorStop(1, '#2c531c');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 512);

            // Serat bilah rumput
            for (let i = 0; i < 7000; i++) {
                const rx = Math.random() * 512;
                const ry = Math.random() * 512;
                const len = 3 + Math.random() * 6;
                const shade = Math.random() > 0.4 ? 'rgba(95, 175, 60, 0.35)' : 'rgba(25, 65, 15, 0.3)';
                ctx.strokeStyle = shade;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx + (Math.random() - 0.5) * 4, ry - len);
                ctx.stroke();
            }
        } else {
            // Tekstur Aspal / Paving Perkotaan (Urban City Asphalt)
            ctx.fillStyle = '#2d333b';
            ctx.fillRect(0, 0, 512, 512);

            // Bintik agregat aspal
            for (let i = 0; i < 6000; i++) {
                const rx = Math.random() * 512;
                const ry = Math.random() * 512;
                const shade = Math.random() > 0.5 ? 'rgba(200, 215, 230, 0.15)' : 'rgba(15, 20, 25, 0.35)';
                ctx.fillStyle = shade;
                ctx.fillRect(rx, ry, Math.random() * 2.5, Math.random() * 2.5);
            }

            // Grid ubin trotoar/beton halus
            ctx.strokeStyle = 'rgba(70, 85, 105, 0.4)';
            ctx.lineWidth = 2;
            for (let c = 0; c <= 512; c += 64) {
                ctx.beginPath();
                ctx.moveTo(c, 0); ctx.lineTo(c, 512);
                ctx.moveTo(0, c); ctx.lineTo(512, c);
                ctx.stroke();
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(16, 16);
        return texture;
    }

    initEnvironment() {
        // Pencahayaan cerah merata (HemisphereLight + Directional Sunlight)
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xb0d4e8, 1.8);
        this.scene.add(this.hemiLight);

        // Matahari utama dengan bayangan lembut
        this.sunLight = new THREE.DirectionalLight(0xfffdf5, 3.5);
        this.sunLight.position.set(15, 30, 10);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 80;
        this.sunLight.shadow.camera.left = -30;
        this.sunLight.shadow.camera.right = 30;
        this.sunLight.shadow.camera.top = 30;
        this.sunLight.shadow.camera.bottom = -30;
        this.sunLight.shadow.bias = -0.0001;
        this.scene.add(this.sunLight);

        // Cahaya pengisi (Fill Light) agar sisi kiri & kanan tetap jelas
        this.fillLight = new THREE.DirectionalLight(0xd0e8ff, 1.2);
        this.fillLight.position.set(-20, 18, -10);
        this.scene.add(this.fillLight);

        // 1. Panoramic 360 Sky Dome Bola Raksasa
        // Membungkus seluruh pemain (depan, belakang, kiri, kanan, atas) tanpa billboard terputus
        const domeGeo = new THREE.SphereGeometry(180, 48, 32);
        this.skyDomeMat = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            depthWrite: false
        });
        this.skyDome = new THREE.Mesh(domeGeo, this.skyDomeMat);
        this.skyDome.position.set(0, 15, 0);
        this.scene.add(this.skyDome);

        // 2. Lantai Utama Luas Menyesuaikan Lokasi (360 Derajat menyatu ke cakrawala)
        const floorGeo = new THREE.PlaneGeometry(240, 240);
        this.floorMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.8,
            metalness: 0.1
        });
        this.floorMesh = new THREE.Mesh(floorGeo, this.floorMat);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.set(0, 0, -20);
        this.floorMesh.receiveShadow = true;
        this.scene.add(this.floorMesh);

        // Grid jalur tembak tengah (subtle tactical guide)
        this.laneGrid = new THREE.GridHelper(30, 30, 0x0284c7, 0x334155);
        this.laneGrid.position.set(0, 0.02, -15);
        this.scene.add(this.laneGrid);

        // 3. Platform Panggung / Shooting Booth Tempat Pemain Berdiri
        const platformGeo = new THREE.BoxGeometry(10, 0.15, 6);
        this.platformMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.4,
            metalness: 0.3
        });
        this.platform = new THREE.Mesh(platformGeo, this.platformMat);
        this.platform.position.set(0, 0.075, 0);
        this.platform.receiveShadow = true;
        this.scene.add(this.platform);

        // Garis batas keselamatan booth (Safety boundary neon strip)
        const edgeGeo = new THREE.BoxGeometry(10.2, 0.05, 0.15);
        const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
        const edgeStrip = new THREE.Mesh(edgeGeo, edgeMat);
        edgeStrip.position.set(0, 0.16, -2.95);
        this.scene.add(edgeStrip);

        // 4. Meja Booth Tembak di depan pemain
        const counterGeo = new THREE.BoxGeometry(4.5, 1.1, 0.8);
        this.counterMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.4,
            roughness: 0.4
        });
        const counter = new THREE.Mesh(counterGeo, this.counterMat);
        counter.position.set(0, 0.55, -1.2);
        counter.castShadow = true;
        counter.receiveShadow = true;
        this.scene.add(counter);

        // Neon strip pada meja tembak
        const counterLightGeo = new THREE.BoxGeometry(4.4, 0.04, 0.04);
        const counterLightMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
        const counterLight = new THREE.Mesh(counterLightGeo, counterLightMat);
        counterLight.position.set(0, 1.08, -0.81);
        this.scene.add(counterLight);

        // 5. Pembatas / Pilar Tembak Kiri dan Kanan (Shooting Lane Dividers)
        const dividerGeo = new THREE.BoxGeometry(0.2, 1.3, 3);
        const dividerMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.5,
            metalness: 0.2
        });
        const leftDivider = new THREE.Mesh(dividerGeo, dividerMat);
        leftDivider.position.set(-2.4, 0.65, -1.0);
        this.scene.add(leftDivider);

        const rightDivider = new THREE.Mesh(dividerGeo, dividerMat);
        rightDivider.position.set(2.4, 0.65, -1.0);
        this.scene.add(rightDivider);

        // Terapkan latar belakang awal
        this.applyEnvironment(this.currentEnv.id);
    }

    applyEnvironment(envId) {
        const found = this.envList.find(e => e.id === envId);
        if (!found) return;

        this.currentEnv = found;

        // Muat tekstur 360 panorama dari gambar pilihan pengguna
        this.textureLoader.load(found.image, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            // 2 perputaran horizontal membentang 360 derajat di sekeliling pemain
            tex.repeat.set(2, 1);

            if (this.skyDomeMat) {
                this.skyDomeMat.map = tex;
                this.skyDomeMat.needsUpdate = true;
            }
        });

        // Terapkan tekstur tanah prosedural sesuai tipe arena (asphalt, sand, grass)
        const groundTex = this.generateProceduralGroundTexture(found.floorType || 'asphalt');
        if (this.floorMat) {
            this.floorMat.map = groundTex;
            this.floorMat.color.setHex(found.colors.floor);
            if (found.colors.floorEmissive) {
                this.floorMat.emissive.setHex(found.colors.floorEmissive);
            }
            this.floorMat.needsUpdate = true;
        }

        // Sesuaikan pencahayaan matahari, langit, dan kabut (Fog)
        if (this.sunLight) {
            this.sunLight.color.setHex(found.colors.sunLight);
            this.sunLight.intensity = found.colors.sunIntensity;
        }
        if (this.hemiLight) {
            this.hemiLight.color.setHex(found.colors.hemiSky);
            this.hemiLight.groundColor.setHex(found.colors.hemiGround);
        }
        if (this.scene && this.scene.fog) {
            this.scene.fog.color.setHex(found.colors.fog);
            this.scene.fog.near = found.colors.fogNear || 45;
            this.scene.fog.far = found.colors.fogFar || 140;
        }
        if (this.scene) {
            this.scene.background.setHex(found.colors.sky);
        }

        // Tampilkan notifikasi pergantian arena
        this.showEnvironmentNotification(found.name);
    }

    showEnvironmentNotification(name) {
        const el = document.getElementById('weapon-switch-popup');
        if (el) {
            el.innerText = `ARENA: ${name.toUpperCase()}`;
            el.className = 'show';
            setTimeout(() => el.className = '', 1000);
        }
    }

    initWeapon() {
        this.weaponDefaultPos = new THREE.Vector3(0.24, -0.22, -0.52);
        this.recoilOffset = 0;
        this.recoilRot = 0;
        this.equipWeapon(this.currentWeapon.id);
    }

    equipWeapon(weaponId) {
        const found = this.weaponsList.find(w => w.id === weaponId);
        if (!found) return;

        this.currentWeapon = found;
        this.currentWeaponIndex = this.weaponsList.indexOf(found);

        // Hapus model senjata lama jika ada
        if (this.weaponGroup) {
            this.camera.remove(this.weaponGroup);
        }

        // Bangun model 3D baru sesuai kategori
        this.weaponGroup = this.modelBuilder.buildWeapon(this.currentWeapon);

        // Posisi default viewmodel
        if (this.currentWeapon.category === 'sniper') {
            this.weaponDefaultPos.set(0.25, -0.24, -0.62);
        } else if (this.currentWeapon.category === 'crossbow') {
            this.weaponDefaultPos.set(0.22, -0.20, -0.55);
        } else if (this.currentWeapon.category === 'shotgun') {
            this.weaponDefaultPos.set(0.24, -0.23, -0.58);
        } else {
            this.weaponDefaultPos.set(0.24, -0.22, -0.52);
        }

        this.weaponGroup.position.copy(this.weaponDefaultPos);
        this.camera.add(this.weaponGroup);

        this.muzzleFlashMesh = this.weaponGroup.userData.flashMesh;
        this.muzzleLight = this.weaponGroup.userData.flashLight;

        // Update tampilan HUD
        this.updateWeaponHUD();
        this.showWeaponNotification(this.currentWeapon.name);
    }

    updateWeaponHUD() {
        const nameEl = document.getElementById('hud-weapon-name');
        if (nameEl) nameEl.innerText = this.currentWeapon.name;

        const catEl = document.getElementById('hud-weapon-category');
        if (catEl) catEl.innerText = `${this.currentWeapon.category.toUpperCase()} • ${this.currentWeapon.specs.caliber}`;

        const imgEl = document.getElementById('hud-weapon-img');
        if (imgEl) imgEl.src = this.currentWeapon.image;
    }

    showWeaponNotification(name) {
        const el = document.getElementById('weapon-switch-popup');
        if (el) {
            el.innerText = `SENJATA: ${name.toUpperCase()}`;
            el.className = 'show';
            setTimeout(() => el.className = '', 900);
        }
    }

    toggleZoom(force) {
        if (typeof force === 'boolean') {
            this.isZoomed = force;
        } else {
            this.isZoomed = !this.isZoomed;
        }

        const scopeOverlay = document.getElementById('sniper-scope-overlay');
        const targetFOV = this.isZoomed
            ? (this.currentWeapon.gameplay.hasScope ? 25 : 45)
            : this.defaultFOV;

        this.targetFOV = targetFOV;

        if (scopeOverlay) {
            if (this.isZoomed && this.currentWeapon.gameplay.hasScope) {
                scopeOverlay.classList.remove('hidden');
            } else {
                scopeOverlay.classList.add('hidden');
            }
        }
    }

    initTargetManager() {
        this.targetMgr = new TargetManager(this.scene);
    }

    initEvents() {
        // Resize window
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Klik Mouse: Klik kiri menembak, Klik kanan Zoom / Scope
        window.addEventListener('mousedown', (e) => {
            if (!this.controls.isLocked) return;

            if (e.button === 0) {
                this.shoot();
            } else if (e.button === 2) {
                this.toggleZoom(true);
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 2) {
                this.toggleZoom(false);
            }
        });

        // Cegah klik kanan membuka context menu browser
        window.addEventListener('contextmenu', (e) => e.preventDefault());

        // Tombol Angka 1-9 untuk Ganti Senjata Cepat
        window.addEventListener('keydown', (e) => {
            if (e.code.startsWith('Digit')) {
                const num = parseInt(e.code.replace('Digit', ''), 10);
                if (num >= 1 && num <= this.weaponsList.length) {
                    this.equipWeapon(this.weaponsList[num - 1].id);
                }
            }
        });

        // Pointer Lock State change
        this.controls.addEventListener('lock', () => {
            document.getElementById('pause-overlay').classList.add('hidden');
        });

        this.controls.addEventListener('unlock', () => {
            if (this.isPlaying) {
                document.getElementById('pause-overlay').classList.remove('hidden');
            }
        });

        // Tombol Resume di Pause Screen
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.controls.lock();
        });

        // Tombol Quit ke Menu Utama
        document.getElementById('btn-quit').addEventListener('click', () => {
            this.stopGame();
        });
    }

    // Mulai permainan dengan jenjang dan level tertentu (1 - 50)
    startGame(grade, level = null) {
        this.selectedGrade = grade;

        if (level !== null) {
            this.currentLevel = level;
        } else {
            // Default ke unlocked level terkini
            const prog = this.levelMgr.progress[grade.toLowerCase()];
            this.currentLevel = prog ? prog.unlockedLevel : 1;
        }

        this.targetScore = this.levelMgr.getTargetScore(this.currentLevel);
        this.questionDuration = this.levelMgr.getQuestionDuration(this.selectedGrade, this.currentLevel);

        this.isPlaying = false;
        this.isCountingDown = true;
        this.currentRound = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.totalShots = 0;
        this.correctHits = 0;
        this.reactionTimes = [];

        // Kunci kursor mouse
        this.controls.lock();

        // UI Transition
        document.getElementById('main-menu').classList.add('hidden');
        const levelModal = document.getElementById('level-modal');
        if (levelModal) levelModal.classList.add('hidden');
        document.getElementById('result-screen').classList.add('hidden');
        document.getElementById('game-hud').classList.remove('hidden');
        this.updateHUD();

        // Hitungan mundur 3, 2, 1, START!
        this.runCountdown(() => {
            this.isPlaying = true;
            this.isCountingDown = false;
            this.nextQuestion();
        });
    }

    runCountdown(onComplete) {
        const countdownEl = document.getElementById('countdown-display');
        countdownEl.classList.remove('hidden');
        let count = 3;

        const updateCount = () => {
            if (count > 0) {
                countdownEl.innerText = count;
                soundFX.playBeep(false);
                count--;
                setTimeout(updateCount, 900);
            } else {
                countdownEl.innerText = 'TEMBAK!';
                soundFX.playBeep(true);
                setTimeout(() => {
                    countdownEl.classList.add('hidden');
                    onComplete();
                }, 700);
            }
        };
        updateCount();
    }

    nextQuestion() {
        if (this.currentRound >= this.roundCount) {
            this.endGame();
            return;
        }

        this.currentRound++;
        this.currentQuestionData = this.mathGen.generate(this.selectedGrade, this.currentLevel);
        this.questionTimer = this.questionDuration;
        this.questionStartTime = performance.now();

        // Update teks soal di HUD
        const qTextEl = document.getElementById('question-text');
        qTextEl.innerText = this.currentQuestionData.question;
        document.getElementById('question-badge').innerText = `${this.selectedGrade.toUpperCase()} • LEVEL ${this.currentLevel} • SOAL ${this.currentRound} / ${this.roundCount}`;

        // Spawn target 3D dengan opsi jawaban dan level kesulitan gerak
        this.targetMgr.spawnTargets(
            this.currentQuestionData.options,
            this.currentQuestionData.correctAnswer,
            this.currentLevel
        );

        this.updateHUD();
    }

    shoot() {
        if (!this.isPlaying) return;

        // Cek jeda tembakan (Fire-rate limiter)
        const now = performance.now();
        if (this.lastShootTime && now - this.lastShootTime < this.currentWeapon.gameplay.fireRateDelay) {
            return;
        }
        this.lastShootTime = now;

        this.totalShots++;
        soundFX.playWeaponShot(this.currentWeapon.gameplay.soundType);

        // Animasi hentakan recoil senjata sesuai spesifikasi
        this.recoilOffset = this.currentWeapon.gameplay.recoilKick;
        this.recoilRot = this.currentWeapon.gameplay.recoilRot;

        // Flash moncong
        if (this.muzzleFlashMesh) this.muzzleFlashMesh.visible = true;
        if (this.muzzleLight) this.muzzleLight.intensity = 5;
        setTimeout(() => {
            if (this.muzzleFlashMesh) this.muzzleFlashMesh.visible = false;
            if (this.muzzleLight) this.muzzleLight.intensity = 0;
        }, 55);

        // Raycasting ke arah crosshair
        this.raycaster.setFromCamera(this.centerPoint, this.camera);
        const interactables = this.targetMgr.getInteractableMeshes();
        const intersects = this.raycaster.intersectObjects(interactables, false);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const data = hitMesh.userData;

            if (data && !data.isHit) {
                if (data.isCorrect) {
                    this.handleCorrectHit(data, intersects[0].point);
                } else {
                    this.handleWrongHit(data);
                }
            }
        } else {
            // Meleset tidak mengenai target apapun
            this.triggerHitmarker(false);
        }

        this.updateHUD();
    }

    handleCorrectHit(data, hitPoint) {
        data.isHit = true;
        this.correctHits++;

        // Hitung waktu reaksi dalam milidetik
        const reactionMs = Math.round(performance.now() - this.questionStartTime);
        this.reactionTimes.push(reactionMs);

        // Suara & partikel
        soundFX.playHit();
        soundFX.playCorrect();
        this.targetMgr.explodeTarget(hitPoint, true);

        // Hitmarker hijau
        this.triggerHitmarker(true);

        // Tampilkan indikator waktu reaksi popup
        this.showReactionFeedback(reactionMs);

        // Poin & Combo
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        // Rumus Skor: 1000 base + sisa waktu bonus + multiplier combo
        const speedBonus = Math.round((this.questionTimer / this.questionDuration) * 500);
        const comboMultiplier = Math.min(this.combo, 5);
        const earnedScore = (1000 + speedBonus) * comboMultiplier;
        this.score += earnedScore;

        // Lanjut ke soal berikutnya setelah jeda singkat
        setTimeout(() => {
            if (this.isPlaying) {
                this.nextQuestion();
            }
        }, 500);
    }

    handleWrongHit(data) {
        soundFX.playHit();
        soundFX.playWrong();
        this.triggerHitmarker(false);

        // Efek goyang dan merah pada target
        const targetObj = this.targetMgr.targets.find(t => t.disc === data.disc);
        if (targetObj) {
            this.targetMgr.shakeWrongTarget(targetObj);
        }

        // Reset combo dan penalti
        this.combo = 0;
        this.score = Math.max(0, this.score - 250);

        // Kurangi waktu tersisa sebagai penalti
        this.questionTimer = Math.max(0.5, this.questionTimer - 1.5);
    }

    handleTimeout() {
        soundFX.playWrong();
        this.combo = 0;
        this.score = Math.max(0, this.score - 200);

        // Flash layar merah
        const overlay = document.getElementById('flash-overlay');
        overlay.classList.add('flash-red');
        setTimeout(() => overlay.classList.remove('flash-red'), 400);

        setTimeout(() => {
            if (this.isPlaying) {
                this.nextQuestion();
            }
        }, 600);
    }

    triggerHitmarker(isCorrect) {
        const hm = document.getElementById('hitmarker');
        hm.className = isCorrect ? 'hit-correct' : 'hit-wrong';
        setTimeout(() => {
            hm.className = '';
        }, 120);
    }

    showReactionFeedback(ms) {
        const el = document.getElementById('reaction-popup');
        el.innerText = `⚡ ${ms} ms`;
        el.className = 'show';
        setTimeout(() => {
            el.className = '';
        }, 800);
    }

    updateHUD() {
        document.getElementById('score-val').innerText = this.score;
        document.getElementById('combo-val').innerText = `${this.combo}x`;
        const timerPercent = (this.questionTimer / this.questionDuration) * 100;
        document.getElementById('timer-bar-fill').style.width = `${Math.max(0, timerPercent)}%`;

        // Update target progress bar di HUD jika tersedia
        const targetTextEl = document.getElementById('hud-target-score');
        if (targetTextEl) targetTextEl.innerText = `TARGET: ${this.targetScore}`;

        const targetBarEl = document.getElementById('hud-target-bar-fill');
        if (targetBarEl) {
            const pct = Math.min(100, Math.round((this.score / this.targetScore) * 100));
            targetBarEl.style.width = `${pct}%`;
            targetBarEl.style.background = this.score >= this.targetScore ? '#00ff88' : '#00e5ff';
        }
    }

    endGame() {
        this.isPlaying = false;
        this.controls.unlock();

        // Hitung statistik akhir
        const avgReaction = this.reactionTimes.length > 0
            ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
            : 0;
        const accuracy = this.totalShots > 0
            ? Math.round((this.correctHits / this.totalShots) * 100)
            : 0;

        // Catat progres ke LevelManager
        const result = this.levelMgr.recordLevelResult(this.selectedGrade, this.currentLevel, this.score);

        // Tentukan Rank (S, A, B, C)
        let rank = 'C';
        if (result.passed) {
            if (accuracy >= 85 && avgReaction <= 1500) rank = 'S';
            else if (accuracy >= 70 && avgReaction <= 2200) rank = 'A';
            else rank = 'B';
        }

        // Tampilkan layar hasil
        document.getElementById('game-hud').classList.add('hidden');
        const resScreen = document.getElementById('result-screen');
        resScreen.classList.remove('hidden');

        document.getElementById('res-rank').innerText = rank;
        document.getElementById('res-score').innerText = this.score;
        document.getElementById('res-reaction').innerText = `${avgReaction} ms`;
        document.getElementById('res-accuracy').innerText = `${accuracy}% (${this.correctHits}/${this.totalShots})`;
        document.getElementById('res-maxcombo').innerText = `${this.maxCombo}x`;

        // Pre-fill nama pemain untuk papan peringkat
        const nameInput = document.getElementById('fps-player-name-input');
        const saveBtn = document.getElementById('btn-fps-save-score');
        const saveMsg = document.getElementById('fps-save-score-msg');
        if (nameInput) {
            nameInput.value = localStorage.getItem('math_player_name') || '';
            nameInput.disabled = false;
        }
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerText = '💾 SIMPAN';
        }
        if (saveMsg) {
            saveMsg.innerText = '';
        }

        // Status Kelulusan & Naik Level
        const statusEl = document.getElementById('res-level-status');
        const btnNextLvl = document.getElementById('btn-next-level');

        if (statusEl) {
            if (result.passed) {
                const starStr = '⭐'.repeat(result.stars);
                statusEl.innerHTML = `
                    <div style="color: #00ff88; font-size: 22px; font-weight: 800; margin-bottom: 5px;">
                        🎉 SELAMAT! LEVEL ${this.currentLevel} LULUS! ${starStr}
                    </div>
                    <div style="color: #cbd5e1; font-size: 14px;">
                        Skor Anda (${this.score}) mencapai target kelulusan (${result.target}).
                        ${this.currentLevel < 50 ? 'Level berikutnya terbuka!' : '🏆 Anda telah menamatkan seluruh 50 level jenjang ini!'}
                    </div>
                `;
                if (btnNextLvl) {
                    if (this.currentLevel < 50) {
                        btnNextLvl.classList.remove('hidden');
                        btnNextLvl.innerText = `▶️ LANJUT KE LEVEL ${this.currentLevel + 1}`;
                    } else {
                        btnNextLvl.classList.add('hidden');
                    }
                }
            } else {
                const diff = result.target - this.score;
                statusEl.innerHTML = `
                    <div style="color: #ff3366; font-size: 20px; font-weight: 800; margin-bottom: 5px;">
                        ⚠️ BELUM MENCAPAI TARGET NILAI KELULUSAN
                    </div>
                    <div style="color: #cbd5e1; font-size: 14px;">
                        Target Nilai: <strong style="color: #ffd700;">${result.target}</strong> | Skor Anda: <strong>${this.score}</strong>
                        (Kurang <span style="color: #ff5555; font-weight: bold;">${diff}</span> poin untuk naik level).
                    </div>
                `;
                if (btnNextLvl) btnNextLvl.classList.add('hidden');
            }
        }
    }

    stopGame() {
        this.isPlaying = false;
        this.controls.unlock();
        this.targetMgr.clearTargets();
        document.getElementById('game-hud').classList.add('hidden');
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('result-screen').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
    }

    animate() {
        requestAnimationFrame(this.animate);

        const delta = Math.min(this.clock.getDelta(), 0.1);
        const elapsedTime = this.clock.getElapsedTime();

        // Update Timer Soal jika sedang aktif bermain
        if (this.isPlaying) {
            this.questionTimer -= delta;
            this.updateHUD();

            if (this.questionTimer <= 0) {
                this.handleTimeout();
            }
        }

        // Smooth FOV zoom transition (Zoom / Scope)
        if (this.targetFOV && Math.abs(this.camera.fov - this.targetFOV) > 0.1) {
            this.camera.fov += (this.targetFOV - this.camera.fov) * delta * 15;
            this.camera.updateProjectionMatrix();
        }

        // Animasi Senjata (Swaying lembut & pemulihan recoil sesuai recovery speed)
        const recoverySpeed = this.currentWeapon ? this.currentWeapon.gameplay.recoverySpeed : 1.5;
        if (this.recoilOffset > 0) {
            this.recoilOffset -= delta * 0.7 * recoverySpeed;
            if (this.recoilOffset < 0) this.recoilOffset = 0;
        }
        if (this.recoilRot > 0) {
            this.recoilRot -= delta * 1.8 * recoverySpeed;
            if (this.recoilRot < 0) this.recoilRot = 0;
        }

        const swayX = Math.sin(elapsedTime * 2.0) * 0.004;
        const swayY = Math.cos(elapsedTime * 4.0) * 0.003;

        if (this.weaponGroup) {
            this.weaponGroup.position.set(
                this.weaponDefaultPos.x + swayX,
                this.weaponDefaultPos.y + swayY - this.recoilOffset * 0.4,
                this.weaponDefaultPos.z + this.recoilOffset
            );
            this.weaponGroup.rotation.x = this.recoilRot;
        }

        // Update Target & Partikel
        this.targetMgr.update(delta, elapsedTime);

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}
