

module.exports =
    class User {

        UserID = '';
        Name = '';
        Email = '';
        Password = '';
        AvatarUrl = '';
        BirthDate = '';
        PhoneNumber = '';


        constructor(user) {
            this.UserID = user.UserID;
            this.Name = user.Name;
            this.Email = user.Email;
            this.Password = user.Password;
            this.AvatarUrl = user.AvatarUrl;
            this.BirthDate = user.BirthDate;
            this.PhoneNumber = user.PhoneNumber;


        }


        register(){
            // save to server

        }
        
        updateInfo(user){
            let newUser = new User(this);
            newUser.Name = user.Name;
            newUser.BirthDate = user.BirthDate;
            newUser.PhoneNumber = user.PhoneNumber;

            // save to server

        }

        getListFriends(){
            //return list friends of user id

        }

        addFriend(user){
            // save to server
        }

        joinRoom(roomName){

        }

        createRoom(roomName){

        }

        getHistories(){

        }

      

    }



