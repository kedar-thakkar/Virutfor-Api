import express from 'express';
import { Server } from "socket.io";
import http from 'http'


var socket_cors = "*";

const app = express();
const server = http.createServer(app);
const io =  new Server(server, {
    cors: {
        origin: `${socket_cors}`,
        methods: ["GET", "POST"]
    }
});
 

// implementing socket  

io.on('connection', (socket) => {
    console.log("we have a new connection.")
    socket.on("join", ({room}) => {
        socket.join(room)  
        console.log('room joined ------------------');
        socket.on("request-a-call", ({ callFrom, callTo }) => {
            console.log(callFrom, callTo);
            socket.broadcast.to(room).emit('on-call-request', ({ callFrom, callTo }));   
        })

        socket.on("call-accepted", ({callFrom, callTo}) => {
            socket.broadcast.to(room).emit('join-private-meeting', ({ callFrom, callTo }));   
            
        })

        socket.on("privatemeetingon",({callFrom,callTo})=>{
            console.log("hello",callFrom,callTo)
            socket.broadcast.to(room).emit("participanlistnames",({callFrom,callTo}))
        })

        socket.on("end-usercall",({user_data})=>{
            console.log("end----user");
            socket.broadcast.emit('end-call',({user_data}))
        })
         
    })

    socket.on("join-participants", ({allParticipants}) => {
        socket.broadcast.emit("passdata-user", ({allParticipants}));
    })

});

app.use(express.json())


// Port 

const port = process.env.port || 5500

// Starting server .
server.listen(port, () => console.log(`listening on post ${port}`));