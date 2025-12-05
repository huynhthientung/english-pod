import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.resolve(__dirname, '../old_project/script.js');
const outputPath = path.resolve(__dirname, '../src/data/episodes.json');

console.log(`Reading from: ${scriptPath}`);

try {
    // Read file
    const content = fs.readFileSync(scriptPath, 'utf-8');

    const playlistStart = content.indexOf('new jPlayerPlaylist');
    if (playlistStart === -1) throw new Error('jPlayerPlaylist not found');

    const arrayStart = content.indexOf('[', playlistStart);
    if (arrayStart === -1) throw new Error('Array start [ not found');

    // The array ends with `], {` because there is a 3rd argument
    const arrayEnd = content.indexOf('], {', arrayStart);
    if (arrayEnd === -1) {
        // Fallback: try `]);` just in case logic was wrong but my view was right? 
        // No, the view showed `], {`.
        throw new Error('Array end "], {" not found');
    }

    let arrayStr = content.substring(arrayStart, arrayEnd + 1); // include ]



    // Use function constructor to parse the array string (it's JS object notation, not strict JSON)

    const episodes = new Function(`return ${arrayStr}`)();

    console.log(`Found ${episodes.length} episodes.`);

    // Clean up data
    const cleaned = episodes.map((ep, index) => {
        // Extract ID from mp3 url or title if possible, else use index
        // Title format: "1. Elementary - Difficult Customer"
        // matches: (\d+)\.\s+(.*)
        const titleMatch = ep.title.match(/^(\d+)\.\s+(.*)/);
        let id = index;
        let title = ep.title;
        let level = 'Unknown';

        if (titleMatch) {
            // id = parseInt(titleMatch[1]); // Keep explicit ID if good, but index is safer for array access
            title = titleMatch[2]; // "Elementary - Difficult Customer"
        }

        // Attempt to extract Level
        // "Elementary - ..."
        const levelMatch = title.match(/^([a-zA-Z\s-]+)\s-\s(.*)/);
        let cleanTitle = title;
        if (levelMatch) {
            level = levelMatch[1].trim();
            cleanTitle = levelMatch[2].trim();
        }

        // Extract archive.org ID to build transcript URL
        // mp3: "https://archive.org/download/englishpod_all/englishpod_0001pb.mp3"
        // filename: englishpod_0001pb.mp3
        // transcript file is englishpod_0001.html usually?
        // Let's deduce transcript filename from mp3 filename
        // englishpod_0001pb.mp3 -> englishpod_0001
        const mp3Url = ep.mp3;
        const filename = mp3Url.split('/').pop(); // englishpod_0001pb.mp3
        const baseId = filename.replace('pb.mp3', '').replace('.mp3', ''); // englishpod_0001

        // Valid transcript URL example: https://ia600103.us.archive.org/31/items/englishpod_all/englishpod_0001.html
        // We will save it locally as `${baseId}.html`

        return {
            id: index,
            original_title: ep.title,
            title: cleanTitle,
            level: level,
            mp3: ep.mp3,
            poster: ep.poster,
            transcript_id: baseId,
            transcript_url: `https://archive.org/download/englishpod_all/${baseId}.html`
            // Note: fetching from download/englishpod_all/ might work better or items/englishpod_all/
        };
    });

    fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2));
    console.log(`Successfully wrote ${cleaned.length} episodes to ${outputPath}`);

} catch (err) {
    console.error('Error extracting data:', err);
    process.exit(1);
}
