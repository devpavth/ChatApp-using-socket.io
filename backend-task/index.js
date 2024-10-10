const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require("./routes/auth");
const path = require('path');


const app = express();
require("dotenv").config();
const server = http.createServer(app);
// const io = socketIo(server);

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1,'chat-app/build')));
  app.get('*',(req,res) =>{
    res.sendFile(path.resolve(__dirname1, "chat-app","build","index.html"));
  })
}else{
  app.get('/', (req, res) => {
    res.send('Chat Server is running');
  });
  
}


const PORT = 5000;

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("DB connection successful");
})
.catch((err) => {
    console.error("DB connection error:", err.message);
});


// app.get('/', (req, res) => {
//   res.send('Chat Server is running');
// });

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



