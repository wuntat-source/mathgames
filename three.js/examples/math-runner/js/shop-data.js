// shop-data.js - Pengelola Toko Power-Up, Kustomisasi Skin & Saldo Koin
// Math Parkour Runner 3D

const COIN_KEY = 'math_runner_coins_v1';
const INVENTORY_KEY = 'math_runner_inventory_v1';
const SKIN_KEY = 'math_runner_skins_v1';

export const POWER_UPS = [
    {
        id: 'shield',
        name: 'Energy Shield 🛡️',
        desc: 'Menciptakan kubah pelindung 3D yang menahan 1x tabrakan rintangan atau salah gerbang.',
        price: 300,
        icon: '🛡️',
        type: 'consumable'
    },
    {
        id: 'heart',
        name: 'Pemulih Nyawa ❤️',
        desc: 'Menambah / memulihkan 1 nyawa (heart) yang hilang saat bertanding.',
        price: 400,
        icon: '❤️',
        type: 'consumable'
    },
    {
        id: 'magnet',
        name: 'Magnet Koin 🧲',
        desc: 'Menyedot semua koin di ketiga jalur secara otomatis selama 10 detik.',
        price: 350,
        icon: '🧲',
        type: 'consumable'
    },
    {
        id: 'nitro',
        name: 'Nitro Turbo Boost 🚀',
        desc: 'Melesat dengan kecepatan tinggi dan kebal sementara selama 5 detik.',
        price: 450,
        icon: '🚀',
        type: 'consumable'
    }
];

export const SKINS = [
    {
        id: 'default',
        name: 'Cyber Blue (Original)',
        desc: 'Armor sci-fi biru tua dengan visor neon magenta.',
        price: 0,
        icon: '🔷',
        colors: {
            body: 0x1a2639,
            chest: 0x00f0ff,
            helm: 0x0f172a,
            visor: 0xff007b,
            arms: 0x24334a,
            legs: 0x0f172a
        }
    },
    {
        id: 'gold',
        name: 'Golden Champion ⭐',
        desc: 'Armor emas mengkilap metalik untuk juara master matematika.',
        price: 800,
        icon: '🟨',
        colors: {
            body: 0xd4af37,
            chest: 0xffea00,
            helm: 0x997a15,
            visor: 0xfff066,
            arms: 0xbfa130,
            legs: 0x7c6310
        }
    },
    {
        id: 'crimson',
        name: 'Crimson Blaze 🔥',
        desc: 'Armor merah menyala dengan visor oranye berapi-api.',
        price: 1000,
        icon: '🔴',
        colors: {
            body: 0x8b0000,
            chest: 0xff3333,
            helm: 0x4a0000,
            visor: 0xff7700,
            arms: 0x991b1b,
            legs: 0x450a0a
        }
    },
    {
        id: 'emerald',
        name: 'Emerald Matrix ⚡',
        desc: 'Armor cyber hacker dengan aksen hijau neon bercahaya.',
        price: 1200,
        icon: '🟢',
        colors: {
            body: 0x064e3b,
            chest: 0x00ff88,
            helm: 0x022c22,
            visor: 0x10b981,
            arms: 0x047857,
            legs: 0x064e3b
        }
    },
    {
        id: 'amethyst',
        name: 'Amethyst Phantom 🔮',
        desc: 'Armor misterius ungu ultraviolet bertenaga kosmik.',
        price: 1500,
        icon: '🟣',
        colors: {
            body: 0x4c1d95,
            chest: 0xc084fc,
            helm: 0x2e1065,
            visor: 0xa855f7,
            arms: 0x6b21a8,
            legs: 0x3b0764
        }
    }
];

class ShopManager {
    constructor() {
        this.coins = this.loadCoins();
        this.inventory = this.loadInventory();
        this.skinsData = this.loadSkins();
    }

    loadCoins() {
        if (typeof localStorage !== 'undefined') {
            const val = localStorage.getItem(COIN_KEY);
            if (val !== null) return parseInt(val, 10) || 0;
        }
        // Beri modal awal 500 koin agar pemain langsung dapat mencoba berbelanja
        this.saveCoins(500);
        return 500;
    }

    saveCoins(amount) {
        this.coins = amount;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(COIN_KEY, this.coins.toString());
        }
    }

    addCoins(amount) {
        this.saveCoins(this.coins + amount);
        return this.coins;
    }

    loadInventory() {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(INVENTORY_KEY);
            if (raw) {
                try { return JSON.parse(raw); } catch (e) {}
            }
        }
        // Default awal: dapat 1 shield gratis sebagai uji coba
        const defaultInv = { shield: 1, heart: 0, magnet: 1, nitro: 0 };
        this.saveInventory(defaultInv);
        return defaultInv;
    }

    saveInventory(inv) {
        this.inventory = inv || this.inventory;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(this.inventory));
        }
    }

    loadSkins() {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(SKIN_KEY);
            if (raw) {
                try { return JSON.parse(raw); } catch (e) {}
            }
        }
        const defaultSkins = {
            unlocked: ['default'],
            active: 'default'
        };
        this.saveSkins(defaultSkins);
        return defaultSkins;
    }

    saveSkins(data) {
        this.skinsData = data || this.skinsData;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(SKIN_KEY, JSON.stringify(this.skinsData));
        }
    }

    buyPowerUp(powerUpId) {
        const item = POWER_UPS.find(p => p.id === powerUpId);
        if (!item) return { success: false, msg: 'Item tidak ditemukan' };

        if (this.coins < item.price) {
            return { success: false, msg: `Koin tidak cukup! Butuh ${item.price} koin.` };
        }

        this.addCoins(-item.price);
        this.inventory[powerUpId] = (this.inventory[powerUpId] || 0) + 1;
        this.saveInventory();

        return {
            success: true,
            msg: `Berhasil membeli ${item.name}!`,
            remainingCoins: this.coins,
            count: this.inventory[powerUpId]
        };
    }

    buySkin(skinId) {
        const skin = SKINS.find(s => s.id === skinId);
        if (!skin) return { success: false, msg: 'Skin tidak ditemukan' };

        if (this.skinsData.unlocked.includes(skinId)) {
            return { success: false, msg: 'Skin sudah Anda miliki!' };
        }

        if (this.coins < skin.price) {
            return { success: false, msg: `Koin tidak cukup! Butuh ${skin.price} koin.` };
        }

        this.addCoins(-skin.price);
        this.skinsData.unlocked.push(skinId);
        this.skinsData.active = skinId;
        this.saveSkins();

        return {
            success: true,
            msg: `Berhasil membeli dan memakai skin ${skin.name}!`,
            remainingCoins: this.coins
        };
    }

    equipSkin(skinId) {
        if (!this.skinsData.unlocked.includes(skinId)) {
            return { success: false, msg: 'Beli skin ini terlebih dahulu.' };
        }
        this.skinsData.active = skinId;
        this.saveSkins();
        return { success: true, activeSkin: skinId };
    }

    getActiveSkinConfig() {
        const activeId = this.skinsData.active || 'default';
        return SKINS.find(s => s.id === activeId) || SKINS[0];
    }

    usePowerUp(type) {
        if (this.inventory[type] && this.inventory[type] > 0) {
            this.inventory[type]--;
            this.saveInventory();
            return true;
        }
        return false;
    }
}

export const shopManager = new ShopManager();
