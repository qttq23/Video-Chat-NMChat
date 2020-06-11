const joinHistoryModel = require('../models/join_history.model');

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

        //Write add to join history
        joinHistoryModel.add(userId, this.roomId, participant.joinTime, '');
    }

    remove(userId) {
        var pariticipant = participants[userId];
        pariticipant.leave();
        delete participant;

        //Update leave time in history
        joinHistoryModel.update(userId, this.roomId, participant.leaveTime);
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

    }
}