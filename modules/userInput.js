import {TuringMachine} from './TuringMachine.js'
import {cytoCreateNode, cytoCreateEdge, cytoRemoveNode} from './cytoscape.js';
//export
export{createState, createTransition, cytoTransitionHelper, startTuringMachine}

//this file handels user input


// ---- Global Variables ----
// Turing Machine instance
let turingMachine;

// Helper for Form Default Values
let stateIdSetter = 0; // Set the first StateID to 0, used to handle unique ID assignment to states
let maxStateId = 50;    // Maximum allowed States
let TransitionSetter = 0; // Set the first From State to 0, used to handle TransitionFromId / Transition Creation

// Cytoscape TransitionID
// Note: Assumes maxID of states is 99, edge ids start from 100 onwards
let edgeId = 100;     // Starting ID for edges


/**
 * Initializes the Turing Machine and sets up the initial state when the page is loaded or reset.
 *
 * This function is run when the page is loaded, as well as by the `reset()` function.
 * It resets global variables to their starting values and initializes the Turing Machine.
 * It also handles form reset, enabling/disabling form elements
 * @returns {void}
 */
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

    //create TM object
    createTuringMachine();
}
window.addEventListener("load", startTuringMachine);


/**
 * Creates a new state based on user inputs and adds it to the Turing Machine.
 *
 * This function retrieves user inputs from input fields and sliders to define the attributes of the new state.
 * It then calls the `createState()` function to create the state and update the Turing Machine object.
 *
 * @returns {void}
 */
function userCreateState() {

    var stateId = document.getElementById("stateId").value;
    var isStartingState = document.getElementById("stateStarting").checked === true;
    var isAcceptingState = document.getElementById("stateAccepting").checked === true;
    var isRejectingState = document.getElementById("stateRejecting").checked === true;

    createState(undefined, stateId, isStartingState, isAcceptingState, isRejectingState);
    
}
document.getElementById("createStateButton").addEventListener("click", userCreateState);
/**
 * Creates a new state and updates the Turing Machine with it.
 *
 * This function creates a new state with the provided attributes and adds it to the Turing Machine.
 * It handles various scenarios, such as setting starting, accepting, and rejecting states
 * alerts user if trying to create Accepting & Rejecting state -> return
 * alerts user if max number of nodes reached -> return
 * Creates Cytoscape node
 * Additionally, it handles form validation and logging.
 *
 * @param {string} stateName - The name of the new state.
 * @param {number} stateId - The ID of the new state.
 * @param {boolean} isStartingState - Indicates whether the state is a starting state (true) or not (false).
 * @param {boolean} isAcceptingState - Indicates whether the state is an accepting state (true) or not (false).
 * @param {boolean} isRejectingState - Indicates whether the state is a rejecting state (true) or not (false).
 * @returns {void}
 */
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
    //unlock delete last state button
    if(stateIdSetter>0){
        document.getElementById("deleteStateButton").disabled=false;
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



/**
 * Reads user inputs to create transitions and adds them to the Turing Machine.
 *
 * This function retrieves user inputs from input fields and creates transitions based on those inputs.
 * It calls the `createTransition()` function to add the transitions to the Turing Machine.
 * It also handles Cytoscape edge creation and form input helper functions.
 *
 * @returns {void}
 */
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
/**
 * Creates a new transition and updates the Turing Machine with it.
 *
 * This function creates a new transition between two states and adds it to the Turing Machine.
 * It gets the corresponding states from their IDs, updates the delta function, and handles form input.
 * It also logs the transition creation.
 *
 * @param {number} fromStateId - The ID of the source state for the transition.
 * @param {number} toStateId - The ID of the target state for the transition.
 * @param {string} label - The label of the transition (either "0" or "1").
 * @returns {void}
 */
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
/**
 * Helper function to create Cytoscape edges based on transition inputs.
 *
 * This function creates Cytoscape edges based on the provided transition inputs.
 * It handles scenarios where edges can be combined or separate based on the inputs.
 *
 * @param {number} fromStateId0 - The ID of the source state for the first transition.
 * @param {number} toStateId0 - The ID of the target state for the first transition.
 * @param {number} fromStateId1 - The ID of the source state for the second transition.
 * @param {number} toStateId1 - The ID of the target state for the second transition.
 * @returns {void}
 */
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
/**
 * Helper function to handle form inputs related to transitions.
 *
 * This function assists in updating form input fields related to transitions.
 * It iterates through form fields, sets values, disables fields, and controls button states.
 *
 * @returns {void}
 */
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
    //delete Transition button
    if(TransitionSetter > 0){
        document.getElementById("deleteTransitionButton").disabled = false;
    }
}

/**
 * Deletes the last state that was created.
 *
 * This function removes the last created state from the Turing Machine object and updates the form inputs accordingly.
 * It checks for existing transitions to or from the state being deleted and alerts&retruns if such transitions exist.
 * Removes the corresponding cytoscape node.
 *
 * @returns {void}
 */
