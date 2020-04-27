const Client = {
    getInfoBySocket: function(socket){
        return {
            id: socket.id,
            nickName: socket.nickName,
            avatarUrl: socket.avatarUrl,
            openid: socket.openid,
            gender: socket.gender
        }
    },

    getListId: function(allSize, pkSize){
        var list = [];
        for(var i = 0; i < allSize; i++){
            list.push(i);
        }
        list = list.sort(function(a, b){
            return Math.random() - 0.5;
        }).slice(0, pkSize);

        list.sort(function(a, b){ return a > b ? 1 : -1} )
        return list;
    }
}

module.exports = Client;