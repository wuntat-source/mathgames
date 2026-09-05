// Target Manager: Mengatur kemunculan, animasi, teks jawaban, dan efek pecahan target 3D

import * as THREE from 'three';

export class TargetManager {
    constructor(scene) {
        this.scene = scene;
        this.targets = [];
        this.particles = [];
        this.targetGroup = new THREE.Group();
        this.scene.add(this.targetGroup);

        // Geometri dan material yang di-cache untuk performa optimal
        this.initMaterialsAndGeometries();

        // 12 Posisi bervariasi di arena tembak (kiri jauh, tengah, kanan jauh, dekat dan dalam)
        this.spawnSlotsPool = [
            // Baris Depan (Dekat: z = -11 s/d -13)
            { x: -6.5, y: 1.6, z: -11.5 },
            { x: -2.2, y: 1.8, z: -12.5 },
            { x:  2.2, y: 1.7, z: -12.0 },
            { x:  6.5, y: 1.9, z: -11.5 },

            // Baris Tengah (Sedang: z = -15 s/d -18)
            { x: -7.5, y: 2.2, z: -16.0 },
            { x: -3.0, y: 2.5, z: -17.5 },
            { x:  0.0, y: 2.2, z: -16.5 },
            { x:  3.5, y: 2.4, z: -17.0 },
            { x:  7.5, y: 2.1, z: -16.0 },

            // Baris Jauh (Tantangan Jarak: z = -20 s/d -24)
            { x: -5.0, y: 2.8, z: -21.0 },
            { x:  1.5, y: 2.9, z: -22.5 },
            { x:  6.0, y: 2.7, z: -21.5 }
        ];

        this.currentLevel = 1;
    }

    setLevel(lvl) {
        this.currentLevel = lvl || 1;
    }

    initMaterialsAndGeometries() {
        // Piringan target
        this.discGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.12, 32);
        this.discGeo.rotateX(Math.PI / 2);

        // Ring neon luar
        this.ringGeo = new THREE.TorusGeometry(0.95, 0.06, 16, 32);

