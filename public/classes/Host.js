


module.exports =
    class Host extends Participant {



        constructor(user) {
            this.ID = user.UserID;
            this.Name = user.Name;
        }

        invite(userId){


        }

        kickParticipant(userId){

        }

        allowVideo(isOn){

        }

        allowMicro(isOn){

        }

        setMainScreen(userId){

        }

        // override
        leaveRoom(){
            
        }


    }