// Weapon 3D Viewmodel Builder
// Membangun model 3D prosedural dinamis untuk Pistol, Rifle, Shotgun, Sniper, dan Crossbow

import * as THREE from 'three';

export class WeaponModelBuilder {
    constructor() {
        // Material umum senjata yang di-cache
        this.materials = {
            darkMetal: new THREE.MeshStandardMaterial({ color: 0x181e26, metalness: 0.9, roughness: 0.25 }),
            steel: new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95, roughness: 0.15 }),
            polymer: new THREE.MeshStandardMaterial({ color: 0x222a36, roughness: 0.8 }),
            wood: new THREE.MeshStandardMaterial({ color: 0x6e3b1c, roughness: 0.7 }),
            camoGreen: new THREE.MeshStandardMaterial({ color: 0x3d4a38, roughness: 0.6 }),
            neonCyan: new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
            neonGreen: new THREE.MeshBasicMaterial({ color: 0x00ff88 }),
            scopeLens: new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.75 })
        };
    }

    buildWeapon(weaponData) {
        const group = new THREE.Group();
        group.name = 'WeaponViewmodel';

        switch (weaponData.category) {
            case 'rifle':
                this.buildRifle(group, weaponData);
                break;
            case 'shotgun':
                this.buildShotgun(group, weaponData);
                break;
            case 'sniper':
                this.buildSniper(group, weaponData);
                break;
            case 'crossbow':
                this.buildCrossbow(group, weaponData);
                break;
            case 'pistol':
            default:
                this.buildPistol(group, weaponData);
                break;
        }

        // Muzzle flash mesh & light (titik moncong peluru)
        const flashGeo = new THREE.OctahedronGeometry(0.08, 0);
        const flashMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const flashMesh = new THREE.Mesh(flashGeo, flashMat);
        flashMesh.position.set(0, 0.05, -0.65);
        flashMesh.visible = false;
        group.add(flashMesh);

        const flashLight = new THREE.PointLight(0xffaa00, 0, 8);
        flashLight.position.copy(flashMesh.position);
        group.add(flashLight);

        group.userData = {
            flashMesh,
            flashLight,
            weaponData
        };

        return group;
    }

    // --- 1. MODEL PISTOL (Glock, Beretta) ---
    buildPistol(group, data) {
        const isBaretta = data.id === 'baretta';
        const slideMat = isBaretta ? this.materials.steel : this.materials.darkMetal;

        // Slide
        const slide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.42), slideMat);
        slide.position.set(0, 0.05, -0.1);
        group.add(slide);

        // Grip
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.12), this.materials.polymer);
        grip.rotation.x = -0.28;
        grip.position.set(0, -0.09, 0.05);
        group.add(grip);

        // Barrel
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 16), this.materials.steel);
        barrel.rotateX(Math.PI / 2);
        barrel.position.set(0, 0.05, -0.34);
        group.add(barrel);

        // Iron Sight (Bidik Depan & Belakang)
        const frontSight = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, 0.02), this.materials.neonGreen);
        frontSight.position.set(0, 0.11, -0.28);
        group.add(frontSight);

        const rearSight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), this.materials.neonCyan);
        rearSight.position.set(0, 0.11, 0.08);
        group.add(rearSight);
    }

    // --- 2. MODEL SENAPAN SERBU / RIFLE (AR-15, M4 Carbine, M16) ---
    buildRifle(group, data) {
        // Upper & Lower Receiver
        const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.5), this.materials.darkMetal);
        receiver.position.set(0, 0.05, -0.05);
        group.add(receiver);

        // Handguard
        const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.45), this.materials.polymer);
        handguard.position.set(0, 0.05, -0.45);
        group.add(handguard);

        // Long Barrel & Muzzle Brake
        const barrelLen = data.id === 'm16series' ? 0.45 : 0.35;
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, barrelLen, 16), this.materials.steel);
        barrel.rotateX(Math.PI / 2);
        barrel.position.set(0, 0.05, -0.7 - barrelLen / 2);
        group.add(barrel);

        // Curved Magazine (STANAG 30-round)
        const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.12), this.materials.steel);
        mag.rotation.x = 0.22;
        mag.position.set(0, -0.15, -0.15);
        group.add(mag);

        // Pistol Grip
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.1), this.materials.polymer);
        grip.rotation.x = -0.32;
        grip.position.set(0, -0.1, 0.12);
        group.add(grip);

        // Stock (Popor Belakang)
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.15, 0.35), this.materials.polymer);
        stock.position.set(0, 0.02, 0.38);
        group.add(stock);

        // Carry Handle / Tactical Sight di Atas
        const sight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.25), this.materials.darkMetal);
        sight.position.set(0, 0.15, -0.05);
        group.add(sight);

        // Garis Aksen Cyan
        const accent = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.015, 0.3), this.materials.neonCyan);
        accent.position.set(0, 0.12, -0.4);
        group.add(accent);
    }

    // --- 3. MODEL SHOTGUN (Pump-Action) ---
    buildShotgun(group, data) {
        // Receiver
        const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.45), this.materials.darkMetal);
        receiver.position.set(0, 0.05, -0.05);
        group.add(receiver);

        // 12-Gauge Thick Barrel
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.65, 16), this.materials.steel);
        barrel.rotateX(Math.PI / 2);
        barrel.position.set(0, 0.07, -0.55);
        group.add(barrel);

        // Magazine Tube di bawah laras
        const magTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.55, 16), this.materials.steel);
        magTube.rotateX(Math.PI / 2);
        magTube.position.set(0, 0.01, -0.5);
        group.add(magTube);

        // Sliding Pump Grip (Textured Forend)
        const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.25, 16), this.materials.polymer);
        pump.rotateX(Math.PI / 2);
        pump.position.set(0, 0.01, -0.45);
        group.add(pump);

        // Stock (Popor Kayu / Polimer Kokoh)
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.42), this.materials.polymer);
        stock.position.set(0, -0.02, 0.38);
        stock.rotation.x = 0.08;
        group.add(stock);

        // Front Bead Sight
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), this.materials.neonGreen);
        bead.position.set(0, 0.105, -0.85);
        group.add(bead);
    }

    // --- 4. MODEL SNIPER RIFLE (MB03A, Novritsch SSG) ---
    buildSniper(group, data) {
        const bodyMat = data.id === 'novritsch' ? this.materials.camoGreen : this.materials.polymer;

        // Bodi & Receiver Ramping
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.65), bodyMat);
        body.position.set(0, 0.04, -0.15);
        group.add(body);

        // Laras Panjang Presisi (Fluted Long Barrel)
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.85, 16), this.materials.steel);
        barrel.rotateX(Math.PI / 2);
        barrel.position.set(0, 0.06, -0.85);
        group.add(barrel);

        // Muzzle Brake besar di ujung laras
        const muzzleBrake = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.1), this.materials.steel);
        muzzleBrake.position.set(0, 0.06, -1.3);
        group.add(muzzleBrake);

        // Teropong Bidik Optik (Optical Sniper Scope)
        const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.38, 16), this.materials.steel);
        scopeTube.rotateX(Math.PI / 2);
        scopeTube.position.set(0, 0.18, -0.15);
        group.add(scopeTube);

        // Lensa Depan Teropong
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16), this.materials.scopeLens);
        lens.rotateX(Math.PI / 2);
        lens.position.set(0, 0.18, -0.34);
        group.add(lens);

        // Mount penyangga teropong
        const scopeMount1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.03), this.materials.darkMetal);
        scopeMount1.position.set(0, 0.13, -0.25);
        group.add(scopeMount1);

        const scopeMount2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.03), this.materials.darkMetal);
        scopeMount2.position.set(0, 0.13, -0.05);
        group.add(scopeMount2);

        // Bolt-Action Handle (Tuas Kokang Sniper)
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.09, 8), this.materials.steel);
        bolt.rotateZ(Math.PI / 2.5);
        bolt.position.set(0.06, 0.08, 0.05);
        group.add(bolt);

        const boltKnob = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), this.materials.darkMetal);
        boltKnob.position.set(0.11, 0.1, 0.05);
        group.add(boltKnob);

        // Popor Sniper dengan Sandaran Pipi (Cheek-rest Stock)
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.17, 0.45), bodyMat);
        stock.position.set(0, 0.01, 0.38);
        group.add(stock);

        const cheekRest = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.05, 0.18), this.materials.polymer);
        cheekRest.position.set(0, 0.11, 0.32);
        group.add(cheekRest);
    }

    // --- 5. MODEL CROSSBOW (Busur Silang Taktis) ---
    buildCrossbow(group, data) {
        // Batang Utama (Stock / Rail)
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.75), this.materials.polymer);
        stock.position.set(0, 0.02, -0.15);
        group.add(stock);

        // Sayap Busur Melintang (Limb Assembly)
        const bowWing = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.06), this.materials.steel);
        bowWing.position.set(0, 0.05, -0.55);
        group.add(bowWing);

        // Katrol Majemuk Ujung Busur (Pulleys)
        const pulleyL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), this.materials.steel);
        pulleyL.position.set(-0.42, 0.05, -0.55);
        group.add(pulleyL);

        const pulleyR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), this.materials.steel);
        pulleyR.position.set(0.42, 0.05, -0.55);
        group.add(pulleyR);

        // Anak Panah Karbon di Rel (Carbon Bolt Arrow)
        const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 12), this.materials.steel);
        arrow.rotateX(Math.PI / 2);
        arrow.position.set(0, 0.09, -0.45);
        group.add(arrow);

        // Ujung Mata Panah (Arrow Broadhead)
        const arrowTip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 4), this.materials.neonGreen);
        arrowTip.rotateX(-Math.PI / 2);
        arrowTip.position.set(0, 0.09, -0.72);
        group.add(arrowTip);

        // Tali Busur (String Line)
        const stringMat = new THREE.LineBasicMaterial({ color: 0x00e5ff });
        const stringPoints = [
            new THREE.Vector3(-0.42, 0.05, -0.55),
            new THREE.Vector3(0, 0.08, -0.2),
            new THREE.Vector3(0.42, 0.05, -0.55)
        ];
        const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
        const bowString = new THREE.Line(stringGeo, stringMat);
        group.add(bowString);

        // Grip & Popor
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.1), this.materials.polymer);
        grip.rotation.x = -0.28;
        grip.position.set(0, -0.1, 0.08);
        group.add(grip);
    }
}
