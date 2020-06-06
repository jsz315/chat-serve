const fs = require('fs');
const https = require('https');
var SocketServer = require('ws').Server;

const {Message} = require('./tcp/message')
const Client = require('./tcp/Client')
const RoomManager = require('./tcp/RoomManager.js');

var port = 5566;
var ws;
var isHttps = false;

if(isHttps){
    const server = https.createServer({
        cert: fs.readFileSync('/usr/local/nginx/conf/1_wlwol.cn_bundle.crt'),
        key: fs.readFileSync('/usr/local/nginx/conf/1_wlwol.cn.key')
    });
    ws = new SocketServer({ server, port });
}
else{
    ws = new SocketServer({port});
}

ws.on('connection', (client)=>{
    console.log("on connection");
    // console.log(e);
    var room = RoomManager.getInstance().getRoomBySocket(client);
    client.on("message", (data)=>{
        console.log(data);
        var obj = JSON.parse(data);
        if(obj.type == Message.TYPE_LOGIN){
            client.nickName = obj.msg;
            room.send(Message.TYPE_MESSAGE, "登录成功");
            if(room.checkReady()){
                room.send(Message.TYPE_END_MATCH, room.getInfo());
            }
            else{
                room.send(Message.TYPE_WAIT_MATCH, room.getInfo());
            }
        }
        else if(obj.type == Message.TYPE_MESSAGE){
            room.send(Message.TYPE_MESSAGE, obj.msg);
        }
    })

    client.on('close', ()=>{
        console.log('disconnected');
        room.remove(client);
        room.send(Message.TYPE_QUIT, client.nickName + "退出");
    });
})

console.log(`websocket on port ${port}`)