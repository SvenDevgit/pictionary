var pictionary = function() {
   var canvas, context;
   var socket = io();
   var mousedown = false;
   var guessBox;
   
   var showGuess = function(guess) {
      console.log(guess);
      $('#lastguess').text('last guess ' +  guess.toLowerCase());
   };

   var onKeyDown = function(event) {
      if (event.keyCode != 13) { // Enter
         return;
      }
      console.log(guessBox.val());
      var guess = guessBox.val();
      socket.emit('guess', guess);
      showGuess(guess);
      guessBox.val('');
   };

   guessBox = $('#myguess input');
   guessBox.on('keydown', onKeyDown);
   
   var draw = function(position) {
      context.beginPath();
      context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
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
   socket.on('guess', showGuess);
};

$(document).ready(function() {
    pictionary();
});