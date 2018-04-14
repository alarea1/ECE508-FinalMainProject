var Node_Count = 0;
var graph_table = new Array(Node_Count);
var graph_message = new Array(Node_Count);
var graph = new Graph();
var ready_topo = {};
let unvisited = [];
//class Graph
function Graph() {
    this.edges = [];
    this.nodes = {};
};
Graph.Node = function GraphNode(node_id) {
    this.id = node_id;
};
Graph.Edge = function GraphEdge(edge_message) {
    this.source = edge_message.source;
    this.target = edge_message.target;
    this.weight = edge_message.weight;
};


Graph.prototype.addNode = function(id) {
    if (this.nodes[id] === undefined) {
        this.nodes[id] = new Graph.Node(id);
    }
    return this.nodes[id];
}
Graph.prototype.addEdge = function(source, target, c) {
    var a = this.addNode(source);
    var b = this.addNode(target);
    var edge = new Graph.Edge({ source: a, target: b, weight: c });
    this.edges.push(edge);
    return edge;
}



function distance_vector(num) {
    // call front end module to render the processing table
      createFrontEndTable(num);
      // data structure edge(e: startID-endId: weight)
      graph_message[0] = {e: "0-1:4,0-2:2", n: 2}
      graph_message[1] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,2-3:2", n: 5}
      graph_message[2] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-4:3", n: 6}
      graph_message[3] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-5:3", n: 6}
      graph_message[4] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-5:3,1-6:3", n: 7}
      graph_message[5] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-5:3,1-6:3,2-7:4", n: 8}

    //read graph_message and add egdes to
    for (var index = 0; index < graph_message[Number(num) - 3].n; index++) {
        var s = graph_message[Number(num) - 3].e.charAt(index + 5 * index);
        var t = graph_message[Number(num) - 3].e.charAt(index + 5 * index +2);
        var c = Number(graph_message[Number(num) - 3].e.charAt(index + 5 * index +4));
        graph.addEdge(s, t, c);

        var initialEdges = document.getElementById("cost" + s.toString() + t.toString());
        initialEdges.innerHTML = Number(c);
        var initialEdgesReverse = document.getElementById("cost" + t.toString() + s.toString());
        initialEdgesReverse.innerHTML = Number(c);
        var initialHop = document.getElementById("hop" + s.toString() + t.toString());
        initialHop.innerHTML = t;
        var initialHop = document.getElementById("hop" + t.toString() + s.toString());
        initialHop.innerHTML = s;
    }
    Node_Count = num;
    for (var row = 0; row < Node_Count; row++) {
        graph_table[row] = new Array(Node_Count);
        for (var col = 0; col < Node_Count; col++) {
            graph_table[row][col] = { cost: 999999, next_hop: "N" };
        }
        //Node n -> Node n: nexthop: itself, cost:0
        graph_table[row][row].next_hop = row;
        graph_table[row][row].cost = 0;
    }

    for (e in graph.edges) {
        s = Number(graph.edges[e].source.id);
        t = Number(graph.edges[e].target.id);
        w = Number(graph.edges[e].weight);
        graph_table[s][t] = { cost: w, next_hop: t };
        graph_table[t][s] = { cost: w, next_hop: s };

    }
     for (var row = 0; row < Node_Count; row++) {
        for (var col = 0; col < Node_Count; col++) {
             if(graph_table[row][col].next_hop === "N") {
                var NoneReachable = document.getElementById("hop" + row.toString() + col.toString());
                NoneReachable.innerHTML = "None";
             }
             if(graph_table[row][col].cost === 999999) {
                var NoneReachableCost = document.getElementById("cost" + row.toString() + col.toString());
                NoneReachableCost.innerHTML = 999999;
             }
             else {
             var normalhop =  document.getElementById("hop" + row.toString() + col.toString());
             var normalcost =  document.getElementById("cost" + row.toString() + col.toString());
             normalhop.innerHTML = graph_table[row][col].next_hop;
             normalcost.innerHTML = graph_table[row][col].cost;
             }    
        }
    }   
    for (var row = 0; row < Node_Count; row++) {
        for (var col = 0; col < Node_Count; col++) {
                console.log(graph_table[row][col].cost);   
        }
    }   
    for (var row = 0; row < Node_Count; row++) {
        for (var col = 0; col < Node_Count; col++) {
            if (graph_table[row][col] != "N" && row != col) {
                unvisited.push(row);
                unvisited.push(col);
            }



        }
    }
};
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


