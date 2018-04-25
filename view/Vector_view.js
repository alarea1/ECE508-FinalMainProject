

function initVector(x1,y1,des,distance,next_hop) {
    var vector_rect_width = 40;
    var vector_rect_height = 30;
    var vector_font = '30px Arial';

    var rect1 = new zrender.Rect({
              scale: [1, 1],
              style: {
                  fill: '#b8b8b8',
                  text: des,
                  textPosition: 'inside',
                  font: vector_font
              },
              shape: {
                  x: 0,
                  y: 0,
                  width: vector_rect_width,
                  height: vector_rect_height
              }
    });

    var rect2 = new zrender.Rect({
              scale: [1, 1],
              style: {
                  fill: 'd6d6d6',
                  text: distance,
                  textPosition: 'inside',
                  font: vector_font
              },
              shape: {
                  x: vector_rect_width,
                  y: 0,
                  width: vector_rect_width,
                  height: vector_rect_height
              }
    });

    var rect3 = new zrender.Rect({
              scale: [1, 1],
              style: {
                  fill: '#b8b8b8',
                  text: next_hop,
                  textPosition: 'inside',
                  font: vector_font
              },
              shape: {
                  x: vector_rect_width*2,
                  y: 0,
                  width: vector_rect_width,
                  height: vector_rect_height
              }
    });

    var vector_group = new zrender.Group({
        position: [x1, y1]
    });

    vector_group.add(rect1);
    vector_group.add(rect2);
    vector_group.add(rect3);

    return vector_group;
}
