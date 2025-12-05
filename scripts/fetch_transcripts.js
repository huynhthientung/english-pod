import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const episodes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/episodes.json'), 'utf-8'));


const transcriptDir = path.resolve(__dirname, '../public/transcripts');

if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

// Helper to download file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle redirect
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode} ${url}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

const BATCH_SIZE = 5;

async function fetchAll() {
    console.log(`Starting download of ${episodes.length} transcripts...`);

    // Chunk array
    for (let i = 0; i < episodes.length; i += BATCH_SIZE) {
        const batch = episodes.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (ep) => {
            const dest = path.join(transcriptDir, `${ep.transcript_id}.html`);
            if (fs.existsSync(dest)) {
                console.log(`[${ep.id}] Exists: ${ep.transcript_id}`);
                return;
            }

            // Try fetching
            try {
                // The URL in json is strictly a guess, we might need to follow redirects or try different patterns
                // url: https://archive.org/download/englishpod_all/englishpod_0001.html
                // Check if it's the stream URL or what.
                let url = ep.transcript_url;

                // We know from exploration: https://ia600103.us.archive.org/31/items/englishpod_all/englishpod_0001.html
                // The generic one is contextually safe: https://archive.org/download/englishpod_all/{filename}

                await downloadFile(url, dest);
                console.log(`[${ep.id}] Downloaded: ${ep.transcript_id}`);
            } catch (err) {
                console.error(`[${ep.id}] Failed: ${ep.transcript_id} - ${err.message}`);
            }
        }));
    }
    console.log('Done!');
}

fetchAll();
