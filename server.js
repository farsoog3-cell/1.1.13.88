const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

// ملفات ثابتة
app.use(express.static(path.join(__dirname, "public")));

let players = {};

// صور افتراضية
const defaultAvatars = [
  "/avatars/cartoon1.png",
  "/avatars/cartoon2.png",
  "/avatars/cartoon3.png"
];

// توليد نرد عشوائي
function rollDice() {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
}

io.on("connection", (socket) => {
  console.log("لاعب دخل:", socket.id);

  if (!players[socket.id]) {
    players[socket.id] = {
      id: socket.id,
      username: "لاعب" + Math.floor(Math.random()*1000),
      avatar: defaultAvatars[Math.floor(Math.random()*defaultAvatars.length)],
      balance: 100
    };
  }

  socket.emit("welcome", players[socket.id]);
  io.emit("updatePlayers", players);

  socket.on("setUser", (data) => {
    if (players[socket.id]) {
      players[socket.id].username = data.username;
      players[socket.id].avatar = data.avatar;
      io.emit("updatePlayers", players);
    }
  });

  socket.on("roll", () => {
    const result = rollDice();
    Object.keys(players).forEach(id => {
      if (result.reduce((a,b)=>a+b,0) > 10) {
        players[id].balance += 10;
      } else {
        players[id].balance -= 10;
      }
    });
    io.emit("result", result);
    io.emit("updatePlayers", players);
  });

  socket.on("signal", (data) => {
    io.to(data.target).emit("signal", {
      source: socket.id,
      signal: data.signal
    });
  });

  socket.on("disconnect", () => {
    console.log("لاعب خرج:", socket.id);
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(port, () => console.log("Server running on port " + port));