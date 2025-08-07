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
let sliceMap = [];

fetch("perks.json")
  .then(res => res.json())
  .then(data => {
    perksData = data;
    drawWheel("knight");
    selector.addEventListener("change", () => {
      svg.innerHTML = "";
      drawWheel(selector.value);
    });
  });

function drawWheel(vocation) {
  const slices = perksData.perks;
  const angles = 360 / sliceCount;

  // Dedication
  slices.dedication.forEach((perkIndex, i) => {
    const perk = perksData.dedication[perkIndex];
    drawSlice(i, colors.dedication, `Dedication: ${perk.name}`, perk);
  });

  // Conviction
  slices.conviction[vocation].forEach((perkIndex, i) => {
    const perk = perksData.conviction[perkIndex];
    drawSlice(i, colors.conviction, `Conviction: ${perk.name}`, perk);
  });

  // Revelation
  slices.revelation[vocation].forEach((perkIndex, i) => {
    const perk = perksData.revelation[perkIndex];
    drawSlice(i, colors.revelation, `Revelation: ${perk.name}`, perk);
  });
}

function drawSlice(index, color, label, perk) {
  const angle = (360 / sliceCount) * index;
  const rad = (angle - 90) * (Math.PI / 180);
  const x = centerX + radius * Math.cos(rad);
  const y = centerY + radius * Math.sin(rad);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const a0 = angle * Math.PI / 180;
  const a1 = (angle + 360 / sliceCount) * Math.PI / 180;
  const x0 = centerX + radius * Math.cos(a0);
  const y0 = centerY + radius * Math.sin(a0);
  const x1 = centerX + radius * Math.cos(a1);
  const y1 = centerY + radius * Math.sin(a1);

  const d = `
    M ${centerX} ${centerY}
    L ${x0} ${y0}
    A ${radius} ${radius} 0 0 1 ${x1} ${y1}
    Z
  `;

  path.setAttribute("d", d);
  path.setAttribute("fill", color);
  path.setAttribute("stroke", "#111");
  path.setAttribute("stroke-width", "1");
  path.style.cursor = "pointer";

  path.addEventListener("click", () => {
    perkDetails.innerHTML = `
      <strong>${label}</strong><br><br>
      ${perk.template ? `<b>Template:</b> ${perk.template}<br>` : ""}
      ${perk.amount ? `<b>Amount:</b> ${perk.amount}<br>` : ""}
      ${perk.tiers ? `<b>Tiers:</b> <pre>${JSON.stringify(perk.tiers, null, 2)}</pre>` : ""}
      ${perk.effect ? `<b>Effect:</b> <pre>${JSON.stringify(perk.effect, null, 2)}</pre>` : ""}
    `;
  });

  svg.appendChild(path);
}