function interval_update() {
    var start = unvisited.shift();
    var next = unvisited.shift();
    unvisited.push(start);
    unvisited.push(next);
    for (var target = 0; target < Node_Count; target++) {
        if (target != start) {
            findMinimum(start, target, next);
        }
    }
}

function findMinimum(start, target, next) {
    var now = graph_table[start][next].cost + graph_table[next][target].cost;
    if (graph_table[start][target].next_hop == next || (now < graph_table[start][target].cost && start != graph_table[next][target].next_hop)) {
        var old_cost = graph_table[start][target].cost;
        graph_table[start][target].next_hop = next;
        graph_table[start][target].cost = now;


        //now update the responding part of routing table!
        // havent consider how routing table should work when killing a node!
        var update_hop = document.getElementById("hop" + start.toString() + target.toString());
        var update_cost = document.getElementById("cost" + start.toString() + target.toString());

        update_hop.innerHTML = "Node ID: " + next;
        update_cost.innerHTML = Number(now) + "original: " + Number(old_cost);
        

    }
    if((now < graph_table[start][target].cost && start != graph_table[next][target].next_hop)) {
        graph_table[start][target].next_hop = next;
        graph_table[start][target].cost = now;

    }
    //console.log("start is: " + start, "destination is: " + target, "cost is: " +  graph_table[start][target].cost, "the next hop is: " + next);
    //console.log("okay. let's finish this!")



}

