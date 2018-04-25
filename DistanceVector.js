var Node_Count = 0;
var graph_table = new Array(Node_Count);
var graph_message = {e:"A-B:weight,...",n:0};
var graph = new Graph();

var ready_topo = {};
let unvisited = [];
let isAlive = [];
let node_neighbors = [];
let graph_matrix = [];
let link_matrix = [];
let isStable = false;

//updating strategy:
let force_split = true;
let force_only = false;
let split_only = false;
let autoplay = false;
//class Graph
//Not necessary

function Graph() {
     this.edges = [];
     this.nodes = {};
};
//class Graph
//Not necessary
Graph.Node = function GraphNode(node_id) {
      this.id = node_id;
};
//class Graph
//Not necessary
Graph.Edge = function GraphEdge(edge_message) {
    this.source = edge_message.source;
     this.target = edge_message.target;
     this.weight = edge_message.weight;
};


function distance_vector(num) {
      //clean everything
      cleanView();
      delete graph_table;
      delete graph;
      delete unvisited;
      delete isAlive;
      delete node_neighbors;
      delete graph_matrix;
      delete link_matrix;
      graph_table = new Array(Node_Count);
      graph = new Graph();
      unvisited = [];
      isAlive = [];
      node_neighbors = [];
      graph_matrix = [];
      link_matrix = [];
      //////////

      initTopology(num,0);

    // call front end module to render the processing table
      createFrontEndTable(num);
      // data structure edge(e: startID-endId: weight)
      Node_Count = num;
      //examples:
      //graph_message[0] = {e: "0-1:4,0-2:2", n: 2}
      //graph_message[1] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,2-3:2", n: 5}
      //graph_message[2] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-4:3", n: 6}
      //graph_message[3] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-5:3", n: 6}
      //graph_message[4] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-5:3,1-6:3", n: 7}
      //graph_message[5] = {e: "0-1:4,0-2:2,1-2:1,0-3:1,1-4:2,0-5:3,1-6:3,2-7:4", n: 8}
    for(var i = 0; i < Node_Count; i++) {
        graph_matrix[i] = new Array(Node_Count);
        for(var j = 0; j < Node_Count; j++) {
            graph_matrix[i][j] = Infinity;
        }
    }

    console.log(graph_message.e);
    //read graph_message and add egdes to
    for(var i = 0; i < Node_Count; i++) {
        isAlive[i] = true;
    }
    for(var i = 0; i < Node_Count; i++) {
        node_neighbors[i] = new Array();
    }
    for (var index = 0; index < graph_message.n; index++) {
        var s = graph_message.e.charAt(index + 5 * index);
        var t = graph_message.e.charAt(index + 5 * index +2);
        var c = Number(graph_message.e.charAt(index + 5 * index +4));

        graph_matrix[s][t] = c;
        graph_matrix[t][s] = c;

        var message_source_target = {end: Number(t), cost: Number(c)};
        var message_target_source = {end: Number(s), cost: Number(c)};
        node_neighbors[Number(s)].push(message_source_target);
        node_neighbors[Number(t)].push(message_target_source);


        var initialEdges = document.getElementById("cost" + s.toString() + t.toString());
        initialEdges.innerHTML = Number(c);
        var initialEdgesReverse = document.getElementById("cost" + t.toString() + s.toString());
        initialEdgesReverse.innerHTML = Number(c);
        var initialHop = document.getElementById("hop" + s.toString() + t.toString());
        initialHop.innerHTML = t;
        var initialHop = document.getElementById("hop" + t.toString() + s.toString());
        initialHop.innerHTML = s;
    }

    // for rendering topology in view
    for(var i = 0; i < Node_Count; i++) {
        link_matrix[i] = new Array(Node_Count);
        for(var j = 0; j < Node_Count; j++) {
            link_matrix[i][j] = graph_matrix[i][j];
        }
    }
    initView(Node_Count);
    initLinks(Node_Count);
    renderView();

    for (var row = 0; row < Node_Count; row++) {
        graph_table[row] = new Array(Node_Count);
        for (var col = 0; col < Node_Count; col++) {
            graph_table[row][col] = { cost: Infinity, next_hop: "N" };
        }
        //Node n -> Node n: nexthop: itself, cost:0
        graph_table[row][row].next_hop = row;
        graph_table[row][row].cost = 0;
    }

    for(var i = 0; i < Node_Count; i++) {
        for(var j = 0; j < Node_Count; j++) {
            if(graph_matrix[i][j] != Infinity) {
                s = Number(i);
                t = Number(j);
                w = Number(graph_matrix[i][j]);
                graph_table[s][t] = { cost: w, next_hop: t };
                graph_table[t][s] = { cost: w, next_hop: s };
            }
        }
    }



     for (var row = 0; row < Node_Count; row++) {
        for (var col = 0; col < Node_Count; col++) {
             if(graph_table[row][col].next_hop === "N") {
                var NoneReachable = document.getElementById("hop" + row.toString() + col.toString());
                NoneReachable.innerHTML = "None";
             }
             if(graph_table[row][col].cost === Infinity) {
                var NoneReachableCost = document.getElementById("cost" + row.toString() + col.toString());
                NoneReachableCost.innerHTML = "Infinity";
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
               // console.log(graph_table[row][col].cost);
        }
    }
    for (var row = 0; row < Node_Count; row++) {
        for (var col = 0; col < Node_Count; col++) {
            if (graph_table[row][col].next_hop != "N" && row != col) {
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
        if(force_split == true){
            if (target != start) {
            setTimeout(findMinimum(start, target, next), 500);
            }
        } else if(force_only == true) {
            if (target != start) {
            setTimeout(findMinimum_force(start, target, next), 500);
            }
        } else if(split_only == true) {
            if (target != start) {
            setTimeout(findMinimum_split(start, target, next), 500);
            }
        }

    }
}

function findMinimum(start, target, next) {
    console.log("findMinimum is working");
    if(graph_table[start][next].cost > 0 &&  graph_table[next][target].cost > 0){
    var now = graph_table[start][next].cost + graph_table[next][target].cost;
    if (graph_table[start][target].next_hop == next || (((now < graph_table[start][target].cost)) && start != graph_table[next][target].next_hop)) {
        var last_cost = graph_table[start][target].cost;

        graph_table[start][target].next_hop = next;
        graph_table[start][target].cost = now;


        //now update the responding part of routing table!
        // havent consider how routing table should work when killing a node!
        var update_hop = document.getElementById("hop" + start.toString() + target.toString());
        var update_cost = document.getElementById("cost" + start.toString() + target.toString());
        
        //animation happenning now! now testing!
        changeColor(start, target);


            if(now == Infinity) {
            update_hop.innerHTML =  "None";
            } else {
            update_hop.innerHTML =  next;
            }
            if(last_cost == Infinity) {
               update_cost.innerHTML = Number(now) + "(" + "Inf" +")";
  
            } else {
                update_cost.innerHTML = Number(now) + "(" + last_cost +")";
                }
            
            }
        }
}
    //console.log("start is: " + start, "destination is: " + target, "cost is: " +  graph_table[start][target].cost, "the next hop is: " + next);
    //console.log("okay. let's finish this!")

function findMinimum_force(start, target, next) {
    console.log("findMinimum_force is working");
    if(graph_table[start][next].cost > 0 &&  graph_table[next][target].cost > 0){
    var now = graph_table[start][next].cost + graph_table[next][target].cost;
    if (graph_table[start][target].next_hop == next || (((now < graph_table[start][target].cost)))) {
        var last_cost = graph_table[start][target].cost;

        graph_table[start][target].next_hop = next;
        graph_table[start][target].cost = now;


        //now update the responding part of routing table!
        // havent consider how routing table should work when killing a node!
        var update_hop = document.getElementById("hop" + start.toString() + target.toString());
        var update_cost = document.getElementById("cost" + start.toString() + target.toString());

        //animation happenning now! now testing!
        changeColor(start, target);

            if(now == Infinity) {
            update_hop.innerHTML =  "None";
            } else {
            update_hop.innerHTML =  next;
                }
            if(last_cost == Infinity) {
               update_cost.innerHTML = Number(now) + "(" + "Inf" +")";
  
            } else {

                update_cost.innerHTML = Number(now) + "(" + last_cost +")";
            }

            }
        }
}


function findMinimum_split(start, target, next) {
    console.log("findMinimum_split is working");
    if(graph_table[start][next].cost > 0 &&  graph_table[next][target].cost > 0){
    var now = graph_table[start][next].cost + graph_table[next][target].cost;
    if ((((now < graph_table[start][target].cost)) && start != graph_table[next][target].next_hop)) {
        var last_cost = graph_table[start][target].cost;

        graph_table[start][target].next_hop = next;
        graph_table[start][target].cost = now;

        //now update the responding part of routing table!
        // havent consider how routing table should work when killing a node!
        var update_hop = document.getElementById("hop" + start.toString() + target.toString());
        var update_cost = document.getElementById("cost" + start.toString() + target.toString());

        //animation happenning now! now testing!
        changeColor(start, target);

        
            if(now == Infinity) {
            update_hop.innerHTML =  "None";
            } else {
            update_hop.innerHTML =  next;
                }
                if(last_cost == Infinity) {
               update_cost.innerHTML = Number(now) + "(" + "Inf" +")"; 
                } else {
                update_cost.innerHTML = Number(now) + "(" + last_cost +")";
                }
            }
        }
}




////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////  Viewer level  /////////////////////////////////////////
function createFrontEndTable(nodecount) {
    console.log("createFrontEndTable() function works!")
    var main_div = document.getElementById("main");
    //console.log(main_div);
    for(var i = 0; i < nodecount ; i++) {
        var sub_node_tab_card = document.createElement('div');
        sub_node_tab_card.id = "node_tab_card" + i;
        sub_node_tab_card.className = "card";
        sub_node_tab_card.style.width = '24rem';
        sub_node_tab_card.style.display = 'inline-block';
        sub_node_tab_card.style.position = 'relative';
        sub_node_tab_card.style.float = 'left';
        sub_node_tab_card.style.top =  Math.floor(i / 3) * 29 + 'rem';
         sub_node_tab_card.style.left = '1rem';



        var opacity_card = document.createElement('div');
        opacity_card.id = "opacity_card" + i;
        opacity_card.className = "card";
        opacity_card.style.width = '24rem';
        opacity_card.style.height = '26rem';
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
        killbutton_div.appendChild(document.createTextNode('X'));
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
    opacity_card.parentElement.parentElement.parentElement.parentElement.firstChild.style.opacity = 0.9;

    var id_str = String(id).slice(-1);
    isAlive[Number(id_str)] = false;

    //console.log(node_neighbors[Number(id_str)].length);
        for(var i = 0; i < node_neighbors[Number(id_str)].length; i++){
        graph_table[Number(id_str)][node_neighbors[Number(id_str)][i].end].cost = Infinity;
        graph_table[node_neighbors[Number(id_str)][i].end][Number(id_str)].cost = Infinity;
        graph_table[Number(id_str)][node_neighbors[Number(id_str)][i].end].next_hop = "N";
        graph_table[node_neighbors[Number(id_str)][i].end][Number(id_str)].next_hop = "N";



        var update_hop = document.getElementById("hop" + Number(id_str).toString() + (node_neighbors[Number(id_str)][i].end).toString());
        var update_cost = document.getElementById("cost" + Number(id_str).toString() + (node_neighbors[Number(id_str)][i].end).toString());

        update_hop.innerHTML =  "None";
        update_cost.innerHTML = "Infinity";


        var update_hop_reverse = document.getElementById("hop"  + (node_neighbors[Number(id_str)][i].end).toString() + Number(id_str).toString());
        var update_cost_reverse = document.getElementById("cost"  + (node_neighbors[Number(id_str)][i].end).toString() + Number(id_str).toString());

        update_hop_reverse.innerHTML = "None";
        update_cost_reverse.innerHTML = "Infinity";
    }
}


function ableNode(id) {
    var opacity_card = document.getElementById(id);
    opacity_card.parentElement.style.zIndex = 1;
    opacity_card.parentElement.style.opacity = 0;

    var id = Number(String(id).slice(-1));
    isAlive[id] = true;

    //console.log(node_neighbors[Number(id_str)].length);
    for(var i = 0; i < node_neighbors[id].length; i++){
        graph_table[id][node_neighbors[id][i].end].cost = node_neighbors[id][i].cost;
        graph_table[node_neighbors[id][i].end][id].cost = node_neighbors[id][i].cost;
        graph_table[id][node_neighbors[id][i].end].next_hop = node_neighbors[id][i].end;
        graph_table[node_neighbors[id][i].end][id].next_hop = id;



        var update_hop = document.getElementById("hop" + id.toString() + (node_neighbors[id][i].end).toString());
        var update_cost = document.getElementById("cost" + id.toString() + (node_neighbors[id][i].end).toString());

        update_hop.innerHTML = node_neighbors[id][i].end;
        update_cost.innerHTML = graph_table[id][node_neighbors[id][i].end].cost;


        var update_hop_reverse = document.getElementById("hop"  + (node_neighbors[id][i].end).toString() + id.toString());
        var update_cost_reverse = document.getElementById("cost"  + (node_neighbors[id][i].end).toString() +id.toString());

        update_hop_reverse.innerHTML = id.toString();
        update_cost_reverse.innerHTML = graph_table[node_neighbors[id][i].end][id].cost;

    }
}

function manual_form_update() {

    var form = document.getElementById("manual_form");

    var senderId = form.SenderId.value;
    var recieveId = form.ReceiveId.value;
    form.reset();
    console.log(senderId);
    console.log(recieveId);

    manually_update(senderId, recieveId);
}


function manually_update(x, z) {
    setTimeout(function(){
         console.log("manually_update is working steaming from:" + x + "to: " + z );
         for (var target = 0; target < Node_Count; target++) {
            if (target != x) {
                if(force_split) {
                    //console.log("findMinimum force_split working!");
                    findMinimum(x, target, z);
                } else if(force_only){
                    //console.log("findMinimum force_only working!");
                    //have not implemented?
                    findMinimum_force(x, target, z);
                } else if(split_only) {
                    //console.log("findMinimum split_only working!");
                    //have not implemented?
                    findMinimum_split(x, target, z);
                }

            }
        }

    }, 2000);
}

function auto_display() {
    //console.log("auto_display working");
    autoplay = !autoplay;
    if(autoplay == true) {
        var btn = document.getElementById("autoplaybut");
        btn.className = "btn btn-danger";
        btn.innerHTML = "Pause";
    } else {
        var btn = document.getElementById("autoplaybut");
        btn.className = "btn btn btn-success";
        btn.innerHTML = "autoplay";
    }

        var autoRunThread = setInterval(function(){
        if(autoplay == false) {
            clearInterval(autoRunThread);
        }
        interval_update();
        console.log("i am working");
        }, 3000);
}

function fs_mode() {
    force_split = true;
    force_only = false;
    split_only = false;
    var fs_btn = document.getElementById("forced_split");
    var fo_btn = document.getElementById("forcedonly");
    var so_btn = document.getElementById("splitonly");

    fs_btn.className = "btn btn-primary active";
    fo_btn.className = "btn btn-info";
    so_btn.className = "btn btn-warning";
    document.getElementById("current_strategy").innerHTML = "Forced-Update & Split-Horizon(default)";

}

function fu_mode() {
    force_split = false;
    force_only = true;
    split_only = false;
    var fs_btn = document.getElementById("forced_split");
    var fo_btn = document.getElementById("forcedonly");
    var so_btn = document.getElementById("splitonly");

    fs_btn.className = "btn btn-primarye";
    fo_btn.className = "btn btn-info active";
    so_btn.className = "btn btn-warning";
    document.getElementById("current_strategy").innerHTML = "Forced-Update-Only";


}
function sh_mode() {
    force_split = false;
    force_only = false;
    split_only = true;
    var fs_btn = document.getElementById("forced_split");
    var fo_btn = document.getElementById("forcedonly");
    var so_btn = document.getElementById("splitonly");

    fs_btn.className = "btn btn-primarye";
    fo_btn.className = "btn btn-info";
    so_btn.className = "btn btn-warning active";
    document.getElementById("current_strategy").innerHTML = "Split-Horizon-Only";

}

function changeColor(row, col) {
    var cost_tr = document.getElementById("cost"+row.toString()+col.toString());
    var hop_tr = document.getElementById("hop"+row.toString()+col.toString());
    console.log(cost_tr);
    console.log("start shining!");
    setTimeout(function(){
        cost_tr.className = "bg-warning";
        hop_tr.className = "bg-warning";
        console.log("start working1");
    }, 500);
    setTimeout(function(){
        cost_tr.className = "";
        hop_tr.className = "";
        console.log("start working2");
    }, 1000);
    setTimeout(function(){
        cost_tr.className = "bg-warning";
        hop_tr.className = "bg-warning";
        console.log("start working3");
    }, 2000);
    setTimeout(function(){
        cost_tr.className = "";
        hop_tr.className = "";
        console.log("start working4");
    }, 3000);
}

window.onload = function() {

    distance_vector(7);
    //setInterval(function() { interval_update(); }, 2000);
    //setTimeout(function(){
    //    for (var row = 0; row < Node_Count; row++) {
    //    for (var col = 0; col < Node_Count; col++) {
    //           // console.log(graph_table[row][col].cost);
    //        }
    //    }
    //}, 40000);
    //setTimeout(disableNode(1), 1000);
}
