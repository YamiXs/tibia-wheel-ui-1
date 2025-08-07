const container = document.getElementById("perks-container");
const filter = document.getElementById("type-filter");

fetch("perks.json")
  .then(res => res.json())
  .then(data => {
    let allPerks = [];

    // Packa alla perks i en array
    for (const type of ['dedication', 'conviction', 'revelation']) {
      if (Array.isArray(data[type])) {
        allPerks.push(...data[type].map(p => ({ ...p, type })));
      }
    }

    function render(type = 'all') {
      container.innerHTML = '';
      const visible = type === 'all' ? allPerks : allPerks.filter(p => p.type === type);
      visible.forEach(perk => {
        const div = document.createElement('div');
        div.className = 'perk';
        div.innerHTML = `
          <h3>${perk.name || '(no name)'}</h3>
          <p><strong>Type:</strong> ${perk.type}</p>
          ${perk.template ? `<p><strong>Template:</strong> ${perk.template}</p>` : ''}
          ${perk.amount ? `<p><strong>Amount:</strong> ${perk.amount}</p>` : ''}
        `;
        container.appendChild(div);
      });
    }

    render();

    filter.addEventListener('change', e => render(e.target.value));
  })
  .catch(err => {
    container.innerHTML = `<p style="color:red;">Failed to load perks.json: ${err.message}</p>`;
  });
