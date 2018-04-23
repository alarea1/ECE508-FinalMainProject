
var main_viewport = document.getElementById('view');

var zr = zrender.init(main_viewport);

var node_offset = 50;

var Node1 = new zrender.Circle({
      position: [100, 200],
            scale: [1, 1],
            shape: {
                cx: 50,
                cy: 50,
                r: 40
            },
            style: {
                fill: '#eeaaff',
                lineWidth: 10,
                text:'A',
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

zr.add(link1);
zr.add(link2);

zr.add(Node1);
zr.add(Node2);
zr.add(Node3);

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
