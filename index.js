import express from "express";
import http from "http"
import { Server } from "socket.io";

const port = process.env.PORT || 3000

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


app.get('/', (req, res) => {
    res.send("hello")
})

io.on("connection", (socket) => {
    console.log("user connected");

    socket.on('create-room', (data) => {
        console.log(data);
        socket.join(data.roomID);
        socket.to(data.roomID).emit('welcome', `${data.email} joined `);

    });

    socket.on('join-room', (data) => {
        socket.join(data.room);
        socket.to(data.room).emit('welcome', `${data.email} joined the room.`)

    });

    socket.on('leave-room', (data) => {
        socket.to(data.roomID.id).emit(`left`, `${data.email} left the room.`)
        socket.leave(data.roomID);
    });

    socket.on('send-message', (data) => {
        console.log(data);
        socket.to(data.room).emit('receive-message', data);
    });


})

server.listen(port, () => {
    console.log(`listening to ${port}`)
})