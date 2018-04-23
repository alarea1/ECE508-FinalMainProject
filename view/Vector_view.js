

function initVector(x1,y1,src,des,cos) {
    var vector_rect_width = 30;
    var vector_rect_height = 20;


    var rect1 = new zrender.Rect({
              scale: [1, 1],
              style: {
                  fill: '#b8b8b8',
                  text: src,
                  textPosition: 'inside',
                  font: '20px Arial'
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
                  text: cos,
                  textPosition: 'inside',
                  font: '20px Arial'
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
                  text: des,
                  textPosition: 'inside',
                  font: '20px Arial'
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
