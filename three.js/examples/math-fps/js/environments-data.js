// Database Pilihan Background & Arena
// Diambil dari folder F:\Antigravity\games1\background

export const ENVIRONMENTS_DATABASE = [
    {
        id: 'kota',
        name: 'Kota Metropolitan',
        category: 'Urban City',
        image: 'background/kota.jpg',
        thumbnail: 'background/kota.jpg',
        floorType: 'asphalt',
        description: 'Arena perkotaan modern dengan panorama gedung bertingkat dan lantai beton aspal halus.',
        colors: {
            sky: 0x8ec8e5,
            floor: 0x2e3540,
            floorEmissive: 0x05080c,
            gridPrimary: 0x0284c7,
            gridSecondary: 0x334155,
            sunLight: 0xffffff,
            sunIntensity: 3.5,
            hemiSky: 0xe0f2fe,
            hemiGround: 0x334155,
            fog: 0x8ec8e5,
            fogNear: 45,
            fogFar: 140
        }
    },
    {
        id: 'padangpasir',
        name: 'Padang Pasir (Desert)',
        category: 'Desert Dunes',
        image: 'background/padangpasir1.jpg',
        thumbnail: 'background/padangpasir1.jpg',
        floorType: 'sand',
        description: 'Gurun pasir eksotis dengan bukit pasir keemasan dan pencahayaan terik matahari hangat.',
        colors: {
            sky: 0xfde047,
            floor: 0xc89852,
            floorEmissive: 0x1f1405,
            gridPrimary: 0xb47b32,
            gridSecondary: 0xd97706,
            sunLight: 0xffedd5,
            sunIntensity: 3.8,
            hemiSky: 0xfef3c7,
            hemiGround: 0xb45309,
            fog: 0xf2cb85,
            fogNear: 45,
            fogFar: 140
        }
    },
    {
        id: 'padangrumput',
        name: 'Padang Rumput (Meadow)',
        category: 'Green Meadow',
        image: 'background/padangrumput.jpg',
        thumbnail: 'background/padangrumput.jpg',
        floorType: 'grass',
        description: 'Lanskap padang rumput hijau yang asri dan luas dengan suasana alam terbuka yang menyegarkan.',
        colors: {
            sky: 0x7dd3fc,
            floor: 0x3b692b,
            floorEmissive: 0x0a1c07,
            gridPrimary: 0x22c55e,
            gridSecondary: 0x15803d,
            sunLight: 0xf0fdf4,
            sunIntensity: 3.4,
            hemiSky: 0xdcfce7,
            hemiGround: 0x166534,
            fog: 0x86efac,
            fogNear: 45,
            fogFar: 140
        }
    }
];
