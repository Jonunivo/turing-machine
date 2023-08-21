
import {State} from './State.js';
import {cy, animateNode, animateEdge} from './cytoscape.js';


// ---- Turingmaschine Prototyp 1
export class TuringMachine{
    //TM consists of:
    //states: set of states (State.js)
    //sigma: Eingabealphabet (set of chars)
    //gamma: Arbeitsalphabet (set of chars)
    //delta: Übergangsfunktionen ([state, char] -> state)
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
    
    //runs simulation of input string on turingmachine
    //preconditions: type turingmachine = TuringMachine, fully defined
    //               type input = string
    //called by userInput.runSimulation()
    async runSimulation(input) {
        //mode switch button
        let stopOnAcceptReject = document.getElementById("modeSwitch").checked === true;
        console.log(stopOnAcceptReject);
        
        
        // -- core --
        let currentState = this.startstate;
        let i = 0;
        let length = input.length;

        //mode 1: stop when accept / reject state reached
        if(stopOnAcceptReject){
            while(currentState !== this.acceptstate &&
                currentState !== this.rejectstate &&
                i<length){

                    // --- Consume Token
                    let currentToken = input.substring(0,1);
                    input = input.substring(1);
                    
                    ////debug/logging
                    simulationLogMessage(`currently at State ${currentState.id}, accepting? ${currentState.isAccepting}`);
                    console.log(`   next state if 0: ${this.transition(currentState, this.delta, "0").id}`);
                    console.log(`   next state if 1: ${this.transition(currentState, this.delta, "1").id}`);
                    simulationLogMessage(`   current Token:   ${currentToken}`);
                    simulationLogMessage(`--------`)
                    ////

                    ///// animation
                    let animationTime = 1000/document.getElementById("speedSlider").value;
                    animateNode(currentState.id, animationTime);
                    await new Promise(resolve => setTimeout(resolve, 1.5*animationTime+10));
                    animateEdge(currentState.id, currentToken, animationTime);
                    await new Promise(resolve => setTimeout(resolve, 2*animationTime+10));
                    ////

                    //transition
                    currentState = this.transition(currentState, this.delta, currentToken), 1000;
                    i++;
                    
                } 
        }
        
        //mode : continue until end of string
        else{
            while(i<length){
                    //consume character & execute transition function
                    let currentToken = input.substring(0,1);
                    input = input.substring(1);
                    
                    ////debug/logging
                    simulationLogMessage(`currently at State ${currentState.id}, accepting? ${currentState.isAccepting}`);
                    console.log(`   next state if 0: ${this.transition(currentState, this.delta, "0").id}`);
                    console.log(`   next state if 1: ${this.transition(currentState, this.delta, "1").id}`);
                    simulationLogMessage(`   current Token:   ${currentToken}`);
                    simulationLogMessage(`--------`)
                    ////

                    ///// animation
                    let animationTime = 1000/document.getElementById("speedSlider").value;
                    animateNode(currentState.id, animationTime);
                    await new Promise(resolve => setTimeout(resolve, 1.5*animationTime+10));
                    animateEdge(currentState.id, currentToken, animationTime);
                    await new Promise(resolve => setTimeout(resolve, 2*animationTime+10));
                    ////

                    //transition
                    currentState = this.transition(currentState, this.delta, currentToken), 1000;
                    i++;
                }
        }
        //finalize simulation & return result
        return this.simulationResult(currentState);
    }
    
    //executes 1 step of a TM simulation (execute transition function)
    //takes state, delta function & current token & returns next state
    //called by runSimulation()
    transition(state, delta, token){
        //get instruction out of delta-map, should return next State
        let returnState = delta.get(this.getKeyByContent(delta, [state, token]));
        return returnState;
    }
    

    //handles everything after simulation reached final state
    simulationResult(finalState){

        let result = false;

        //user logging
        simulationLogMessage(`currently at State ${finalState.id}, accepting? ${finalState.isAccepting}`);
        //last state Accepting
        if(finalState === this.acceptstate){
            simulationLogMessage("--- Last State Accepting ---");
            result = true;
        }
        else if(finalState === this.rejectstate){
            simulationLogMessage("--- Last State Rejecting ---")
        }
        else{
            simulationLogMessage("end of string reached, missed accept/reject state")
            simulationLogMessage("-> rejecting input")
        }
        //final node animation
        let animationTime = 1000/document.getElementById("speedSlider").value;
        animateNode(finalState.id, animationTime);
        //reenable run simulation button
        document.getElementById("runSimulationButton").disabled = false;
        document.getElementById("runSimulationButton").innerHTML = "Run Simulation"
        
        //return simulation result
        return result
    }

    //creates a new state & adds it to turingmachine (caller)
    //called by userInput.createState()
    createNewState (id, name, isStarting, isAccepting, isRejecting){
        //add state to states list
        let state = new State(id, isStarting, isAccepting, isRejecting)
        this.states.add(state);
        return state;
    
    }
    //creates a new transition & adds it to turingmachine (caller)
    //label should be string format
    //called by userInput.createTransition()
    createNewTransition(fromState, toState, label){
        this.delta.set([fromState, label], toState)
    }

// --- Helper Functions ---
    //given: id -> returns: state with id
    getStateById(id){
        let states = this.states;
        for(const state of states){
            if(state.id == id){
                return state;
            }
        }
        return null;
    }
    //ensures comparison of array content not of array objects!
    getKeyByContent(delta, content){
        for(const [key, value] of delta){
            if(JSON.stringify(key) === JSON.stringify(content)){
                return key;
            }
        }
        return null;
    }

}

//helper: add messages to the user screen (creates p element)
function simulationLogMessage(message){
    //get id from HTML
    const logMessagesDiv = document.getElementById("simulationLogMessages");
    //create log window element
    const logMessagesElement = document.createElement("p");
    logMessagesElement.setAttribute("id", "simulationLogMessage")
    logMessagesElement.setAttribute("class", "logMessage")
    logMessagesElement.textContent = message;
    logMessagesDiv.appendChild(logMessagesElement);
}










/*
// --- create a very simple turingmachine:
//      6 states, each going to next state if 1, else stay at state
//      -> reaches acceptstate if string contains >= 5 "1"
// -- states & transitions
let states = new Set();
let transitions = new Map();
//start state
let startstate = new State(0, true, false, false);
states.add(startstate);

for(let i = 1; i<5; i++){
    states.add(new State(i, false, false, false));
}
//accepting&rejecting state (reject state should not be reached here)
let acceptstate = new State(5, false, true, false);
states.add(acceptstate);
let rejectstate = new State(10, false, false, true);

// -- transitions
//from start to start (if 0) & to first (if 1)
transitions.set([startstate, "0"], startstate);
transitions.set([startstate, "1"], getStateById(states, 1));
//from 1 to 1 (if 0) & to 2 (if 1)
for(let i = 1; i<5; i++){
    transitions.set([getStateById(states, i), "0"], getStateById(states, i));
    transitions.set([getStateById(states, i), "1"], getStateById(states, i+1))
}
//to last state (if 1) else stay
transitions.set([getStateById(states, 1), "0"], getStateById(states, 1));
transitions.set([getStateById(states, 1), "0"], getStateById(states, 1));




// -- sigma
let sigma = new Set();
sigma.add("0");
sigma.add("1");
// -- gamma
let gamma = new Set(sigma);

// -- TM creation
let testturingmachine = new TuringMachine(states, sigma, gamma, transitions, startstate, acceptstate, rejectstate);

testturingmachine.runSimulation("1111111111");


*/