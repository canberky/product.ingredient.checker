import express from 'express';
import multer, { memoryStorage } from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

const client = new Anthropic();
app.use(express.json());

const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) app.use(express.static(distPath));

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const imageBase64 = req.file.buffer.toString('base64');
    const mediaType = req.file.mimetype;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(mediaType)) {
      return res.status(400).json({ error: 'Unsupported image format. Use JPEG, PNG, GIF, or WebP.' });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: `Analyze this product image and find the ingredients list. Extract all ingredients and check for:\n\n1. ALCOHOL: ethanol, wine, beer, spirits, rum, brandy, mirin, sake, liqueur, etc.\n2. PORK: pork, ham, bacon, lard, gelatin (from pork), pork fat, prosciutto, pancetta, chorizo, pepperoni, salami, etc.\n\nRespond with ONLY a valid JSON object:\n{\n  "ingredients_found": true,\n  "ingredients_list": ["ingredient1", "ingredient2"],\n  "has_alcohol": false,\n  "alcohol_ingredients": [],\n  "has_pork": false,\n  "pork_ingredients": [],\n  "notes": ""\n}\n\nIf no ingredient list is visible, set ingredients_found to false and explain in notes.` },
        ],
      }],
    });

    const content = response.content[0].text.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: 'Could not parse results. Please try again.' });
    res.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze image. Please try again.' });
  }
});

app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html');
  existsSync(indexPath) ? res.sendFile(indexPath) : res.status(404).send('Run: npm run build');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
