import {TuringMachine} from './TuringMachine.js'


//global variables
//TuringMachine
let turingMachine;

//Form Default Values helper
//set first StateID to 0
let stateIdSetter = 0;
document.getElementById("stateId").value = stateIdSetter;
//set first From State to 0
let TransitionSetter = 0;
document.getElementById("fromStateId0").value = TransitionSetter;
document.getElementById("fromStateId1").value = TransitionSetter;


//function that is run when page is loaded (also runs on reset())
function startTuringMachine(){
    //disable transition
    document.getElementsByName("transitionField").forEach(element => {
        element.value = 0;
        element.disabled = true;
    });
    //disable run simulation
    document.getElementById("inputStringField").value = "";
    document.getElementById("runSimulationButton").disabled = true;
    //turing Machine initialized
    createTuringMachine();
}
window.addEventListener("load", startTuringMachine);

function createState() {
    // Get the user input from the input fields and radio buttons
    var stateName = document.getElementById("stateName").value;
    var stateId = document.getElementById("stateId").value;
    var isStartingState = document.getElementById("stateStarting").checked === true;
    var isAcceptingState = document.getElementById("stateAccepting").checked === true;
    var isRejectingState = document.getElementById("stateRejecting").checked === true;

    // create State from user input (in TuringMachine.js)
    let currentState = turingMachine.createNewState(stateId, stateName, isStartingState, isAcceptingState, isRejectingState);
    //catch State not allowed to be Accepting & Rejecting
    if(isAcceptingState&&isRejectingState){
        alert("A state cannot be Accepting & Rejecting at the same time");
        return;
    }
    
    // add accepting/rejecting/starting state to turingMachine object
    if(isStartingState){
        turingMachine.startstate=currentState;
        console.log("starting state set");
        //disable Starting state radio buttons & set to No
        document.getElementById("stateStarting").disabled = true;
        document.getElementById("stateStarting").checked = false;
    }

    
    if(isAcceptingState){
        turingMachine.acceptstate=currentState;
        console.log("accepting state set");
    }
    if(isRejectingState){
        turingMachine.rejectstate=currentState;
        console.log("rejecting state set");
    }

    //form Validation
    //set StateID of next state
    document.getElementById("stateId").value = stateIdSetter+1;
    //set max of from & to states to max ID of created States (Transition Form)
    document.getElementById("fromStateId0").setAttribute('max', stateIdSetter);
    document.getElementById("toStateId0").setAttribute('max', stateIdSetter);
    document.getElementById("fromStateId1").setAttribute('max', stateIdSetter);
    document.getElementById("toStateId1").setAttribute('max', stateIdSetter);
    //go to nextID
    stateIdSetter++;
    //unlock create Transition when new or first state created & lock run simulation
    if(TransitionSetter < stateIdSetter){
        document.getElementsByName("transitionField").forEach(element => {
            element.disabled = false;
        });
        document.getElementById("createTransitionButton").disabled = false;
        document.getElementById("runSimulationButton").disabled = true;
    }


    //logging
    console.log("State created: ", stateName, " ", stateId);
    console.log("TM now: ", turingMachine);
    //log to user window
    displayLogMessage(`State ${stateName}`)
    displayLogMessage(`ID: ${stateId}`)
    if(isStartingState){
        displayLogMessage(`Starting State`)
    }
    if(isRejectingState){
        displayLogMessage(`Rejecting State`)
    }
    if(isAcceptingState){
        displayLogMessage(`Accepting State`)
    }
    displayLogMessage("----------")


}
document.getElementById("createStateButton").addEventListener("click", createState);

//create transitions
//LIMITATION: transition labels are limited to 0 & 1
function createTransition(){
    //fetch user input
    var fromStateId0 = document.getElementById("fromStateId0").value;
    var toStateId0 = document.getElementById("toStateId0").value;
    var fromStateId1 = document.getElementById("fromStateId1").value;
    var toStateId1 = document.getElementById("toStateId1").value;
    //get corresponding states from IDs
    var fromState0 = turingMachine.getStateById(fromStateId0);
    var toState0 = turingMachine.getStateById(toStateId0);
    var fromState1 = turingMachine.getStateById(fromStateId1);
    var toState1 = turingMachine.getStateById(toStateId1);
    //add transitions to turingMachine set delta
    turingMachine.delta.set([fromState0, "0"], toState0);
    turingMachine.delta.set([fromState1, "1"], toState1);


    //form input helper
    //set from state iterating from 0 to stateIdSetter
    TransitionSetter++;
    document.getElementById("fromStateId0").value = TransitionSetter;
    document.getElementById("fromStateId1").value = TransitionSetter;
    //lock input when all fromIDs done
    if(TransitionSetter === stateIdSetter){
        document.getElementsByName("transitionField").forEach(element => {
            element.disabled = true;
        });
        document.getElementById("createTransitionButton").disabled = true;
        
        document.getElementById("runSimulationButton").disabled = false;
    }

    //logging
    console.log(`0: Transition from ${fromState0} to ${toState0}`);
    console.log(`1: Transition from ${fromState1} to ${toState1}`);
    //user log
    displayLogMessage(`Transition created`)
    displayLogMessage(`0: from ${fromStateId0} to ${toStateId0}`)
    displayLogMessage(`1: from ${fromStateId1} to ${toStateId1}`)
    displayLogMessage(`--------`)

}
document.getElementById("createTransitionButton").addEventListener("click", createTransition);


//runSimulation on inputString & alert user on simulation outcome
function runSimulation(){
    //prevent user from inputting anything else than a bitstring
    var inputString = document.getElementById("inputStringField").value;
    var filteredInput = inputString.replace(/[^01]/g, '');
    if(inputString !== filteredInput){
        document.getElementById("inputStringField").value = filteredInput;
        alert("please only input bitstrings");
        return;
    }
    document.getElementById("inputStringField").value = filteredInput;
    //prevent no starting state
    if(turingMachine.startstate === undefined){
        alert("please create a start state");
        return;
    }

    //run Simulation
    var simulationResult = turingMachine.runSimulation(inputString);
    if(simulationResult){
        alert("input accepted!")
    }
    else{
        alert("input rejected!")
    }
}
document.getElementById("runSimulationButton").addEventListener("click", runSimulation);

//create default turing machine (no states, alphabet = {0,1})
function createTuringMachine(){
    let states = new Set();
    let sigma = new Set();
    sigma.add("0");
    sigma.add("1");
    let gamma = new Set(sigma);
    let transitions = new Map();
    turingMachine = new TuringMachine(states, sigma, gamma, transitions, undefined, undefined, undefined);
    console.log("successfully created TM:", turingMachine);
    //display to user log
    displayLogMessage("TM Created!")
    displayLogMessage("-------------------------")
}
//document.getElementById("createTMButton").addEventListener("click", createTuringMachine);

//reset button that destroys States & Transitions (page reload)
function reset(){


    //reload page
    location.reload();
}
document.getElementById("resetButton").addEventListener("click", reset);


//helper function that add messages to the user screen (creates p element)
function displayLogMessage(message){
    //get id from HTML
    const logMessagesDiv = document.getElementById("logMessages");
    //create log window element
    const logMessagesElement = document.createElement("p");
    logMessagesElement.setAttribute("id", "logMessage")
    logMessagesElement.textContent = message;
    logMessagesDiv.appendChild(logMessagesElement);
}


//debug helper

