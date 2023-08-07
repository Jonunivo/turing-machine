import {TuringMachine} from './TuringMachine.js'


//global variables
//TuringMachine
let turingMachine;


//creates a State from the user provided input & adds it to turingMachine
function createState() {
    // Get the user input from the input fields and radio buttons
    var stateName = document.getElementById("stateName").value;
    var stateId = document.getElementById("stateId").value;
    var isStartingState = document.querySelector('input[name="startingState"]:checked').value === "true";
    var isAcceptingState = document.querySelector('input[name="acceptingState"]:checked').value === "true";
    var isRejectingState = document.querySelector('input[name="rejectingState"]:checked').value === "true";

    // create State from user input (in TuringMachine.js)
    let currentState = turingMachine.createNewState(stateId, stateName, isStartingState, isAcceptingState, isRejectingState);
    // add accepting/rejecting/starting state to turingMachine object
    if(isStartingState){
        turingMachine.startstate=currentState;
        console.log("starting state set");
    }
    if(isAcceptingState){
        turingMachine.acceptstate=currentState;
        console.log("accepting state set");
    }
    if(isRejectingState){
        turingMachine.rejectstate=currentState;
        console.log("rejecting state set");
    }
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
//LIMITATION: user is expected to input IDs of states that actually exist
//LIMITATION: transition labels are limited to 0 & 1
function createTransition(){
    //handle invalid user input
    // -- TO DO --

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
    var inputString = document.getElementById("inputStringField").value;
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
document.getElementById("createTMButton").addEventListener("click", createTuringMachine);

//reset button that destroys TuringMachine (page reload)
function reset(){
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