        // Penyangga tiang
        this.poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 4, 16);

        // Material target - Putih bersih mengkilap berdefinisi tinggi
        this.targetMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.15
        });

        this.ringMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            emissive: 0x0284c7,
            emissiveIntensity: 0.6,
            metalness: 0.3,
            roughness: 0.2
        });

        this.poleMat = new THREE.MeshStandardMaterial({
            color: 0x64748b,
            metalness: 0.8,
            roughness: 0.3
        });
    }

    // Buat sprite teks beresolusi tinggi dengan Canvas 2D yang sangat kontras dan tajam
    createTextTexture(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 512, 256);

        // Kotak badge rounded berlatar gelap kontras tinggi
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(40, 30, 432, 196, 30);
        } else {
            ctx.rect(40, 30, 432, 196);
        }
        ctx.fill();

        // Border cyan terang
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Teks jawaban angka tebal warna putih terang
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 115px "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return texture;
    }

    // Spawn 4 target di lokasi yang dinamis dan terpisah jauh
    spawnTargets(options, correctAnswer, level = 1) {
        this.clearTargets();
        this.currentLevel = level || 1;

        // Acak dari 12 pool slot posisi dan pilih 4 lokasi yang tidak saling bertumpukan
        const shuffledSlots = [...this.spawnSlotsPool].sort(() => Math.random() - 0.5);
        const chosenSlots = [];

        for (const slot of shuffledSlots) {
            if (chosenSlots.length >= options.length) break;
            // Pastikan jarak antar target minimal 3.2 unit agar tidak bertabrakan
            const tooClose = chosenSlots.some(s => {
                const dx = s.x - slot.x;
                const dz = s.z - slot.z;
                return Math.sqrt(dx * dx + dz * dz) < 3.2;
            });
            if (!tooClose) {
                chosenSlots.push(slot);
            }
        }

        // Fallback jika tidak menemukan jarak cukup
        while (chosenSlots.length < options.length) {
            chosenSlots.push(shuffledSlots[chosenSlots.length]);
        }

        // Tentukan variasi pola gerak sesuai level (makin tinggi level, target bergerak aktif)
        // Level 1-5: Gerak halus statis / bobbing
        // Level 6-20: Gerak horizontal patroli kiri-kanan
        // Level 21-35: Gerak orbit elips & naik-turun
        // Level 36-50: Gerak dinamis kombinasi dengan kecepatan lebih tinggi
        const movePatterns = ['strafe_horizontal', 'vertical_wave', 'circle_orbit', 'gentle_bob'];

        options.forEach((val, idx) => {
            const slot = chosenSlots[idx];
            // Tambahkan variasi offset acak
            const posX = slot.x + (Math.random() - 0.5) * 1.0;
            const posY = slot.y + (Math.random() - 0.5) * 0.4;
            const posZ = slot.z + (Math.random() - 0.5) * 1.5;

            // Tentukan pola gerak untuk target ini
            let pattern = 'gentle_bob';
            let speed = 1.0;
            let range = 0.8;

            if (this.currentLevel >= 6) {
                pattern = movePatterns[idx % movePatterns.length];
                // Kecepatan & radius gerak bertambah bertahap sesuai level
                const lvlFactor = Math.min(2.2, 1.0 + (this.currentLevel / 45));
                speed = (0.9 + Math.random() * 0.6) * lvlFactor;
                range = Math.min(2.2, 0.9 + (this.currentLevel / 50) * 1.2);
            }

            const targetObj = this.createSingleTarget(val, val === correctAnswer, posX, posY, posZ, pattern, speed, range);
            this.targets.push(targetObj);
            this.targetGroup.add(targetObj.root);
        });
    }

    createSingleTarget(value, isCorrect, x, y, z, movePattern = 'gentle_bob', moveSpeed = 1.0, moveRange = 1.0) {
        const root = new THREE.Group();
        root.position.set(x, -2, z); // Mulai dari bawah untuk animasi pop-up

        // Tiang penyangga (bergerak bersama target)
        const pole = new THREE.Mesh(this.poleGeo, this.poleMat);
        pole.position.set(0, -2, 0);
        pole.castShadow = true;
        root.add(pole);

        // Disc target
        const disc = new THREE.Mesh(this.discGeo, this.targetMat.clone());
        disc.castShadow = true;
        disc.receiveShadow = true;
        root.add(disc);

        // Ring neon
        const ring = new THREE.Mesh(this.ringGeo, this.ringMat.clone());
        root.add(ring);

        // Billboard sprite teks
        const texture = this.createTextTexture(String(value));
        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(1.8, 0.9, 1);
        sprite.position.set(0, 0, 0.1);
        root.add(sprite);

        // Simpan data di disc mesh untuk raycasting tembakan
        disc.userData = {
            value: value,
            isCorrect: isCorrect,
            root: root,
            ring: ring,
            disc: disc,
            isHit: false
        };

        return {
            root,
            disc,
            ring,
            targetY: y,
            baseX: x,
            baseY: y,
            baseZ: z,
            isCorrect,
            value,
            movePattern,
            moveSpeed,
            moveRange,
            movePhase: Math.random() * Math.PI * 2,
            scaleProgress: 0,
            bobOffset: Math.random() * Math.PI * 2,
            userData: disc.userData
        };
    }

    // Efek ledakan partikel saat target ditembak benar
    explodeTarget(pos, isCorrect) {
        const particleCount = isCorrect ? 35 : 15;
        const color = isCorrect ? 0x00ff88 : 0xff3344;
        const pGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
        const pMat = new THREE.MeshBasicMaterial({ color });

        for (let i = 0; i < particleCount; i++) {
            const mesh = new THREE.Mesh(pGeo, pMat);
            mesh.position.copy(pos);
            this.scene.add(mesh);

            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 9,
                Math.random() * 8 + 1,
                (Math.random() - 0.5) * 9
            );

            this.particles.push({
                mesh,
                velocity,
                rotSpeed: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
                life: 1.0
            });
        }
    }

    // Efek saat target salah ditembak (flash merah & goyang)
    shakeWrongTarget(targetObj) {
        targetObj.shakeTime = 0.4;
        if (targetObj.ring) {
            targetObj.ring.material.color.setHex(0xff0044);
            targetObj.ring.material.emissive.setHex(0xff0044);
            setTimeout(() => {
                if (targetObj.ring) {
                    targetObj.ring.material.color.setHex(0x00e5ff);
                    targetObj.ring.material.emissive.setHex(0x00e5ff);
                }
            }, 350);
        }
    }

    // Update animasi & perpindahan posisi target secara dinamis
    update(deltaTime, elapsedTime) {
        // 1. Update targets (animasi pop-up & perpindahan dinamis berpatroli)
        for (let i = this.targets.length - 1; i >= 0; i--) {
            const t = this.targets[i];

            // Animasi pop-up muncul dari bawah lantai saat pertama kali spawn
            if (t.root.position.y < t.targetY - 0.05) {
                t.root.position.y += (t.targetY - t.root.position.y) * 12 * deltaTime;
            } else {
                // Pola Gerakan Berpindah Tempat Sesuai Pola Dinamis
                const timeFactor = elapsedTime * t.moveSpeed + t.movePhase;

                if (t.movePattern === 'strafe_horizontal') {
                    // Bergerak ke kiri dan ke kanan secara dinamis
                    const offsetX = Math.sin(timeFactor) * t.moveRange;
                    const bobY = Math.cos(timeFactor * 2) * 0.08;
                    t.root.position.x = t.baseX + offsetX;
                    t.root.position.y = t.targetY + bobY;
                } else if (t.movePattern === 'vertical_wave') {
                    // Bergerak naik-turun secara bergelombang
                    const offsetY = Math.sin(timeFactor) * (t.moveRange * 0.45);
                    const swayX = Math.cos(timeFactor * 0.8) * 0.35;
                    t.root.position.x = t.baseX + swayX;
                    t.root.position.y = t.targetY + offsetY;
                } else if (t.movePattern === 'circle_orbit') {
                    // Bergerak melingkar / elips di udara
                    const orbitX = Math.sin(timeFactor) * (t.moveRange * 0.8);
                    const orbitY = Math.cos(timeFactor) * (t.moveRange * 0.35);
                    t.root.position.x = t.baseX + orbitX;
                    t.root.position.y = t.targetY + orbitY;
                } else {
                    // Gentle bobbing mengambang halus
                    const bob = Math.sin(elapsedTime * 2.2 + t.bobOffset) * 0.06;
                    t.root.position.y = t.targetY + bob;
                    t.root.position.x = t.baseX;
                }
            }

            // Animasi shake jika terkena tembakan salah
            if (t.shakeTime && t.shakeTime > 0) {
                t.shakeTime -= deltaTime;
                const shakeAmount = Math.sin(t.shakeTime * 40) * 0.25;
                t.root.position.x += shakeAmount;
            }
        }

        // 2. Update partikel pecahan
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= deltaTime * 1.8;

            p.velocity.y -= 18 * deltaTime; // Gravitasi
            p.mesh.position.addScaledVector(p.velocity, deltaTime);

            p.mesh.rotation.x += p.rotSpeed.x * deltaTime;
            p.mesh.rotation.y += p.rotSpeed.y * deltaTime;
            p.mesh.scale.setScalar(Math.max(0.01, p.life));

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                this.particles.splice(i, 1);
            }
        }
    }

    // Ambil daftar mesh target yang bisa ditembak untuk Raycaster
    getInteractableMeshes() {
        return this.targets.map(t => t.disc).filter(disc => !disc.userData.isHit);
    }

    clearTargets() {
        for (const t of this.targets) {
            this.targetGroup.remove(t.root);
        }
        this.targets = [];
    }
}
