// src/AssetLoader.ts
export class AssetLoader {
    private images: Map<string, HTMLImageElement> = new Map();
    private audio: Map<string, HTMLAudioElement> = new Map();
    private totalAssets = 0;
    private loadedAssets = 0;

    /**
     * Loads a single image.
     * @param name A unique name for the image (e.g., 'playerIdle').
     * @param src The path to the image file (e.g., './assets/images/player_idle.png').
     * @returns A Promise that resolves when the image is loaded.
     */
    loadImage(name: string, src: string): Promise<HTMLImageElement> {
        this.totalAssets++;
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.images.set(name, img);
                this.loadedAssets++;
                console.log(`Loaded image: ${name}`);
                resolve(img);
            };
            img.onerror = (e) => {
                this.loadedAssets++; // Still increment to avoid blocking, but log error
                console.error(`Failed to load image: ${src}`, e);
                reject(new Error(`Failed to load image: ${src}`));
            };
        });
    }

    /**
     * Loads a single audio file.
     * @param name A unique name for the audio (e.g., 'jumpSound').
     * @param src The path to the audio file (e.g., './assets/audio/jump_sound.mp3').
     * @returns A Promise that resolves when the audio is loaded.
     */
    loadAudio(name: string, src: string): Promise<HTMLAudioElement> {
        this.totalAssets++;
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = src;
            // Audio can be tricky; metadata loaded is often sufficient
            audio.oncanplaythrough = () => {
                this.audio.set(name, audio);
                this.loadedAssets++;
                console.log(`Loaded audio: ${name}`);
                resolve(audio);
            };
            audio.onerror = (e) => {
                this.loadedAssets++;
                console.error(`Failed to load audio: ${src}`, e);
                reject(new Error(`Failed to load audio: ${src}`));
            };
        });
    }

    /**
     * Loads multiple assets concurrently.
     * @param assetConfig An array of objects defining assets to load.
     * @returns A Promise that resolves when all assets are loaded.
     */
    async loadAll(assetConfig: { type: 'image' | 'audio', name: string, src: string }[]): Promise<void> {
        const promises: Promise<any>[] = [];
        assetConfig.forEach(asset => {
            if (asset.type === 'image') {
                promises.push(this.loadImage(asset.name, asset.src));
            } else if (asset.type === 'audio') {
                promises.push(this.loadAudio(asset.name, asset.src));
            }
        });
        await Promise.all(promises);
        console.log('All assets loaded!');
    }

    /**
     * Get a loaded image.
     * @param name The unique name of the image.
     * @returns The HTMLImageElement, or undefined if not found.
     */
    getImage(name: string): HTMLImageElement | undefined {
        return this.images.get(name);
    }

    /**
     * Get a loaded audio element.
     * @param name The unique name of the audio.
     * @returns The HTMLAudioElement, or undefined if not found.
     */
    getAudio(name: string): HTMLAudioElement | undefined {
        return this.audio.get(name);
    }

    /**
     * Get the loading progress (0-1).
     */
    get progress(): number {
        return this.totalAssets === 0 ? 1 : this.loadedAssets / this.totalAssets;
    }
}