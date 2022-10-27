import express from "express";
import WebSocket from "ws";
import http from "http";
import { SocketAddress } from "net";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); //start http and wss server on the same port

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to the Browser");
  socket.on("close", () => console.log("Disconnected from the browser"));
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString("utf8")));
  });
});

server.listen(PORT, handleListen);
