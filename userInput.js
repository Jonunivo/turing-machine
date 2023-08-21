import {TuringMachine} from './TuringMachine.js'
import {cytoCreateNode, cytoCreateEdge, cytoRemoveLastNode} from './cytoscape.js';
//export
export{createState, createTransition, cytoTransitionHelper, startTuringMachine}

// -- global variables
//TuringMachine
let turingMachine;
//Form Default Values helper
//set first StateID to 0
let stateIdSetter = 0;
let maxStateId = 50;
//set first From State to 0
let TransitionSetter = 0;
//cytoscape TransitionID (!assumes maxID of states = 99! edge ids from 100 onwards)
let edgeId = 100;

//function that is run when page is loaded (=> also run by reset())
function startTuringMachine(){
    //(re-)set globals to starting value
    stateIdSetter = 0;
    document.getElementById("stateId").value = 0;
    TransitionSetter = 0;
    edgeId = 100;

    //FORM RESET
    //disable run simulation
    document.getElementById("inputStringField").value = "";
    document.getElementById("runSimulationButton").disabled = true;
    //reactivate State sliders
    document.getElementById("stateStarting").disabled = false;
    document.getElementById("stateAccepting").disabled = false;
    document.getElementById("stateRejecting").disabled = false;
    //disable transition
    document.getElementsByName("transitionField").forEach(element => {
        element.value = 0;
        element.disabled = true;
    });
    document.getElementById("createTransitionButton").disabled= true;

    //turing Machine initialized
    


    //create TM object
    createTuringMachine();
}
window.addEventListener("load", startTuringMachine);


//read State Inputs from User
function userCreateState() {
    // Get the user input from the input fields and on/off sliders
    var stateName = document.getElementById("stateName").value;
    var stateId = document.getElementById("stateId").value;
    var isStartingState = document.getElementById("stateStarting").checked === true;
    var isAcceptingState = document.getElementById("stateAccepting").checked === true;
    var isRejectingState = document.getElementById("stateRejecting").checked === true;

    createState(stateName, stateId, isStartingState, isAcceptingState, isRejectingState);
    
}
document.getElementById("createStateButton").addEventListener("click", userCreateState);
//actually create state
function createState(stateName, stateId, isStartingState, isAcceptingState, isRejectingState){
    //cyto default values
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
        //disable Starting state slider & set to off
        document.getElementById("stateAccepting").disabled = true;
        document.getElementById("stateAccepting").checked = false;
        //logging
        console.log("accepting state set");
    }
    if(isRejectingState){
        turingMachine.rejectstate=currentState;
        cytocolor = '#f06060';
        //disable Starting state slider & set to off
        document.getElementById("stateRejecting").disabled = true;
        document.getElementById("stateRejecting").checked = false;
        //logging
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



//read Transition inputs from user
//LIMITATION: transition labels are limited to 0 & 1
function userCreateTransition(){
    //fetch user input
    var fromStateId0 = document.getElementById("fromStateId0").value;
    var toStateId0 = document.getElementById("toStateId0").value;
    var fromStateId1 = document.getElementById("fromStateId1").value;
    var toStateId1 = document.getElementById("toStateId1").value;

    //create transition in TM
    createTransition(fromStateId0, toStateId0, "0");
    createTransition(fromStateId1, toStateId1, "1");
    //cytoscope creation
    cytoTransitionHelper(fromStateId0, toStateId0, fromStateId1, toStateId1);

}
document.getElementById("createTransitionButton").addEventListener("click", userCreateTransition);
//actually create Transition
function createTransition(fromStateId, toStateId, label){
    //get corresponding states from IDs
    var fromState = turingMachine.getStateById(fromStateId);
    var toState = turingMachine.getStateById(toStateId);
    //add transitions to turingMachine set delta
    turingMachine.createNewTransition(fromState, toState, label);
    

    //formhelper
    transitionFormHelper();

    //logging
    console.log(`0: Transition from ${fromState} to ${toState}`);
    console.log(`1: Transition from ${fromState} to ${toState}`);
    //user log
    /*
    transitionLogMessage(`Transition created`)
    transitionLogMessage(`0: from ${fromStateId0} to ${toStateId0}`)
    transitionLogMessage(`1: from ${fromStateId1} to ${toStateId1}`)
    transitionLogMessage(`--------`)
    */
}
//create cytoscape edges
function cytoTransitionHelper(fromStateId0, toStateId0, fromStateId1, toStateId1){
    if(fromStateId0 == fromStateId0 && toStateId0 == toStateId1){
        //combined edge if edge 0 == edge 1
        cytoCreateEdge(edgeId, fromStateId0, toStateId0, "0,1")
    }
    else{
        //seperate edges (even Id for 0 edges, odd Id for 1 edges)
        cytoCreateEdge(edgeId, fromStateId0, toStateId0, 0);
        cytoCreateEdge(edgeId+1, fromStateId1, toStateId1, 1);
    }
    edgeId += 2;
}
//form input helper
function transitionFormHelper(){
    //set from state iterating from 0 to stateIdSetter
    TransitionSetter+=0.5;
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
}

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

    //disable Run Simulation button until end of Simulation
    document.getElementById("runSimulationButton").disabled = true;
    document.getElementById("runSimulationButton").innerHTML = "Simulation Running"

    //run Simulation
    var simulationResult = turingMachine.runSimulation(inputString);

    //user alert
    if(simulationResult){
        //alert("input accepted!")
    }
    else{
        //alert("input rejected!")
    }

    //re-enable Run Simulation button
    //done in turingMachine.runSimulation in TuringMachine.js

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


//not used anymore (since cytoscape)
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
//not used anymore (since cytoscape)
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


