let scenes = [];
const arcTypes = [
  {name:"Glow Up", emoji:"🌟", color:"#22c55e"},
  {name:"Plot Twist", emoji:"🌀", color:"#eab308"},
  {name:"Healing Arc", emoji:"🩹", color:"#06b67f"},
  {name:"Chaos Season", emoji:"🔥", color:"#ef4444"},
  {name:"Main Character", emoji:"👑", color:"#a855f7"},
  {name:"Slow Burn", emoji:"⏳", color:"#64748b"}
];

let currentArc = arcTypes[0];

function loadData() {
  const saved = localStorage.getItem('arc_scenes');
  if (saved) scenes = JSON.parse(saved);
}

function saveData() {
  localStorage.setItem('arc_scenes', JSON.stringify(scenes));
}

function renderArcPicker() {
  const container = document.getElementById('arc-picker');
  container.innerHTML = '';
  arcTypes.forEach(arc => {
    const div = document.createElement('div');
    div.className = `arc-chip px-4 py-3 rounded-2xl text-center text-sm cursor-pointer ${arc.name === currentArc.name ? 'active' : 'bg-neutral-800'}`;
    div.innerHTML = `${arc.emoji} ${arc.name}`;
    div.onclick = () => {
      currentArc = arc;
      renderArcPicker();
    };
    container.appendChild(div);
  });
}

function saveScene() {
  const text = document.getElementById('scene-input').value.trim();
  if (!text) return;

  const today = new Date().toISOString().split('T')[0];

  scenes.unshift({
    date: today,
    episode: scenes.length + 1,
    scene: text,
    arc: currentArc
  });

  saveData();
  document.getElementById('scene-input').value = '';
  showToast("Scene logged! 🎥");
  renderArcs();
  renderRecap();
}

function renderArcs() {
  const container = document.getElementById('arc-list');
  container.innerHTML = '';
  scenes.slice(0, 8).forEach(s => {
    const div = document.createElement('div');
    div.className = 'bg-neutral-900 rounded-3xl p-5 flex gap-4';
    div.innerHTML = `
      <div class="text-4xl">${s.arc.emoji}</div>
      <div class="flex-1">
        <p class="text-xs text-neutral-400">EP ${s.episode} • ${s.date}</p>
        <p class="line-clamp-2 text-sm mt-1">${s.scene}</p>
        <p class="text-xs mt-3 text-${s.arc.color.slice(1)}">${s.arc.name}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderRecap() {
  const container = document.getElementById('recap-content');
  container.innerHTML = '';

  if (scenes.length === 0) {
    container.innerHTML = `<p class="text-neutral-400 text-center py-8">Log a few scenes to see your season recap...</p>`;
    return;
  }

  const arcCount = {};
  scenes.forEach(s => arcCount[s.arc.name] = (arcCount[s.arc.name]||0) + 1);

  let html = `<p class="text-neutral-400 text-sm">This season so far...</p>`;
  Object.keys(arcCount).forEach(arc => {
    html += `<div class="flex justify-between mt-4"><span>${arc}</span><span class="font-bold">${arcCount[arc]} episodes</span></div>`;
  });
  container.innerHTML = html;
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#111;color:white;padding:12px 24px;border-radius:9999px;font-size:14px;z-index:9999;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(['tab-today','tab-arcs','tab-recap'][tab]).classList.remove('hidden');
}

function init() {
  loadData();
  renderArcPicker();
  renderArcs();
  renderRecap();
  switchTab(0);
  console.log('%cARC loaded – your life is now a series 🎬', 'color:#ef4444; font-weight:bold');
}

window.onload = init;
