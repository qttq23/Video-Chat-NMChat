

module.exports =
    class Room {

        RoomID = '';
        RoomName = '';
        HostID = '';
        StartTime = '';
        EndTime = '';

        // additions
        config = {};
        messages = [];
        host = '';
        participants = [];


        constructor(room) {
            RoomID = room.RoomID;
            RoomName = room.RoomName;
            HostID = room.HostID;
            StartTime = room.StartTime;
            EndTime = room.EndTime;
        }

        data(){
            // return data to save to database
        }

        create(){
            // save time start to database


        }

        end(){
            // save time end to database
        }




    }



