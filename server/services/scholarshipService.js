import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllScholarships = async () => {
    try {
        const dataPath = path.join(__dirname, '../data/scholarships.json');
        
        try {
            await fs.access(dataPath);
        } catch (error) {
            console.warn("Data file not found, returning empty array.");
            return [];
        }

        const rawData = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading scholarships data:", error);
        throw new Error("Could not retrieve scholarships data");
    }
};
