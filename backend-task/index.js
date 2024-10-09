const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require("./routes/auth");
const messageRoutes= require("./routes/messages")

const app = express();
require("dotenv").config();
const server = http.createServer(app);
// const io = socketIo(server);

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = 5000;

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("DB connection successful");
})
.catch((err) => {
    console.error("DB connection error:", err.message);
});


app.get('/', (req, res) => {
  res.send('Chat Server is running');
});

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
  global.chatSocket = socket;
  console.log('A user connected');

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log("send message", {data})
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  // socket.on('sendMessage', (message) => {
  //   // Broadcast message to all clients
  //   io.emit('receiveMessage', message);
  // });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// paviguna116 - username


// 33wSXdbWAb43UlJq  - password


// GVRPGXMNcIlekx6G - pwd

// pavithradevi


// mongodb+srv://<db_username>:<db_password>@cluster0.dz5vf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0