import cytoscape from '../node_modules/cytoscape/dist/cytoscape.esm.min.js';

var cy = cytoscape({
    container: document.getElementById('cytoscape'),
    elements: [
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      {
        data: {
          id: 'ab',
          source: 'a',
          target: 'b'
        }
      }],
    style: [
    {
        selector: 'node',
        style: {
            shape: 'round-rectangle',
            'background-color': 'red',
        }
    }],

    // disable panning & zooming
    zoomingEnabled: false,
    userPanningEnabled: false,


  });

  //add node
  cy.add({
    group: 'nodes',
    data: { weight: 75 },
    position: { x: 200, y: 200 },


});

//add 2 nodes with edges (can reference eles later)
var eles = cy.add([
    { group: 'nodes', data: { id: 'n0' }, position: { x: 100, y: 100 } },
    { group: 'nodes', data: { id: 'n1' }, position: { x: 200, y: 200 } },
    { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } }
  ]);


  //layout
  var layout = cy.layout({
    name: 'random'
  });
  
  layout.run();