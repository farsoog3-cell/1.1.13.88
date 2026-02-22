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
