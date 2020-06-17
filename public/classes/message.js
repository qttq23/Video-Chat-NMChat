class MessageClient {
    constructor(userId, roomId) {
        this.userId = userId;
        this.roomId = roomId;
    }

    static sendMessage(content, receiver) {
        Message.sendMessage(content, receiver);
    }
}

module.exports =
    class Message {


        SenderId = '';
        ReceiverId = '';
        Content = '';
        SendTime = '';
        State = '';

        constructor(message) {
            this.SenderId = message.SenderId;
            this.ReceiverId = message.ReceiverId;
            this.Content = message.Content;
            this.SendTime = message.SendTime;
            this.State = message.State;
        }


    }