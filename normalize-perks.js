import fs from 'fs-extra';

const inputPath = './data/perks.json';
const outputPath = './data/perks.normalized.json';

const run = async () => {
  const raw = await fs.readJSON(inputPath);
  const result = [];

  // --- Dedication ---
  for (const d of raw.dedication) {
    const [name, ...descParts] = d.name.split(':');
    result.push({
      type: 'dedication',
      name: name.trim(),
      description: descParts.join(':').trim()
    });
  }

  // --- Conviction ---
  for (const c of raw.conviction) {
    result.push({
      type: 'conviction',
      name: c.Ability,
      stages: {
        1: c['Stage 1'],
        2: c['Stage 2'],
        ...(c['Stage 3'] ? { 3: c['Stage 3'] } : {})
      }
    });
  }

  // --- Revelation ---
  for (const r of raw.revelation) {
    const [key] = Object.keys(r).filter(k => k !== 'Stage 1' && k !== 'Stage 2' && k !== 'Stage 3');
    const [name, ...descParts] = (key || '').split(':');
    const description = r[key] || '';

    result.push({
      type: 'revelation',
      name: name?.trim() || key,
      effect: description.trim(),
      stages: {
        ...(r['Stage 1'] ? { 1: r['Stage 1'] } : {}),
        ...(r['Stage 2'] ? { 2: r['Stage 2'] } : {}),
        ...(r['Stage 3'] ? { 3: r['Stage 3'] } : {})
      }
    });
  }

  await fs.writeJSON(outputPath, result, { spaces: 2 });
  console.log(`✅ Normalized data saved to: ${outputPath}`);
};

run();
