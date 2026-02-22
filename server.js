const http = require("http");
const PORT = process.env.PORT || 3000;

let bots = [];
let running = false;

const locations = [
  "🇹🇷 تركيا", "🇸🇦 السعودية", "🇪🇬 مصر",
  "🇫🇷 فرنسا", "🇩🇪 ألمانيا",
  "🇺🇸 أمريكا", "🇯🇵 اليابان", "🇧🇷 البرازيل"
];

function generateBot() {
  return {
    id: "BOT-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    name: "Agent_" + Math.floor(Math.random() * 9999),
    location: locations[Math.floor(Math.random() * locations.length)],
    status: Math.random() > 0.3 ? "🟢 Online" : "⚫ Offline",
    time: new Date().toLocaleTimeString()
  };
}

http.createServer((req, res) => {

  const url = new URL(req.url, "http://localhost");
  const count = parseInt(url.searchParams.get("n"));

  if (url.pathname === "/generate" && count > 0) {
    for (let i = 0; i < count; i++) bots.unshift(generateBot());
    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  if (url.pathname === "/clear") {
    bots = [];
    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  if (url.pathname === "/start") running = true;
  if (url.pathname === "/stop") running = false;

  const online = bots.filter(b => b.status.includes("Online")).length;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  res.end(`
  <html lang="ar">
  <head>
    <meta charset="UTF-8">
    <title>Cyber Dashboard</title>
    <style>
      body { margin:0; font-family:Arial; background:#020617; color:#e5e7eb; }

      header {
        background:#020617;
        padding:20px;
        text-align:center;
        font-size:28px;
        border-bottom:2px solid #22c55e;
      }

      .stats {
        display:flex;
        justify-content:center;
        gap:20px;
        margin:20px;
        flex-wrap:wrap;
      }

      .card {
        background:#111827;
        padding:15px;
        border-radius:10px;
        min-width:160px;
        text-align:center;
      }

      .controls { text-align:center; margin:20px; }

      input, button {
        padding:8px;
        margin:4px;
        border-radius:6px;
        border:none;
        font-size:16px;
      }

      button { background:#22c55e; color:white; cursor:pointer; }
      .danger { background:#ef4444; }
      .blue { background:#3b82f6; }

      .bots {
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:12px;
        padding:20px;
      }

      .bot {
        background:#111827;
        padding:12px;
        border-radius:10px;
        width:260px;
      }
    </style>
  </head>

  <body>

    <header>🧠 Cyber Control Panel</header>

    <div class="stats">
      <div class="card">إجمالي<br><b>${bots.length}</b></div>
      <div class="card">Online<br><b>${online}</b></div>
      <div class="card">Offline<br><b>${bots.length - online}</b></div>
      <div class="card">الحالة<br><b>${running ? "🟢 Running" : "⏸️ Stopped"}</b></div>
    </div>

    <div class="controls">
      <form action="/generate" style="display:inline;">
        عدد:
        <input type="number" name="n" min="1" max="500" value="5">
        <button>إنشاء</button>
      </form>

      <form action="/start" style="display:inline;">
        <button class="blue">تشغيل المحاكاة</button>
      </form>

      <form action="/stop" style="display:inline;">
        <button class="danger">إيقاف</button>
      </form>

      <form action="/clear" style="display:inline;">
        <button class="danger">حذف الكل</button>
      </form>
    </div>

    <div class="bots">
      ${bots.map(b => `
        <div class="bot">
          🤖 <b>${b.name}</b><br>
          🆔 ${b.id}<br>
          🌍 ${b.location}<br>
          ${b.status}<br>
          ⏱️ ${b.time}
        </div>
      `).join("")}
    </div>

  </body>
  </html>
  `);

}).listen(PORT);
