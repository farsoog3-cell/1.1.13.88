const http = require("http");

const PORT = process.env.PORT || 3000;

const html = `
<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<title>موقعي</title>
<style>
  body {
    background:#0f172a;
    color:white;
    font-family:Arial;
    text-align:center;
    padding-top:80px;
  }
  h1 { font-size:40px; }
  p { color:#94a3b8; }
  button {
    background:#22c55e;
    border:none;
    padding:12px 24px;
    font-size:18px;
    border-radius:8px;
    cursor:pointer;
  }
</style>
</head>
<body>
  <h1>🚀 موقعك يعمل بنجاح</h1>
  <p>السيرفر يعمل الآن على Render</p>
  <button onclick="alert('🔥 جاهز للاستخدام')">اضغط هنا</button>
</body>
</html>
`;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}).listen(PORT);
