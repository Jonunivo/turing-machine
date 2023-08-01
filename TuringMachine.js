
import {State} from './State.js';

// ---- Turingmaschine Prototyp 1
class TuringMachine{
    //TM consists of:
    //states: set of states (State.js)
    //sigma: Eingabealphabet (set of chars)
    //gamma: Arbeitsalphabet (set of chars)
    //delta: Übergangsfunktionen
    //startstate: startstate (part of states)
    //acceptstate: accepting state (part of states)
    //rejectstate: rejecting state (part of states)
    constructor(states, sigma, gamma, delta, startstate, acceptstate, rejectstate){
        this.states = states;
        this.sigma = sigma;
        this.gamma = gamma;
        this.delta = delta;
        this.startstate = startstate;
        this.acceptstate = acceptstate;
        this.rejectstate = rejectstate;
    }

}
// --- create a very simple turingmachine:
// -- states
let states = new Set();
//start state
let startstate = new State(0, true, 5);
states.add(startstate);

for(let i = 0; i<5; i++){
    states.add(new State(i, true, 5));
}
//accepting state
let acceptstate = new State(5, false, 0);
states.add(acceptstate);
// -- sigma
let sigma = new Set();
sigma.add(0);
sigma.add(1);
// -- gamma
let gamma = new Set(sigma);
// -- TM creation
let testturingmachine = new TuringMachine(states, sigma, gamma, new Map(), startstate, acceptstate, undefined);

