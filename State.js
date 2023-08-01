//States
export class State{
    //id: unique int 
    //starting: true if State is starting state, false otherwise
    //accepting: 0=accepting state; 1=rejecting state; >1=neither
    constructor(id, starting, accepting){
        this.id =id;
        this.starting = starting;
        this.accepting = accepting;
    }
    //getter methods
    get isAccepting() {
        return (this.accepting === 0);
    }
    get isRejecting() {
        return (this.accepting === 1);
    }
    get isStarting() {
        return (this.starting);
    }
    
}


const teststate = new State(0, true, 0);
console.log(teststate.starting);