//This class is not used for milestone 4
class user{
    constructor(connection, rsvp){
        this.connection = connection;
        this.rsvp =rsvp
    }

    //Sets and Gets the connection attribute
    setConnection(connection){
        this.connection = connection;
    }

    getConnection(){
        return this.connection;
    }

    //Sets and Gets the rsvp
    setRSVP(rsvp){
        this.rsvp = rsvp;
    }
    
    getRSVP(){
        return this.rsvp;
    }

}

module.exports = user;