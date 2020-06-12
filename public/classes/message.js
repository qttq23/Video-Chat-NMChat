class MessageClient {
    constructor(userId, roomId) {
        this.userId = userId;
        this.roomId = roomId;
    }

    static sendMessage(content, receiver) {
        Message.sendMessage(content, receiver);
    }
}

class Message {
    static sendMessage(content, receiver) {
        if (content && receiver) {
            const sentTime = Date.now();

            //Convert content, receiver, sent time to bytes
        }
    }

    static receiveMessage() {
        //Convert bytes to receiver, sent time to info

        //get info
    }
}