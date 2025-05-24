// IMPORTS
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

// ENVIRONMENT VARIABLES
const PORT = 3030;

// SETUP SERVERS
const app = express();
app.use(express.json(), cors());
const server = http.createServer(app);
const io = socketio(server, { cors: {} });

// API ENDPOINT TO DISPLAY THE CONNECTION TO THE SIGNALING SERVER
let connections = [];
app.get("/hello", (req, res) => {
  res.json("world");
});
app.get("/connections", (req, res) => {
  res.json(connections);
});

// MESSAGING LOGIC
io.on("connection", (socket) => {
  console.log("User connected with id", socket.id);

  connections.push(socket.id);

  socket.on("message", (message) => {
    console.log("Broadcast message receive");
    // Send message to all peers expect the sender
    if (!message.from) {
      console.warn("Message have no from, abort");
      return;
    }
    if (!message.target) {
      console.info("This is a broadcast message");
      socket.broadcast.emit("message", message);
    }
    console.info("Message is from a specific user");

    io.to(message.target).emit("message", message);
    //console.log("Broadcast message send");
  });

  socket.on("disconnect", () => {
    const disconnectingPeer = connections.find((peer) => peer === socket.id);
    if (disconnectingPeer) {
      console.log("Disconnected", disconnectingPeer);
      const payload = {
        action: "close",
        disconnect: disconnectingPeer,
        message: "Peer has left the signaling server",
      };
      // Make all peers close their peer channels
      socket.broadcast.emit("message", { payload: payload });
      // remove disconnecting peer from connections
      const indexDisconnectingPeer = connections.indexOf(disconnectingPeer);
      if (indexDisconnectingPeer > -1) {
        connections.splice(indexDisconnectingPeer);
      }
    } else {
      console.log(socket.id, "has disconnected");
    }
  });
});

// RUN APP
server.listen(PORT, console.log(`Listening on PORT ${PORT}`));