window.onload = function() {

    distance_vector(7);
    setInterval(function() { interval_update(); }, 3000);
    setTimeout(function(){ 
        for (var row = 0; row < Node_Count; row++) {
        for (var col = 0; col < Node_Count; col++) {
                console.log(graph_table[row][col].cost);   
            }
        }   
    }, 40000);
    //setTimeout(disableNode(1), 1000);
}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////  Viewer level  /////////////////////////////////////////
function createFrontEndTable(nodecount) {
    console.log("createFrontEndTable() function works!")
    var main_div = document.getElementById("main");
    console.log(main_div);
    for(var i = 0; i < nodecount ; i++) {
        var sub_node_tab_card = document.createElement('div');
        sub_node_tab_card.id = "node_tab_card" + i;
        sub_node_tab_card.className = "card";
        sub_node_tab_card.style.width = '18rem';
        sub_node_tab_card.style.display = 'inline-block';
        sub_node_tab_card.style.position = 'relative';
         sub_node_tab_card.style.float = 'left';
        sub_node_tab_card.style.top =  Math.floor(i / 4) * 29 + 'rem';
        
        

        var opacity_card = document.createElement('div');
        opacity_card.id = "opacity_card" + i;
        opacity_card.className = "card";
        opacity_card.style.width = '18rem';
        opacity_card.style.height = '25rem';
        opacity_card.style.display = 'inline-block';
        opacity_card.style.zIndex = '1';
        opacity_card.style.opacity = '0';
        opacity_card.style.position = 'absolute';
        opacity_card.style.backgroundColor = 'red';

        
        var opacity_card_toggle = document.createElement('div');
        opacity_card_toggle.onmouseover = function blur() {
            pfx = ["webkit", "moz", "MS", "o", ""],
            opacity_card_toggle.style.webkitTransform = 'scale(2)';
            opacity_card_toggle.style.MozTransform = 'scale(2)';
            opacity_card_toggle.style.msTransform = 'scale(2)';
            opacity_card_toggle.style.OTransform = 'scale(2)';
            opacity_card_toggle.style.transform = 'scale(2)';
        }
        opacity_card_toggle.onclick = function showMessage() {
            console.log("now you are restore Node : " + this.id);
            ableNode(this.id)
        };



        opacity_card_toggle.id= "opacity_card_toggle" + i;
        opacity_card_toggle.style.width = '10rem';
        opacity_card_toggle.style.height = '6rem';
        var opacity_card_toggle_text = document.createTextNode("restore node : " + i);
        opacity_card_toggle.style.position = 'absolute';
        opacity_card_toggle.style.backgroundColor = 'orange';
        opacity_card_toggle.style.left= '25%'; 
        opacity_card_toggle.style.top= '25%'; 
        opacity_card.appendChild(opacity_card_toggle);
        opacity_card_toggle.appendChild(opacity_card_toggle_text);


        var node_tab = document.createElement('table');
        //setting node_tab's id & className
        node_tab.id = "node_tab" + i;
        node_tab.className="table table-dark";
        node_tab.style.zIndex = '2';
        node_tab.style.position = 'absolute'
        //create tab_header
        var node_tab_header = document.createElement('tr');
        //which has 3 th
        var node_tab_header_nodeinfo =document.createElement('th');
        var node_tab_header_nodeinfo_text = document.createTextNode("This is Node : " + i );


        var killbutton = document.createElement('th');
        killbutton.id = "killbutton" + i;
       
        var killbutton_div = document.createElement('button');
        killbutton_div.style.zIndex = '3';
        killbutton_div.id = "killbutton_div" + i;
        killbutton_div.className="btn btn-warning";
        killbutton_div.type = "button";
        killbutton_div.addEventListener('click', function() {
        
        disableNode(this.id);
        }, false);


        var killbutton_text = document.createTextNode("Kill Node");

        var node_tab_index = document.createElement('tr');
        var node_tab_index_dest = document.createElement('th');
        var node_tab_index_cost = document.createElement('th');
        var node_tab_index_hop = document.createElement('th');

        var node_tab_index_dest_text = document.createTextNode("destination");
        var node_tab_index_cost_text = document.createTextNode("cost");
        var node_tab_index_hop_text = document.createTextNode("next-hop");

        node_tab_header_nodeinfo.appendChild(node_tab_header_nodeinfo_text);
        killbutton.appendChild(killbutton_text);
        killbutton.appendChild(killbutton_div);

        node_tab_header.appendChild(node_tab_header_nodeinfo);
        node_tab_header.appendChild(killbutton);
        node_tab.appendChild(node_tab_header);


        node_tab_index_dest.appendChild(node_tab_index_dest_text);
        node_tab_index_cost.appendChild(node_tab_index_cost_text);
        node_tab_index_hop.appendChild(node_tab_index_hop_text);

        node_tab_index.appendChild(node_tab_index_dest);
        node_tab_index.appendChild(node_tab_index_cost);
        node_tab_index.appendChild(node_tab_index_hop);
        node_tab.appendChild(node_tab_index);



        sub_node_tab_card.appendChild(opacity_card);
        //opacity_card.appendChild(node_tab);
        sub_node_tab_card.appendChild(node_tab);
        //for loop to insert each target node into the node_tab element

        for(var j = 0; j < nodecount; j++) {

            var to_node_j = document.createElement('tr');
            var to_node_j_dest = document.createElement('td');
            var to_node_j_cost = document.createElement('td');
            var to_node_j_hop = document.createElement('td');

            var to_node_j_dest_text = document.createTextNode("Node" + j);
            to_node_j_cost.id = "cost" + i + j;
            to_node_j_hop.id = "hop" + i + j;

            to_node_j_dest.appendChild(to_node_j_dest_text);
            to_node_j.appendChild(to_node_j_dest);
            to_node_j.appendChild(to_node_j_cost);
            to_node_j.appendChild(to_node_j_hop);

            node_tab.appendChild(to_node_j);

        }

        main_div.appendChild(sub_node_tab_card);
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Add Node && Kill Node functions////////////////////////////

function disableNode(id) {
    // display of front end module changes:
    //sub_node_tab_card.className.id = "node_tab_card" + i;
    console.log("level " + id + "  start!");
    var node_tab = document.getElementById("node_tab" + id);
    var opacity_card = document.getElementById(id);
    console.log(opacity_card.parentElement.parentElement.parentElement.parentElement.firstChild);
    opacity_card.parentElement.parentElement.parentElement.parentElement.firstChild.style.zIndex = 4;
    opacity_card.parentElement.parentElement.parentElement.parentElement.firstChild.style.opacity = 0.5;
    

}


function ableNode(id) {
    var opacity_card = document.getElementById(id);
    opacity_card.parentElement.style.zIndex = 1;
    opacity_card.parentElement.style.opacity = 0;



}