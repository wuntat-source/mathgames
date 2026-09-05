// runner-world.js - Generator Lintasan 3D, Gerbang Jawaban Matematika & Rintangan Parkour
import * as THREE from 'three';
import { LANES, LANE_WIDTH } from './runner-player.js';

export class RunnerWorld {
    constructor(scene) {
        this.scene = scene;

        // Lintasan
        this.trackSegments = [];
        this.segmentLength = 40;
        this.totalSegments = 5;

        // Koleksi Objek Aktif
        this.gateSets = []; // Kumpulan set gerbang matematika (3 portal per baris)
        this.obstacles = []; // Rintangan balok / barikade
        this.coins = []; // Koin bonus
        this.buildings = []; // Dekorasi gedung sci-fi samping lintasan

        this.initTrack();
        this.initEnvironment();
    }

    // --- 1. LINTASAN 3D (3 JALUR) ---
    initTrack() {
        const roadWidth = LANE_WIDTH * 3 + 2.0;

        for (let i = 0; i < this.totalSegments; i++) {
            const seg = this.createTrackSegment(roadWidth, this.segmentLength);
            seg.position.z = -i * this.segmentLength;
            this.scene.add(seg);
            this.trackSegments.push(seg);
        }
    }

    createTrackSegment(width, length) {
        const group = new THREE.Group();

        // Aspal / Lantai Lintasan
        const roadGeo = new THREE.PlaneGeometry(width, length);
        const roadMat = new THREE.MeshStandardMaterial({
            color: 0x24355c,
            roughness: 0.5,
            metalness: 0.4
        });
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        group.add(road);

        // Garis Pembatas Jalur (Neon Lane Dividers)
        const dividerGeo = new THREE.PlaneGeometry(0.16, length);
        const dividerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });

        // Pembatas Jalur Kiri - Tengah
        const div1 = new THREE.Mesh(dividerGeo, dividerMat);
        div1.rotation.x = -Math.PI / 2;
        div1.position.set(-LANE_WIDTH / 2, 0.01, 0);
        group.add(div1);

        // Pembatas Jalur Tengah - Kanan
        const div2 = new THREE.Mesh(dividerGeo, dividerMat);
        div2.rotation.x = -Math.PI / 2;
        div2.position.set(LANE_WIDTH / 2, 0.01, 0);
        group.add(div2);

        // Pinggiran Rel Pembatas Menyala (Side Rails)
        const railGeo = new THREE.BoxGeometry(0.3, 0.5, length);
        const railMat = new THREE.MeshStandardMaterial({
            color: 0x2a3e68,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.45
        });

        const leftRail = new THREE.Mesh(railGeo, railMat);
        leftRail.position.set(-width / 2, 0.25, 0);
        group.add(leftRail);

        const rightRail = new THREE.Mesh(railGeo, railMat);
        rightRail.position.set(width / 2, 0.25, 0);
        group.add(rightRail);

        return group;
    }

    // --- 2. DEKORASI LINGKUNGAN SCI-FI ---
    initEnvironment() {
        // Gedung pencakar langit / menara futuristik di kiri dan kanan jalan
        const buildingGeo = new THREE.BoxGeometry(8, 30, 8);
        const buildingColors = [0x2c437a, 0x334f8f, 0x413478, 0x254778];

        for (let i = 0; i < 16; i++) {
            const mat = new THREE.MeshStandardMaterial({
                color: buildingColors[i % buildingColors.length],
                roughness: 0.4,
                metalness: 0.6
            });
            const bLeft = new THREE.Mesh(buildingGeo, mat);
            const zPos = -i * 18 + 10;
            bLeft.position.set(-18 - Math.random() * 8, 15, zPos);
            this.scene.add(bLeft);
            this.buildings.push(bLeft);

            const bRight = new THREE.Mesh(buildingGeo, mat.clone());
            bRight.position.set(18 + Math.random() * 8, 15, zPos);
            this.scene.add(bRight);
            this.buildings.push(bRight);
        }
    }

    // --- 3. GERBANG JAWABAN MATEMATIKA (3 PORTAL) ---
    spawnMathGates(zDistance, questionData) {
        const gateSet = {
            z: zDistance,
            gates: [],
            correctLane: questionData.correctLane,
            passed: false,
            options: questionData.options
        };

        LANES.forEach((laneX, laneIndex) => {
            const isCorrect = (laneIndex === questionData.correctLane);
            const textValue = String(questionData.options[laneIndex]);
            const gateMesh = this.createGatePortalMesh(laneX, textValue, isCorrect);
            gateMesh.position.set(laneX, 0, zDistance);
            this.scene.add(gateMesh);

            gateSet.gates.push({
                laneIndex: laneIndex,
                mesh: gateMesh,
                isCorrect: isCorrect,
                value: textValue
            });
        });

        this.gateSets.push(gateSet);
    }

    createGatePortalMesh(laneX, textValue, isCorrect) {
        const group = new THREE.Group();

        // 1. Tiang Gapura Portal Kiri & Kanan
        const postGeo = new THREE.BoxGeometry(0.35, 4.0, 0.35);
        const postMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.8,
            roughness: 0.2
        });

        const leftPost = new THREE.Mesh(postGeo, postMat);
        leftPost.position.set(-LANE_WIDTH * 0.45, 2.0, 0);
        group.add(leftPost);

        const rightPost = new THREE.Mesh(postGeo, postMat);
        rightPost.position.set(LANE_WIDTH * 0.45, 2.0, 0);
        group.add(rightPost);

        // Balok Palang Atas Portal
        const topGeo = new THREE.BoxGeometry(LANE_WIDTH * 0.95, 0.4, 0.4);
        const topBeam = new THREE.Mesh(topGeo, postMat);
        topBeam.position.set(0, 4.0, 0);
        group.add(topBeam);

        // 2. Tirai Energi Hologram Neon (Portal Energy Field)
        const fieldGeo = new THREE.PlaneGeometry(LANE_WIDTH * 0.85, 3.8);
        const fieldMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide
        });
        const field = new THREE.Mesh(fieldGeo, fieldMat);
        field.position.set(0, 2.0, 0);
        group.add(field);

        // 3. Papan Angka Jawaban (Canvas Texture)
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Latar Belakang Kartu Angka
        ctx.fillStyle = 'rgba(26, 42, 85, 0.96)';
        ctx.roundRect(16, 16, 480, 224, 28);
        ctx.fill();

        // Border Glow
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#00f0ff';
        ctx.stroke();

        // Teks Angka Opsi Jawaban
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 96px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textValue, 256, 128);

        const texture = new THREE.CanvasTexture(canvas);
        const signGeo = new THREE.PlaneGeometry(2.4, 1.2);
        const signMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 2.4, 0.05);
        group.add(sign);

        return group;
    }

    // --- 4. RINTANGAN PARKOUR (BALOK / HURDLE) ---
    spawnObstacle(zDistance, freeLaneIndex) {
        // Pasang rintangan di salah satu jalur yang BUKAN freeLane (agar pemain selalu punya jalur aman)
        const obstacleLanes = [0, 1, 2].filter(l => l !== freeLaneIndex);
        const targetLane = obstacleLanes[Math.floor(Math.random() * obstacleLanes.length)];
        const laneX = LANES[targetLane];

        const isJumpable = Math.random() > 0.45;

        let obsMesh;
        if (isJumpable) {
            // Rintangan Rendah (Hurdle) - Bisa dilompati!
            const geo = new THREE.BoxGeometry(2.4, 0.7, 0.5);
            const mat = new THREE.MeshStandardMaterial({
                color: 0xffa500,
                emissive: 0xff5500,
                emissiveIntensity: 0.6,
                roughness: 0.3
            });
            obsMesh = new THREE.Mesh(geo, mat);
            obsMesh.position.set(laneX, 0.35, zDistance);
            obsMesh.isJumpable = true;
            obsMesh.minJumpHeight = 0.8;
        } else {
            // Rintangan Tinggi (Laser Wall) - Harus dihindari dengan ganti jalur!
            const geo = new THREE.BoxGeometry(2.2, 3.5, 0.4);
            const mat = new THREE.MeshStandardMaterial({
                color: 0xff0044,
                emissive: 0xff0022,
                emissiveIntensity: 0.8,
                roughness: 0.2
            });
            obsMesh = new THREE.Mesh(geo, mat);
            obsMesh.position.set(laneX, 1.75, zDistance);
            obsMesh.isJumpable = false;
        }

        obsMesh.castShadow = true;
        this.scene.add(obsMesh);
        this.obstacles.push({
            mesh: obsMesh,
            laneIndex: targetLane,
            isJumpable: obsMesh.isJumpable,
            minJumpHeight: obsMesh.minJumpHeight || 99
        });
    }

    // --- 5. KOIN SIBER (COLLECTIBLE BONUS) ---
    spawnCoins(zDistance, laneIndex) {
        const laneX = LANES[laneIndex];
        const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
        const coinMat = new THREE.MeshStandardMaterial({
            color: 0xffd200,
            emissive: 0xffaa00,
            emissiveIntensity: 0.7,
            metalness: 0.8,
            roughness: 0.2
        });

        for (let i = 0; i < 3; i++) {
            const coin = new THREE.Mesh(coinGeo, coinMat);
            coin.rotation.x = Math.PI / 2;
            coin.position.set(laneX, 1.2, zDistance + i * 2.8);
            this.scene.add(coin);
            this.coins.push(coin);
        }
    }

    // --- 6. UPDATE LINTASAN & PERGERAKAN OBJEK (WORLD LOOP) ---
    update(delta, gameSpeed, player, onMathResult, onHitObstacle, onCollectCoin, isMagnetActive = false) {
        const moveZ = gameSpeed * delta;

        // 1. Daur ulang segmen lintasan yang lewat di belakang kamera
        this.trackSegments.forEach(seg => {
            seg.position.z += moveZ;
            if (seg.position.z > this.segmentLength) {
                // Pindahkan ke ujung paling depan
                seg.position.z -= this.segmentLength * this.totalSegments;
            }
        });

        // 2. Pergerakan gedung samping
        this.buildings.forEach(b => {
            b.position.z += moveZ * 0.75;
            if (b.position.z > 20) {
                b.position.z -= 16 * 18;
            }
        });

        // 3. Update Koin (Rotasi, Magnet & Deteksi Pengambilan)
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.position.z += moveZ;
            coin.rotation.z += delta * 4;

            // Efek Magnet Koin: Sedot koin ke koordinat pemain
            if (isMagnetActive && coin.position.z > -28 && coin.position.z < 6) {
                coin.position.x = THREE.MathUtils.lerp(coin.position.x, player.mesh.position.x, delta * 9);
                coin.position.y = THREE.MathUtils.lerp(coin.position.y, player.mesh.position.y + 1.2, delta * 9);
            }

            // Cek tabrakan dengan pemain (Player di z = 0)
            if (Math.abs(coin.position.z) < 1.4 && Math.abs(coin.position.x - player.mesh.position.x) < 1.4) {
                // Koin terambil!
                this.scene.remove(coin);
                this.coins.splice(i, 1);
                if (onCollectCoin) onCollectCoin();
                continue;
            }

            // Hapus jika sudah jauh di belakang pemain
            if (coin.position.z > 15) {
                this.scene.remove(coin);
                this.coins.splice(i, 1);
            }
        }

        // 4. Update Rintangan Parkour (Deteksi Tabrakan)
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.mesh.position.z += moveZ;

            // Cek kontak dengan pemain
            if (Math.abs(obs.mesh.position.z) < 1.0 && Math.abs(obs.mesh.position.x - player.mesh.position.x) < 1.2) {
                if (!player.isInvulnerable) {
                    // Cek apakah pemain melompat cukup tinggi jika obstacle jumpable
                    const isJumpedOver = obs.isJumpable && (player.posY >= obs.minJumpHeight);
                    if (!isJumpedOver) {
                        // Kena tabrak rintangan!
                        if (onHitObstacle) onHitObstacle();
                    }
                }
            }

            // Hapus rintangan yang sudah lewat
            if (obs.mesh.position.z > 15) {
                this.scene.remove(obs.mesh);
                this.obstacles.splice(i, 1);
            }
        }

        // 5. Update Gerbang Matematika (3 Portal Gate)
        for (let i = this.gateSets.length - 1; i >= 0; i--) {
            const gSet = this.gateSets[i];
            gSet.z += moveZ;
            gSet.gates.forEach(g => {
                g.mesh.position.z = gSet.z;
            });

            // Cek saat melintasi garis portal pemain (z = 0)
            if (!gSet.passed && gSet.z >= -0.5 && gSet.z <= 1.5) {
                gSet.passed = true;

                // Tentukan gerbang mana yang dilewati pemain berdasarkan jalurnya
                const chosenGate = gSet.gates[player.currentLane];
                const isCorrect = chosenGate.isCorrect;

                if (onMathResult) {
                    onMathResult(isCorrect, chosenGate.value, gSet);
                }

                // Efek visual portal yang dilewati
                if (isCorrect) {
                    chosenGate.mesh.visible = false;
                }
            }

            // Hapus set gerbang yang sudah jauh di belakang
            if (gSet.z > 20) {
                gSet.gates.forEach(g => {
                    this.scene.remove(g.mesh);
                });
                this.gateSets.splice(i, 1);
            }
        }
    }

    clearWorldObjects() {
        this.gateSets.forEach(gSet => {
            gSet.gates.forEach(g => this.scene.remove(g.mesh));
        });
        this.gateSets = [];

        this.obstacles.forEach(obs => this.scene.remove(obs.mesh));
        this.obstacles = [];

        this.coins.forEach(c => this.scene.remove(c));
        this.coins = [];
    }
}
