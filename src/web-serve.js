const fs = require('fs');
const https = require('https');
var SocketServer = require('ws').Server;

var port = 5566;
var ws;
var isHttps = false;

if(isHttps){
    const server = https.createServer({
        cert: fs.readFileSync('/path/to/cert.pem'),
        key: fs.readFileSync('/path/to/key.pem')
    });
    ws = new SocketServer({ server, port });
}
else{
    ws = new SocketServer({port});
}

ws.on('connection', (client)=>{
    console.log("on connection");
    // console.log(e);
    client.send("you ok");
    client.on("message", (msg)=>{
        client.send("to u: " + msg)
    })

    client.on('close', ()=>{
        console.log('disconnected');
    });
})

console.log(`websocket on port ${port}`)