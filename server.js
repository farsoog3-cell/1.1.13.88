const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;

let interval = null;
let logs = [];

function ping(url) {
  const start = Date.now();

  const lib = url.startsWith("https") ? https : http;

  lib.get(url, res => {
    const time = Date.now() - start;

    logs.unshift({
      url,
      status: res.statusCode,
      time: time + " ms",
      date: new Date().toLocaleTimeString()
    });

    logs = logs.slice(0, 50);
  }).on("error", () => {
    logs.unshift({
      url,
      status: "Error",
      time: "-",
      date: new Date().toLocaleTimeString()
    });
  });
}

http.createServer((req, res) => {

  const urlObj = new URL(req.url, "http://localhost");

  // تشغيل
  if (urlObj.pathname === "/start") {
    const target = urlObj.searchParams.get("url");
    const seconds = parseInt(urlObj.searchParams.get("t"));

    if (interval) clearInterval(interval);

    interval = setInterval(() => ping(target), seconds * 1000);

    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  // إيقاف
  if (urlObj.pathname === "/stop") {
    clearInterval(interval);
    interval = null;

    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  res.end(`
  <h1>📡 مراقبة الروابط</h1>

  <form action="/start">
    رابط الموقع:<br>
    <input name="url" placeholder="https://example.com" required><br><br>

    كل كم ثانية؟<br>
    <input type="number" name="t" value="5" min="1" required><br><br>

    <button>تشغيل المراقبة</button>
  </form>

  <form action="/stop">
    <button style="background:red;color:white;margin-top:10px">
      إيقاف
    </button>
  </form>

  <hr>

  <h2>النتائج</h2>

  ${logs.map(l => `
    ⏰ ${l.date} |
    🌐 ${l.url} |
    📊 ${l.status} |
    ⚡ ${l.time}<br>
  `).join("")}
  `);

}).listen(PORT);
