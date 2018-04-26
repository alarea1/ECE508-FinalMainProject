
var main_viewport = document.getElementById('view');
var zr = zrender.init(main_viewport);
var node_offset = 50;

var view_node_list = new Array(Node_Count);
let view_link_list = [];
var view_link_count = 0;

// target
var view_focused_node_id = 0; // default A
var view_focused_node;

let view_node_parameters = [];
view_node_parameters[0] = {color: '#eeaaff',text: 'A'};
view_node_parameters[1] = {color: '#abf9ff',text: 'B'};
view_node_parameters[2] = {color: '#adffad',text: 'C'};
view_node_parameters[3] = {color: '#8480ff',text: 'D'};
view_node_parameters[4] = {color: '#ff6f82',text: 'E'};
view_node_parameters[5] = {color: '#7bffda',text: 'F'};
view_node_parameters[6] = {color: '#fffd86',text: 'G'};

let view_graph_parameters = [];
view_graph_parameters[0] = {};
view_graph_parameters[1] = {};
view_graph_parameters[2] = {pos: [100,200,300,300,500,300],radius: 40, font:'30px Arial',lineWidth:10,lineFont: '25px Arial'};
view_graph_parameters[3] = {pos: [50,50,200,50,300,300,300,400],radius: 40, font:'30px Arial',lineWidth:10,lineFont: '25px Arial'};
view_graph_parameters[4] = {pos: [50,50,200,50,300,300,300,400,500,300],radius: 40, font:'30px Arial',lineWidth:10,lineFont: '25px Arial'};
view_graph_parameters[5] = {pos: [50,50,200,50,300,300,300,400,500,300,200,200],radius: 40, font:'30px Arial',lineWidth:10,lineFont: '25px Arial'};
view_graph_parameters[6] = {pos: [50,50,200,50,300,300,300,400,500,300,200,200,600,200],radius: 40, font:'30px Arial',lineWidth:10,lineFont: '25px Arial'};

var vector_des;
var vector_des_after;
var vector_src;

function initView(num)
{
  //delete view_node_list;
  //view_node_list = new Array(num);
  if(!view_node_list){
    view_node_list = new Array(num);
  }

  var i;
  for(i=0;i<num;i++){
    var newnode_x = view_graph_parameters[num-1].pos[2*i];
    var newnode_y = view_graph_parameters[num-1].pos[2*i+1];

    var newNode = new zrender.Circle({
          position: [newnode_x, newnode_y],
                scale: [1, 1],
                shape: {
                    cx: node_offset,
                    cy: node_offset,
                    r: view_graph_parameters[num-1].radius
                },
                style: {
                    fill: view_node_parameters[i].color,
                    lineWidth: 10,
                    text: view_node_parameters[i].text,
                    textPosition:'inside',
                    font: view_graph_parameters[num-1].font
                }
    });

    view_node_list[i] = newNode;
    //view_node_list[i].on('click',clickNode(i.toString()));

  }

  //click functions

  view_node_list[0].on('click', function(e) {
          clickNode(0);
  });
  view_node_list[1].on('click', function(e) {
          clickNode(1);
  });
  view_node_list[2].on('click', function(e) {
          clickNode(2);
  });
  if(num>3){
    view_node_list[3].on('click', function(e) {
            clickNode(3);
    });
    if(num>4){
      view_node_list[4].on('click', function(e) {
              clickNode(4);
      });
      if(num>5){
        view_node_list[5].on('click', function(e) {
                clickNode(5);
        });
        if(num>6){
          view_node_list[6].on('click', function(e) {
                  clickNode(6);
          });
        }
      }
    }


  }


  //

  newnode_x = view_graph_parameters[num-1].pos[0];
  newnode_y = view_graph_parameters[num-1].pos[1];
  view_focused_node = new zrender.Circle({
        position: [newnode_x, newnode_y],
              scale: [1, 1],
              shape: {
                  cx: node_offset,
                  cy: node_offset,
                  r: view_graph_parameters[num-1].radius*1.2
              },
              style: {
                  fill: '#ff0004',
                  lineWidth: 10
              }
  });

}

function initLinks(num)
{
  delete view_link_list;
  view_link_list = [];
  for(var i = 0; i < num; i++) {
      for(var j = 0; j < i; j++) {
        if(link_matrix[i][j]!=Infinity){
          var lineColor = '#949494';
          var lineText = link_matrix[i][j].toString();
          if(link_matrix[i][j]==-1){
            lineColor = '#ff001a';
            lineText = 'INF';
          }
          var parameter = view_graph_parameters[num-1];
          var new_link = new zrender.Line({
            style: {
                lineWidth:parameter.lineWidth,
                stroke: lineColor,
                text:lineText,
                width: 0,
                height: 20,
                textFill: '#000',
                font: parameter.lineFont
            },
            shape: {
                x1: parameter.pos[i*2]+node_offset,
                y1: parameter.pos[i*2+1]+node_offset,
                x2: parameter.pos[j*2]+node_offset,
                y2: parameter.pos[j*2+1]+node_offset
            }
          });
          view_link_list.push(new_link);
          view_link_count = view_link_count + 1;
        }
      }
  }
}

function clickNode(node)
{

  //console.log("click index:"+node);
    var index = node;

      view_focused_node_id = index;
      var parameter = view_graph_parameters[Node_Count-1];
      view_focused_node.animateTo({
        position: [parameter.pos[index*2],parameter.pos[index*2+1]]
      }, 1);

}

function renderView()
{
  for(var i=0;i<view_link_count;i++){
    if(view_link_list[i]){
      zr.add(view_link_list[i]);
    }
  }
  if(view_focused_node){
    zr.add(view_focused_node);
  }
  for(var i=0;i<Node_Count;i++){
    if(view_node_list[i]){
      zr.add(view_node_list[i]);
    }
  }
}

//function test(){
//  console.log("ooooops!");
//}

function cleanView()
{
  view_focused_node_id = 0;
  view_focused_node = null;
  zr.remove(view_focused_node);
  for(var i=0;i<view_link_count;i++){
    zr.remove(view_link_list[i]);
  }
  for(var i=0;i<Node_Count;i++){
    zr.remove(view_node_list[i]);
  }
}

//var vector1 = initVector(500,300,'C','B','50');


//src==next, des==start
function sendVector(src_id,des_id,src_dis,src_nhop,des_dis,des_nhop,des_a_dis,des_a_nhop)
{
  if(vector_des){
    zr.remove(vector_des);
    delete vector_des;
  }
  if(vector_des_after){
    zr.remove(vector_des_after);
    delete vector_des_after;
  }
  if(vector_src){
    zr.remove(vector_src);
    delete vector_src;
  }

  var c_id = "A".charCodeAt(0)+view_focused_node_id;
  var parameter = view_graph_parameters[Node_Count-1];

  vector_des = initVector(80+parameter.pos[des_id*2],parameter.pos[des_id*2+1],String.fromCharCode(c_id),des_dis,des_nhop);
  vector_des_after = initVector(80+parameter.pos[des_id*2],parameter.pos[des_id*2+1],String.fromCharCode(c_id),des_a_dis,des_a_nhop);
  vector_src = initVector(80+parameter.pos[src_id*2],parameter.pos[src_id*2+1],String.fromCharCode(c_id),src_dis,src_nhop);

  zr.add(vector_des);
  //zr.add(vector_des_after);
  zr.add(vector_src);

  vector_src.animate('', false)
            .when(1000, {
                position: [80+parameter.pos[des_id*2],parameter.pos[des_id*2+1]+30]
            })
            .done(function () {
                zr.add(vector_des_after);
            })
            .start();

}
