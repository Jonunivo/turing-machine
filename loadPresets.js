import {createState, createTransition, cytoTransitionHelper, startTuringMachine} from './userInput.js';
import {clearCanvas} from './cytoscape.js'

function loadPreset1(){
    //reset
    empty();
    //Preset 1: Accept whenever a 1 seen in string
    //Starting State
    createState("", 0, true, false, false);
    //Accepting state
    createState("", 1, false, true, false);
    //Transitions
    //From state 0
    createTransition(0, 0, "0")
    createTransition(0, 1, "1")
    //from state 1
    createTransition(1, 1, "0")
    createTransition(1, 1, "1")
    //cytoscape creation
    cytoTransitionHelper(0, 0, 0, 1);
    cytoTransitionHelper(1, 1, 1, 1);

}

function loadPreset2(){
    //reset
    empty();
    //Preset 2: Accept whenever starts with "0010"
    //Starting State
    createState("", 0, true, false, false);
    //intermediate states
    createState("", 1, false, false, false);
    createState("", 2, false, false, false);
    createState("", 3, false, false, false);
    //accepting state
    createState("", 4, false, true, false);
    //rejecting state
    createState("", 5, false, false, true);
    //Transitions
    //From state 0
    createTransition(0, 1, "0")
    createTransition(0, 5, "1")
    //from state 1
    createTransition(1, 2, "0")
    createTransition(1, 5, "1")
    //from state 2
    createTransition(2, 5, "0")
    createTransition(2, 3, "1")
    //from state 3
    createTransition(3, 4, "0")
    createTransition(3, 5, "1")
    //from state 4
    createTransition(4, 4, "0")
    createTransition(4, 4, "1")
    //from state 5
    createTransition(5, 5, "0")
    createTransition(5, 5, "1")
    //cytoscape creation
    cytoTransitionHelper(0, 1, 0, 5);
    cytoTransitionHelper(1, 2, 1, 5);
    cytoTransitionHelper(2, 5, 2, 3);
    cytoTransitionHelper(3, 4, 3, 5);
    cytoTransitionHelper(4, 4, 4, 4);
    cytoTransitionHelper(5, 5, 5, 5);
}

function empty(){
    //reset
    startTuringMachine();
    clearCanvas();
}


//event listeners 
var options = document.querySelectorAll("#presetSelect option");

options.forEach(function(option) {
    option.addEventListener("click", function() {
        
        if (option.value === "empty") {
            empty();
            console.log("empty clicked");
        }
        else if (option.value === "PresetOne") {
            loadPreset1();
            console.log("PresetOne clicked");
        } 
        else if (option.value === "PresetTwo") {
            loadPreset2();
            console.log("PresetTwo clicked");
        } 
        // Add more conditions for other options as needed
    });
});