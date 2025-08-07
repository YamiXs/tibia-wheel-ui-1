import fs from 'fs-extra';
import yaml from 'js-yaml';

const inputPath = './data/data.yaml';
const outputPath = './data/perks.json';

const run = async () => {
  try {
    const yamlContent = await fs.readFile(inputPath, 'utf8');
    const jsonData = yaml.load(yamlContent);
    await fs.writeJSON(outputPath, jsonData, { spaces: 2 });
    console.log(`✅ Converted data.yaml → perks.json`);
  } catch (err) {
    console.error('❌ Error converting YAML:', err.message);
  }
};

run();
