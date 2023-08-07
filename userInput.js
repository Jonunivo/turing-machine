import {State} from './State.js';
import {TuringMachine} from './TuringMachine.js'

//test click of button
function modifyText(){
    const t1 = document.getElementById("head-title");
    t1.innerHTML = "this workedbbbbbbbb!!!!!!!";
}
document.getElementById("addStateButton").addEventListener("click", modifyText);

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

    ////debug
    const t1 = document.getElementById("head-title");
    t1.innerHTML = `${stateName}, ${stateId}, ${isStartingState}, ${isAcceptingState},
    ${isRejectingState} `;
    ////
    // create State from user input (in TuringMachine.js)
    let currentState = turingMachine.createNewState(stateName, stateId, isStartingState, isAcceptingState, isRejectingState);
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
};
document.getElementById("createStateButton").addEventListener("click", createState);

//create transitions
function createTransition(){
    //TO DO
}


//runSimulation on inputString (not yet working, since no transitions implemented)
function runSimulation(){
    var inputString = document.getElementById("inputString").value;
    turingMachine.runSimulation(inputString);
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
}
document.getElementById("createTMButton").addEventListener("click", createTuringMachine);


//helper function that add messages to the user screen (creates p element)
function displayLogMessage(message){
    //get id from HTML
    const logMessagesDiv = document.getElementById("logMessages");
    //create log window element
    const logMessagesElement = document.createElement("p");
    logMessagesElement.textContent = message;
    logMessagesDiv.appendChild(logMessagesElement);
}
