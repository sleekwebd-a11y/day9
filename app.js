let messages = [];

function loadData() {
  const saved = localStorage.getItem('unsent_messages');
  if (saved) messages = JSON.parse(saved);
}

function saveData() {
  localStorage.setItem('unsent_messages', JSON.stringify(messages));
}

function sendToVoid() {
  const recipient = document.getElementById('recipient').value;
  const text = document.getElementById('message').value.trim();

  if (!recipient || !text) {
    alert("Choose who it's for and write something 🔥");
    return;
  }

  const savageLevel = Math.floor(Math.random() * 10) + 1;
  const catharsis = Math.floor(Math.random() * 40) + 60;

  messages.unshift({
    date: new Date().toLocaleDateString('en-US', {month:'short', day:'numeric'}),
    recipient,
    text,
    savage: savageLevel,
    catharsis
  });

  saveData();
  document.getElementById('message').value = '';
  showToast("Sent to the void. You're free now ✨");

  renderArchive();
  renderRecap();
}

function renderArchive() {
  const container = document.getElementById('archive-list');
  container.innerHTML = '';

  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message-card rounded-3xl p-6 mb-4';
    div.innerHTML = `
      <div class="flex justify-between text-xs text-neutral-400 mb-2">
        <span>${msg.date} • ${msg.recipient}</span>
        <span class="text-rose-400">${msg.savage}/10 savage</span>
      </div>
      <p class="text-lg italic">"${msg.text}"</p>
      <p class="text-xs text-emerald-400 mt-4">Catharsis: ${msg.catharsis}%</p>
    `;
    container.appendChild(div);
  });
}

function renderRecap() {
  const container = document.getElementById('recap-stats');
  if (messages.length === 0) {
    container.innerHTML = `<p class="text-neutral-400">Log some unsent texts to see your monthly energy...</p>`;
    return;
  }

  const total = messages.length;
  const avgSavage = Math.round(messages.reduce((a,m) => a + m.savage, 0) / total);

  container.innerHTML = `
    <div class="text-center">
      <p class="text-6xl font-bold text-rose-400">${total}</p>
      <p class="text-sm text-neutral-400">texts you didn't send</p>
    </div>
    <div class="mt-8 text-center">
      <p class="text-4xl font-bold">${avgSavage}/10</p>
      <p class="text-sm text-neutral-400">average savage level</p>
    </div>
  `;
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#111;color:white;padding:14px 28px;border-radius:9999px;font-size:15px;z-index:9999;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(['compose','archive','recap'][tab]).classList.remove('hidden');
}

function init() {
  loadData();
  renderArchive();
  renderRecap();
  switchTab(0);
  console.log('%cUnsent loaded – your secrets are safe here 🔥', 'color:#e11d48; font-weight:bold');
}

window.onload = init;
