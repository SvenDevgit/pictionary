var pictionary = function() {
    var canvas, context;
    var socket = io();
    var moudedown = false;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function() {
        mousedown = true;
        return mousedown;
    });
    canvas.on('mouseup', function() {
        mousedown = false;
        return mousedown;
    });
    canvas.on('mousemove', function(event) {
      if (mousedown){  
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        socket.emit('draw', position);                
        draw(position);
      }  
    });

   
    socket.on('draw', draw);
};

$(document).ready(function() {
    pictionary();
});