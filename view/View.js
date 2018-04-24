
var main_viewport = document.getElementById('view');
var zr = zrender.init(main_viewport);
var node_offset = 50;

var view_node_list = new Array(Node_Count);
let view_link_list = [];
var view_link_count = 0;

let view_node_parameters = [];
view_node_parameters[0] = {color: '#eeaaff',text: 'A'};
view_node_parameters[1] = {color: '#abf9ff',text: 'B'};
view_node_parameters[2] = {color: '#adffad',text: 'C'};
view_node_parameters[3] = {color: '#8480ff',text: 'D'};
view_node_parameters[4] = {color: '#ff6f82',text: 'E'};
view_node_parameters[5] = {color: '#7bffda',text: 'F'};
view_node_parameters[6] = {color: '#fffd86',text: 'G'};

let view_graph_parameters = [];
view_graph_parameters[0] = {pos: [100,200,300,300,500,300],radius: 40, font:'30px Arial'};
view_graph_parameters[1] = {pos: [100,200,300,300,500,300],radius: 40, font:'30px Arial'};
view_graph_parameters[2] = {pos: [100,200,300,300,500,300],radius: 40, font:'30px Arial'};

view_graph_parameters[6] = {pos: [50,50,200,50,300,300,300,400,500,300,200,200,600,200],radius: 40, font:'30px Arial',lineWidth:10,lineFont: '20px Arial'};

function initView(num)
{
  delete view_node_list;
  view_node_list = new Array(num);

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
  }
}

function initLinks(num)
{
  for(var i = 0; i < num; i++) {
      for(var j = 0; j < i; j++) {
        if(link_matrix[i][j]!=Infinity){
          var parameter = view_graph_parameters[num-1];
          var new_link = new zrender.Line({
            style: {
                lineWidth:parameter.lineWidth,
                stroke: '#949494',
                text:link_matrix[i][j].toString(),
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

function renderView()
{

  for(var i=0;i<view_link_count;i++){
    zr.add(view_link_list[i]);
  }
  for(var i=0;i<Node_Count;i++){
    zr.add(view_node_list[i]);
  }

}

function cleanView()
{

}

var Node1 = new zrender.Circle({
      position: [100, 200],
            scale: [1, 1],
            shape: {
                cx: 50,
                cy: 50,
                r: 40
            },
            style: {
                fill: view_node_parameters[0].color,
                lineWidth: 10,
                text: view_node_parameters[4].text,
                textPosition:'inside',
                font: '30px Arial'
            }
});

var Node2 = new zrender.Circle({
      position: [300, 300],
            scale: [1, 1],
            shape: {
                cx: 50,
                cy: 50,
                r: 40
            },
            style: {
                fill: '#abf9ff',
                lineWidth: 10,
                text:'B',
                textPosition:'inside',
                font: '30px Arial'
            }
});

var Node3 = new zrender.Circle({
      position: [500, 300],
            scale: [1, 1],
            shape: {
                cx: 50,
                cy: 50,
                r: 40
            },
            style: {
                fill: '#adffad',
                lineWidth: 10,
                text:'C',
                textPosition:'inside',
                font: '30px Arial'
            }
});

var link1 = new zrender.Line({
  style: {
      lineWidth:10,
      stroke: '#949494',
      text:'4',
      width: 0,
      height: 20,
      textFill: '#000',
      font: '20px Arial'
  },
  shape: {
      x1: 500+node_offset,
      y1: 300+node_offset,
      x2: 300+node_offset,
      y2: 300+node_offset
  }
});

var link2 = new zrender.Line({
  style: {
      lineWidth:10,
      stroke: '#949494',
      text:'6',
      width: 0,
      height: 20,
      textFill: '#000',
      font: '20px Arial'
  },
  shape: {
      x1: 300+node_offset,
      y1: 300+node_offset,
      x2: 100+node_offset,
      y2: 200+node_offset
  }
});

//zr.add(link1);
//zr.add(link2);

//zr.add(Node1);
//zr.add(Node2);
//zr.add(Node3);

var vector1 = initVector(500,300,'C','B','50');

zr.add(vector1);

vector1.animate('', true)
            .when(1000, {
                position: [300, 300]
            })
            .when(2000, {
                position: [100, 200]
            })
            .when(3000, {
                position: [300, 300]
            })
            .when(4000, {
                position: [500, 300]
            })
            .start();
