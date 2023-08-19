import cytoscape from './node_modules/cytoscape/dist/cytoscape.esm.min.js';

//cytoscape object
var cy = cytoscape({
    container: document.getElementById('cytoscape'),
    style: [
    {
        selector: 'node',
        style: {
            shape: 'round-rectangle',
            'background-color': 'red',

            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'blue'
        }
    },
    {
        
        selector: 'edge',
        style: {

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
    xPos = 50 + id*150;
    yPos = 50;

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
            'border-color': `${borderColor}`
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
          }
        }
    );
}

export {cytoCreateNode, cytoCreateEdge}