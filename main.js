const container = document.getElementById("perks-container");
const filter = document.getElementById("type-filter");

fetch("perks.json")
  .then(res => res.json())
  .then(data => {
    const allPerks = [];

    for (const type of ['dedication', 'conviction', 'revelation']) {
      if (Array.isArray(data[type])) {
        data[type].forEach(p => allPerks.push({ ...p, type }));
      }
    }

    const render = (type = 'all') => {
      container.innerHTML = '';
      const filtered = type === 'all' ? allPerks : allPerks.filter(p => p.type === type);

      filtered.forEach(perk => {
        const card = document.createElement('div');
        card.className = `perk-card ${perk.type}`;

        card.innerHTML = `
          <h3>${perk.name || 'Unnamed Perk'}</h3>
          <p><strong>Type:</strong> ${perk.type}</p>
          ${perk.template ? `<p><strong>Template:</strong><br> ${perk.template}</p>` : ''}
          ${perk.amount ? `<p><strong>Amount:</strong> ${perk.amount}</p>` : ''}
          ${perk.effect ? `<p><strong>Effect:</strong> ${JSON.stringify(perk.effect)}</p>` : ''}
        `;
        container.appendChild(card);
      });
    };

    render();

    filter.addEventListener('change', e => render(e.target.value));
  })
  .catch(err => {
    container.innerHTML = `<p style="color:red;">⚠️ Failed to load perks.json</p>`;
    console.error(err);
  });
