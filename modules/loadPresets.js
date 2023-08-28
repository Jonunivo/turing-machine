import {createState, createTransition, cytoTransitionHelper, startTuringMachine} from './userInput.js';
import {clearCanvas} from './cytoscape.js'






//creates Preset that detects if "1" in string
function loadPreset1(){
    //reset
    empty();
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

//creates Preset that detects string starts with "0010"
function loadPreset2(){
    //reset
    empty();
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


//creates Preset that detects string containing "0010"
function loadPreset3(){
    //reset
    empty();
    //Starting State
    createState("", 0, true, false, false);
    //intermediate states
    createState("", 1, false, false, false);
    createState("", 2, false, false, false);
    createState("", 3, false, false, false);
    //accepting state
    createState("", 4, false, true, false);
    //Transitions
    //From state 0
    createTransition(0, 1, "0")
    createTransition(0, 0, "1")
    //from state 1
    createTransition(1, 2, "0")
    createTransition(1, 0, "1")
    //from state 2
    createTransition(2, 2, "0")
    createTransition(2, 3, "1")
    //from state 3
    createTransition(3, 4, "0")
    createTransition(3, 0, "1")
    //from state 4
    createTransition(4, 4, "0")
    createTransition(4, 4, "1")
    //cytoscape creation
    cytoTransitionHelper(0, 1, 0, 0);
    cytoTransitionHelper(1, 2, 1, 0);
    cytoTransitionHelper(2, 2, 2, 3);
    cytoTransitionHelper(3, 4, 3, 0);
    cytoTransitionHelper(4, 4, 4, 4);
}

//Clears Canvas & Deletes TuringMachine (Creates new one)
function empty(){
    //reset
    startTuringMachine();
    clearCanvas();
}


//handle Dropdown menu & activate correct function when value changes
var presetSelect = document.getElementById("presetSelect");
    
presetSelect.addEventListener("change", function() {
        
        if (presetSelect.value === "empty") {
            empty();
            console.log("empty clicked");
        }
        else if (presetSelect.value === "PresetOne") {
            loadPreset1();
            console.log("PresetOne clicked");
        } 
        else if (presetSelect.value === "PresetTwo") {
            loadPreset2();
            console.log("PresetTwo clicked");
        } 
        else if (presetSelect.value === "PresetThree") {
            loadPreset3();
            console.log("PresetThree clicked");
        } 
        // Add more conditions for other options as needed
    });

