import cytoscape from './node_modules/cytoscape/dist/cytoscape.esm.min.js';


//global var: isanimation complete?
let isComplete = true;

//cytoscape object
var cy = cytoscape({
    container: document.getElementById('cytoscape'),
    style: [
    {
        selector: 'node',
        style: {
            shape: 'round-rectangle',
            'background-color': 'red',
            'width': '50px',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'blue'
        }
    },
    {
        
        selector: 'edge',
        style: {
            'line-color': 'black',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'blue',
            'curve-style': 'bezier',
            'loop-direction': '0deg'
        }
        
    }],

    // disable panning & zooming
    zoomingEnabled: false,
    userPanningEnabled: false,
  });



//add node example
/*
  cy.add({
    group: 'nodes',
    data: { weight: 75 },
    position: { x: 50, y: 50 },
});
*/

function cytoCreateNode(id, xPos=200, yPos=200, color='grey', border=false){
    //ensure creating within box & distance from each other
    let xDistance = 150;
    let yDistance = 100;
    xPos = Math.max(50, (50 + xDistance*id) % document.getElementById('cytoscape').clientWidth);
    yPos = 80 + yDistance*(Math.floor((50 + id*150) / document.getElementById('cytoscape').clientWidth));
    let label = id;
    //border
    let borderWidth = 0;
    let borderColor = 'white';
    if(border){
        borderWidth = 2;
        borderColor = 'black'
    }

    //core
    cy.add({
        group: 'nodes',
        data: {id: id},
        style: {
            'background-color': `${color}`,
            'border-width': `${borderWidth}`, // Set the border width for the nodes
            'border-color': `${borderColor}`,
            'label': `${label}`,
            "text-valign": "center",
            "text-halign": "center",
        },
        position: { x: xPos, y: yPos},
    });
}

function cytoCreateEdge(id, fromNode, toNode, label){
    console.log(id, fromNode, toNode);
    //core
    cy.add({ 
        group: 'edges', 
        data: { 
            id: `${id}`, 
            source: `${fromNode}`, 
            target: `${toNode}` 
        },
        style: {
            'label': `${label}`,
            "text-margin-y": "-10px",
            "text-margin-x": "-10px",
          }
        }
    );
}

function cytoRemoveLastNode(){
    //TO DO
}


//not yet working like intended!! TO DO
async function animate(nodeId, token){
    //wait
    //simulation speed
    let animationTime = 1000/document.getElementById("speedSlider").value;

    let node = cy.getElementById(nodeId);
    //fade in
    let originalColor = node.style("background-color");
    isComplete=false;
    node.animate(
        {
            style: {
            "background-color": "red",
            },
        },
        {
            duration: animationTime,
            complete: function(){
                node.animate(
                    {
                        style: {
                        "background-color": `${originalColor}`,
                        },
                    },
                    {
                        duration: animationTime,
                        complete: function(){
                            console.log("nodeAnimation complete")
                            edgeAnimation(nodeId, token)
                            isComplete = true;
                        }
                    }
                );
            }
        }
    );
    await new Promise(resolve => setTimeout(resolve, 4*animationTime+10));
    //fade out
}

function edgeAnimation(nodeId, token){
    //edge animation
    //get edge
    let animationTime = 1000/document.getElementById("speedSlider").value;
    let node = cy.getElementById(nodeId);
    let outgoingEdges = node.outgoers('edge');
    let edge 
    if(token==0 || outgoingEdges.length === 1){
        // 0 or 0,1 edge -> even edge ID
        edge=outgoingEdges.find(edge => edge.id() % 2 === 0);
    }
    else if(token==1){
        // 1 edge -> odd edge ID
        edge=outgoingEdges.find(edge => edge.id() % 2 === 1);
    }
    else{
        edge=null;
    }
    if(edge != null){
            edge.animate( 
            {
            style: {
                "line-color": "red",
            },
        },
        {
            duration: animationTime,
            complete: function(){
                edge.animate( 
                    {
                    style: {
                        "line-color": "black",
                    },
                },
                {
                    duration: animationTime,
                    complete: function(){
                        isComplete=true;
                        console.log("edge animation complete")
                    }
                }
                );
            }
        }
        );
        
    }
}

//move nodes back into field if dragged out of it
// https://stackoverflow.com/questions/39280268/disable-dragging-nodes-outside-of-area-in-cytoscape-js
cy.on('mouseup', function (e) {
    let tg = e.target;
    if (tg.group != undefined && tg.group() == 'nodes') {
        let w = cy.width();
        let h = cy.height();
        if (tg.position().x > w-20) tg.position().x = w-50;
        if (tg.position().x < 0+20) tg.position().x = 0+50;
        if (tg.position().y > h-20) tg.position().y = h-20;
        if (tg.position().y < 0+60) tg.position().y = 0+60;
    }
})


export {cy, cytoCreateNode, cytoCreateEdge, cytoRemoveLastNode, animate, edgeAnimation}