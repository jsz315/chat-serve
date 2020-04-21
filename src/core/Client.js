const Client = {
    getInfoBySocket: function(socket){
        return {
            id: socket.id,
            nickName: socket.nickName
        }
    }
}

module.exports = Client;