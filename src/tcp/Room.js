const Client = require('./Client')

class Room{
    
    constructor(){
        this.size = 2;
        this.players = [];
    }

    add(socket){
        var m = this.players.findIndex(n => n == socket);
        if(m == -1){
            this.players.push(socket);
        }
    }

    remove(socket){
        var m = this.players.findIndex(n => n == socket);
        if(m != -1){
            this.players.splice(m, 1);
        }
    }

    has(socket){
        return this.players.findIndex(n => n == socket) != -1;
    }

    send(type, data, socket){
        this.players.forEach(n => {
            if(n.readyState == 1){
                n.send(JSON.stringify({
                    type,
                    data, 
                    players: this.getInfo(),
                    player: Client.getInfoBySocket(socket)
                }));
            }
            // n.send({type, data});
        })
    }

    getInfo(){
        return this.players.map(n => {
            return Client.getInfoBySocket(n);
        })
    }

    checkReady(){
        return this.size == this.players.length;
    }
    
}

module.exports = Room;