function deleteLastState(){
    //delete in TM object
    let stateToDelete = turingMachine.getStateById(stateIdSetter-1);
    //alert if any Transitions to/from this state
    for(const [key, value] of turingMachine.delta.entries()){
        if(key[0] === stateToDelete ||
            value === stateToDelete){
            alert(`please remove any from/to State ID ${stateIdSetter-1} transition first`)
            return;
        }
    }
    //delete in TM object
    turingMachine.states.delete(stateToDelete);

    //form helper
    stateIdSetter--;
    document.getElementById("stateId").value = stateIdSetter;
    document.getElementById("toStateId0").value = 0;
    document.getElementById("toStateId1").value = 0;
    document.getElementById("toStateId0").setAttribute('max', stateIdSetter-1)
    document.getElementById("toStateId1").setAttribute('max', stateIdSetter-1)
    if(stateIdSetter===0){
        document.getElementById("deleteStateButton").disabled = true;
    }
    //delete node in cyto
    cytoRemoveNode(stateIdSetter);
}
document.getElementById("deleteStateButton").addEventListener("click", deleteLastState);

/**
 * Deletes the last created transition.
 *
 * This function removes the last created transition from the Turing Machine object's delta function.
 * It updates the form inputs and controls related to transitions.
 * It also manages the visual representation in Cytoscape by removing the corresponding edges.
 *
 * @returns {void}
 */
function deleteLastTransition(){
    //decrease edgeId
    edgeId -= 2;
    TransitionSetter--;
    //Delete from TM object
    const fromState = turingMachine.getStateById(TransitionSetter);
    turingMachine.delta.delete(turingMachine.getKeyByContent(turingMachine.delta, [fromState, "0"]));
    turingMachine.delta.delete(turingMachine.getKeyByContent(turingMachine.delta, [fromState, "1"]));

    //Form adjustments
    document.getElementById("fromStateId0").value = TransitionSetter;
    document.getElementById("fromStateId1").value = TransitionSetter;
    document.getElementsByName("transitionField").forEach(element => {
        element.disabled = false;
    });
    document.getElementById("createTransitionButton").disabled = false;
    document.getElementById("runSimulationButton").disabled = true;
    if(TransitionSetter === 0){
        document.getElementById("deleteTransitionButton").disabled = true;
    }

    //delete in cyto
    cytoRemoveNode(edgeId);
    cytoRemoveNode(edgeId+1);
}
document.getElementById("deleteTransitionButton").addEventListener("click", deleteLastTransition);

/**
 * Runs the Turing Machine simulation on the input string and provides the simulation outcome to the user.
 *
 * This function initiates the simulation process by clearing the user simulation log and validating the input string.
 * It ensures that the input string consists only of binary (0 and 1) characters.
 * It also checks if there's a starting state defined in the Turing Machine, if not: alerts user & returns.
 * During the simulation, the "Run Simulation" button is disabled and its text is changed to indicate the running state.
 * After the simulation, the simulation result is displayed to the user through an alert. (disabled for now)
 *
 * @returns {void}
 */
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
}
document.getElementById("runSimulationButton").addEventListener("click", runSimulation);

/**
 * Creates a default Turing Machine with no states and an alphabet {0, 1}.
 *
 * This function initializes a default Turing Machine object with the following properties:
 * - An empty set of states
 * - An alphabet (sigma) containing the symbols "0" and "1"
 * - A working alphabet (gamma) identical to the alphabet sigma
 * - An empty map of transitions
 * - No defined starting, accepting, or rejecting states initially
 *
 * The created Turing Machine object is assigned to the global variable `turingMachine`.
 *
 * @returns {void}
 */
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

/**
 * Resets the Turing Machine simulation by reloading the page.
 *
 * This function reloads the entire page, effectively resetting the Turing Machine simulation.
 * All created states and transitions will be destroyed, and the simulation will return to its initial state.
 *
 * @returns {void}
 */
function reset(){
    //reload page
    location.reload();
}
document.getElementById("resetButton").addEventListener("click", reset);



/**
 * //not used anymore
 * 
 * Adds a log message to the user screen in the simulation log area.
 *
 * This function appends a new log message to the simulation log area on the user screen.
 * It creates a new paragraph element and populates it with the provided message.
 *
 * @param {string} message - The message to be displayed in the simulation log.
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


/**
 * //not used anymore
 * 
 * Adds a log message to the user screen in the state log area.
 *
 * This function appends a new log message to the simulation log area on the user screen.
 * It creates a new paragraph element and populates it with the provided message.
 *
 * @param {string} message - The message to be displayed in the simulation log.
 * @returns {void}
 */
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

/**
 * //not used anymore
 * 
 * Adds a log message to the user screen in the transition log area.
 *
 * This function appends a new log message to the simulation log area on the user screen.
 * It creates a new paragraph element and populates it with the provided message.
 *
 * @param {string} message - The message to be displayed in the simulation log.
 * @returns {void}
 */
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


