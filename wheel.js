const svg = document.getElementById("wheel");
const perkDetails = document.getElementById("perk-details");
const selector = document.getElementById("vocation-selector");

const colors = {
  dedication: '#4fc3f7',
  conviction: '#81c784',
  revelation: '#f06292',
};

const centerX = 300;
const centerY = 300;
const radius = 250;
const sliceCount = 36;

let perksData = null;

fetch("perks.json")
  .then(res => res.json())
  .then(data => {
    if (!data.perks || !data.dedication || !data.conviction || !data.revelation) {
      perkDetails.innerHTML = `<span style="color:red;">❌ perks.json saknar nödvändig struktur</span>`;
      return;
    }

    perksData = data;
    drawWheel("knight");

    selector.addEventListener("change", () => {
      svg.innerHTML = "";
      drawWheel(selector.value);
    });
  })
  .catch(err => {
    perkDetails.innerHTML = `<span style="color:red;">❌ Failed to load perks.json</span>`;
    console.error(err);
  });

function drawWheel(vocation) {
  const slices = perksData.perks;
  const angles = 360 / sliceCount;

  drawSlices(slices.dedication, perksData.dedication, 'dedication');
  drawSlices(slices.conviction[vocation], perksData.conviction, 'conviction');
  drawSlices(slices.revelation[vocation], perksData.revelation, 'revelation');
}

function drawSlices(indexes, dataList, type) {
  if (!indexes) return;

  indexes.forEach((perkIndex, i) => {
    const perk = dataList[perkIndex];
    const angle = (360 / sliceCount) * (perkIndex % sliceCount);
    const a0 = (angle - 90) * Math.PI / 180;
    const a1 = (angle - 90 + 360 / sliceCount) * Math.PI / 180;

    const x0 = centerX + radius * Math.cos(a0);
    const y0 = centerY + radius * Math.sin(a0);
    const x1 = centerX + radius * Math.cos(a1);
    const y1 = centerY + radius * Math.sin(a1);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${centerX} ${centerY} L ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1} Z`;

    path.setAttribute("d", d);
    path.setAttribute("fill", colors[type]);
    path.setAttribute("stroke", "#000");
    path.setAttribute("stroke-width", "1");
    path.style.cursor = "pointer";

    path.addEventListener("click", () => {
      perkDetails.innerHTML = `
        <strong>${type.toUpperCase()}: ${perk.name}</strong><br><br>
        ${perk.template ? `<b>Template:</b> ${perk.template}<br>` : ""}
        ${perk.amount ? `<b>Amount:</b> ${perk.amount}<br>` : ""}
        ${perk.tiers ? `<b>Tiers:</b> <pre>${JSON.stringify(perk.tiers, null, 2)}</pre>` : ""}
        ${perk.effect ? `<b>Effect:</b> <pre>${JSON.stringify(perk.effect, null, 2)}</pre>` : ""}
      `;
    });

    svg.appendChild(path);
  });
}
