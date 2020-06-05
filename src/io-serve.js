
const {Message} = require('./message')
const Client = require('./src/core/Client')
const port = 8899;
const RoomManager = require('./src/core/RoomManager.js');
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

    console.log("socket server start at " + port);

    io.on('connection', socket=>{
        console.log("a client connection")
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
            socket.avatarUrl = obj.avatarUrl;
            io.emit(Message.TYPE_LOGIN, {
                nickName: socket.nickName,
                avatarUrl: socket.avatarUrl,
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
    
        socket.on(Message.TYPE_LIST_ID, obj=>{
            var room = RoomManager.getInstance().getRoomBySocket(socket);
            if(room){
                room.send(Message.TYPE_LIST_ID, Client.getListId(obj.allSize, obj.pkSize));
            }
        })
    
        socket.on(Message.TYPE_CHOOSE_ANSWER, obj=>{
            var room = RoomManager.getInstance().getRoomBySocket(socket);
            if(room){
                room.send(Message.TYPE_CHOOSE_ANSWER, {
                    player: Client.getInfoBySocket(socket),
                    obj: obj
                });
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
}