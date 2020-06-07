//pm2 start web-serve.js  运行方式

const fs = require('fs');
const https = require('https');
var SocketServer = require('ws').Server;

const {Message} = require('./tcp/message')
const Client = require('./tcp/Client')
const RoomManager = require('./tcp/RoomManager.js');

var port = 10086;
var ws;
var isHttps = false;

if(isHttps){
    const server = https.createServer({
        cert: fs.readFileSync('/usr/local/nginx/conf/1_wlwol.cn_bundle.crt'),
        key: fs.readFileSync('/usr/local/nginx/conf/2_wlwol.cn.key')
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
    client.on("message", (res)=>{
        console.log(res);
        var obj = JSON.parse(res);
        if(obj.type == Message.TYPE_LOGIN){

            client.id = Date.now();
            client.nickName = obj.data.nickName;
            client.avatarUrl = obj.data.avatarUrl;
            client.openid = obj.data.openid;
            client.gender = obj.data.gender;
           
            room.send(Message.TYPE_LOGIN, "登录成功", client);
            if(room.checkReady()){
                room.send(Message.TYPE_END_MATCH, "匹配成功");
            }
            else{
                room.send(Message.TYPE_WAIT_MATCH, "房间未满");
            }
        }
        else if(obj.type == Message.TYPE_MESSAGE){
            room.send(Message.TYPE_MESSAGE, obj.data);
        }
        else if(obj.type == Message.TYPE_LIST_ID){
            room.send(Message.TYPE_LIST_ID, Client.getListId(obj.data.allSize, obj.data.pkSize));
        }
        else if(obj.type == Message.TYPE_CHOOSE_ANSWER){
            room.send(Message.TYPE_CHOOSE_ANSWER, obj.data, client);
        }
        else if(obj.type == Message.TYPE_PING){
            // room.send(Message.TYPE_PING, "保持连接");
            client.send(JSON.stringify({
                type: Message.TYPE_PING,
                data: "保持连接"
            }));
        }

    })

    client.on('close', ()=>{
        console.log('disconnected');
        room.remove(client);
        room.send(Message.TYPE_QUIT, client.nickName + "退出", client);
    });
})

console.log(`websocket on port ${port}`)