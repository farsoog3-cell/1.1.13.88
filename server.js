const http = require("http");

const PORT = process.env.PORT || 3000;

let bots = [];

const locations = [
  "🇹🇷 تركيا",
  "🇸🇦 السعودية",
  "🇪🇬 مصر",
  "🇫🇷 فرنسا",
  "🇩🇪 ألمانيا",
  "🇺🇸 أمريكا",
  "🇯🇵 اليابان",
  "🇧🇷 البرازيل"
];

function generateBot() {
  return {
    id: "BOT-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    name: "Agent_" + Math.floor(Math.random() * 9999),
    location: locations[Math.floor(Math.random() * locations.length)],
    status: Math.random() > 0.3 ? "🟢 Online" : "⚫ Offline",
    time: new Date().toLocaleString()
  };
}

const server = http.createServer((req, res) => {

  const url = new URL(req.url, "http://localhost");

  // إنشاء بوتات
  if (url.pathname === "/generate") {
    const count = parseInt(url.searchParams.get("n")) || 1;

    for (let i = 0; i < count; i++) {
      bots.unshift(generateBot());
    }

    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  // حذف الكل
  if (url.pathname === "/clear") {
    bots = [];
    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  const online = bots.filter(b => b.status.includes("Online")).length;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  res.end(`
  <!DOCTYPE html>
  <html lang="ar">
  <head>
    <meta charset="UTF-8">
    <title>لوحة البوتات</title>
    <style>
      body { margin:0; font-family:Arial; background:#0f172a; color:white; }

      header {
        background:#111827;
        padding:18px;
        text-align:center;
        font-size:26px;
        font-weight:bold;
        border-bottom:3px solid #22c55e;
      }

      .stats {
        display:flex;
        justify-content:center;
        gap:20px;
        margin:20px;
        flex-wrap:wrap;
      }

      .card {
        background:#1f2937;
        padding:15px;
        border-radius:10px;
        min-width:150px;
        text-align:center;
      }

      .controls { text-align:center; margin:20px; }

      input, button {
        font-size:16px;
        padding:8px;
        border-radius:6px;
        border:none;
        margin:5px;
      }

      button { background:#22c55e; color:white; cursor:pointer; }
      .danger { background:#ef4444; }

      .bots {
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:12px;
        padding:20px;
      }

      .bot {
        background:#1f2937;
        padding:12px;
        border-radius:10px;
        width:260px;
        line-height:1.6;
      }
    </style>
  </head>

  <body>

    <header>🤖 لوحة البوتات</header>

    <div class="stats">
      <div class="card">إجمالي<br><b>${bots.length}</b></div>
      <div class="card">Online<br><b>${online}</b></div>
      <div class="card">Offline<br><b>${bots.length - online}</b></div>
    </div>

    <div class="controls">
      <form action="/generate" method="GET" style="display:inline;">
        عدد:
        <input type="number" name="n" min="1" max="500" value="5">
        <button>إنشاء</button>
      </form>

      <form action="/clear" method="GET" style="display:inline;">
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

});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
