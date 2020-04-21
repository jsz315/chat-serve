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

var httpServer = require('http').createServer();
var io = require('socket.io')(httpServer);
httpServer.listen(5566);

io.on('connection', socket=>{
    console.log("a client connection")

    socket.on('msg', msg=>{
        console.log(msg);
        io.emit('msg', socket.nickName + ': ' + msg);
        // socket.emit('serve', 'to you ' + msg);
    });

    socket.on('login', name=>{
        socket.nickName = name;
        io.emit('msg', socket.nickName + '进入房间');
    })

    socket.on('disconnect', ()=>{
        console.log('connect disconnect');
    });

    // 与客户端对应的接收指定的消息
    socket.on('client message', (data)=>{
        console.log(data);// hi server
    });
})