// var ws = new WebSocket("sw://127.0.0.1:5566");
// ws.onopen = function(e){
//     console.log("serve start");
//     console.log(e);
// }

// ws.onclose = function(e){
//     console.log("serve close");
//     console.log(e);
// }

// ws.onmessage = function(e){
//     console.log("serve message");
//     console.log(e);
// }

// ws.onerror = function(e){
//     console.log("serve error");
//     console.log(e);
// }

// setTimeout(() => {
//     ws.close();
// }, 3000);

// var SocketServer = require('ws').Server;

// var ws = new SocketServer({port: 5566});

// ws.on('message', (e)=>{
//     console.log("on message");
//     // console.log(e);
//     e.emit("ok");
// })

// ws.on('connection', (e)=>{
//     console.log("on connection");
//     // console.log(e);
// })



const {Message} = require('./message')
const Client = require('./src/core/Client')
const port = 8899;
const RoomManager = require('./src/core/RoomManager.js');
// var httpServer = require('http').createServer();
// var io = require('socket.io')(httpServer);
// httpServer.listen(port);

var io;

init();

function init(){
    var fs = require('fs');
    io = require('socket.io').listen(port, {
        //线上
        // key : fs.readFileSync('/usr/local/nginx/conf/2_wlwol.cn.ke').toString(),
        // cert: fs.readFileSync('/usr/local/nginx/conf/1_wlwol.cn_bundle.crt').toString(),
        // ca: fs.readFileSync('/etc/pki/tls/certs/your.domain.com.cer').toString(),
        // 'log level':1
    });
}


// var io = require('socket.io').listen(port);
console.log("socket server start at " + port);

io.on('connection', socket=>{

    console.log("a client connection")
    // console.log(socket);

    socket.on(Message.TYPE_MESSAGE, msg=>{
        console.log("type = " + Message.TYPE_MESSAGE);
        console.log(msg);
        var room = RoomManager.getInstance().getRoomBySocket(socket);
        if(room){
            room.send(Message.TYPE_MESSAGE, {msg: msg, player: Client.getInfoBySocket(socket)});
        }
    });

    socket.on(Message.TYPE_LOGIN, obj=>{
        console.log("type = " + Message.TYPE_LOGIN);
        console.log(obj);
        socket.nickName = obj.nickName;
        io.emit(Message.TYPE_LOGIN, {
            nickName: socket.nickName,
            id: socket.id
        })
    })

    socket.on(Message.TYPE_START_MATCH, ()=>{
        var room = RoomManager.getInstance().getEmptyRoom();
        room.add(socket);
        if(room.checkReady()){
            room.send(Message.TYPE_END_MATCH, room.getInfo());
        }
        else{
            room.send(Message.TYPE_WAIT_MATCH, room.getInfo());
        }
    })

    socket.on('disconnect', ()=>{
        console.log('connect disconnect');
        var room = RoomManager.getInstance().getRoomBySocket(socket);
        if(room){
            room.remove(socket);
            RoomManager.getInstance().removeRoom(room);
            room.send(Message.TYPE_EXIT_MATCH, Client.getInfoBySocket(socket));
        }
       
    });

    // 与客户端对应的接收指定的消息
    socket.on('client message', (data)=>{
        console.log(data);// hi server
    });
})