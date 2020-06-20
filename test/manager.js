

roomList = [];
class Manager{

    items = []

    constructor(){
        console.log('constructor of Manager');
        this.items.push({
            id: '1',
            name: 'item1'
        });

        roomList.push('room0');
    }

    // manager;
    static _instance = null;

    static getInstance(){
        if(!Manager._instance){
            Manager._instance = new Manager();
        }
        return Manager._instance;
    }

    findRoom(){
        return roomList[0];
    }

}


module.exports = Manager.getInstance();

