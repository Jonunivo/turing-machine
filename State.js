//States
export class State{
    //id: unique int 
    //starting: true if State is starting state, false otherwise
    //accepting: 0=accepting state; 1=rejecting state; >1=neither
    constructor(id, isStarting, isAccepting, isRejecting){
        this.id =id;
        this.isStarting = isStarting;
        this.isAccepting = isAccepting;
        this.isRejecting = isRejecting
    }
    //getter methods
    get isAccepting() {
        return (this.isAccepting);
    }
    get isRejecting() {
        return (this.isRejecting)
    }
    get isStarting() {
        return (this.isStarting);
    }
    
}

