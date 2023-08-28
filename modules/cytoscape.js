import cytoscape from '../node_modules/cytoscape/dist/cytoscape.esm.min.js';
export {cy, cytoCreateNode, cytoCreateEdge, cytoRemoveNode, animateNode, animateEdge, clearCanvas};

//This file handels the cytoscape object & operates the canvas 
//& animation


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

/**
 * Creates a node in the cy object
 *
 * It allows to customize the position,
 * color, and appearance of the node, as well as adding a border. 
 * The function ensures that nodes are created within specific coordinates and maintain a certain distance from each other.
 * 
 * @param {string} id - The unique identifier for the new node.
 * @param {number} [xPos=200] - The X-coordinate position of the node on the graph.
 * @param {number} [yPos=200] - The Y-coordinate position of the node on the graph.
 * @param {string} [color='grey'] - The background color of the node.
 * @param {boolean} [border=false] - A flag indicating whether the node should have a border.
 * @returns {void}
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

/**
 * Creates an edge between two nodes in the cy object.
 *
 * Creates an edge connecting two nodes within the Cytoscape graph. 
 * It allows to specify the source and target nodes, as well as providing an optional label for the edge.
 *
 * @param {string} id - The unique identifier for the new edge.
 * @param {string} fromNode - The ID of the source node where the edge originates.
 * @param {string} toNode - The ID of the target node where the edge terminates.
 * @param {string} [label] - The label to be displayed on the edge.
 * @returns {void}
 */
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

/**
 * Removes an object from a Cytoscape graph based on its ID.
 *
 * @param {number} id - The ID of the node to be removed.
 * @returns {void}
 */
function cytoRemoveNode(id){
    let node = cy.getElementById(id);
    cy.remove(node);
}


/**
 * Animates Red blinking of a Cytoscape Node
 *
 * @param {number} nodeId - The ID of the node to be animated.
 * @param {number} animationTime - The time of the animation
 * @returns {void}
 */
function animateNode(nodeId, animationTime){
    let node = cy.getElementById(nodeId);
    //fade in
    let originalColor = node.style("background-color");
    node.animate(
        {
            style: {
            "background-color": "red",
            },
        },
        {
            duration: animationTime,
            //fade out
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
                        }
                    }
                );
            }
        }
    );
}

/**
 * Animates Red blinking of a Cytoscape Edge
 *
 * @param {number} nodeId - The ID of the node to be animated.
 * @param {number} token - The token of the edge ("0" or "1")
 * @param {number} animationTime - The time of the animation
 * @returns {void}
 */
function animateEdge(nodeId, token, animationTime){
    //get edge
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
    //fade-in
    if(edge != null){
        let originalColor = edge.style("background-color");
        edge.animate( 
        {
        style: {
            "line-color": "red",
        },
        },
        {
        duration: animationTime,
        //fade-out
        complete: function(){
            edge.animate( 
                {
                style: {
                    "line-color": `${originalColor}`,
                },
            },
            {
                duration: animationTime,
                complete: function(){
                    console.log("edge animation complete")
                }
            }
            );
        }
        }
        );
        
    }
}

/**
 * Clears the content of a Cytoscape canvas by removing all nodes.
 *
 * Removes all nodes from the Cytoscape canvas, effectively clearing its content.
 * results in an empty canvas
 * @returns {void}
 */
function clearCanvas(){
    var toBeRemoved = cy.nodes();
    toBeRemoved.remove();
}

//moves nodes back into field if dragged out of it
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


