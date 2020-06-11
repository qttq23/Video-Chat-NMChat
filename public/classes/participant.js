class RoomParticipants {
    constructor(userId, roomId) {
        this.pariticipants = {};
        this.roomId = roomId;
    }

    add(userId) {
        //new participant
        //this.pariticipants.add()
        var participant = new Participant(userId);
        pariticipants[userId] = participant;
    }

    remove(userId) {
        var pariticipant = participants[userId];
        pariticipant.leave();
        delete participant;
    }

    isInRoom(userId) {
        userId in paricipants;
    }
}

class Pariticipant {
    constructor(userId) {
        this.userId = userId;
        this.joinTime = Date.now();
    }

    leave() {
        this.leaveTime = Date.now();
        //Save to database;
    }
}