import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';

const urls = {
  dedication: 'https://tibia.fandom.com/wiki/Wheel_of_Destiny/Dedication_Perks',
  conviction: 'https://tibia.fandom.com/wiki/Wheel_of_Destiny/Conviction_Perks',
  revelation: 'https://tibia.fandom.com/wiki/Wheel_of_Destiny/Revelation_Perks'
};

async function fetchDedication() {
  const res = await axios.get(urls.dedication);
  const $ = cheerio.load(res.data);

  const perks = [];
  $('#mw-content-text ul').first().find('li').each((i, el) => {
    const text = $(el).text().trim();
    if (text) perks.push({ name: text });
  });
  console.log(`Dedication: found ${perks.length} list perks`);
  return perks;
}

async function fetchTablePerks(url, type) {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  const perks = [];
  $('table.wikitable').each((i, table) => {
    const headers = [];
    $(table).find('tr').each((j, row) => {
      const cells = $(row).find('th, td');
      if (j === 0) {
        headers.length = 0;
        cells.each((k, c) => headers.push($(c).text().trim()));
      } else {
        const obj = {};
        cells.each((k, c) => {
          const key = headers[k] || `col${k}`;
          obj[key] = $(c).text().trim();
        });
        if (Object.values(obj).some(v => v)) perks.push(obj);
      }
    });
  });
  console.log(`${type}: found ${perks.length} table perks`);
  return perks;
}

const main = async () => {
  console.log('⏳ Scraping in progress...');
  const dedication = await fetchDedication();
  const conviction = await fetchTablePerks(urls.conviction, 'Conviction');
  const revelation = await fetchTablePerks(urls.revelation, 'Revelation');

  const result = { dedication, conviction, revelation };
  await fs.ensureDir('./data');
  await fs.writeJSON('./data/perks.json', result, { spaces: 2 });
  console.log('🎉 Done, saved to data/perks.json');
};

main().catch(console.error);
