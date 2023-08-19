import {TuringMachine} from './TuringMachine.js'
import {cytoCreateNode, cytoCreateEdge, cytoRemoveLastNode} from './cytoscape.js';

// -- global variables
//TuringMachine
let turingMachine;
//Form Default Values helper
//set first StateID to 0
let stateIdSetter = 0;
document.getElementById("stateId").value = stateIdSetter;
let maxStateId = 50;
//set first From State to 0
let TransitionSetter = 0;
document.getElementById("fromStateId0").value = TransitionSetter;
document.getElementById("fromStateId1").value = TransitionSetter;
//cytoscape TransitionID (!assumes maxID of states = 99! edge ids from 100 onwards)
let edgeId = 100;

//function that is run when page is loaded (=> also run by reset())
function startTuringMachine(){
    //disable transition
    document.getElementsByName("transitionField").forEach(element => {
        element.value = 0;
        element.disabled = true;
    });
    document.getElementById("createTransitionButton").disabled= true;
    //disable run simulation
    document.getElementById("inputStringField").value = "";
    document.getElementById("runSimulationButton").disabled = true;
    //turing Machine initialized
    createTuringMachine();
}
window.addEventListener("load", startTuringMachine);


//creates state from user input
function createState() {
    // Get the user input from the input fields and on/off sliders
    var stateName = document.getElementById("stateName").value;
    var stateId = document.getElementById("stateId").value;
    var isStartingState = document.getElementById("stateStarting").checked === true;
    var isAcceptingState = document.getElementById("stateAccepting").checked === true;
    var isRejectingState = document.getElementById("stateRejecting").checked === true;
    //cytoscape variables
    var cytocolor = 'lightgrey';
    var cytoborder = false;
    //catch State not allowed to be Accepting & Rejecting
    if(isAcceptingState&&isRejectingState){
        alert("A state cannot be Accepting & Rejecting at the same time");
        return;
    }
    //limit maxStates
    if(stateIdSetter > maxStateId){
        alert(`max limit of states:  ${maxStateId} reached`)
        return
    }

    // create State from user input (in TuringMachine.js)
    let currentState = turingMachine.createNewState(stateId, stateName, isStartingState, isAcceptingState, isRejectingState);
    // add accepting/rejecting/starting state to turingMachine object
    if(isStartingState){
        turingMachine.startstate=currentState;
        
        //cyto
        cytocolor = 'darkgrey';
        cytoborder = 'true';
        //disable Starting state slider & set to off
        document.getElementById("stateStarting").disabled = true;
        document.getElementById("stateStarting").checked = false;
        //logging
        console.log("starting state set");
    }
    if(isAcceptingState){
        turingMachine.acceptstate=currentState;
        cytocolor = '#bfdf56';
        console.log("accepting state set");
    }
    if(isRejectingState){
        turingMachine.rejectstate=currentState;
        cytocolor = '#f06060';
        console.log("rejecting state set");
    }

    //cytoscape
    cytoCreateNode(stateIdSetter, 250, 250, cytocolor, cytoborder);

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
        document.getElementById("toStateId0").disabled=false;
        document.getElementById("toStateId1").disabled=false;
        document.getElementById("createTransitionButton").disabled = false;
        document.getElementById("runSimulationButton").disabled = true;
    }



    //logging
    console.log("State created: ", stateName, " ", stateId);
    console.log("TM now: ", turingMachine);
    //log to user window
    /*
    stateLogMessage(`State ${stateName}`)
    stateLogMessage(`ID: ${stateId}`)
    if(isStartingState){
        stateLogMessage(`Starting State`)
    }
    if(isRejectingState){
        stateLogMessage(`Rejecting State`)
    }
    if(isAcceptingState){
        stateLogMessage(`Accepting State`)
    }
    stateLogMessage("----------")
    */
}
document.getElementById("createStateButton").addEventListener("click", createState);

//creates tranistion from user input
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
    //cytoscape
    
    if(fromStateId0 == fromStateId1 && toStateId0 == toStateId1){
        //combined edge if edge 0 == edge 1
        cytoCreateEdge(edgeId, fromStateId0, toStateId0, "0,1")
    }
    else{
        //seperate edges
        cytoCreateEdge(edgeId, fromStateId0, toStateId0, 0);
        cytoCreateEdge(edgeId+1, fromStateId1, toStateId1, 1);
    }
    edgeId += 2;

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
    /*
    transitionLogMessage(`Transition created`)
    transitionLogMessage(`0: from ${fromStateId0} to ${toStateId0}`)
    transitionLogMessage(`1: from ${fromStateId1} to ${toStateId1}`)
    transitionLogMessage(`--------`)
    */
}
document.getElementById("createTransitionButton").addEventListener("click", createTransition);

//Delete last created State
function deleteLastState(){
    // TO DO
    /*
    //delete in TM object
    let stateToDelete = turingMachine.getStateById(stateIdSetter-1);
    turingMachine.states.delete(stateToDelete);
    //delete any Transitions from/to this state

    //delete node in cyto (also deletes transitions)
    cytoRemoveLastNode();
    */
}
//document.getElementById("deleteStateButton").addEventListener("click", deleteLastState);
//delete last created transition
function deleteLastTransition(){
    //TO DO
}
//document.getElementById("deleteTransitionButton").addEventListener("click", deleteLastTransition);

//runSimulation on inputString & alert user on simulation outcome
function runSimulation(){
    //clear userSimulationLog
    document.getElementById("simulationLogMessages").innerHTML="";

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

    //user alert
    if(simulationResult){
        //alert("input accepted!")
    }
    else{
        //alert("input rejected!")
    }
}
document.getElementById("runSimulationButton").addEventListener("click", runSimulation);

//create default turing machine (no states, alphabet = {0,1})
function createTuringMachine(){
    //properties
    let states = new Set();
    let sigma = new Set();
    sigma.add("0");
    sigma.add("1");
    let gamma = new Set(sigma);
    let transitions = new Map();

    //create TM object
    turingMachine = new TuringMachine(states, sigma, gamma, transitions, undefined, undefined, undefined);

    //logging
    console.log("successfully created TM:", turingMachine);
    simulationLogMessage("TM Created!")
    simulationLogMessage("-------------------------")
}
//document.getElementById("createTMButton").addEventListener("click", createTuringMachine);

//reset button that destroys States & Transitions (page reload)
function reset(){
    //reload page
    location.reload();
}
document.getElementById("resetButton").addEventListener("click", reset);



//helper functions that add messages to the user screen (creates p element)
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
function stateLogMessage(message){
    //get id from HTML
    const logMessagesDiv = document.getElementById("stateLogMessages");
    //create log window element
    const logMessagesElement = document.createElement("p");
    logMessagesElement.setAttribute("id", "stateLogMessage")
    logMessagesElement.setAttribute("class", "logMessage")
    logMessagesElement.textContent = message;
    logMessagesDiv.appendChild(logMessagesElement);
}
function transitionLogMessage(message){
    //get id from HTML
    const logMessagesDiv = document.getElementById("transitionLogMessages");
    //create log window element
    const logMessagesElement = document.createElement("p");
    logMessagesElement.setAttribute("id", "transitionLogMessage")
    logMessagesElement.setAttribute("class", "logMessage")
    logMessagesElement.textContent = message;
    logMessagesDiv.appendChild(logMessagesElement);
}


//debug helper

