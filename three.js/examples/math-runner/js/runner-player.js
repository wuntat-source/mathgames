// runner-player.js - Karakter Pelari 3D Sci-Fi Prosedural untuk Three.js
import * as THREE from 'three';

export const LANE_WIDTH = 3.6;
export const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // [0: Kiri, 1: Tengah, 2: Kanan]

export class RunnerPlayer {
    constructor(scene) {
        this.scene = scene;
        this.currentLane = 1; // Mulai di Jalur Tengah (Index 1)
        this.targetX = LANES[1];
        
        // Fisika Vertikal (Lompat)
        this.posY = 0;
        this.verticalVelocity = 0;
        this.gravity = 42;
        this.jumpForce = 15;
        this.isGrounded = true;

        // Status & Animasi
        this.runCycle = 0;
        this.tiltAngle = 0;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        this.mesh = null;

        // Referensi anggota tubuh untuk animasi
        this.leftArm = null;
        this.rightArm = null;
        this.leftLeg = null;
        this.rightLeg = null;
        this.head = null;
        this.jetpackGlow = null;

        this.initMesh();
    }

    initMesh() {
        this.mesh = new THREE.Group();

        // 1. Badan / Torso (Armor Sci-Fi)
        const bodyGeo = new THREE.BoxGeometry(0.9, 1.2, 0.6);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x1a2639,
            roughness: 0.3,
            metalness: 0.8
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 1.6;
        body.castShadow = true;
        this.mesh.add(body);
        this.bodyMesh = body;

        // Armor Plat Dada Bercahaya (Cyan Chest Arc)
        const chestGeo = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        const chestMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.8,
            roughness: 0.1
        });
        const chest = new THREE.Mesh(chestGeo, chestMat);
        chest.position.set(0, 1.7, 0.32);
        this.mesh.add(chest);
        this.chestMesh = chest;

        // 2. Kepala & Helm dengan Visor Neon
        const headGroup = new THREE.Group();
        headGroup.position.y = 2.5;

        const helmGeo = new THREE.BoxGeometry(0.65, 0.65, 0.7);
        const helmMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.2,
            metalness: 0.9
        });
        const helm = new THREE.Mesh(helmGeo, helmMat);
        helm.castShadow = true;
        headGroup.add(helm);
        this.helmMesh = helm;

        // Visor Cyberpunk (Kacamata Neon Glow)
        const visorGeo = new THREE.BoxGeometry(0.55, 0.22, 0.12);
        const visorMat = new THREE.MeshStandardMaterial({
            color: 0xff007b,
            emissive: 0xff007b,
            emissiveIntensity: 1.2,
            roughness: 0.1
        });
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.position.set(0, 0.05, 0.35);
        headGroup.add(visor);
        this.visorMesh = visor;

        this.head = headGroup;
        this.mesh.add(headGroup);

        // 3. Tangan Kiri & Kanan (Arm Pivots)
        const armGeo = new THREE.BoxGeometry(0.28, 0.9, 0.3);
        const armMat1 = new THREE.MeshStandardMaterial({ color: 0x24334a, roughness: 0.4, metalness: 0.7 });
        const armMat2 = new THREE.MeshStandardMaterial({ color: 0x24334a, roughness: 0.4, metalness: 0.7 });

        // Left Arm Pivot
        this.leftArm = new THREE.Group();
        this.leftArm.position.set(-0.65, 2.0, 0);
        const leftArmMesh = new THREE.Mesh(armGeo, armMat1);
        leftArmMesh.position.y = -0.45;
        leftArmMesh.castShadow = true;
        this.leftArm.add(leftArmMesh);
        this.mesh.add(this.leftArm);

        // Right Arm Pivot
        this.rightArm = new THREE.Group();
        this.rightArm.position.set(0.65, 2.0, 0);
        const rightArmMesh = new THREE.Mesh(armGeo, armMat2);
        rightArmMesh.position.y = -0.45;
        rightArmMesh.castShadow = true;
        this.rightArm.add(rightArmMesh);
        this.mesh.add(this.rightArm);
        this.armMeshes = [leftArmMesh, rightArmMesh];

        // 4. Kaki Kiri & Kanan (Leg Pivots)
        const legGeo = new THREE.BoxGeometry(0.32, 1.0, 0.35);
        const legMat1 = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.6 });
        const legMat2 = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.6 });

        // Left Leg Pivot
        this.leftLeg = new THREE.Group();
        this.leftLeg.position.set(-0.3, 1.0, 0);
        const leftLegMesh = new THREE.Mesh(legGeo, legMat1);
        leftLegMesh.position.y = -0.5;
        leftLegMesh.castShadow = true;
        this.leftLeg.add(leftLegMesh);
        this.mesh.add(this.leftLeg);

        // Right Leg Pivot
        this.rightLeg = new THREE.Group();
        this.rightLeg.position.set(0.3, 1.0, 0);
        const rightLegMesh = new THREE.Mesh(legGeo, legMat2);
        rightLegMesh.position.y = -0.5;
        rightLegMesh.castShadow = true;
        this.rightLeg.add(rightLegMesh);
        this.mesh.add(this.rightLeg);
        this.legMeshes = [leftLegMesh, rightLegMesh];

        // 5. Jetpack Pendorong di Belakang
        const jetGeo = new THREE.BoxGeometry(0.6, 0.8, 0.25);
        const jetMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.8
        });
        const jetpack = new THREE.Mesh(jetGeo, jetMat);
        jetpack.position.set(0, 1.6, -0.4);
        this.mesh.add(jetpack);

        // Nozel Pendorong Jetpack
        const nozGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.2, 8);
        const nozMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.9
        });
        const noz1 = new THREE.Mesh(nozGeo, nozMat);
        noz1.position.set(-0.18, 1.1, -0.4);
        noz1.rotation.x = Math.PI;
        const noz2 = noz1.clone();
        noz2.position.x = 0.18;
        this.mesh.add(noz1);
        this.mesh.add(noz2);
        this.jetpackGlow = [noz1, noz2];

        // 6. Kubah Pelindung Energi 3D (Energy Shield)
        const shieldGeo = new THREE.IcosahedronGeometry(1.65, 2);
        const shieldMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.35,
            wireframe: true
        });
        this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        this.shieldMesh.position.y = 1.6;
        this.shieldMesh.visible = false;
        this.mesh.add(this.shieldMesh);
        this.hasShield = false;

        // Posisi awal di z = 0
        this.mesh.position.set(this.targetX, 0, 0);
        this.scene.add(this.mesh);
    }

    moveLeft() {
        if (this.currentLane > 0) {
            this.currentLane--;
            this.targetX = LANES[this.currentLane];
            this.tiltAngle = 0.28; // Miringkan badan ke kiri
            return true;
        }
        return false;
    }

    moveRight() {
        if (this.currentLane < LANES.length - 1) {
            this.currentLane++;
            this.targetX = LANES[this.currentLane];
            this.tiltAngle = -0.28; // Miringkan badan ke kanan
            return true;
        }
        return false;
    }

    jump() {
        if (this.isGrounded) {
            this.verticalVelocity = this.jumpForce;
            this.isGrounded = false;
            return true;
        }
        return false;
    }

    triggerHurt() {
        this.isInvulnerable = true;
        this.invulnerableTimer = 1.3; // 1.3 detik kebal & berkedip
    }

    setShield(active) {
        this.hasShield = active;
        if (this.shieldMesh) {
            this.shieldMesh.visible = active;
        }
    }

    applySkin(skinConfig) {
        if (!skinConfig || !skinConfig.colors) return;
        const c = skinConfig.colors;

        if (this.bodyMesh && this.bodyMesh.material) {
            this.bodyMesh.material.color.setHex(c.body);
        }
        if (this.chestMesh && this.chestMesh.material) {
            this.chestMesh.material.color.setHex(c.chest);
            this.chestMesh.material.emissive.setHex(c.chest);
        }
        if (this.helmMesh && this.helmMesh.material) {
            this.helmMesh.material.color.setHex(c.helm);
        }
        if (this.visorMesh && this.visorMesh.material) {
            this.visorMesh.material.color.setHex(c.visor);
            this.visorMesh.material.emissive.setHex(c.visor);
        }
        if (this.armMeshes) {
            this.armMeshes.forEach(m => m.material.color.setHex(c.arms));
        }
        if (this.legMeshes) {
            this.legMeshes.forEach(m => m.material.color.setHex(c.legs));
        }
    }

    update(delta, gameSpeed, isBoosted = false) {
        // Animasi rotasi kubah shield jika aktif
        if (this.shieldMesh && this.shieldMesh.visible) {
            this.shieldMesh.rotation.y += delta * 2.2;
            this.shieldMesh.rotation.x += delta * 1.4;
        }

        // 1. Pergeseran Jalur Horizontal Halus (Smooth Lane Lerping)
        this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, this.targetX, delta * 16);

        // Kembalikan kemiringan badan ke tegak
        this.tiltAngle = THREE.MathUtils.lerp(this.tiltAngle, 0, delta * 8);
        this.mesh.rotation.z = this.tiltAngle;

        // 2. Simulasi Fisika Lompat Vertikal
        if (!this.isGrounded) {
            this.verticalVelocity -= this.gravity * delta;
            this.posY += this.verticalVelocity * delta;

            if (this.posY <= 0) {
                this.posY = 0;
                this.verticalVelocity = 0;
                this.isGrounded = true;
            }
        }
        this.mesh.position.y = this.posY;

        // 3. Animasi Gerak Anggota Tubuh (Lari & Lompat)
        if (this.isGrounded) {
            // Frekuensi lari sebanding dengan kecepatan game
            this.runCycle += delta * (gameSpeed * 0.85);

            const armSwing = Math.sin(this.runCycle) * 0.75;
            const legSwing = Math.sin(this.runCycle) * 0.85;

            this.leftArm.rotation.x = armSwing;
            this.rightArm.rotation.x = -armSwing;
            this.leftLeg.rotation.x = -legSwing;
            this.rightLeg.rotation.x = legSwing;

            // Sedikit pantulan vertikal saat melangkah
            this.mesh.position.y += Math.abs(Math.sin(this.runCycle * 2)) * 0.08;
        } else {
            // Pose di udara saat melompat
            this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, -1.2, delta * 10);
            this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, -1.2, delta * 10);
            this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0.6, delta * 10);
            this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, -0.4, delta * 10);
        }

        // 4. Efek Cahaya Jetpack Pendorong
        if (this.jetpackGlow) {
            const intensity = isBoosted ? 2.5 : 0.8;
            this.jetpackGlow.forEach(g => {
                g.material.emissiveIntensity = intensity;
                g.scale.y = isBoosted ? (1.5 + Math.random() * 0.5) : 1.0;
            });
        }

        // 5. Status Kebal & Kedip (Invulnerability Flash)
        if (this.isInvulnerable) {
            this.invulnerableTimer -= delta;
            // Berkedip transparan
            this.mesh.visible = (Math.floor(this.invulnerableTimer * 18) % 2 === 0);
            if (this.invulnerableTimer <= 0) {
                this.isInvulnerable = false;
                this.mesh.visible = true;
            }
        }
    }

    reset() {
        this.currentLane = 1;
        this.targetX = LANES[1];
        this.mesh.position.set(this.targetX, 0, 0);
        this.posY = 0;
        this.verticalVelocity = 0;
        this.isGrounded = true;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        this.mesh.visible = true;
    }
}
