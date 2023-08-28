
import {State} from './State.js';
import {animateNode, animateEdge} from './cytoscape.js';

//this file handles turingmachine object & runs simulation

//Turingmaschine
export class TuringMachine{
    /**
     * Constructs a TuringMachine object with the provided attributes.
     *
     * @param {Set<State>} states - The set of states in the Turing Machine.
     * @param {Set<string>} sigma - The input alphabet (a set of characters).
     * @param {Set<string>} gamma - The working alphabet (a set of characters).
     * @param {Map<[State, string], State>} delta - The transition function mapping [state, char] to a new state.
     * @param {State} startstate - The starting state of the Turing Machine.
     * @param {State} acceptstate - The accepting state of the Turing Machine.
     * @param {State} rejectstate - The rejecting state of the Turing Machine.
     */
    constructor(states, sigma, gamma, delta, startstate, acceptstate, rejectstate){
        this.states = states;
        this.sigma = sigma;
        this.gamma = gamma;
        this.delta = delta;
        this.startstate = startstate;
        this.acceptstate = acceptstate;
        this.rejectstate = rejectstate;
    }
    
    /**
     * Runs a simulation of an input string on a Turing Machine.
     *
     * This method simulates the provided input string on a fully defined Turing Machine.
     * It is called by the `runSimulation()` method of the `userInput` object.
     * logs Simulation progress & result to userLog
     * async to pause while running node/edge animation
     *
     * @param {string} input - The input string to be simulated.
     * @returns {boolean} result from simulationResult() method
     */
    async runSimulation(input) {
        //Read mode switch button
        let stopOnAcceptReject = document.getElementById("modeSwitch").checked === true;
     
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

                    //transition to next state
                    currentState = this.transition(currentState, this.delta, currentToken), 1000;
                    i++;
                } 
        }
        
        //mode 2: continue until end of string
        else{
            while(i<length){
                    //consume token
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

                    //transition to next state
                    currentState = this.transition(currentState, this.delta, currentToken), 1000;
                    i++;
                }
        }
        //finalize simulation & return result
        return this.simulationResult(currentState);
    }
    
    /**
     * Executes a single step of a Turing Machine simulation by applying the transition function.
     * 
     * Helper of runSimulation()
     *
     * This method takes the current state, the delta function, and the current token as parameters.
     * It returns the next state after applying the transition defined by the delta function.
     *
     * @param {State} state - The current state of the Turing Machine.
     * @param {Map<[State, string], State>} delta - The transition function of the Turing Machine.
     * @param {string} token - The current token being processed.
     * @returns {State} The next state after applying the transition.
     */
    transition(state, delta, token){
        //get instruction out of delta-map, should return next State
        let returnState = delta.get(this.getKeyByContent(delta, [state, token]));
        return returnState;
    }
    

    /**
     * Handles the result after the simulation reaches its final state.
     * 
     * Helper of runSimulation()
     *
     * This method processes the final state of the simulation and handles various scenarios,
     * including logging, checking if the final state is an accepting or rejecting state,
     * and animating the final node. It also reenables the run simulation button.
     *
     * @param {State} finalState - The final state reached during the simulation.
     * @returns {boolean} `true` if the simulation was successful (ended in an accepting state),
     *                   `false` otherwise.
     */
    simulationResult(finalState){
        let result = false;

        //user logging
        simulationLogMessage(`currently at State ${finalState.id}, accepting? ${finalState.isAccepting}`);
        //last state Accepting/Rejecting/neither?
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

    /**
     * Creates a new state and adds it to the Turing Machine.
     *
     * This method creates a new state with the provided attributes and adds it to the list of states
     * within the Turing Machine. It is called by the `createState()` method of `userInput.js`
     *
     * @param {number} id - The unique identifier of the new state.
     * @param {string} name - The name or label of the new state.
     * @param {boolean} isStarting - Indicates whether the state is a starting state (true) or not (false).
     * @param {boolean} isAccepting - Indicates whether the state is a accepting state (true) or not (false).
     * @param {boolean} isRejecting - Indicates whether the state is a rejecting state (true) or not (false).
     * @returns {State} The newly created state.
     */
    createNewState (id, name, isStarting, isAccepting, isRejecting){
        //add state to states list
        let state = new State(id, isStarting, isAccepting, isRejecting)
        this.states.add(state);
        return state;
    }

    /**
     * Creates a new transition and adds it to the Turing Machine.
     *
     * This method creates a new transition between two states and adds it to the transition function
     * (delta) of the Turing Machine. It is called by the `createTransition()` method of `userInput.js`
     *
     * @param {State} fromState - The source state of the transition.
     * @param {State} toState - The target state of the transition.
     * @param {string} label - The label or identifier for the transition (string format).
     * @returns {void}
     */
    createNewTransition(fromState, toState, label){
        this.delta.set([fromState, label], toState)
    }


/**
 * ------------------------
 * --- Helper Functions ---
 * ------------------------
 */ 

    /**
     * Retrieves a state with the specified ID from the Turing Machine.
     *
     * This method takes a state ID as input and searches through the list of states in the Turing Machine.
     * If a state with the provided ID is found, it is returned; otherwise, `null` is returned.
     *
     * @param {number} id - The ID of the state to retrieve.
     * @returns {State|null} The state with the specified ID, or `null` if not found.
     */
    getStateById(id){
        let states = this.states;
        for(const state of states){
            if(state.id == id){
                return state;
            }
        }
        return null;
    }

    /**
     * Retrieves the key in a Map by comparing the content of array elements.
     *
     * This method takes a Map and content (array) as input and searches through the keys of the Map.
     * It compares the content of each key with the provided content using JSON.stringify.
     * If a matching key is found, it is returned; otherwise, `null` is returned.
     *
     * @param {Map} delta - The Map to search for the key.
     * @param {Array} content - The content (array) to compare against.
     * @returns {Array|null} The key with matching content, or `null` if not found.
     */
    getKeyByContent(delta, content){
        for(const [key, value] of delta){
            if(JSON.stringify(key) === JSON.stringify(content)){
                return key;
            }
        }
        return null;
    }
}

/**
 * Helper function to add log messages to the user screen.
 *
 * This function takes a message as input and creates a new `<p>` element to display the message
 * on the user screen. It appends the element to the log messages container on the HTML page.
 *
 * @param {string} message - The message to be displayed as a log.
 * @returns {void}
 */
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