// Database Spesifikasi Senjata Lengkap
// Berdasarkan gambar dan nama senjata di folder F:\Antigravity\games1\gun

export const WEAPONS_DATABASE = [
    {
        id: 'glock40',
        name: 'Glock .40-Calibre',
        fullName: 'Glock 22 .40 S&W Semiautomatic Pistol',
        category: 'pistol',
        image: 'gun/Glock .40-calibre semiautomatic pistol..jpg',
        specs: {
            caliber: '.40 S&W (10×22mm)',
            capacity: '15 Peluru',
            muzzleVelocity: '330 m/s (1,080 ft/s)',
            effectiveRange: '50 meter',
            weight: '650 g (Unloaded)',
            fireMode: 'Semi-Otomatis (Safe Action)',
            action: 'Short Recoil, Striker-fired'
        },
        description: 'Pistol dinas standar penegak hukum dengan bodi polimer ringan dan daya hentak amunisi .40 S&W yang kuat.',
        gameplay: {
            recoilKick: 0.05,
            recoilRot: 0.12,
            recoverySpeed: 1.8,
            fireRateDelay: 150,
            soundType: 'pistol'
        }
    },
    {
        id: 'baretta',
        name: 'Beretta 92FS',
        fullName: 'Beretta 92FS / M9 9mm Semiautomatic Pistol',
        category: 'pistol',
        image: 'gun/Baretta.jpg',
        specs: {
            caliber: '9×19mm Parabellum',
            capacity: '15 Peluru',
            muzzleVelocity: '381 m/s (1,250 ft/s)',
            effectiveRange: '50 meter',
            weight: '950 g',
            fireMode: 'Semi-Otomatis (DA/SA)',
            action: 'Falling block, Short recoil'
        },
        description: 'Pistol legendaris militer dan kepolisian Italia/Amerika Serikat dengan desain open-slide khas yang minim macet.',
        gameplay: {
            recoilKick: 0.045,
            recoilRot: 0.11,
            recoverySpeed: 2.0,
            fireRateDelay: 140,
            soundType: 'pistol'
        }
    },
    {
        id: 'm4carbine',
        name: 'M4 Carbine',
        fullName: 'Colt M4 5.56mm Tactical Carbine',
        category: 'rifle',
        image: 'gun/M4Carabine.jpg',
        specs: {
            caliber: '5.56×45mm NATO',
            capacity: '30 Peluru (STANAG)',
            muzzleVelocity: '884 m/s (2,900 ft/s)',
            effectiveRange: '500 meter',
            weight: '2.88 kg',
            fireMode: 'Semi / Burst / Otomatis',
            action: 'Direct Impingement Gas-operated'
        },
        description: 'Senapan karabin serbu taktis laras 14.5 inci yang ringkas dengan popor teleskopik dan rel modular serbaguna.',
        gameplay: {
            recoilKick: 0.07,
            recoilRot: 0.15,
            recoverySpeed: 1.6,
            fireRateDelay: 110,
            soundType: 'rifle'
        }
    },
    {
        id: 'ar15',
        name: 'AR-15 Rifle',
        fullName: 'ArmaLite / Colt AR-15 Sporter Rifle',
        category: 'rifle',
        image: 'gun/AR15.jpg',
        specs: {
            caliber: '5.56×45mm NATO / .223 Remington',
            capacity: '30 Peluru',
            muzzleVelocity: '990 m/s (3,250 ft/s)',
            effectiveRange: '550 meter',
            weight: '3.1 kg',
            fireMode: 'Semi-Otomatis Presisi',
            action: 'Direct Impingement, Rotating bolt'
        },
        description: 'Platform senapan modern paling populer di dunia dengan akurasi tinggi, bobot seimbang, dan stabilitas tembakan jempolan.',
        gameplay: {
            recoilKick: 0.065,
            recoilRot: 0.14,
            recoverySpeed: 1.7,
            fireRateDelay: 120,
            soundType: 'rifle'
        }
    },
    {
        id: 'm16series',
        name: 'M16 Rifle Series',
        fullName: 'M16A2/A4 5.56mm Military Assault Rifle',
        category: 'rifle',
        image: 'gun/M16Rifleseries.jpg',
        specs: {
            caliber: '5.56×45mm NATO',
            capacity: '30 Peluru',
            muzzleVelocity: '948 m/s (3,110 ft/s)',
            effectiveRange: '600 - 800 meter',
            weight: '3.5 kg',
            fireMode: 'Semi / 3-Round Burst',
            action: 'Gas-operated, Rotating bolt'
        },
        description: 'Senapan serbu militer laras panjang 20 inci dengan jarak tembak jauh, akurasi tinggi, dan bidikan carry-handle klasik.',
        gameplay: {
            recoilKick: 0.08,
            recoilRot: 0.16,
            recoverySpeed: 1.5,
            fireRateDelay: 130,
            soundType: 'rifle'
        }
    },
    {
        id: 'shootgun',
        name: 'Pump Shotgun',
        fullName: '12-Gauge Tactical Pump-Action Shotgun',
        category: 'shotgun',
        image: 'gun/shootgun.jpg',
        specs: {
            caliber: '12 Gauge (0.729 in / 18.5mm)',
            capacity: '6 + 1 Peluru (Tubular Mag)',
            muzzleVelocity: '400 m/s (1,300 ft/s)',
            effectiveRange: '40 meter',
            weight: '3.3 kg',
            fireMode: 'Manual Slide / Pump-Action',
            action: 'Pump-action sliding forend'
        },
        description: 'Senapan gentel (shotgun) pompa taktis dengan daya hancur luar biasa dan suara kokang mekanikal yang memuaskan.',
        gameplay: {
            recoilKick: 0.15,
            recoilRot: 0.32,
            recoverySpeed: 1.0,
            fireRateDelay: 450,
            soundType: 'shotgun'
        }
    },
    {
        id: 'mb03a',
        name: 'MB03A Sniper',
        fullName: 'MB03A Tactical Bolt-Action Sniper Rifle',
        category: 'sniper',
        image: 'gun/MB03Asniper.jpg',
        specs: {
            caliber: '6mm Match Precision BB / .308 replica',
            capacity: '30 Peluru',
            muzzleVelocity: '145 m/s (480 ft/s)',
            effectiveRange: '65 meter',
            weight: '2.5 kg',
            fireMode: 'Bolt-Action Single Shot',
            action: 'Manual Spring Bolt-Action'
        },
        description: 'Senapan runduk bolt-action bergaya VSR-10 dengan rel teropong atas untuk bidikan titik jauh berpresisi tinggi.',
        gameplay: {
            recoilKick: 0.12,
            recoilRot: 0.25,
            recoverySpeed: 1.1,
            fireRateDelay: 500,
            soundType: 'sniper',
            hasScope: true
        }
    },
    {
        id: 'novritsch',
        name: 'Novritsch SSG Sniper',
        fullName: 'Novritsch SSG10 / SSG Series Precision Sniper',
        category: 'sniper',
        image: 'gun/NovritschSSG11_sniper.jpg',
        specs: {
            caliber: '6mm Competition Heavy Match',
            capacity: '28 Peluru',
            muzzleVelocity: '160 m/s (530 ft/s - 2.8 Joule)',
            effectiveRange: '85 meter',
            weight: '2.2 kg',
            fireMode: 'Manual Bolt-Action (Hair Trigger)',
            action: 'Precision CNC Steel Bolt'
        },
        description: 'Senapan sniper kompetisi rancangan Austria dengan pemicu 90° super responsif, laras fluted berbobot ringan, dan akurasi pinpoint.',
        gameplay: {
            recoilKick: 0.11,
            recoilRot: 0.22,
            recoverySpeed: 1.2,
            fireRateDelay: 420,
            soundType: 'sniper',
            hasScope: true
        }
    },
    {
        id: 'crossbow',
        name: 'Tactical Crossbow',
        fullName: 'Modern Tactical Compound Crossbow',
        category: 'crossbow',
        image: 'gun/crosbow.jpg',
        specs: {
            caliber: '20-Inch Carbon Bolts (Anak Panah)',
            capacity: '1 Anak Panah per lontaran',
            muzzleVelocity: '120 m/s (400 ft/s)',
            effectiveRange: '75 meter',
            weight: '3.4 kg',
            drawWeight: '185 lbs Draw Weight',
            action: 'Mechanical Release Compound Limb'
        },
        description: 'Senjata busur silang modern bertransmisi katrol majemuk (compound) berdaya lontar kencang, sunyi tanpa ledakan mesiu.',
        gameplay: {
            recoilKick: 0.05,
            recoilRot: 0.09,
            recoverySpeed: 1.8,
            fireRateDelay: 350,
            soundType: 'crossbow'
        }
    }
];
