// export default class Message{
//     type;
//     data;
//     constructor(){

//     }

//     static TYPE_LOGIN = 'login';
//     static TYPE_MESSAGE = 'message';
//     static TYPE_START_MATCH = 'start match';
//     static TYPE_WAIT_MATCH = 'wait match';
//     static TYPE_END_MATCH = 'end match';
//     static TYPE_QUIT = 'quit';


//     static TYPE_CONNECT = 'connect';
//     static TYPE_DISCONNECT = 'disconnect';
// }

const Message = {
    // static TYPE_LOGIN = 'login';
    // static TYPE_MESSAGE = 'message';
    // static TYPE_START_MATCH = 'start match';
    // static TYPE_WAIT_MATCH = 'wait match';
    // static TYPE_END_MATCH = 'end match';
    // static TYPE_QUIT = 'quit';

    TYPE_LOGIN: 'login',
    TYPE_MESSAGE: 'message',
    TYPE_WAIT_MATCH: 'wait match',
    TYPE_END_MATCH: 'end match',
    TYPE_QUIT: 'quit',
    TYPE_LIST_ID: 'list id',
    TYPE_CHOOSE_ANSWER: 'choose answer',
    TYPE_PING: 'ping'
}

module.exports = {
    Message
}