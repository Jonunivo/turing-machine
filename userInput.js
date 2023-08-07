//import {State} from './State.js';
//import {TuringMachine} from './TuringMachine.js'

//test click of button
function modifyText(){
    const t1 = document.getElementById("head-title");
    t1.innerHTML = "this worked!!!!!!!";
    console.log("logging");
}
document.getElementById("addStateButton").addEventListener("click", modifyText);



function createState() {
    // Get the user input from the input fields and radio buttons
    var stateName = document.getElementById("stateName").value;
    var stateId = document.getElementById("stateId").value;
    var isStartingState = document.querySelector('input[name="startingState"]:checked').value;
    var isAcceptingState = document.querySelector('input[name="acceptingState"]:checked').value;
    var isRejectingState = document.querySelector('input[name="rejectingState"]:checked').value;

    ////debug
    const t1 = document.getElementById("head-title");
    t1.innerHTML = `${stateName}, ${stateId}, ${isStartingState}, ${isAcceptingState},
    ${isRejectingState} `;
    ////

    // create State from user input (in TuringMachine.js)
    TuringMachine.createNewState(stateName, stateId, isStartingState, isAcceptingState, isRejectingState);
    console.log("here");
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





//helper function that (should) add messages to the user screen
function displayLogMessage(message){
    //get id from HTML
    const logMessagesDiv = document.getElementById("logMessages");
    //create log window element
    const logMessagesElement = document.createElement("p");
    logMessagesElement.textContent = message;
    logMessagesDiv.appendChild(logMessagesElement);
}

