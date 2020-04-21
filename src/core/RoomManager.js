const Room = require('./Room')

class RoomManager{

    constructor(){
        this.rooms = [];
    }
    
    static getInstance(){
        if(!this._instance){
            this._instance = new RoomManager();
        }
		return this._instance;
    }

    getEmptyRoom(){
        var m = this.rooms.findIndex(n => !n.checkReady());
        if(m != -1){
            return this.rooms[m];
        }
        var room = new Room();
        this.rooms.push(room);
        return room;
    }

    getRoomBySocket(socket){
        var m = this.rooms.findIndex(n => n.has(socket));
        if(m != -1){
            return this.rooms[m];
        }
        return null;
    }

    removeRoom(room){
        var m = this.rooms.findIndex(n => room);
        if(m != -1){
            this.rooms.splice(m , 1);
        }
    }

    removeRoomBySocket(socket){
        var m = this.rooms.findIndex(n => n.has(socket));
        if(m != -1){
            this.rooms.splice(m , 1);
        }
    }
    
}

module.exports = RoomManager;